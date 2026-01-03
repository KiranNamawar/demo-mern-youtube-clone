import { Pen, Video, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useRevalidator } from "react-router";
import z from "zod";
import Button from "./Button";
import Form from "./Form";

const videoSchema = z.object({
  title: z.string({ error: "title is required" }),
  description: z.string().optional(),
  videoUrl: z.url({ error: "Invalid URL" }).refine(
    (url) => {
      return url.includes("youtube.com") || url.includes("youtu.be");
    },
    {
      error: "URL must be from youtube.com or youtu.be",
    }
  ),
  thumbnailUrl: z.url({ error: "Invalid URL" }),
  category: z.string().min(1, { error: "category is required" }),
});

function VideoDialog({ edit = false, video = {}, channelId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const channels = useSelector((state) => state.user.channels);
  const [activeChannelId, setActiveChannelId] = useState(
    channelId ?? channels[0]?._id ?? null
  );
  const [error, setError] = useState(null);
  const dialogRef = useRef(null);

  const fields = [
    { name: "title", type: "text", defaultValue: video.title ?? "" },
    {
      name: "description",
      type: "text",
      defaultValue: video.description ?? "",
    },
    { name: "videoUrl", type: "url", defaultValue: video.videoUrl ?? "" },
    {
      name: "thumbnailUrl",
      type: "url",
      defaultValue: video.thumbnailUrl ?? "",
    },
    { name: "category", type: "text", defaultValue: video.category ?? "" },
  ];

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  function handleSuccess(data) {
    if (edit) {
      revalidator.revalidate();
    } else {
      navigate(`/channel/${activeChannelId}`);
    }
    closeDialog();
  }

  function handleError(code, error) {
    setError(error);
  }

  const title = edit ? "Edit Video" : "Upload Video";
  const Icon = edit ? Pen : Video;
  const submitPath = edit
    ? `/channel/${activeChannelId}/video/${video._id}`
    : `/channel/${activeChannelId}/video`;
  const method = edit ? "put" : "post";

  return (
    <div>
      <Button
        disabled={channels.length === 0}
        Icon={Icon}
        title={title}
        onClick={(evt) => {
          evt.stopPropagation();
          openDialog();
        }}
      />
      <dialog ref={dialogRef}>
        <div className="p-10 flex flex-col items-center gap-4">
          <div className="flex justify-between w-full items-center">
            <h2>{title}</h2>
            <button className="btn-secondary" onClick={closeDialog}>
              <X />
            </button>
          </div>
          <div>
            {edit ? (
              <p>
                {channels.find((chan) => chan._id === activeChannelId).name}
              </p>
            ) : (
              <select onChange={(evt) => setActiveChannelId(evt.target.value)}>
                {channels.map((chan) => (
                  <option
                    key={chan._id}
                    value={chan._id}
                    className="flex items-center gap-4"
                  >
                    {chan.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <Form
            fields={fields}
            schema={videoSchema}
            onSuccess={handleSuccess}
            onError={handleError}
            submitPath={submitPath}
            submitButtonTitle={title}
            disableSubmit={!!error || channels.length === 0}
            method={method}
          />
          {error && <div>{error}</div>}
        </div>
      </dialog>
    </div>
  );
}

export default VideoDialog;
