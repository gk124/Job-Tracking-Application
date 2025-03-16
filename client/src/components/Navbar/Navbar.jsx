import React from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();
  const onLogout = () => {
    toast.success("Logged Out Successfully");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <div className="shadow bg-white d-flex align-item-center justify-content-between p-3 mb-4 bg-light rounded">
        <h2 className="text-lg font-weight-bold text-black py-2">JOBS</h2>
        {/* <SearchBar/> */}
        {localStorage.getItem("token") && (
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
        )}
      </div>

    </>
  );
};

export default Navbar;
