import React from "react";
import "./EmployeeTile.css";

const EmployeeTile = ({
  name,
  empId,
  designation,
  ageing,
  benchPercentage,
}) => {
  return (
    <div className="employee-tile">
      <div className="employee-tile-left">
        <div className="employee-name">{name}</div>
        <div className="employee-id">ID: {empId}</div>
        <div className="employee-designation">{designation}</div>
      </div>
      <div className="employee-tile-right">
        <div className="employee-section">
          <div className="section-title">Ageing</div>
          <div className="section-value">{ageing}</div>
        </div>
        <div className="employee-section">
          <div className="section-title">Bench %</div>
          <div className="section-value">{benchPercentage}</div>
        </div>
        {/* Add more sections here if needed */}
      </div>
    </div>
  );
};

export default EmployeeTile;