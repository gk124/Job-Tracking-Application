import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";

const AddEditJobs = ({ jobData, type, getAllJobs }) => {
  const [company, setCompany] = useState(jobData?.company || "");
  const [position, setPosition] = useState(jobData?.position || "");
  const [status, setStatus] = useState(jobData?.status || "");
  const [notes, setNotes] = useState(jobData?.notes || "");
  const [error, setError] = useState(null);

  // add job
  const addNewJob = async () => {
    try {
      const response = await axiosInstance.post("/add-job", {
        company: company,
        position: position,
        status: status,
        notes: notes,
      });

      if (response.data && response.data.job) {
        toast.success(response.data.message);
        getAllJobs();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  // edit job
  const editJob = async () => {
    const jobID = jobData?._id;
    try {
      const response = await axiosInstance.put("/edit-job/" + jobID, {
        company: company,
        position: position,
        status: status,
        notes: notes,
      });

      if (response.data && response.data.job) {
        toast.success(response.data.message);
        getAllJobs();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddJob = async (e) => {
    e.preventDefault();
    if (!company) {
      setError("Please Enter the company name");
      toast.error("Please Enter the company name");
      return;
    }

    setError(null);
    if (!position) {
      setError("Please Enter the position applied for");
      toast.error("Please Enter the position name");
      return;
    }

    setError(null);
    if (!status) {
      setError("Please select the current status of your application");
      toast.error("Please select the current status of your application");
      return;
    }

    setError(null);

    if (type === "edit") {
      editJob();
    } else {
      addNewJob();
    }

    setCompany("");
    setPosition("");
    setStatus("");
    setNotes("");
  };

  return (
    <div>
      <div className="d-flex flex-column gap-2">
        <form className="" onSubmit={handleAddJob}>
          <div className="row g-3 align-items-center my-2">
            <div className="col-3">
              <label htmlFor="inputCompany" className="col-form-label">
                Company
              </label>
            </div>
            <div className="col-6">
              <input
                type="text"
                id="inputCompany"
                className="form-control"
                aria-describedby="companyHelpInline"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row g-3 align-items-center my-2">
            <div className="col-3">
              <label htmlFor="inputPosition" className="col-form-label">
                Position
              </label>
            </div>
            <div className="col-6">
              <input
                type="text"
                id="inputPosition"
                className="form-control"
                aria-describedby="PositionHelpInline"
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row g-3 align-items-center my-2">
            <div className="col-3">
              <label htmlFor="inputStatus" className="col-form-label">
                Status
              </label>
            </div>
            <div className="col-6">
              <select
                className="form-select"
                id="inputStatus"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option selected value="">
                  Select
                </option>
                <option value="Applied">Applied</option>
                <option value="Interview Scheduled">Interview Scheduled</option>
                <option value="Offered">Offered</option>
              </select>
            </div>
            <div className="row g-3 align-items-center my-2">
              <div className="col-3">
                <label htmlFor="inputInterview" className="col-form-label">
                  Interview Details
                </label>
              </div>
              <div className="col-6">
                <textarea
                  type="text"
                  id="inputInterview"
                  className="form-control"
                  aria-describedby="InterviewHelpInline"
                  value={notes}
                  onChange={(e) => {
                    setNotes(e.target.value);
                  }}
                />
              </div>
            </div>
            {error && <p className="text-danger text-sm pb-1">{error}</p>}
            <div className="row">
              <button
                onClick={() => {}}
                type="submit"
                className="btn btn-primary mt-5 px-4 col-auto"
              >
                {type === "add" ? "ADD" : "UPDATE"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditJobs;
