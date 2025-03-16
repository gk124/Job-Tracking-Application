import React from "react";
import "../Cards/ProfileInfo.css";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({userInfo, onLogout}) => {
  return (
    <div className="d-flex profile gap-2">
      <div className="pic rounded-circle">{getInitials(userInfo?.fullName)}</div>
      <div className="d-flex flex-column">
        <span className="text-sm " style={{ fontWeight: "600" }}>
          {userInfo?.fullName}
        </span>
        <span className="text-sm" style={{textDecoration:"underline", cursor:"pointer"}} onClick={onLogout}>Logout</span>
      </div>
    </div>
  );
};

export default ProfileInfo;
