import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();
  const hasVerified = useRef(false);

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
        hasVerified.current = true;
      } catch (err) {
        // Only show error if never succeeded
        if (!hasVerified.current) setStatus("error");
      }
    };
    verify();
    // eslint-disable-next-line
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-charcoal">Email Verification</h2>
        {status === "verifying" && <p>Verifying your email...</p>}
        {status === "success" && (
          <>
            <p className="text-green-600 mb-4">Email verified! You can now log in.</p>
            <button
              onClick={() => navigate("/login")}
              className="bg-tan text-cream px-6 py-3 rounded-lg hover:bg-gold transition font-medium"
            >
              Log in
            </button>
          </>
        )}
        {status === "error" && (
          <p className="text-red-600">Invalid or expired verification link.</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;