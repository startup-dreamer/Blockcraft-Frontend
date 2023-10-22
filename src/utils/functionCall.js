import {
  ITEM_ABI,
  ITEM_FACTORY_ABI,
  ITEM_FACTORY_CONTRACT_ADDRESS,
  LEVEL_ABI,
  LEVEL_CONTRACT_ADDRESS,
  WORLD_CONTRACT_ABI,
  WORLD_CONTRACT_ADDRESS,
} from "./constants";
import { makeFileObjects, uploadWeb3 } from "./web3Storage";
import { ethers } from "ethers";

// ******************WORLD NFT Function call****************************

export const createNewWorld = async (signer, name, description) => {
  const CID = await uploadWeb3(await makeFileObjects({ cubes: [], items: [] }));
  const contract = new ethers.Contract(
    WORLD_CONTRACT_ADDRESS,
    WORLD_CONTRACT_ABI,
    signer
  );
  const tx = await contract.createWorld(name, CID, description);
  await tx.wait();
  return CID;
};

export const saveGame = async (signer, worldID, objData) => {
  console.log(signer, objData);
  const CID = await uploadWeb3(await makeFileObjects(objData));
  console.log("CID : " + CID);
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    WORLD_CONTRACT_ADDRESS,
    WORLD_CONTRACT_ABI,
    signer
  );
  const tx = await contract.updateTokenURI(account, worldID, CID);
  const receipt = await tx.wait();
  console.log(receipt);
};

export const fetchGameData = async (signer) => {
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    WORLD_CONTRACT_ADDRESS,
    WORLD_CONTRACT_ABI,
    signer
  );
  try {
    const res1 = await contract.getOwnerWorldIds(account);
    console.log(res1);
    const res = await contract.fetchMetadata(account);
    let data = [];
    res.forEach((item) => {
      data.push(JSON.parse(atob(item)));
    });
    console.log(data);
    return [data, res1];
  } catch (error) {
    console.log(error.errorArgs[0]);
    return "null";
  }
};

// ******************ITEMS NFT Function call****************************

export const createNewItem = async (
  signer,
  totalSupply,
  name,
  symbol,
  itemID
) => {
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    ITEM_FACTORY_CONTRACT_ADDRESS,
    ITEM_FACTORY_ABI,
    signer
  );
  const tx = await contract.newItem(totalSupply, name, symbol, itemID);
  console.log(tx);
  const receipt = await tx.wait();
  console.log(receipt);
};

export const listItem = async (signer, ItemNum, price) => {
  const contract = new ethers.Contract(
    ITEM_FACTORY_CONTRACT_ADDRESS,
    ITEM_FACTORY_ABI,
    signer
  );

  // const ItemNum = 4;
  // const price = 10;
  const tx = await contract.listOnMarketplace(ItemNum, price);
  const receipt = await tx.wait();
  console.log(receipt);
};

export const purchaseItems = async (signer, ItemNum, price) => {
  const contract = new ethers.Contract(
    ITEM_FACTORY_CONTRACT_ADDRESS,
    ITEM_FACTORY_ABI,
    signer
  );
  const tx = await contract.purchase(ItemNum, { value: price });
  const receipt = await tx.wait();
  console.log(receipt);
};

export const fetchUserItemMetadata = async (signer) => {
  const account = await signer.getAddress();
  const contract = new ethers.Contract(
    ITEM_FACTORY_CONTRACT_ADDRESS,
    ITEM_FACTORY_ABI,
    signer
  );

  const totalItems = await contract._totalItems();
  let itemMetadata = [];

  for (let i = 1; i <= totalItems; i++) {
    const itemNumToItem = await contract.itemNumToItem(i);
    const itemTotalSupply = itemNumToItem.totalSupply;

    const itemAddress = itemNumToItem.itemAddress;
    const itemContract = new ethers.Contract(itemAddress, ITEM_ABI, signer);

    for (let j = 1; j <= itemTotalSupply; j++) {
      const owner = await itemContract.ownerOf(j);
      if (owner === account) {
        const ipfsCid = await itemContract.tokenURI(j);
        const name = await itemContract.name();

        const json = {
          name: name,
          cid: ipfsCid,
        };

        itemMetadata.push(json);
      }
    }
  }
  console.log(itemMetadata);
  return itemMetadata;
};

export const fetchCreatorNFTData = async (signer) => {
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    ITEM_FACTORY_CONTRACT_ADDRESS,
    ITEM_FACTORY_ABI,
    signer
  );
  try {
    const res = await contract.fetchMetadata(account);
    console.log(res);
  } catch (error) {
    console.log(error.errorArgs[0]);
  }
};

export const getAllNFTsTotalSupplyItemURI = async (signer) => {
  const contract = new ethers.Contract(
    ITEM_FACTORY_CONTRACT_ADDRESS,
    ITEM_FACTORY_ABI,
    signer
  );

  const totalItems = await contract._totalItems();
  let itemAdditionalData = [];

  for (let i = 1; i <= totalItems; i++) {
    const itemNumToItem = await contract.itemNumToItem(i);
    const itemTotalSupply = itemNumToItem.totalSupply;

    const json = {
      itemAddress: itemNumToItem.itemAddress,
      itemTotalSupply: Number(itemTotalSupply?._hex),
      totalSold: itemNumToItem.totalSold,
      cid: itemNumToItem.itemURI,
      itemName: itemNumToItem.itemName,
      price: Number(itemNumToItem.price?._hex),
      itemNum: i,
    };

    itemAdditionalData.push(json);
  }
  return itemAdditionalData;
};

// ******************ITEMS NFT Function call****************************
export const mintLevel = async (signer) => {
  const contract = new ethers.Contract(
    LEVEL_CONTRACT_ADDRESS,
    LEVEL_ABI,
    signer
  );
  const tx = await contract.createLevel("temp");
  console.log(tx);
  const receipt = await tx.wait();
  console.log(receipt);
};
export const fetchLevel = async (signer) => {
  const account = signer.getAddress();
  const contract = new ethers.Contract(
    LEVEL_CONTRACT_ADDRESS,
    LEVEL_ABI,
    signer
  );
  const tx = await contract.getOwnerLevelId(account);
  return Number(tx._hex)
};


function compareObjects(obj1, obj2) {
  return (
    obj1.pos.toString() === obj2.pos.toString() &&
    obj1.texture === obj2.texture
  );
}

export const compare = (data1, data2) => {
  if (data1 && data2) {
    if (data1.length == data2.length) {

      return data1.every((item, index) => compareObjects(item, data2[index]))
    }
    return false;
  }
  return false;
};
