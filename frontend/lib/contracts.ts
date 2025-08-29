import { uintCV, standardPrincipalCV } from '@stacks/transactions';
import { FinishedTxData, openContractCall } from '@stacks/connect';
import { network, contractAddress, contractNames, appConfig } from '../config/stacks';

interface ContractCallOptions {
  onFinish?: (data: FinishedTxData) => void;
  onCancel?: () => void;
}

/**
 * Helper function to handle contract calls
 */
const makeContractCall = async (
  functionName: string,
  functionArgs: any[],
  options?: ContractCallOptions
) => {
  try {
    await openContractCall({
      network,
      anchorMode: 1, // This means the transaction will be anchored only once
      contractAddress,
      contractName: contractNames.escrow,
      functionName,
      functionArgs,
      onFinish: (data) => {
        console.log('Transaction finished:', data);
        options?.onFinish?.(data);
      },
      onCancel: () => {
        console.log('Transaction cancelled');
        options?.onCancel?.();
      },
      appDetails: appConfig,
      postConditionMode: 1, // Allow post conditions
    });
  } catch (error) {
    console.error('Error making contract call:', error);
    throw error;
  }
};

export const contractCalls = {
  /**
   * Creates a new P2P challenge with a specified stake amount
   */
  createP2PChallenge: async (stake: number, options?: ContractCallOptions) => {
    await makeContractCall(
      'create-p2p-challenge',
      [uintCV(stake)],
      options
    );
  },

  /**
   * Join an existing P2P challenge
   */
  joinP2PChallenge: async (challengeId: number, options?: ContractCallOptions) => {
    await makeContractCall(
      'join-p2p-challenge',
      [uintCV(challengeId)],
      options
    );
  },

  /**
   * Resolve a P2P challenge and distribute rewards
   */
  resolveP2PChallenge: async (challengeId: number, options?: ContractCallOptions) => {
    await makeContractCall(
      'resolve-p2p-challenge',
      [uintCV(challengeId)],
      options
    );
  },

  /**
   * Creates a new P2C (Player vs Computer) challenge
   */
  createP2CChallenge: async (options?: ContractCallOptions) => {
    await makeContractCall(
      'create-p2c-challenge',
      [], // No args needed for P2C challenge creation
      options
    );
  },

  /**
   * Resolve a P2C challenge and distribute rewards
   */
  resolveP2CChallenge: async (challengeId: number, options?: ContractCallOptions) => {
    await makeContractCall(
      'resolve-p2c-challenge',
      [uintCV(challengeId)],
      options
    );
  },
};
