import { uintCV } from '@stacks/transactions';
import { openContractCall } from '@stacks/connect';
import { network, contractAddress, contractNames } from '../config/stacks';

interface ContractCallOptions {
  functionName: string;
  functionArgs: any[];
  onFinish?: (data: any) => void;
  onCancel?: () => void;
}

/**
 * Helper function to handle contract calls
 */
const makeContractCall = async (
  functionName: string,
  functionArgs: any[],
  options?: { onFinish?: (data: any) => void; onCancel?: () => void }
) => {
  await openContractCall({
    contractAddress,
    contractName: contractNames.escrow,
    functionName,
    functionArgs,
    network,
    onFinish: options?.onFinish,
    onCancel: options?.onCancel,
  });
};

export const contractCalls = {
  /**
   * Creates a new P2P challenge with a specified stake amount
   */
  createP2PChallenge: async (stake: number, options?: { onFinish?: (data: any) => void; onCancel?: () => void }) => {
    await makeContractCall(
      'create-p2p-challenge',
      [uintCV(stake)],
      options
    );
  },

  joinP2PChallenge: async (challengeId: number, options?: { onFinish?: (data: any) => void, onCancel?: () => void }) => {
    await openContractCall({
      contractAddress,
      contractName: contractNames.escrow,
      functionName: 'join-p2p-challenge',
      functionArgs: [uintCV(challengeId)],
      network,
      onFinish: options?.onFinish,
      onCancel: options?.onCancel,
    });
  },

  resolveP2PChallenge: async (challengeId: number, options?: { onFinish?: (data: any) => void, onCancel?: () => void }) => {
    await openContractCall({
      contractAddress,
      contractName: contractNames.escrow,
      functionName: 'resolve-p2p-challenge',
      functionArgs: [uintCV(challengeId)],
      network,
      onFinish: options?.onFinish,
      onCancel: options?.onCancel,
    });
  },

  createP2CChallenge: async (options?: { onFinish?: (data: any) => void, onCancel?: () => void }) => {
    await openContractCall({
      contractAddress,
      contractName: contractNames.escrow,
      functionName: 'create-p2c-challenge',
      functionArgs: [],
      network,
      onFinish: options?.onFinish,
      onCancel: options?.onCancel,
    });
  },

  resolveP2CChallenge: async (challengeId: number, options?: { onFinish?: (data: any) => void, onCancel?: () => void }) => {
    await openContractCall({
      contractAddress,
      contractName: contractNames.escrow,
      functionName: 'resolve-p2c-challenge',
      functionArgs: [uintCV(challengeId)],
      network,
      onFinish: options?.onFinish,
      onCancel: options?.onCancel,
    });
  },
};
