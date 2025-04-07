import { useEffect, useRef } from "react";
import moment from "moment";
import ProfileAvatar from "../assets/default-avatar.png";

const NotificationModel = ({ isOpen, onClose, notifications, notificationButtonRef }) => {
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target) &&
        notificationButtonRef.current &&
        !notificationButtonRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, notificationButtonRef]);

  const formatNotificationTime = (createdAt) => {
    const date = moment(createdAt);
    if (date.isSame(new Date(), "day")) {
      return date.format("h:mm A");
    } else if (date.isSame(moment().subtract(1, "days"), "day")) {
      return "Yesterday";
    } else {
      return date.format("MMM D");
    }
  };

  return (
    <div
      ref={notificationRef}
      className={`absolute w-[300px] md:w-[437px] max-h-[400px] overflow-auto transition-all duration-200 bg-white rounded-20 gap-1 flex flex-col right-10 top-14 z-20 ${
        isOpen ? "opacity-1 pointer-events-all" : "opacity-0 pointer-events-none"
      }`}
      style={{ boxShadow: "0px 0px 20px 0px #0000001A" }}
    >
      <p className="font-bold pt-4 px-4">Notification</p>
      <hr className="bg-gray h-[1px] border-none" />

      {notifications && notifications.length === 0 ? (
        <p className="px-4 py-2">No notifications available</p>
      ) : (
        notifications?.map((i) => (
          <div
            className={`flex items-center gap-2 px-4 py-2 ${
              i.isRead ? "bg-transparent" : "bg-[#dfdddd]"
            }`}
            key={i._id}
          >
            <img
              src={i?.senderId?.image ? i?.senderId?.image : ProfileAvatar}
              className="min-w-10 h-10 md:min-w-12 md:h-12 rounded-full"
              alt=""
            />
            <div>
              <p
                className="text-xs md:text-sm font-semibold"
                dangerouslySetInnerHTML={{ __html: i.message }}
              />
            </div>
            <p className="min-w-fit md:text-sm text-xs text-end mt-2">
              {formatNotificationTime(i.createdAt)}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationModel;
