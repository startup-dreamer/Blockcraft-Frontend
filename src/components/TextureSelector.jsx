import React, { useEffect, useState } from "react";
import { useStore } from "../hooks/useStore";
import { useKeyboard } from "../hooks/useKeyboard";
import { ethers } from "ethers";
import {
  diamondImg,
  grassImg,
  glassImg,
  woodImg,
  quartzImg,
  stoneImg,
  treeImg,
} from "../images/block_icons/images";
import {
  BagIcon,
  InfoIcon,
  bagPackIcon,
  chatIcon,
  gearIcon,
  globeIcon,
  levelsIcon,
  profileIcon,
  saveIcon,
  shopIcon,
} from "../assets";
import { compare, mintLevel, saveGame } from "../utils/functionCall";
import Loader from "./Loader";

const images = {
  grass: grassImg,
  tree: treeImg,
  glass: glassImg,
  wood: woodImg,
  diamond: diamondImg,
  quartz: quartzImg,
  stone: stoneImg,
};

const levels = [
  { level: 1, id: 1 },
  { level: 2, id: 2 },
  { level: 3, id: 3 },
  { level: 4, id: 4 },
  { level: 5, id: 5 },
  { level: 6, id: 6 },
  { level: 7, id: 7 },
  { level: 8, id: 8 },
  { level: 9, id: 9 },
  { level: 10, id: 10 },
];

