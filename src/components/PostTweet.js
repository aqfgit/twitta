import React, { useState } from "react";
import { db } from "../firebase";

const PostTweet = ({ userId, handle, setTweets, tweets }) => {
  const [body, setBody] = useState("");

  const handlePost = async () => {
    try {
      const ref = await db
        .collection("users")
        .doc(userId)
        .collection("tweets")
        .add({
          body,
        });
      setTweets([...tweets, { id: ref.id, by: handle, body: body }]);
    } catch {
      console.log("ERROR POST");
    }
  };

  return (
    <div>
      <label htmlFor="tweet">Tweet sth</label>
      <textarea
        id="tweet"
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
        }}
      ></textarea>
      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default PostTweet;
