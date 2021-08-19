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
      //gets list of all collection in wallet
      const collection = await fetchCollections();
      setUserCollections(collection.data);

      //gets all nfts in wallet
      const assets = await fetchAssets();
      //makes map of all nfts where key is the collection slug and value is an array of all the nfts
      const collectionMap = new Map();
      collection.data.forEach((e) => {
        collectionMap.set(e.slug, []);
      });
      assets.data.assets.forEach((e) => {
        var prevArr = collectionMap.get(e.collection.slug);
        prevArr.push(e);
        collectionMap.set(e.collection.slug, prevArr);
      });

      const userNFTDisplayArr = [];
      collectionMap.forEach((e) => {
        userNFTDisplayArr.push(e[e.length - 1]);
      });
      setUserNFTs(userNFTDisplayArr);
    }
  }, [walletAddr]);

  return (
    <div>
      {userCollections.map((e) => (
        <div className="collectionList__container">{e.name}</div>
      ))}
      <div height="30px"></div>

      {userNFTs.map((e) => (
        <img src={e.image_url} />
      ))}
    </div>
  );
}

export default Search;
