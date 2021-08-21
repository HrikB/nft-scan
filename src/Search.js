import React from "react";
import "./Search.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";

function Search() {
  const [input, setInput] = useState("");
  const history = useHistory();

  const searchWallet = (e) => {
    e.preventDefault();
    history.push(`/${input}`);
    setInput("");
  };

  return (
    <div className="search__container">
      <form className="form">
        <input
          className="input__field"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          placeholder="Search any Ethereum Address"
          type="text"
        />
        <button
          disabled={!input.trim()}
          id="submitbutton"
          onClick={searchWallet}
          type="submit"
        ></button>
      </form>
    </div>
  );
}

export default Search;
