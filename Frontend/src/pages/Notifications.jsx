import React, { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getNotifications();
      setNotifications(data);
    })();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((n) => (
          <NotificationCard
            key={n._id}
            bed={n.bed}
            assignedUser={n.assignedUser}
            onAdmit={() => admitPatient(n.bed.id)}
            onWithdraw={() => withdrawPatient(n.bed.id)}
          />
        ))
      )}
    </div>
  );
};

export default Notifications;
