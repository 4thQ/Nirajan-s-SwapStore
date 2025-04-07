import { useEffect, useRef, useState } from "react";
import NotificationModel from "./NotificationModel";
import { getNotifications, markeAsReadNotifcation } from "../http/api";

const Notification = () => {
  const [isOpenNotificationModel, setIsOpenNotificationModel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const notificationButtonRef = useRef(null);

  const handleClose = async () => {
    try {
      setIsOpenNotificationModel(false);
      if (unreadCount === 0) {
        return;
      }
      const { data } = await markeAsReadNotifcation();
      setUnreadCount(0);
      setNotifications(data?.updatedNotifications);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = () => {
    setIsOpenNotificationModel((prev) => !prev);
  };

  useEffect(() => {
    const fetchNotificationsAndCount = async () => {
      try {
        const response = await getNotifications();
        console.log("Response : ", response);
        setUnreadCount(response.data.unreadCount);
        setNotifications(response.data.notifications);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotificationsAndCount();

    const intervalId = setInterval(() => {
      fetchNotificationsAndCount();
    }, 120000); // 2 MINUE

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <button
        ref={notificationButtonRef}
        className={`flex items-center justify-center rounded-full ${
          isOpenNotificationModel ? "bg-black" : "bg-white"
        }`}
        onClick={handleToggle}
      >
        <div className="p-3 flex gap-2 items-center">
          <BellSVG color={isOpenNotificationModel ? "white" : "black"} />
          <span
            className={`text-sm hidden md:inline font-semibold ${
              isOpenNotificationModel ? "text-white" : "text-black"
            }`}
          >
            {unreadCount}
          </span>
        </div>
      </button>
      {isOpenNotificationModel && (
        <NotificationModel
          isOpen={isOpenNotificationModel}
          notifications={notifications}
          onClose={handleClose}
          notificationButtonRef={notificationButtonRef}
        />
      )}
    </div>
  );
};

export default Notification;

const BellSVG = ({ color }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z"
        fill={color}
      />
      <path
        d="M14.8302 20.01C14.4102 21.17 13.3002 22 12.0002 22C11.2102 22 10.4302 21.68 9.88018 21.11C9.56018 20.81 9.32018 20.41 9.18018 20C9.31018 20.02 9.44018 20.03 9.58018 20.05C9.81018 20.08 10.0502 20.11 10.2902 20.13C10.8602 20.18 11.4402 20.21 12.0202 20.21C12.5902 20.21 13.1602 20.18 13.7202 20.13C13.9302 20.11 14.1402 20.1 14.3402 20.07C14.5002 20.05 14.6602 20.03 14.8302 20.01Z"
        fill={color}
      />
    </svg>
  );
};
