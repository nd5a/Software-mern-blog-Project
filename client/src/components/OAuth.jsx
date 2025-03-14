import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function OAuth() {
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      toast.info("Processing Google login..."); 
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultFromGoogle.user.displayName,
          email: resultFromGoogle.user.email,
          googlePhotoUrl: resultFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // dispatch(signInSuccess(data));
        // navigate("/");
        toast.success("Login successful");
        setTimeout(() => {
          dispatch(signInSuccess(data));
          navigate("/");
        }, 3000); 
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
    <Button
      type="button"
      gradientDuoTone="pinkToOrange"
      outline
      onClick={handleGoogleClick}
      >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue With Google
      </Button>
    <ToastContainer position="top-right" autoClose={3000} />
      </>
  );
}
