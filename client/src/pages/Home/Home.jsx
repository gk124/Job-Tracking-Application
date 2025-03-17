import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { MdCreate, MdDelete, MdAdd } from "react-icons/md";
import AddEditJobs from "./AddEditJobs";
import Modal from "react-modal";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Modal.setAppElement("#root");

const Home = () => {
  const [type, setType] = useState("add");
  const [data, setData] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [allJobs, setAllJobs] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  //  Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const navigate = useNavigate();

  // get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // get all jobs
  const getAllJobs = async () => {
    try {
      const response = await axiosInstance.get("/get-all-jobs");
      if (response.data?.jobs) {
        setAllJobs(response.data.jobs);
      }
    } catch (error) {
      console.log("An unexpected error occurred while fetching jobs");
    }
  };

  // delete job
  const deleteJob = async (data) => {
    const jobID = data?._id;
    try {
      const response = await axiosInstance.delete(`/delete-job/${jobID}`);
      if (response.data && !response.data.error) {
        toast.success(response.data.message);
        getAllJobs(); // Refresh the job list
      }
    } catch (error) {
      toast.error("An error occurred while deleting the job");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllJobs();
  }, []);

  const handleOpenModal = (type, job = null) => {
    setType(type);
    setData(job);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //  Filter Jobs based on search and status
  const filteredJobs = allJobs.filter((job) => {
    return (
      (job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.position.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus ? job.status === filterStatus : true)
    );
  });

  // Pagination Logic
  const indexOfLastJob = currentPage * rowsPerPage;
  const indexOfFirstJob = indexOfLastJob - rowsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(filteredJobs.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="container mx-auto overflow-x-scroll">
        {/*Search & Filter Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          {/* Search Input */}
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search by company or position"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter Dropdown */}
          <select
            className="form-control w-25"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Offered">Offered</option>
          </select>

          {/* Add Job Button */}
          <button
            className="btn btn-success"
            onClick={() => handleOpenModal("add")}
          >
            <MdAdd className="display-6" />
            <span className="display-7">Add</span>
          </button>
        </div>

        {/*Jobs Table */}
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th scope="col">Company</th>
              <th scope="col">Position</th>
              <th scope="col">Status</th>
              <th scope="col">Applied On</th>
              <th scope="col"></th>
            </tr>
          </thead>

          <tbody>
            {currentJobs.map((item) => (
              <tr
                key={item._id}
                onClick={() => handleOpenModal("view", item)} // Handle row click
                style={{ cursor: "pointer" }}
              >
                <td>{item.company}</td>
                <td>{item.position}</td>
                <td>{item.status}</td>
                <td>
                  {item.appliedOn
                    ? moment.utc(item.appliedOn).format("Do MMM YYYY")
                    : "N/A"}
                </td>
                <td className="d-flex gap-3">
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click when clicking Edit
                      handleOpenModal("edit", item);
                    }}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  >
                    <MdCreate />
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click when clicking Delete
                      deleteJob(item);
                    }}
                    style={{ cursor: "pointer", fontSize: "20px" }}
                  >
                    <MdDelete />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-3 gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="btn btn-light mx-2"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="btn btn-light mx-2"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/*Modal */}
      <Modal
        isOpen={openModal}
        onRequestClose={handleCloseModal}
        shouldCloseOnOverlayClick={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "500px",
            padding: "20px",
            borderRadius: "10px",
            overflowY: "auto",
          },
        }}
      >
        <h2>
          {type === "add"
            ? "Add Job"
            : type === "edit"
            ? "Edit Job"
            : "Job Details"}
        </h2>
        {type === "view" ? (
          <>
            <p>
              <strong>Company:</strong> {data?.company}
            </p>
            <p>
              <strong>Position:</strong> {data?.position}
            </p>
            <p>
              <strong>Status:</strong> {data?.status}
            </p>
            <p>
              <strong>Applied On:</strong>{" "}
              {data?.appliedOn
                ? moment.utc(data.appliedOn).format("Do MMM YYYY")
                : "N/A"}
            </p>
            <p>
              <strong>Interview Details:</strong> {data?.notes}
            </p>
          </>
        ) : (
          <AddEditJobs jobData={data} type={type} getAllJobs={getAllJobs} />
        )}
        <button onClick={handleCloseModal} className="btn btn-secondary mt-3">
          Close
        </button>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default Home;
