const MessagesPage = () => {
  return (
    <div>
      <div className="no-messages-message text-center p-10">
        <h2 className="text-lg font-bold">No Messages Yet</h2>
        <p className="text-gray-600 mt-2">
          You don’t have any messages yet. Check back here for updates or start a
          conversation.
        </p>
      </div>
    </div>
  );
};
export default MessagesPage;
