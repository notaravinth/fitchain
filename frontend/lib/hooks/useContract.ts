import { useState, useCallback } from 'react';
import { useStacks } from './useStacks';
import { contractCalls } from '../contracts';

export function useContract() {
  const { userSession } = useStacks();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContractCall = useCallback(async (
    call: (options?: { onFinish?: (data: any) => void; onCancel?: () => void }) => Promise<void>,
    onSuccess?: () => void
  ) => {
    if (!userSession.isUserSignedIn()) {
      setError('Please connect your Leather wallet first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await call({
        onFinish: (data) => {
          console.log('Transaction successful:', data);
          setLoading(false);
          if (onSuccess) onSuccess();
        },
        onCancel: () => {
          console.log('Transaction cancelled by user');
          setLoading(false);
          setError('Transaction cancelled');
        },
      });
    } catch (err: any) {
      console.error('Contract call error:', err);
      setLoading(false);
      setError(err.message || 'An error occurred');
    }
  }, [userSession]);

  const createP2PChallenge = async (stake: number, onSuccess?: () => void) => {
    await handleContractCall((options) => contractCalls.createP2PChallenge(stake, options), onSuccess);
  };

  const joinP2PChallenge = async (challengeId: number, onSuccess?: () => void) => {
    await handleContractCall((options) => contractCalls.joinP2PChallenge(challengeId, options), onSuccess);
  };

  const resolveP2PChallenge = async (challengeId: number, onSuccess?: () => void) => {
    await handleContractCall((options) => contractCalls.resolveP2PChallenge(challengeId, options), onSuccess);
  };

  const createP2CChallenge = async (onSuccess?: () => void) => {
    await handleContractCall((options) => contractCalls.createP2CChallenge(options), onSuccess);
  };

  const resolveP2CChallenge = async (challengeId: number, onSuccess?: () => void) => {
    await handleContractCall((options) => contractCalls.resolveP2CChallenge(challengeId, options), onSuccess);
  };

  return {
    loading,
    error,
    createP2PChallenge,
    joinP2PChallenge,
    resolveP2PChallenge,
    createP2CChallenge,
    resolveP2CChallenge,
  };
}
