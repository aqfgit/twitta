import React, { useState, useEffect } from "react";
import { db } from "../firebase";

const Tweet = ({ id, by, byId, body, handle }) => {
  const [commentBody, setCommentBody] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [currentUserLikeId, setCurrentUserLikeId] = useState();

  const addComment = async () => {
    try {
      const ref = await db
        .collection("users")
        .doc(byId)
        .collection("tweets")
        .doc(id)
        .collection("comments")
        .add({
          body: commentBody,
          author: handle,
        });
      setComments([
        ...comments,
        { id: ref.id, body: commentBody, author: handle },
      ]);
    } catch {
      console.error("ERROR COMMENT");
    }
  };

  const likeTweet = async () => {
    try {
      setLiked(true);
      const ref = await db
        .collection("users")
        .doc(byId)
        .collection("tweets")
        .doc(id)
        .collection("likes")
        .add({
          likedBy: handle,
        });
      setLikes([...likes, { id: ref.id, likedBy: handle }]);
      setCurrentUserLikeId(ref.id);
    } catch {
      console.error("ERROR LIKE");
      setLiked(false);
    }
  };

  const unlikeTweet = async () => {
    try {
      setLiked(false);
      await db
        .collection("users")
        .doc(byId)
        .collection("tweets")
        .doc(id)
        .collection("likes")
        .doc(currentUserLikeId)
        .delete();
      const updatedLikes = likes.filter((like) => like.likedBy != handle);
      console.log("likes length", likes.length, handle);
      console.log("updatgedLikes liength", updatedLikes.length);
      setLikes(updatedLikes);
    } catch {
      console.error("ERROR LIKE");

      setLiked(true);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      const data = await db
        .collection("users")
        .doc(byId)
        .collection("tweets")
        .doc(id)
        .collection("comments")
        .get();
      data.forEach((doc) => {
        setComments((prevState) => {
          return [
            ...prevState,
            {
              body: doc.data().body,
              id: doc.id,
              author: doc.data().author,
            },
          ];
        });
      });
    };

    const fetchLikes = async () => {
      const data = await db
        .collection("users")
        .doc(byId)
        .collection("tweets")
        .doc(id)
        .collection("likes")
        .get();
      data.forEach((doc) => {
        setLiked(doc.data().likedBy == handle);
        setCurrentUserLikeId(doc.id);
        setLikes((prevState) => {
          return [
            ...prevState,
            {
              likedBy: doc.data().likedBy,
              id: doc.id,
            },
          ];
        });
      });
    };

    fetchComments();
    fetchLikes();
  }, []);

  return (
    <div key={id} style={{ border: "2px solid blue", padding: "10px" }}>
      <strong>{by}</strong> said:
      <p>{body}</p>
      <button onClick={liked ? unlikeTweet : likeTweet}>
        <span>
          {liked ? (
            <span role="img" aria-label="heart">
              💚
            </span>
          ) : (
            <span role="img" aria-label="heart">
              ❤
            </span>
          )}
        </span>
      </button>
      <div>
        {console.log(likes)}
        <strong>{likes.length} </strong>likes
      </div>
      <label htmlFor="comment">Add comment</label>
      <input
        id="comment"
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
      />
      <button onClick={addComment}>Send</button>
      {comments.map((comment) => {
        return (
          <div key={comment.id}>
            <strong>
              {comment.body}, said {comment.author}
            </strong>
          </div>
        );
      })}
    </div>
  );
};

export default Tweet;
