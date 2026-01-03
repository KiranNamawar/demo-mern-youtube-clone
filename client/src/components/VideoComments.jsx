import { useEffect, useRef, useState } from "react";
import { timeAgo } from "../utils/format";
import Avatar from "./Avatar";
import { Check, Pen, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../lib/api";
import toast from "react-hot-toast";

function VideoComments({ comments: originalComments, videoId }) {
  const [comments, setComments] = useState(originalComments);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState({
    id: null,
    content: "",
  });
  const editingCommentRef = useRef(null);
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;

  function handleNewComment(evt) {
    evt.preventDefault();
    if (newComment.trim() === "") return;
    api
      .post(`/videos/${videoId}/comments`, { content: newComment })
      .then(({ data }) => {
        setComments(data.data);
        setNewComment("");
        toast.success("Comment added");
      })
      .catch(console.error);
  }

  function handleDeleteComment(commentId) {
    api
      .delete(`/videos/${videoId}/comments/${commentId}`)
      .then(({ data }) => {
        setComments(data.data);
        toast.success("Comment deleted", { icon: <Trash2 /> });
      })
      .catch(console.error);
  }

  function handleEditComment() {
    api
      .put(`/videos/${videoId}/comments/${editingComment.id}`, {
        content: editingComment.content,
      })
      .then(({ data }) => {
        setComments(data.data);
        setEditingComment({ id: null, content: "" });
        editingCommentRef.current = null;
        toast.success("Comment Edited");
      })
      .catch(console.error);
  }

  // focus editing comment input
  useEffect(() => {
    editingCommentRef.current?.focus();
  }, [editingComment.id, editingCommentRef]);

  // reset state on video change
  useEffect(() => {
    setComments(originalComments);
    setNewComment("");
    setEditingComment({
      id: null,
      content: "",
    });
  }, [originalComments, videoId]);

  return (
    <div className="p-2 flex flex-col gap-4">
      <p className="font-bold text-2xl">{comments.length} Comments</p>
      {/* New Comment  */}
      <div className="flex p-2 gap-2">
        <Avatar src={user.avatar} alt={user.username} width={40} height={40} />
        <form onSubmit={handleNewComment} className="border-b flex w-full">
          <input
            type="text"
            disabled={!isAuthenticated}
            placeholder={
              isAuthenticated
                ? "add new comment"
                : "Please login to add comment"
            }
            value={newComment}
            onChange={(evt) => setNewComment(evt.target.value)}
            className="w-full focus:outline-0 p-2"
          />
          {isAuthenticated && (
            <button type="submit" className="btn-secondary">
              <Check />
            </button>
          )}
        </form>
      </div>
      {/* All comments */}
      <div className="w-full overflow-hidden flex flex-col gap-4">
        {comments.map(
          ({ _id, userId: author, content, createdAt, updatedAt }) => (
            <div
              key={_id}
              className="flex gap-2 w-full items-center justify-between"
            >
              <div className="flex gap-4 w-full">
                <Avatar
                  src={author.avatar}
                  alt={author.username}
                  width={50}
                  height={50}
                />
                <div className="flex w-full flex-col">
                  {/* Not in editing mode display author data */}
                  {!(editingComment.id === _id) && (
                    <p className="flex gap-4 text-fg/50">
                      <span>
                        {(!author.username.startsWith("@") ? "@" : "") +
                          author.username}
                      </span>
                      <span>
                        {new Date(updatedAt) > new Date(createdAt)
                          ? "edited " + timeAgo(updatedAt)
                          : timeAgo(createdAt)}
                      </span>
                    </p>
                  )}
                  {/* In Editing mode display input to edit comment */}
                  {editingComment.id === _id ? (
                    <form
                      onSubmit={(evt) => {
                        evt.preventDefault();
                        isAuthenticated &&
                          author._id === user.id &&
                          handleEditComment();
                      }}
                      className="flex w-full justify-between items-center  border-b"
                    >
                      <input
                        type="text"
                        ref={editingCommentRef}
                        value={editingComment.content}
                        onChange={(evt) =>
                          setEditingComment({
                            id: _id,
                            content: evt.target.value,
                          })
                        }
                        className="w-full focus:outline-0"
                      />
                      <button
                        title="save comment"
                        className="btn-secondary"
                        type="submit"
                      >
                        <Check />
                      </button>
                    </form>
                  ) : (
                    // Render non editing comments
                    <p className="line-clamp-2">{content}</p>
                  )}
                </div>
              </div>
              {/* Only author can update or delete */}
              {isAuthenticated &&
                author._id === user.id &&
                !(editingComment.id === _id) && (
                  <div className="flex items-center gap-2">
                    <button
                      title="edit comment"
                      onClick={() => setEditingComment({ id: _id, content })}
                      className="btn-secondary"
                    >
                      <Pen />
                    </button>
                    <button
                      title="delete comment"
                      onClick={() => handleDeleteComment(_id)}
                      className="btn-secondary"
                    >
                      <Trash2 />
                    </button>
                  </div>
                )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default VideoComments;
