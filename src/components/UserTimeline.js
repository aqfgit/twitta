import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { useUser } from "../contexts/UserContext";
import Tweet from "./Tweet";
import PostTweet from "./PostTweet";

const UserTimeline = ({ match }) => {
  const {
    params: { handle },
  } = match;

  const [tweets, setTweets] = useState([]);
  const [isItCurrentUsersProfile, setIsItCurrentUsersProfile] = useState(false);
  const { currentUserHandle, currentDbUserId } = useUser();

  useEffect(() => {
    const fetchUserTweets = async () => {
      const data = await db
        .collection("users")
        .where("handle", "==", handle)
        .get();
      data.forEach((docUser) => {
        db.collection("users")
          .doc(docUser.id)
          .collection("tweets")
          .get()
          .then((values) => {
            values.forEach((docTweet) => {
              setTweets((prevState) => {
                return [
                  ...prevState,
                  {
                    body: docTweet.data().body,
                    id: docTweet.id,
                    by: handle,
                    byId: docUser.id,
                  },
                ];
              });
            });
          });
      });
    };
    setIsItCurrentUsersProfile(handle == currentUserHandle);
    fetchUserTweets();
  }, []);

  return (
    <>
      <p>`${handle}&apos;s` profile</p>
      {isItCurrentUsersProfile ? (
        <PostTweet
          userId={currentDbUserId}
          tweets={tweets}
          setTweets={setTweets}
          handle={currentUserHandle}
        />
      ) : null}
      {tweets.map((tweet) => {
        console.log(tweet);
        return (
          <Tweet
            key={tweet.id}
            id={tweet.id}
            body={tweet.body}
            by={tweet.by}
            byId={tweet.byId}
            handle={handle}
          />
        );
      })}
    </>
  );
};

export default UserTimeline;
