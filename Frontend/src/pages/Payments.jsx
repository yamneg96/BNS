// import React, { useEffect, useState } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { verifyPayment } from "../services/payment";

// const Payments = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const tx_ref = searchParams.get("tx_ref");
//   const [status, setStatus] = useState("Checking payment...");

//   useEffect(() => {
//     const checkPayment = async () => {
//       if (!tx_ref) {
//         setStatus("No transaction reference found.");
//         return;
//       }
//       try {
//         const result = await verifyPayment(tx_ref);
//         if (result.success) {
//           setStatus("Payment successful! Redirecting to login...");
//           setTimeout(() => navigate("/login"), 2000);
//         } else {
//           setStatus("Payment failed. Please try again.");
//         }
//       } catch (err) {
//         setStatus("Error verifying payment: " + err.message);
//       }
//     };
//     checkPayment();
//   }, [tx_ref, navigate]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg rounded-lg p-8">
//         <h2 className="text-2xl font-bold text-red-800">{status}</h2>
//       </div>
//     </div>
//   );
// };

// export default Payments;

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { verifyPayment } from "../services/payment";
// import { useAuth } from "../context/AuthContext";

// const Payments = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { userEmail } = useAuth();
//   const [status, setStatus] = useState("Verifying your payment...");

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const tx_ref = queryParams.get("tx_ref");
//     const chapaStatus = queryParams.get("status"); // success | failed | cancelled

//     if (!tx_ref) {
//       setStatus("No transaction reference found.");
//       return;
//     }

//     // Show quick message based on Chapa return URL
//     if (chapaStatus && chapaStatus !== "success") {
//       setStatus("❌ Payment was not completed.");
//       return;
//     }

//     // Verify with backend (real confirmation)
//     verifyPayment(tx_ref)
//       .then((res) => {
//         if (res.success) {
//           setStatus("✅ Payment successful! Your subscription is active.");
//           setTimeout(() => navigate("/login"), 3000);
//         } else {
//           setStatus("❌ Payment failed or not verified. Please try again.");
//         }
//       })
//       .catch(() => {
//         setStatus("⚠️ Error verifying payment. Please contact support.");
//       });
//   }, [location, navigate, userEmail]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="p-8 bg-white rounded-xl shadow-md text-center">
//         <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
//         <p>{status}</p>
//       </div>
//     </div>
//   );
// };

// export default Payments;

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { triggerPaymentCallback } from "../services/payment";

const Payments = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [statusMsg, setStatusMsg] = useState("Awaiting your input...");
  const [email, setEmail] = useState("");

  // Extract tx_ref & status from Chapa redirect
  const queryParams = new URLSearchParams(location.search);
  const tx_ref = queryParams.get("tx_ref");
  const status = queryParams.get("status") || "success";

  const handleVerify = () => {
    if (!tx_ref) {
      setStatusMsg("❌ No transaction reference found.");
      return;
    }
    if (!email) {
      setStatusMsg("⚠️ Please enter your email.");
      return;
    }

    setStatusMsg("⏳ Verifying your payment...");

    triggerPaymentCallback({ tx_ref, status, email })
      .then(() => {
        setStatusMsg("✅ Payment processed! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch((err) => {
        console.error("Callback error", err.message);
        setStatusMsg("❌ Payment failed or user not found.");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-xl shadow-md text-center w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>

        <input
          type="email"
          name="userEmail"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-2 rounded-md w-full p-2 mb-4 bg-gray-100 text-center"
          placeholder="Enter your email"
          id="userEmail"
        />

        <button
          onClick={handleVerify}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Verify Payment
        </button>

        <p className="mt-4 text-gray-700">{statusMsg}</p>
      </div>
    </div>
  );
};

export default Payments;