const TextureSelector = () => {
  const [
    cubes,
    items,
    targetCubes,
    activeWorldID,
    activeTexture,
    setTexture,
    chatBar,
    setChatBar,
    inventoryBar,
    setInventoryBar,
    settingMenu,
    setSettingMenu,
    shopMenu,
    setShopMenu,
    infoBar,
    setInfoBar,
    activeConfig,
    setActiveConfig,
    levelMode,
    setLevelMode,
    getLevel,
    setLevel,
  ] = useStore((state) => [
    state.cubes,
    state.items,
    state.targetCubes,
    state.activeWorldID,
    state.blockTexture,
    state.setBlockTexture,
    state.chatBar,
    state.setChatBar,
    state.inventoryBar,
    state.setInventoryBar,
    state.settingMenu,
    state.setSettingMenu,
    state.shopMenu,
    state.setShopMenu,
    state.infoBar,
    state.setInfoBar,
    state.activeConfig,
    state.setActiveConfig,
    state.levelMode,
    state.setLevelMode,
    state.getLevel,
    state.setLevel,
  ]);

  const {
    grass,
    tree,
    glass,
    wood,
    diamond,
    quartz,
    stone,
    chatMenu,
    inventory,
    settings,
    buyMenu,
    infoMenu,
    saveBtn,
    profileMenu,
  } = useKeyboard();

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const textures = {
      grass,
      tree,
      glass,
      wood,
      diamond,
      quartz,
      stone,
      chatMenu,
      inventory,
      settings,
      buyMenu,
      infoMenu,
      saveBtn,
      profileMenu,
    };
    console.log(textures);
    const pressedTexture = Object.entries(textures).find(([k, v]) => v);
    if (pressedTexture) {
      console.log(pressedTexture);
      if (pressedTexture[0] == "chatMenu") {
        setChatBar(!chatBar);
        setActiveConfig(activeConfig == "chatMenu" ? "e" : "chatMenu");
      } else if (pressedTexture[0] == "inventory") {
        setInventoryBar(!inventoryBar);
        setActiveConfig(activeConfig == "inventory" ? "e" : "inventory");
      } else if (pressedTexture[0] == "settings") {
        setSettingMenu(!settingMenu);
        setActiveConfig(activeConfig == "setting" ? "e" : "setting");
      } else if (pressedTexture[0] == "buyMenu") {
        setShopMenu(!shopMenu);
        setActiveConfig(activeConfig == "shopMenu" ? "e" : "shopMenu");
      } else if (pressedTexture[0] == "infoMenu") {
        setInfoBar(!infoBar);
        setActiveConfig(activeConfig == "infoMenu" ? "e" : "infoMenu");
      } else if (pressedTexture[0] == "profileMenu") {
        // setLevelMode(!levelMode);
      } else {
        setTexture(pressedTexture[0]);
      }
    }
  }, [
    profileMenu,
    setTexture,
    grass,
    tree,
    glass,
    wood,
    diamond,
    quartz,
    stone,
    chatMenu,
    inventory,
    settings,
    saveBtn,
    buyMenu,
    infoMenu,
  ]);

  // console.log(levelMode);

  const saveGameData = async () => {
    setLoader(true);
    const objData = {
      cubes,
      items,
    };
    console.log("worldId: " + activeWorldID);
    console.log(objData);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      await saveGame(signer, activeWorldID, objData);
      setLoader(false);
    } catch (error) {
      console.log(error);
    }
  };

  const verifyLevel = async () => {
    setLoader(true);
    const res = compare(cubes, targetCubes[getLevel]);
    console.log(res);
    if (res) {
      setSuccess(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      await mintLevel(signer);
      setModal(true);
      setLevel(getLevel + 1);
    } else {
      setModal(true);
    }
    setLoader(false);
  };

  return (
    <div>
      {modal && (
        <div className="menu absolute z-10 make-flex w-screen h-screen">
          {/* <div
          className="absolute translate-x-[230px] text-white -translate-y-[125px] cursor-pointer"
          onClick={() => set(!settingMenu)}
          >
          X
        </div> */}
          <div className="menu-container w-[500px] h-[300px] card-container make-flex justify-start pt-10 flex-col gap-10">
            <h2 className="text-center">
              {success
                ? "Congrats you have completed your level!"
                : "Not Correct"}
            </h2>
            {/* <p>🎊🎊🎊</p> */}
            <div className="make-flex gap-3">
              <button
                className="btn hover:scale-105"
                onClick={() => window.location.reload()}
              >
                Go to World
              </button>
              <button
                className="btn hover:scale-105"
                onClick={() => {
                  setModal(false);
                  setSuccess(false);
                }}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute bottom-1 cursor-pointer z-10 right-0 icon-container">
        <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[3px] text-white">
          C
        </span>
        <img
          src={chatIcon}
          style={{
            backgroundColor: "rgba(198, 198, 198, 0.544)",
            padding: "13px",
          }}
          onClick={() => setChatBar(!chatBar)}
          className={`${
            "chatMenu" === activeConfig ? "active" : ""
          } configIcon`}
        />
      </div>
      <div className="texture-selector icon-container">
        {Object.entries(images).map(([k, src], index) => {
          return (
            <div>
              <span className="absolute text-[6px] m-1 translate-x-[6px] translate-y-[6px] text-white">
                {index + 1}
              </span>
              <img
                key={k}
                src={src}
                style={{ scale: "1" }}
                className={`${k === activeTexture ? "active" : ""}`}
              />
            </div>
          );
        })}
      </div>
      <div className="icon-container absolute right-0 top-[30%] z-10 cursor-pointer">
        <div onClick={() => saveGameData()}>
          <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[1px] text-white">
            Ctrl+S
          </span>
          <img
            src={saveIcon}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
            className={`${"save" === activeConfig ? "active" : ""}`}
          />
        </div>
        <div onClick={() => setSettingMenu(!settingMenu)}>
          <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[3px] text-white">
            E
          </span>
          <img
            src={gearIcon}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
            className={`${"setting" === activeConfig ? "active" : ""}`}
          />
        </div>
        <div onClick={() => setShopMenu(!shopMenu)}>
          <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[3px] text-white">
            B
          </span>
          <img
            src={shopIcon}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
            className={`${"shopMenu" === activeConfig ? "active" : ""}`}
          />
        </div>
        <div onClick={() => setInventoryBar(!inventoryBar)}>
          <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[3px] text-white">
            Q
          </span>
          <img
            src={bagPackIcon}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
            className={`${"inventory" === activeConfig ? "active" : ""}`}
          />
        </div>
        <div onClick={() => setInfoBar(!infoBar)}>
          <span className="absolute text-[6px] m-1 translate-x-[7px] translate-y-[3px] text-white">
            I
          </span>
          <img
            src={InfoIcon}
            style={{
              backgroundColor: "rgba(198, 198, 198, 0.544)",
              padding: "13px",
            }}
            className={`${"infoMenu" === activeConfig ? "active" : ""}`}
          />
          {infoBar && (
            <ul className="btn absolute  -translate-x-[250px] -translate-y-[75px] w-[250px] text-[18px] py-2 px-3 font-vt">
              <li>To exist view press ESC</li>
              <li> Click on the center pointer to continue</li>
            </ul>
          )}
        </div>
      </div>
      <div
        className="icon-container absolute flex left-2 gap-3 cursor-pointer bottom-2"
        style={{ margin: 0 }}
      >
        <div className="scale-125 hover:scale-110 ">
          {levelMode ? (
            <img
              src={globeIcon}
              onClick={() => {
                setLevelMode(false);
                window.location.reload();
              }}
            />
          ) : (
            <img
              src={levelsIcon}
              onClick={() => {
                setLevelMode(true);
              }}
            />
          )}
        </div>
        <ul
          className=" make-flex p-3 gap-2"
          style={{
            transform: levelMode ? `translateX(-10px)` : `translateX(-1200px)`,
            transition: "0.4s ease-in",
          }}
        >
          {levels.map(({ level, id }) => {
            // console.log(getLevel);
            return (
              <li
                className="level-item text-2xl font-vt  hover:scale-105"
                key={id}
                // onClick={() => setLevel(1)}
                style={{
                  backgroundColor:
                    id <= getLevel
                      ? "#3e9927"
                      : id == getLevel + 1
                      ? "#D3C75A"
                      : "#7c7c7c",
                }}
              >
                Level{level}
              </li>
            );
          })}
          <li
            className="btn cursor-pointer hover:scale-105 h-12 make-flex"
            onClick={() => verifyLevel()}
          >
            Submit
          </li>
        </ul>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default TextureSelector;
