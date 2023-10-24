import { useCallback, useEffect, useState } from "react";

function actionByKey(key) {
  const keyActionMap = {
    KeyW: "moveForward",
    KeyS: "moveBackward",
    KeyA: "moveLeft",
    KeyD: "moveRight",
    keyP: "profileMenu",
    Space: "jump",
    Digit1: "grass",
    Digit2: "tree",
    Digit3: "glass",
    Digit4: "wood",
    Digit5: "diamond",
    Digit6: "quartz",
    Digit7: "stone",
    KeyC: "chatMenu",
    KeyQ: "inventory",
    KeyE: "settings",
    KeyB: "buyMenu",
    KeyI: "infoMenu",
    // keyT: "saveBtn",
  };
  return keyActionMap[key];
}

export const useKeyboard = () => {
  const [actions, setActions] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    grass: false,
    tree: false,
    glass: false,
    wood: false,
    diamond: false,
    quartz: false,
    stone: false,
    chatMenu: false,
    saveBtn: false,
    inventory: false,
    settings: false,
    buyMenu: false,
    infoMenu: false,
    profileMenu: false
  });

  const handleKeyDown = useCallback((e) => {
    const action = actionByKey(e.code);
    if (action) {
      setActions((prev) => {
        return {
          ...prev,
          [action]: true,
        };
      });
    }
  }, []);

  const handleKeyUp = useCallback((e) => {
    const action = actionByKey(e.code);
    if (action) {
      setActions((prev) => {
        return {
          ...prev,
          [action]: false,
        };
      });
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return actions;
};
