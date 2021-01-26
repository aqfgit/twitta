import React, { useState, useEffect } from "react";
import { db } from "../firebase";

const Tweet = ({ id, by, byId, body, handle }) => {
  const [commentBody, setCommentBody] = useState("");
  const [comments, setComments] = useState([]);

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
    fetchComments();
  }, []);

  return (
    <div key={id} style={{ border: "2px solid blue", padding: "10px" }}>
      <strong>{by}</strong> said:
      <p>{body}</p>
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
