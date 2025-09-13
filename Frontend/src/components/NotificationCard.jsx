import React from "react";

const NotificationCard = ({ bed, assignedUser, onAdmit, onWithdraw }) => {
  return (
    <div className="border p-3 mb-2 rounded flex justify-between items-center">
      <div>
        <p><strong>Bed:</strong> {bed.name} ({bed.id})</p>
        <p><strong>Assigned To:</strong> {assignedUser}</p>
      </div>
      <div className="flex gap-2">
        <button onClick={onAdmit} className="bg-green-500 text-white px-3 py-1 rounded">
          Admit
        </button>
        <button onClick={onWithdraw} className="bg-red-500 text-white px-3 py-1 rounded">
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
