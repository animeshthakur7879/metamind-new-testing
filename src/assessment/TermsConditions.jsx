import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleProceed = () => {
    if (accepted) {
      navigate("/test");
    } else {
      alert("Please accept the terms to proceed.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold">Terms & Conditions</h1>
      <p className="mt-4">Please agree to the terms before starting the test.</p>
      <div className="mt-4">
        <input
          type="checkbox"
          id="acceptTerms"
          className="mr-2"
          checked={accepted}
          onChange={() => setAccepted(!accepted)}
        />
        <label htmlFor="acceptTerms">I accept the terms & conditions</label>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-700 rounded text-white"
        onClick={handleProceed}
      >
        Proceed
      </button>
    </div>
  );
};

export default TermsAndConditions;
