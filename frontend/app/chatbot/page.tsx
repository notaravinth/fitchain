"use client";
import { useState, useCallback, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useContract } from "../../lib/hooks/useContract";
import axios from "axios";

interface ChatState {
  challengeName: string;
  category: string;
  amount: number;
  target: number;
  targetType: string;
}

export default function Chatbot() {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [chatState, setChatState] = useState<ChatState>({
    challengeName: "",
    category: "",
    amount: 0,
    target: 0,
    targetType: "",
  });

  // Parse chat response to extract challenge details
  const parseChatResponse = (content: string) => {
    // This is a simple example - adjust the parsing logic based on your AI's response format
    const challengeMatch = content.match(/Challenge Name:\s*(.*?)\n/);
    const categoryMatch = content.match(/Category:\s*(.*?)\n/);

    if (challengeMatch || categoryMatch) {
      setChatState((prev) => ({
        ...prev,
        challengeName: challengeMatch?.[1] || prev.challengeName,
        category: categoryMatch?.[1] || prev.category,
      }));
    }
  };

  const { createP2CChallenge, loading, error } = useContract();

  const handleAddP2CChallenge = async () => {
    try {
      await createP2CChallenge(async () => {
        const res = await axios.post(`http://localhost:3001/p2c`, {
          category: chatState.category || "Fitness",
          challengeName: chatState.challengeName || "Run 10k",
          amount: 0.0001,
          id: Math.floor(Math.random() * 1000),
        });
        console.log("Add P2C Challenge Response:", res);
      });
    } catch (error) {
      console.error("Error adding P2C challenge:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mode: "chat", userInput }),
      });

      const data = await res.json();
      console.log(responses.length);

      if (res.ok) {
        const agentMessages = data[0]?.agent?.messages || [];
        const content = agentMessages[0]?.kwargs?.content || "";

        // Parse the response to update chat state
        parseChatResponse(content);

        setResponses((prev) => [...prev, userInput, content]);
        setUserInput("");
      } else {
        setResponses((prev) => [...prev, `Error: ${data.error}`]);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResponses((prev) => [
        ...prev,
        "An error occurred while fetching data",
      ]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#191919]">
      <Navbar />
      <div className="flex-1 flex justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <div className="bg-[#242424] rounded-lg shadow-xl p-6 mb-6">
            <div className="space-y-4 mb-4 max-h-[60vh] overflow-y-auto">
              {responses.map((response, index) => (
                <div
                  key={index}
                  className={`rounded-lg px-4 py-2 ${
                    index % 2 === 0
                      ? "bg-blue-600 ml-auto w-fit"
                      : "bg-gray-700"
                  }`}
                >
                  {response}
                </div>
              ))}
              {responses.length === 2 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handleAddP2CChallenge}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Creating Challenge..." : "Challenge AI!"}
                  </button>
                </div>
              )}
              {error && (
                <p className="text-red-500 mt-2 text-center">{error}</p>
              )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 transition-colors"
                disabled={loading || !userInput.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
