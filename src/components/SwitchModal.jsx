import React, { useState } from "react";
import { useStore } from "../hooks/useStore";

const SwitchModal = () => {
  const [switchModal, setSwitchModal] = useStore((state) => [
    state.switchModal,
    state.setSwitchModal,
  ]);
  //   const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setSwitchModal(!switchModal);
  };

  return (
    <>
      <span className="label text-2xl text-right font-vt w-20 text-black">
        {switchModal ? "To build" : "In game"}
      </span>
      <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none items-center m-0">
        <input
          type="checkbox"
          name="autoSaver"
          className="sr-only"
          checked={switchModal}
          onChange={handleCheckboxChange}
        />
        <span
          className={`slider flex h-[26px] w-[50px] items-center rounded-full p-1 ml-2 duration-200 ${
            switchModal ? "bg-[#CCCCCE]" : "bg-[#CCCCCE]"
          }`}
        >
          <span
            className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
              switchModal ? "translate-x-6" : ""
            }`}
          ></span>
        </span>
      </label>
    </>
  );
};

export default SwitchModal;
