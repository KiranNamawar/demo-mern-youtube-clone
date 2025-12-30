import { timeAgo } from "../utils/format";
import Avatar from "./Avatar";

function VideoComments({ comments }) {
  return (
    <div className="w-full overflow-hidden">
      {comments.map(({ _id, userId, content, createdAt }) => (
        <div key={_id} className="flex gap-2">
          <Avatar src={userId.avatar} alt={userId.username} />
          <div>
            <p>
              <span>{userId.username}</span>
              <span>{timeAgo(createdAt)}</span>
            </p>
            <pre dangerouslySetInnerHTML={{ __html: content }}></pre>
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoComments;
