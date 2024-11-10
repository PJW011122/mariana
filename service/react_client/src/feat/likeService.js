// likeService.js

import axios from 'axios';

// Get the likes for all posts
export const getLikes = async () => {
    try {
      const response = await axios.get("/like", { params: {} });
    //   console.log("getLikes response data:", response.data); // Log the response data
    //   console.log("count of likes: ", response.data.rowCount);
      return response.data;
    } catch (error) {
      console.error("like GET Error:", error);
      throw error;
    }
  };

// Post a like for a specific post by userId and postId
export const postLike = async (userId, postId) => {
  try {
    const data = {
      user_id: userId,
      post_id: postId
    };
    console.log("postLike data:", data); // Log the data
    const response = await axios.post("/like", data);
    return response.data;
  } catch (error) {
    console.error("like POST Error:", error);
    throw error;
  }
};

// Delete a like by userId and postId
export const deleteLike = async (userId, postId) => {
  try {
    let totalLikes = await getLikes();
    let likeIds = [];
    totalLikes.rows.forEach((like) => {
      if (like.user_id === userId && like.post_id === postId) {
        likeIds.push(like.like_id);
      }
    });

    for (let i = 0; i < likeIds.length; i++) {
        const response = await axios.delete("/like", {
            params: { like_id: likeIds[i] }
        });
        console.log("deleted like:", response.data); // Log the response data
    }
    return;
  } catch (error) {
    console.error("like DELETE Error:", error);
    throw error;
  }
};
