import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/payment";

const Payments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tx_ref = searchParams.get("tx_ref");
  const [status, setStatus] = useState("Checking payment...");

  useEffect(() => {
    const checkPayment = async () => {
      if (!tx_ref) {
        setStatus("No transaction reference found.");
        return;
      }
      try {
        const result = await verifyPayment(tx_ref);
        if (result.success) {
          setStatus("Payment successful! Redirecting to login...");
          setTimeout(() => navigate("/login"), 2000);
        } else {
          setStatus("Payment failed. Please try again.");
        }
      } catch (err) {
        setStatus("Error verifying payment: " + err.message);
      }
    };
    checkPayment();
  }, [tx_ref, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-red-800">{status}</h2>
      </div>
    </div>
  );
};

export default Payments;
