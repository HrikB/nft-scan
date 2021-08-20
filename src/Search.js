import React from "react";
import "./Search.css";
import axios from "axios";
import { useState, useEffect } from "react";

function Search() {
  const [userCollections, setUserCollections] = useState([]);
  const [userNFTs, setUserNFTs] = useState([]);
  const [collMap, setCollMap] = useState([]);
  const [walletAddr, setWalletAddr] = useState(
    "0xd6a984153acb6c9e2d788f08c2465a1358bb89a7"
  );
  //logz:
  //0xff0bd4aa3496739d5667adc10e2b843dfab5712b
  //Mine:
  //0x553a96c13b67D500182bb6aB46d53A2eDFb22706

  const slugArr = [];

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
    return (
      axios
        .get("https://api.opensea.io/api/v1/assets/", {
          params: {
            owner: walletAddr,
            limit: 50,
            offset: offset,
          },
        })
        /*.then(async (res) => {
        console.log("resres", res.data.assets);
        if (res.data.assets.length == 50) {
          await fetchAssets(offset + 50);
        }
      })*/

        .catch((e) => {
          console.log("assetsError", e);
        })
    );
  };

  useEffect(async () => {
    if (walletAddr) {
      //gets list of all collection in wallet
      const collection = await fetchCollections();
      setUserCollections(collection.data);

      //gets all nfts in wallet
      var finalArr = [];
      const assets = await fetchAssets(0);
      finalArr = finalArr.concat(assets.data.assets);

      const overLimit = async (offset) => {
        console.log("awaiting overLimit", offset);
        const res = await fetchAssets(offset);
        finalArr = finalArr.concat(res.data.assets);
        if (res.data.assets.length == 50) {
          await overLimit(offset + 50);
        }
      };
      if (assets.data.assets.length == 50) {
        await overLimit(50);
      }

      console.log("final", finalArr);

      //makes map of all nfts where key is the collection slug and value is an array of all the nfts
      const collectionMap = new Map();
      console.log("collection", collection.data);
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
                ? e.name.length < 17
                  ? e.name
                  : e.name.substring(0, 20) + "..."
                : "--"}
            </p>
            <p>
              {e.collection.name.length < 17
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
