import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Client } from "@xmtp/xmtp-js";
import { ethers } from "ethers";
import { filterChat } from "../utils/FilterChat";
import Lottie from "react-lottie-player";
import loaderGif from "../assets/loader.json";

const ChatBox = () => {
  const { account } = useMoralis();
  const [loader, setLoader] = useState(false);
  const [xmtp, setxmtp] = useState();
  const [contacts, setContacts] = useState();
  const [activeChat, setActiveChat] = useState();
  const [message, setMessage] = useState("");
  const [addContactAddress, setAddContactAddress] = useState("");
  const [activeChatAddress, setActiveChatAddress] = useState("");

  const fetchChat = async (address) => {
    console.log("fetching chats of address : " + address);
    if (xmtp) {
      setActiveChatAddress(address);
      let chatList = [];
      const allConversations = await xmtp.conversations.list();
      for (const conversation of allConversations) {
        const messagesInConversation = await conversation.messages(
          "16fb56100ef63f0f0d58f677a9af7f8049d72518ef090914bd25f69fe5886f3c"
        );
        chatList.push(messagesInConversation);
      }
      console.log("chatList :" + chatList);
      const filteredChat = filterChat(chatList, address);
      console.log("filtered Chat : " + filteredChat);
      setActiveChat(...filteredChat);

      // Fetch live message
    }
  };

  useEffect(() => {
    const listen = async () => {
      if (xmtp) {
        const conversation = await xmtp.conversations.newConversation(
          activeChatAddress
        );
        for await (const message of await conversation.streamMessages()) {
          if (message.senderAddress === xmtp.address) {
            // This message was sent from me
            continue;
          }
          setActiveChat([...activeChat, message]);
        }
      }
    };
    listen();
  }, [activeChat]);

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let xmtpClient = await Client.create(signer, {
      env: process.env.REACT_APP_XMTP_SERVER,
    });
    setxmtp(xmtpClient);

    const allConversations = await xmtpClient.conversations.list();
    let list = [];

    for (const conversation of allConversations) {
      const contact = await conversation.peerAddress;
      console.log(contact);
      list.push(contact);
    }
    setContacts(list);
  };

  const addContact = async () => {
    const areOnNetwork = await Client.canMessage(addContactAddress, {
      env: "dev",
    });
    console.log("isonNetwork : " + areOnNetwork);

    if (areOnNetwork && addContactAddress) {
      const newConversation = await xmtp.conversations.newConversation(
        addContactAddress
      );
      console.log(newConversation);
    } else {
      console.log("isonNetwork : " + areOnNetwork);
    }
  };

  const sendMessage = async () => {
    let tempMessage = message;
    setMessage("");
    if (xmtp && message) {
      const conversation = await xmtp.conversations.newConversation(
        activeChatAddress
      );
      const res = await conversation.send(tempMessage);
      console.log(res);
      setActiveChat([...activeChat, res]);
    }
  };

  return (
    <div className="absolute downMenu flex justify-end right-14 bottom-0 text-black">
      {loader && (
        <div
          className="fixed top-0 w-screen h-screen flex justify-center items-center"
          style={{ background: "rgba(223, 223, 223, 0.22)" }}
        >
          <Lottie
            loop
            animationData={loaderGif}
            play
            style={{
              width: 200,
              height: 200,
            }}
          />
        </div>
      )}
      {xmtp ? (
        <div className="chat-container bg-white w-[650px] h-[90vh] flex rounded-lg ">
          <div className="contacts w-24 border flex flex-col font-vt text-2xl px-2 pt-2">
            {contacts
              ? contacts.map((address) => {
                  return (
                    <div
                      key={address}
                      className="cursor-pointer"
                      onClick={() => fetchChat(address)}
                    >
                      {`${address.slice(0, 4)}..${address.slice(
                        address.length - 2
                      )}`}
                    </div>
                  );
                })
              : ""}
          </div>
          <div className="chatContent flex flex-col justify-end w-full  text-2xl">
            <div className="create-channel h-14">
              <div className="inputContainer flex mb-2 h-10">
                <input
                  type="text"
                  className="border border-black w-full px-2 h-10 rounded-md font-vt"
                  value={addContactAddress}
                  placeholder="Enter Address"
                  onChange={(e) => setAddContactAddress(e.target.value)}
                />
                <button
                  onClick={() => addContact()}
                  className="btn mx-1 hover:bg-[#53537B]"
                >
                  add
                </button>
              </div>
            </div>
            <div className="chats flex flex-col m-2 text-white gap-2 font-vt overflow-y-scroll h-full">
              {activeChat
                ? activeChat.map((item) => {
                    return (
                      <div
                        className="flex"
                        style={{
                          justifyContent: `${
                            account == item?.senderAddress?.toLowerCase()
                              ? "end"
                              : "start"
                          }`,
                        }}
                        key={item.id}
                      >
                        <div className="bg-[#5A5A8E] inline-block px-3 rounded-md">
                          {item.content}
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
            <div className="inputContainer flex mb-2 h-10">
              <input
                type="text"
                className="border border-black w-full px-2 h-10 rounded-md font-vt"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={() => sendMessage()}
                className="btn bg-[#5A5A8E] text-white mx-1 hover:bg-[#53537B]"
              >
                send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-container w-[650px] h-[90vh]  bg-[#4a4a4a41] flex justify-center items-center">
          <button className="btn hover:scale-[102%]" onClick={() => connect()}>
            Connect XMTP
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
