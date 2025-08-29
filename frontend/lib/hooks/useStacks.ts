import { useContext } from 'react';
import { StacksContext } from '../context/StacksContext';

export function useStacks() {
  const context = useContext(StacksContext);
  if (context === undefined) {
    throw new Error('useStacks must be used within a StacksProvider');
  }
  return context;
}
