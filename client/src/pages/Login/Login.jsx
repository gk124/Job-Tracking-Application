import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setError("Please enter a valid email address");
      return;
    }
    setError(null);
    if (!password) {
      toast.error("Please enter password");
      setError("Please enter the password");
      return;
    }
    setError(null);

    // login api call

    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // handle successful login response
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

      <div className="container d-flex align-item-center justify-content-center my-5">
        <div
          className=" border rounded bg-white px-3 py-3"
          style={{ width: "40%" }}
        >
          <form onSubmit={handleLogin}>
            <h4 className="text-xl mb-5 text-center">LOGIN</h4>
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
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not registered yet?{" "}
              <Link to={"/signup"} className="text-primary">
                Create an account
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

export default Login;
