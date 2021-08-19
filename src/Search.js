import React from "react";
import "./Search.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Search() {
  const [userCollections, setUserCollections] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [collMap, setCollMap] = useState([]);
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
      setCollMap(collectionMap);

      //gets one of each collection and stores a refernce in an array
      const userNFTDisplayArr = [];
      collectionMap.forEach((e) => {
        userNFTDisplayArr.push(e[e.length - 1]);
      });
      setUserNFTs(userNFTDisplayArr);
    }
  }, [walletAddr]);

  return (
    <div className="result__container">
      {userNFTs.forEach((e) => {
        console.log(collMap.get(e.collection.slug).length);
      })}
      {userNFTs.map((e) => (
        <div className="collection__container">
          <img src={e.image_url} />
          <div className="displayNFT__container">
            <p style={{ fontWeight: "bold" }}>
              {e.name
                ? e.name.length < 20
                  ? e.name
                  : e.name.substring(0, 20) + "..."
                : "--"}
            </p>
            <p>
              {e.collection.name.length < 20
                ? e.collection.name
                : e.collection.name.substring(0, 20) + "..."}
            </p>
          </div>
          <div className="view__all">
            <span
              style={{
                visibility:
                  collMap.get(e.collection.slug).length > 1 ? "auto" : "hidden",
              }}
            >
              View all ({collMap.get(e.collection.slug).length})
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Search;
