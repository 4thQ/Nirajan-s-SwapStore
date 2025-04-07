import { useState } from "react";
import toast from "react-hot-toast";

const MessageDialog = ({ isOpen, onClose, onSend }) => {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const handleSend = () => {
    if (subject && content) {
      onSend({ subject, content });
      onClose();
    } else {
      toast.error("Please fill in both the subject and message.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-[90%]">
        <h2 className="text-lg font-semibold mb-4">Send Message</h2>
        <input
          type="text"
          placeholder="Subject"
          className="w-full p-2 border rounded mb-3"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          placeholder="Message"
          className="w-full p-2 border rounded mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="btn btn-outline w-32" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary w-32" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDialog;
