import { Pen, TvMinimal, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useRevalidator } from "react-router";
import z from "zod";
import api from "../lib/api";
import { addChannel, updateChannel } from "../state/userSlice";
import Button from "./Button";
import Form from "./Form";
import ErrorCodes from "../lib/error-codes";

const channelSchema = z.object({
  handle: z
    .string({ error: "handle is required" })
    .min(3, { error: "handle must be at least 3 characters" })
    .max(30, { error: "handle too long" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      error: "Only letters, numbers, _, - allowed",
    }),
  name: z.string({ error: "name is required" }),
  description: z.string().optional(),
  banner: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.url({ error: "Invalid banner image url" }).optional()
  ),
  avatar: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.url({ error: "Invalid avatar image url" }).optional()
  ),
});

function ChannelDialog({ edit = false, channel = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const revalidator = useRevalidator();

  const dialogRef = useRef(null);
  const [error, setError] = useState(null);

  const fields = [
    { name: "name", type: "text", defaultValue: channel.name ?? "" },
    {
      name: "handle",
      type: "text",
      defaultValue: channel.handle ?? "",
      onInput: checkHandle,
    },
    {
      name: "description",
      type: "text",
      defaultValue: channel.description ?? "",
    },
    { name: "avatar", type: "url", defaultValue: channel.avatar ?? "" },
    { name: "banner", type: "url", defaultValue: channel.banner ?? "" },
  ];

  const timerRef = useRef(null);
  function checkHandle(evt) {
    const value = evt.target.value;
    clearTimeout(timerRef.current);
    setError(null);
    if (value.length < 3) return;
    timerRef.current = setTimeout(() => {
      api
        .get(`/channel/check-handle/${encodeURIComponent(value)}`)
        .then(() => setError(null))
        .catch((err) => {
          if (err?.response.data?.code === ErrorCodes.CONFLICT) {
            setError(err.response.data.error);
          }
        });
    }, 300);
  }

  const openDialog = () => dialogRef.current.showModal();
  const closeDialog = () => dialogRef.current.close();

  function handleSuccess(data) {
    if (edit) {
      dispatch(updateChannel(data));
      revalidator.revalidate();
    } else {
      dispatch(addChannel(data));
      navigate(`/channel/${data._id}`);
    }
    closeDialog();
  }

  function handleError(code, error) {
    setError(error);
  }

  const title = edit ? "Edit Channel" : "Create Channel";
  const Icon = edit ? Pen : TvMinimal;
  const method = edit ? "put" : "post";
  const submitPath = edit ? `/channel/${channel._id}` : "/channel";

  return (
    <div>
      <Button
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
          <Form
            fields={fields}
            schema={channelSchema}
            onSuccess={handleSuccess}
            onError={handleError}
            submitPath={submitPath}
            submitButtonTitle={title}
            disableSubmit={!!error}
            method={method}
          />
          {error && <div>{error}</div>}
        </div>
      </dialog>
    </div>
  );
}

export default ChannelDialog;
