export const filterChat = (chatList, address) => {
  return chatList.filter((data) => data[0]?.conversation?.peerAddress == address);
};
