import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios';

export default function SingleCategory({nfts}) {
    const router = useRouter()
    const { name } = router.query
    console.log(nfts, "name");
    return (
        <div>
         {/* Render your NFTs data here */}  
        </div>
    )
}

export async function getStaticPaths() {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/all`);
    const collections = response.data;

    console.log(collections);  // Log collections

    const paths = collections
        .filter((collection) => {
            console.log(collection.name);  // Log each collection's name
            return collection.name;
        })
        .map((collection) => ({
            params: { name: collection.name },
        }));

    return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
    const { name } = params;
    console.log(name);  // Log the collection name
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/collections/${name}`);
    const collection = response.data;
    const subdomain = "https://saud-nft.infura-ipfs.io";
    console.log(collection,"test collection");  // Log the collection

    // Check if collection.nftIDs is an array and has items in it
    if (Array.isArray(collection.nftIDs) && collection.nftIDs.length) {
        // Fetch additional data for each NFT from IPFS
        for (let nftID of collection.nftIDs) {
            const ipfsResponse = await axios.get(`${subdomain}/ipfs/${nftID}`);
            const ipfsData = ipfsResponse.data;
            
            // You need to decide how to store and return this data. 
            // Below is just an example assuming you'd want to add it to the collection object

            // If collection.ipfsData does not exist, create it as an empty array
            if (!collection.ipfsData) {
                collection.ipfsData = [];
            }

            // Push ipfsData into the collection.ipfsData array
            collection.ipfsData.push(ipfsData);
        }
    }

    return { 
        props: { nfts: collection },
    };
}