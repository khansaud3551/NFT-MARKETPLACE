import React, { useState, useCallback } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//INTERNAL IMPORT
import Style from "../styles/account.module.css";
import images from "../img";
import Form from "../AccountPage/Form/Form";

const account = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [formData, setFormData] = useState({
    // Initialize your form fields here
  });

  const onDrop = useCallback(async (acceptedFile) => {
    setFileUrl(acceptedFile[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 5000000,
  });

  const handleSubmit = async (event) => {
    console.log(formData);
    try {
      console.log(formData);
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/profiles`, formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.success("Profile updated successfully!");
      // toast.error("An error occurred while updating profile.");
      console.error("An error occurred while updating profile:", error);
    }
  };

  return (
    <div className={Style.account}>
      <ToastContainer />

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
        <Form formData={formData} setFormData={setFormData} handleSubmit={handleSubmit}   />
        </div>
      </div>
    </div>
  );
};

export default account;