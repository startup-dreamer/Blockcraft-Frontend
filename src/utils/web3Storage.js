import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return process.env.REACT_APP_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export async function makeFileObjects(data) {
  
  // const obj = { hello: "world" };
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });

  const files = [
    // new File(["contents-of-file-1"], "plain-utf8.txt"),
    new File([blob], "world.json"),
  ];
  return files;
}

export async function uploadWeb3(file) {
  if (file) {
    const client = makeStorageClient();
    const cid = await client.put(file);
    console.log("web3 Storage cid: " + cid);
    return cid;
  }
}
export async function retrieveData(cid) {
  const client = makeStorageClient();
  const res = await client.get(cid);
  const files = await res.files();
  console.log(files);
  return files;
}
