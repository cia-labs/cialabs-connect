// SearchModal.jsx
import React from "react";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";

const SearchModal = ({ searchOpen, setSearchOpen }) => {
  return (
    <div
      className={`fixed top-0 w-screen h-screen bg-black/5 backdrop-blur-xl flex flex-col px-7 lg:px-[10vw] text-white animation_search ${
        searchOpen ? "z-50 h-screen opacity-100" : "z-0 h-0 opacity-0"
      }`}
    >
      <div className="w-full h-[9vh] mt-5 flex flex-row justify-between items-center">
        <button
          onClick={() => setSearchOpen(false)}
          className="flex flex-row justify-center items-center gap-2 opacity-40"
        >
          <KeyboardBackspaceRoundedIcon fontSize="large" /> Go Back
        </button>
      </div>

      <input
        type="text"
        className="pb-2 outline-0 border-b-1 border-white text-3xl"
        placeholder="Search What You Like"
      />
    </div>
  );
};

export default SearchModal;
