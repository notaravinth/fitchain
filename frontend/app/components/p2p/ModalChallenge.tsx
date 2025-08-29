import React, { useState } from "react";
import axios from "axios";
import { useContract } from "../../../lib/hooks/useContract";

interface ModalChallengeProps {
  open: boolean;
  handleClose: () => void;
}

const ModalChallenge: React.FC<ModalChallengeProps> = ({
  open,
  handleClose,
}) => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [category, setCategory] = useState("");
  const [challengeName, setChallengeName] = useState("");
  const [target, setTarget] = useState("");
  const [targetType, setTargetType] = useState("meters");
  const [amount, setAmount] = useState("");
  const [challengeType, setChallengeType] = useState("");

  const categories = [
    { name: "Fitness", image: "/images/fit.jpg" },
    { name: "Travel", image: "/images/travel.webp" },
    { name: "Art", image: "/images/art.jpg" },
    { name: "Adventure", image: "/images/adventure.jpg" },
    { name: "Lifestyle", image: "/images/lifestyle.webp" },
    { name: "Gaming", image: "/images/gaming.jpg" },
  ];

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCategory(categoryName);
  };

  const handleNext = () => {
    if (page === 1 && selectedCategory) {
      setPage(2);
    }
  };

  const handleBack = () => {
    if (page === 2) {
      setPage(1);
    } else {
      handleClose();
    }
  };

  const handleFormSubmit = async () => {
    try {
      const challengeData = {
        category,
        challengeName,
        target,
        targetType,
        challengeType,
        id: Math.floor(Math.random() * 1000).toString(),
        amount,
      };

      // console.log("Challenge data is ", challengeData);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/addchallenge`,
        challengeData
      );
      console.log("Challenge created:", res.data);
      handleClose();
      setChallengeName("");
      setTarget("");
      setAmount("");
      setCategory("");
      setChallengeType("");
      setTargetType("meters");
    } catch (error) {
      console.log(error);
    }
  };

  const { createP2PChallenge, loading, error } = useContract();

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm text-black">
      <div className="bg-white w-96 rounded-lg p-6 relative max-h-[80vh] overflow-y-auto scrollbar-hide">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-80 h-2 bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full ${
                page === 1 ? "bg-gray-400" : "bg-gray-700"
              }`}
              style={{ width: page === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        {/* Page Content */}
        {page === 1 ? (
          <>
            <h2 className="text-xl font-bold mb-4">Choose a Category</h2>
            <div className="grid grid-cols-3 gap-4 mb-4">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-transform ${
                    selectedCategory === cat.name
                      ? "bg-gray-300 border-gray-700 scale-105"
                      : "bg-gray-100"
                  }`}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-16 h-16 mb-2 object-cover"
                  />
                  <p className="text-sm font-medium text-center">{cat.name}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full disabled:bg-gray-300 mb-2"
              disabled={!selectedCategory}
            >
              Next
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-2">Challenge Details</h2>
            <p className="text-sm mb-4">
              Fill in the details for your challenge.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Challenge Name
              </label>
              <input
                type="text"
                placeholder="Enter challenge name"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Target to Win</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="Target"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="border border-gray-300 rounded-l-lg p-2 w-full"
                />
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="border border-gray-300 rounded-r-lg p-2"
                >
                  <option value="meters">Meters</option>
                  <option value="kilometers">Kilometers</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">
                Challenge Type
              </label>
              <select
                value={challengeType}
                onChange={(e) => setChallengeType(e.target.value)}
                className="border border-gray-300 rounded-lg w-full p-2"
              >
                <option value="">Select Challenge Type</option>
                <option value="multiplayer">Multiplayer</option>
                <option value="versus">Versus Your Friend</option>
                <option value="dare">Dare Your Friend</option>
              </select>
            </div>

            <h3 className="text-lg font-bold mb-2">Participation Details</h3>
            <p className="text-sm mb-4">Maximum Participants: 50</p>

            <h3 className="text-lg font-bold mb-2">Wager Details</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium">Wager Amount</label>
              <div className="flex">
                <input
                  type="number"
                  placeholder="Wager Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border border-gray-300 rounded-l-lg p-2 w-full"
                />
              </div>
            </div>

            <button
              onClick={async () => {
                try {
                  const stake = parseFloat(amount);
                  if (isNaN(stake)) {
                    throw new Error("Invalid amount");
                  }
                  await createP2PChallenge(stake, handleFormSubmit);
                } catch (err) {
                  console.error("Error creating P2P challenge:", err);
                }
              }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed mb-4"
              disabled={
                loading ||
                !amount ||
                !challengeName ||
                !target ||
                !challengeType
              }
            >
              {loading ? "Creating Challenge..." : "Create Challenge"}
            </button>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          </>
        )}

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg w-full"
        >
          Back
        </button>

        <button
          onClick={handleClose}
          className="absolute top-4 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ModalChallenge;
