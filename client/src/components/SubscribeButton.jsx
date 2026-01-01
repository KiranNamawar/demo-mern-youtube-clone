import { useDispatch, useSelector } from "react-redux";
import { addSubscription, removeSubscription } from "../state/userSlice";
import api from "../lib/api";
import { useState } from "react";

function SubscribeButton({ channel }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isAuthenticated = !!user.accessToken;
  const isSubscribed = !!user.subscriptions.find(
    (sub) => sub._id === channel._id
  );

  const [isPending, setIsPending] = useState(false);

  function handleSubscribe() {
    setIsPending(true);
    // optimistic update
    dispatch(addSubscription(channel));
    api
      .patch(`/channel/${channel._id}/subscribe`)
      .catch((err) => {
        console.error(err);
        //revert to prev state
        dispatch(removeSubscription(channel._id));
      })
      .finally(() => setIsPending(false));
  }

  function handleUnsubscribe() {
    setIsPending(true);
    // optimistic update
    dispatch(removeSubscription(channel._id));
    api
      .patch(`/channel/${channel._id}/unsubscribe`)
      .catch((err) => {
        console.error(err);
        //revert to prev state
        dispatch(addSubscription(channel));
      })
      .finally(() => setIsPending(false));
  }

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (isAuthenticated) {
          isSubscribed ? handleUnsubscribe() : handleSubscribe();
        }
        // TODO: ask to login is not authenticated
      }}
    >
      {isSubscribed ? <span>Subscribed</span> : <span>Subscribe</span>}
    </button>
  );
}

export default SubscribeButton;
