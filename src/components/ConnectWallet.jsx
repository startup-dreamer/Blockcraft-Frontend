import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
import { bagPixel, profileIcon } from "../assets";
import { useStore } from "../hooks/useStore";

const ConnectWallet = () => {
  const [setSismo] = useStore((state) => [state.setSismo]);
  const {
    enableWeb3,
    isWeb3Enabled,
    account,
    deactivateWeb3,
    Moralis,
    isWeb3EnableLoading,
  } = useMoralis();

  // useEffect(() => {
  //   if (isWeb3Enabled) return;

  //   if (
  //     typeof window !== "undefined" &&
  //     window.localStorage.getItem("connected")
  //   ) {
  //     enableWeb3();
  //   }
  // }, []);

  useEffect(() => {
    // Moralis
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      if (account == null) {
        window.localStorage.removeItem("connected");
        deactivateWeb3();
        console.log("Null account found");
      }
    });
  }, []);
  return (
    <div className="flex justify-center  items-center">
      {account ? (
        <div className="btn flex items-center gap-2">
          <img src={profileIcon} className="w-6" />
          {`${account.slice(0, 4)}..${account.slice(account.length - 4)}`}
        </div>
      ) : (
        <button
          className="btn hover:scale-[102%]"
          onClick={async () => {
            await enableWeb3();
            setSismo(true);
            if (typeof window !== "undefined") {
              window.localStorage.setItem("connected", "injected");
            }
          }}
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
