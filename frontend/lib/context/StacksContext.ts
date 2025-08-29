import { createContext } from 'react';
import { UserSession } from '@stacks/connect';

export interface StacksContextType {
  userSession: UserSession;
  userData: any;
  authenticate: () => void;
  signOut: () => void;
}

export const StacksContext = createContext<StacksContextType | undefined>(undefined);
