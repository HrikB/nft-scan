import React from "react";
import "./Search.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Search() {
  const [userCollections, setUserCollections] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [walletAddr, setWalletAddr] = useState(
    "0x553a96c13b67D500182bb6aB46d53A2eDFb22706"
  );

  const slugArr = [];

  const fetchCollections = () => {
    return axios
      .get("https://api.opensea.io/api/v1/collections", {
        params: { asset_owner: walletAddr },
      })
      .catch((e) => {
        console.log("error", e);
      });
  };

  const fetchAssets = () => {
    return axios.get("https://api.opensea.io/api/v1/assets/", {
      params: {
        owner: walletAddr,
        limit: 50,
      },
    });
  };

  useEffect(async () => {
    if (walletAddr) {
      const collection = await fetchCollections();
      setUserCollections(collection.data);

      const assets = await fetchAssets();
      setUserNFTs(assets.data.assets);
    }
  }, [walletAddr]);

  return (
    <div>
      {userCollections.map((e) => (
        <div className="collectionList__container">{e.name}</div>
      ))}
      <div height="30px"></div>
      {userNFTs.forEach((e) => {
        console.log(e);
        console.log();
      })}
      {userNFTs.map((e) => (
        <img src={e.image_url} />
      ))}
    </div>
  );
}

export default Search;
