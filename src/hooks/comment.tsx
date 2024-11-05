import React from "react";
import { Comment } from "@/types/comment";
import { Link } from "react-router-dom";

interface CommentsModalProps {
  isOpen: boolean;
  comments: Comment[];
  onClose: () => void;
}
const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  comments,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-lg">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((comment, index) => (
            <div key={index} className="flex items-start mb-4">
              <Link to={`/profile/${comment.username}`}>
                <img
                  src={
                    comment.profileImage || "https://via.placeholder.com/150"
                  }
                  alt={comment.username}
                  className="w-8 h-8 rounded-full border  object-cover mr-2"
                />
              </Link>
              <div>
                <p className="text-sm font-semibold">{comment.username}</p>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            </div>
          ))
        )}
        <div className="flex items-center justify-center">
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
