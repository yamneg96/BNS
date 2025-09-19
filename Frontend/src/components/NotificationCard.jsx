// components/NotificationCard.jsx
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const NotificationCard = ({ message, type, bed, wardName, departmentName, createdAt, from }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 relative">
      {/* Message */}
      <p className="text-gray-800 font-semibold">{message}</p>

      {/* From */}
      <p className="text-sm text-gray-600 mt-1">
        From:{" "}
        <span className="font-medium text-indigo-600">{from?.name || "Unknown"}</span>
      </p>

      {/* Timestamp */}
      <p className="text-xs text-gray-400 mt-1">
        {new Date(createdAt).toLocaleString()}
      </p>

      {/* Toggle button */}
      <button
        onClick={() => setShowDetails((prev) => !prev)}
        className="absolute bottom-2 right-3 text-xs text-indigo-600 font-medium flex items-center cursor-pointer hover:underline"
      >
        {showDetails ? (
          <>
            Hide <ChevronUp size={14} className="ml-1" />
          </>
        ) : (
          <>
            More <ChevronDown size={14} className="ml-1" />
          </>
        )}
      </button>

      {/* Details */}
      {showDetails && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
          <p>
            <span className="font-semibold">Type:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                type === "admit"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {type}
            </span>
          </p>
          <p>
            <span className="font-semibold">Bed:</span> {bed}
          </p>
          <p>
            <span className="font-semibold">Ward:</span> {wardName}
          </p>
          <p>
            <span className="font-semibold">Department:</span> {departmentName}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;
