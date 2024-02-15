import React, { useState, useCallback, useContext } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

//INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import Form from "../AccountPage/Form/Form";
import { NFTMarketplaceContext  } from "../Context/NFTMarketplaceContext";

const account = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    
  });

  //get account from context
  const { checkIfWalletConnected, currentAccount } = useContext(
    NFTMarketplaceContext
  );

  const onDrop = useCallback(async (acceptedFile) => {
    setFileUrl(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleSubmit = async (event) => {
    if (!checkIfWalletConnected()) {
      toast.error('Please connect your wallet first');
      return;
    }

    let profileExists = false;

    try {
      const responseAccount = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}`);
      const profile = responseAccount.data;

      if (profile && profile.username && profile.email) {
        profileExists = true;
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Profile does not exist, handle accordingly
        profileExists = false;
      } else {
    
        toast.error('An error occurred while checking the profile');
        console.error('Error checking profile:', error);
        return; 
      }
    }
  
    const apiEndpoint = profileExists ? `${process.env.NEXT_PUBLIC_API_URL}/api/profiles/${currentAccount}` : `${process.env.NEXT_PUBLIC_API_URL}/api/profiles`;
      //add wallet address to form data
      formData.walletAddress = currentAccount;
      console.log('apiEndpoint', apiEndpoint);
      console.log('formData', formData);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        //send form data
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' }, // Use if sending JSON data
      });
  
      if (response.ok) {
        const result = await response.json();
        // Handle success (e.g., display a success message)
        toast.success('Profile processed successfully');
      } else {
        // Handle server errors or invalid responses
        toast.error('An error occurred while processing your profile');
      }
    } catch (error) {
      // Handle network errors
      toast.error('Failed to send data to the server');
    }
  };

  return (
    <div className={Style.account}>

      <div className={Style.account_info}>
        <h1>Profile settings</h1>
        <p>
          You can set preferred display name, create your profile URL and manage
          other personal settings.
        </p>
      </div>

      <div className={Style.account_box}>
        <div className={Style.account_box_img} {...getRootProps()}>
          <input {...getInputProps()} />
          <Image
            src={fileUrl ? URL.createObjectURL(fileUrl) : images.user1}
            alt="account upload"
            width={150}
            height={150}
            className={Style.account_box_img_img}
          />
          <p className={Style.account_box_img_para}>Change Image</p>
        </div>
        <div className={Style.account_box_from}>
        <Form currentAccount={currentAccount} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}   />
        </div>
      </div>
    </div>
  );
};

export default account;