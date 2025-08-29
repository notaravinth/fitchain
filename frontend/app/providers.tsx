"use client";

import { ReactNode, useState, useEffect } from "react";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { StacksContext } from "../lib/context/StacksContext";

const appConfig = new AppConfig(["store_write", "publish_data"]);
const userSession = new UserSession({ appConfig });

export function Providers({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData());
    }
  }, []);

  const authenticate = () => {
    showConnect({
      appDetails: {
        name: "XFIT Challenge",
        icon: window.location.origin + "/favicon.ico",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  };

  const signOut = () => {
    userSession.signUserOut("/");
    setUserData(null);
  };

  return (
    <StacksContext.Provider
      value={{ userSession, userData, authenticate, signOut }}
    >
      {children}
    </StacksContext.Provider>
  );
}
