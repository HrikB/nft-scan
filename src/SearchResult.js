import React from "react";
import "./SearchResult.css";
import axios from "axios";
import loading from "./loading.svg";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SearchResult() {
  const [userCollections, setUserCollections] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [collMap, setCollMap] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { walletAddr } = useParams();
  //logz:
  //0xff0bd4aa3496739d5667adc10e2b843dfab5712b
  //Mine:
  //0x553a96c13b67D500182bb6aB46d53A2eDFb22706
  //Flamingo:
  //0xb88f61e6fbda83fbfffabe364112137480398018

  const fetchCollections = () => {
    return axios
      .get("https://api.opensea.io/api/v1/collections", {
        params: { asset_owner: walletAddr, limit: 300 },
      })

      .catch((e) => {
        console.log("error", e);
      });
  };

  const fetchAssets = (offset) => {
    return axios
      .get("https://api.opensea.io/api/v1/assets/", {
        params: {
          owner: walletAddr,
          limit: 50,
          offset: offset,
        },
      })

      .catch((e) => {
        console.log("assetsError", e);
      });
  };

  useEffect(async () => {
    setUserCollections([]);
    setUserNFTs([]);
    setCollMap([]);
    if (walletAddr) {
      setIsLoading(true);
      //gets list of all collection in wallet
      const collection = await fetchCollections();
      setUserCollections(collection.data);

      //gets all nfts in wallet
      var finalArr = [];
      const assets = await fetchAssets(0);
      finalArr = finalArr.concat(assets.data.assets);

      const overLimit = async (offset) => {
        const res = await fetchAssets(offset);
        finalArr = finalArr.concat(res.data.assets);
        if (res.data.assets.length == 50) {
          await overLimit(offset + 50);
        }
      };
      if (assets.data.assets.length == 50) {
        await overLimit(50);
      }
      setIsLoading(false);
      //makes map of all nfts where key is the collection slug and value is an array of all the nfts
      const collectionMap = new Map();
      collection.data.forEach((e) => {
        collectionMap.set(e.slug, []);
      });
      finalArr.forEach((e) => {
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
      {userNFTs.map((e) => (
        <div className="collection__container">
          <img src={e.image_url} />
          <div className="displayNFT__container">
            <p style={{ fontWeight: "bold" }}>
              {e.name
                ? e.name.length < 16
                  ? e.name
                  : e.name.substring(0, 16) + "..."
                : "--"}
            </p>
            <p>
              {e.collection.name.length < 16
                ? e.collection.name
                : e.collection.name.substring(0, 16) + "..."}
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
      {isLoading ? (
        <div className="loading__screen">
          <img src={loading} className="loading__img" />
          <p>Loading...</p>
        </div>
      ) : (
        <span />
      )}
    </div>
  );
}

export default SearchResult;
