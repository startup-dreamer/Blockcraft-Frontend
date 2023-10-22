import React, { useState, useEffect } from "react";
import { SismoConnectButton } from "@sismo-core/sismo-connect-react";
import { AUTHS, CONFIG, SIGNATURE } from "../utils/constants";

const SismoConnect = () => {
  const [data, setData] = useState(null);

  return (
    <div className="App">
      {data ? (
        <div> {/* Render your fetched data here */} </div>
      ) : (
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
              setData(data);
            } catch (error) {
              console.error("Error:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default SismoConnect;