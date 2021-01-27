import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { db } from "../firebase";
import PostTweet from "./PostTweet";
import Tweet from "./Tweet";

const Timeline = () => {
  const { currentUserHandle, currentDbUserId } = useUser();
  const [tweets, setTweets] = useState([]);
  const followed = ["a4", "a6"];
  const [followedUsers, setFollowedUsers] = useState([]);

  useEffect(() => {
    const fetchFollowedUsersTweets = async () => {
      const followedUsersCopy = followedUsers.slice(0);
      for (let user of followed) {
        const data = await db
          .collection("users")
          .where("handle", "==", user)
          .get();
        data.forEach((docUser) => {
          const duplicateFollowedUsers = followedUsers.some(
            (el) => el.id === docUser.id
          );
          if (!duplicateFollowedUsers) {
            followedUsersCopy.push({ id: docUser.id, handle: user });
          }
          db.collection("users")
            .doc(docUser.id)
            .collection("tweets")
            .get()
            .then((values) => {
              values.forEach((docTweet) => {
                const duplicateTweet = tweets.some(
                  (el) => el.id === docTweet.id
                );
                if (duplicateTweet) return;
                setTweets((prevState) => {
                  return [
                    ...prevState,
                    {
                      body: docTweet.data().body,
                      id: docTweet.id,
                      by: user,
                      byId: docUser.id,
                    },
                  ];
                });
              });
            });
        });
      }

      setFollowedUsers(followedUsersCopy);
    };

    fetchFollowedUsersTweets();
  }, []);

  return (
    <>
      <div>Welcome, {currentUserHandle}</div>
      <Link to="/dashboard">Dashboard</Link>

      <PostTweet
        userId={currentDbUserId}
        tweets={tweets}
        setTweets={setTweets}
        handle={currentUserHandle}
      />
      {tweets.map((tweet) => {
        console.log(tweet);
        return (
          <Tweet
            key={tweet.id}
            id={tweet.id}
            body={tweet.body}
            by={tweet.by}
            byId={tweet.byId}
            handle={currentUserHandle}
          />
        );
      })}
    </>
  );
};

export default Timeline;
