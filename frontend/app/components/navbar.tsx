"use client";
import { useStacks } from "../../lib/hooks/useStacks";

export default function Navbar() {
  const { userData, authenticate, signOut } = useStacks();

  return (
    <div className="flex items-center justify-between pb-2 border-b-2 border-b-gray-500 mb-5 w-full md:w-[550px]">
      <a className="font-serif mx-4 font-bold text-2xl" href="/">
        FIT CHAIN
      </a>
      {!userData ? (
        <button
          onClick={authenticate}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <div className="flex flex-col text-sm">
            <span className="font-medium">
              {userData.profile?.name || "Stacks User"}
            </span>
            <span className="text-xs text-gray-500">
              {userData.profile?.stxAddress?.testnet}
            </span>
          </div>
          <button
            onClick={signOut}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
