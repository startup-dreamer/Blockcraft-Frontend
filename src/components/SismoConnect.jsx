import React from "react";
import { SismoConnectButton } from "@sismo-core/sismo-connect-react";
import { AUTHS, CONFIG, SIGNATURE } from "../utils/constants";

const SismoConnect = () => {
  return (
    <div className="App">
      <SismoConnectButton
        config={CONFIG}
        auths={AUTHS}
        text="Sign in"
        signature={SIGNATURE}
        onResponse={async (response) => {
          console.log("response", response);
          try {
            const res = await fetch("http://localhost:5000/", {
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
