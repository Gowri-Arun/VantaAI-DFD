import React, { useState } from "react";
import WarningPopup from "./WarningPopup";
import { getWarningReasons } from "../utils/contentChecks";

const PostUploader = ({ onPostSubmit }) => {
  const [postText, setPostText] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [warningReasons, setWarningReasons] = useState([]);

  const handleCheckAndSubmit = () => {
    const reasons = getWarningReasons(postText);
    if (reasons.length > 0) {
      setWarningReasons(reasons);
      setShowWarning(true);
    } else {
      onPostSubmit(postText);
      setPostText("");
    }
  };

  const confirmSubmit = () => {
    onPostSubmit(postText);
    setPostText("");
    setShowWarning(false);
    setWarningReasons([]);
  };

  const cancelSubmit = () => {
    setShowWarning(false);
    setWarningReasons([]);
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow max-w-md w-full">
        <textarea
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Write something to share..."
          className="w-full border p-2 rounded resize-none"
          rows={4}
        />
        <button
          onClick={handleCheckAndSubmit}
          disabled={!postText.trim()}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Post
        </button>
      </div>

      {showWarning && (
        <WarningPopup
          reasons={warningReasons}
          onConfirm={confirmSubmit}
          onCancel={cancelSubmit}
        />
      )}
    </>
  );
};

export default PostUploader;
