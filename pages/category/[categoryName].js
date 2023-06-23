import { useRouter } from 'next/router'
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const CategoryPage = () => {
    const router = useRouter()
    const { categoryName } = router.query
    const [nfts, setNfts] = useState([]);

    const subdomain = "https://saud-nft.infura-ipfs.io";

    useEffect(() => {
      const fetchCategoryNFTs = async () => {
          try {
              const response = await axios.get(`http://localhost:8080/api/nfts/category/${categoryName}`);
              const nfts = response.data;
              // Fetch additional data for each NFT from IPFS
              for (let nft of nfts) {
                  const ipfsResponse = await axios.get(`${subdomain}/ipfs/${nft.ipfsPath}`);
                  const ipfsData = ipfsResponse.data;
                  nft.name = ipfsData.name;
                  nft.description = ipfsData.description;
                  nft.image = ipfsData.image;
              }
              setNfts(nfts);
          } catch (error) {
              console.error("Error fetching NFTs", error);
          }
      };
      if (categoryName) {
          fetchCategoryNFTs();
      }
  }, [categoryName]);

    console.log(nfts);

    return (
        <div>
            <h1>{categoryName}</h1>
            {nfts.map((nft, i) => (
                <div key={i}>
                    <h2>{nft.name}</h2>
                    <p>{nft.description}</p>
                    <img src={nft.image} />
                </div>
            ))}
        </div>
    )
}

export default CategoryPage;
