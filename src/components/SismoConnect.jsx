import React from "react";
import { SismoConnectButton } from "@sismo-core/sismo-connect-react";
import { AUTHS, CONFIG, SIGNATURE } from "../utils/constants";
import { useStore } from "../hooks/useStore";

const SismoConnect = () => {
  const [setSismo] = useStore((state) => [state.setSismo]);
  return (
    <div className="App">
      <SismoConnectButton
        config={CONFIG}
        auths={AUTHS}
        text="Sign in"
        signature={SIGNATURE}
        onResponse={async (response) => {
          console.log("response", response);
          setSismo(false);
          try {
            const res = await fetch("https://backend-hh26.vercel.app/'", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
              body: JSON.stringify(response),
            });
            const data = await res.json();
            console.log(data);
          } catch (error) {
            console.error("Error:", error);
          }
        }}
      />
    </div>
  );
};

export default SismoConnect;
