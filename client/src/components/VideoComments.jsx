import { useEffect, useRef, useState } from "react";
import { timeAgo } from "../utils/format";
import Avatar from "./Avatar";
import { Check, Pen, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import api from "../lib/api";

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
      })
      .catch(console.error);
  }

  function handleDeleteComment(commentId) {
    api
      .delete(`/videos/${videoId}/comments/${commentId}`)
      .then(({ data }) => setComments(data.data))
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
    <div>
      <p>{comments.length} Comments</p>
      {/* New Comment  */}
      <div className="flex p-2 gap-2">
        <Avatar src={user.avatar} alt={user.username} />
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
            className="w-full active:outline-0"
          />
          {isAuthenticated && (
            <button type="submit">
              <Check />
            </button>
          )}
        </form>
      </div>
      {/* All comments */}
      <div className="w-full overflow-hidden">
        {comments.map(
          ({ _id, userId: author, content, createdAt, updatedAt }) => (
            <div key={_id} className="flex gap-2 items-center justify-between">
              <div className="flex gap-2 w-full">
                <Avatar src={author.avatar} alt={author.username} />
                <div className="w-full flex flex-col">
                  {/* Not in editing mode display author data */}
                  {!(editingComment.id === _id) && (
                    <p className="flex gap-2">
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
                      onSubmit={
                        isAuthenticated &&
                        author._id === user.id &&
                        handleEditComment
                      }
                      className="w-full flex justify-between"
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
                        className="w-full active:outline-0"
                      />
                      <button title="save comment" type="submit">
                        <Check />
                      </button>
                    </form>
                  ) : (
                    // Render non editing comments
                    <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
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
                    >
                      <Pen />
                    </button>
                    <button
                      title="delete comment"
                      onClick={() => handleDeleteComment(_id)}
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
