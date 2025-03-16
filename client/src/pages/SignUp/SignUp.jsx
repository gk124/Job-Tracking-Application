import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Please enter your name");
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    if (!password) {
      toast.error("Please enter the password");
      setError("Please enter the password");
      return;
    }
    setError(null);

    // SignUp api call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // handle successful registration response
      if (response.data && response.data.error) {
        toast.error(response.data.message);
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        toast.success(response.data.message);
        localStorage.setItem("token", response.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
        setError(error.response.data.message);
      } else {
        toast.error("An unexpected error occured, please try again");
        setError("An unexpected error occured, please try again");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex align-item-center justify-content-center my-5">
        <div
          className=" border rounded bg-white px-3 py-3"
          style={{ width: "40%" }}
        >
          <form onSubmit={handleSignUp}>
            <h4 className="text-xl mb-5 text-center">Sign Up</h4>
            <div className="form-group">
              <label htmlFor="exampleInputFullName">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="exampleInputFullName"
                aria-describedby="fullNameHelp"
                placeholder="Enter FullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">Email address</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">Password</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-danger text-sm pb-1">{error}</p>}
            <button type="submit" className="btn btn-primary px-4">
              Create Account
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <Link to={"/login"} className="text-primary">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        draggable
        pauseOnHover
      />
    </>
  );
};

export default SignUp;
