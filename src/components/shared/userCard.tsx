import { Button } from "../ui/button";
import useShowToast from "@/hooks/toast";
import { addLike, removeLike } from "@/store/features/Postid";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  SquarePen,
  MessageCircle,
  Trash2,
  Heart as HeartIcon,
  LoaderCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import useToken from "@/store/zustand";
import axios from "axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Post } from "@/types/Posts";
import { useState } from "react";
import Modal from "@/hooks/Modal";
import { commentPostsApi } from "@/http/base";
import CommentsModal from "@/hooks/comment";
import { Comment as CommentModal } from "@/types/comment";
const UserCard = () => {
  const dispatch = useAppDispatch();

  const likedPosts = useAppSelector((state) => state.likes.likedPosts || []);
  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
  });

  api.interceptors.request.use((config: any) => {
    const token = useToken.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  commentPostsApi.interceptors.request.use((config: any) => {
    const token = useToken.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const getallPosts = async () => {
    return api.get("/api/v1/posts/all");
  };

  type CommentState = {
    [key: string]: string; // This allows any key with string values (adjust as needed)
  };

  const user = useAppSelector((state) => state.user?.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState<CommentState>({ text: "" });
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [selectedPostComments, setSelectedPostComments] = useState<
    CommentModal[]
  >([]);

  const handleOpenCommentsModal = (comments: CommentModal[]) => {
    setSelectedPostComments(comments);
    setIsCommentsModalOpen(true);
  };
  const { data: posts } = useQuery({
    queryKey: ["AllPosts"],
    queryFn: getallPosts,
    staleTime: 6000,
  });

  // const isVideo = posts?.data?.media && posts?.data?.media?.includes(".m3u8");

  const toast = useShowToast();
  const navigate = useNavigate();
  const query = useQueryClient();

  const likeOrUnlikePost = async (id: string) => {
    const response = await api.post(`/api/v1/posts/like/${id}`);
    return response.data;
  };

  if (!user) {
    navigate("/dashboard/home", { replace: true });
    toast(
      "Please Login First",
      "Please Login First for Social Media Posts",
      "warning"
    );
  }

  const deletePost = async (id: string) => {
    return api.delete(`/api/v1/posts/${id}`);
  };

  const mutationLikeOrUnlike = useMutation({
    mutationKey: ["likeOrUnlikePost"],
    mutationFn: likeOrUnlikePost,
    onSuccess: (data) => {
      query.invalidateQueries({ queryKey: ["AllPosts"] });
      console.log(data);
    },
  });

  const mutation = useMutation({
    mutationKey: ["deletePost"],
    mutationFn: deletePost,
    onSuccess: (data) => {
      toast("Deleted", "Post deleted successfully", "success");
      console.log("deldata", data?.data?.message);
      setIsModalOpen(false);
      setPostToDelete(null);
      query.invalidateQueries({ queryKey: ["AllPosts"] });
    },
  });

  const postCommment = async (id: string) => {
    return commentPostsApi.post(`/api/v1/posts/comment/${id}`, comment);
  };

  const commentMutation = useMutation({
    mutationKey: ["commentPost"],
    mutationFn: postCommment,
    onSuccess: (data) => {
      query.invalidateQueries({ queryKey: ["AllPosts"] });
      toast("Commented", "Commented successfully", "success");
      setComment({ text: "" });
      console.log(data);
    },
  });
  const handleDelete = () => {
    if (postToDelete) {
      mutation.mutate(postToDelete);
    }
  };

  const handleComment = (id: string) => {
    if (comment.text === "") {
      return toast("Empty Comment", "Please write a comment first", "error");
    }
    console.log(comment.text);
    console.log(id);
    try {
      commentMutation.mutate(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = (id: string) => {
    if (likedPosts.includes(id)) {
      dispatch(removeLike(id));
    } else {
      dispatch(addLike(id));
    }
    mutationLikeOrUnlike.mutate(id);
  };

  const isPostsArrayEmpty = !posts?.data || posts.data.length === 0;

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.log(comment);
  };

  return (
    <>
      {user ? (
        <>
          <div className="flex items-end justify-end max-sm:items-center max-sm:justify-center mb-4">
            <Button
              className="w-32 bg-bgBluchp font-medium dark:bg-bluchp"
              onClick={() => navigate("/dashboard/social/create")}
            >
              <SquarePen size={20} className="text-white dark:text-bgBluchp" />
              <span className="ml-2">Create Post</span>
            </Button>
          </div>
          {isPostsArrayEmpty ? (
            <p className="text-center text-bgBluchp font-bold mt-4 dark:text-bluchp">
              No posts available. Please create a new post or check back later.
            </p>
          ) : (
            <>
              {posts?.data.map((post: Post, index: number) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg mb-6 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="flex items-center px-4 py-2">
                    <Link to={`/profile/${post.client.username}`}>
                      <img
                        className="w-10 h-10 rounded-full object-cover mr-3"
                        src={
                          post?.client?.profileImg ||
                          "https://via.placeholder.com/150"
                        }
                        alt={post?.client?.username || "User"}
                      />
                    </Link>
                    <div>
                      <p className="text-gray-900 font-semibold">
                        {post?.client?.username || "Username"}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {multiFormatDateString(post.createdAt)}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <button
                        className="text-gray-500 hover:text-gray-800 focus:outline-none "
                        onClick={() => {
                          setPostToDelete(post._id);
                          setIsModalOpen(true);
                        }}
                      >
                        {/* More Options Icon */}
                        {post.client.username === user?.username ? (
                          <Trash2 size={18} />
                        ) : (
                          ""
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="my-3 ml-4">
                    {post?.text ? (
                      <h2 className="text-gray-600 text-sm">
                        {post?.text || "No caption"}
                      </h2>
                    ) : null}
                  </div>

                  {/* <video controls width="100%">
                      <source src={post?.media} type="application/x-mpegURL" />
                      Your browser does not support the video tag.
                    </video> */}

                  {post?.media && post?.media.includes(".mp4") ? (
                    <video controls width="100%">
                      <source src={post.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      className="w-full h-72 object-fll"
                      src={post?.media || ""}
                      alt={post?.text || "Post image"}
                    />
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex space-x-4">
                        {post.client.username !== user?.username && (
                          <button onClick={() => handleLike(post._id)}>
                            <HeartIcon
                              className={`w-6 h-6 ${
                                likedPosts.includes(post._id)
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            />
                          </button>
                        )}

                        <button
                          type="button"
                          className="focus:outline-none"
                          onClick={() => handleOpenCommentsModal(post.comments)}
                        >
                          <MessageCircle />
                        </button>
                        <button type="button" className="focus:outline-none">
                          {/* Share Icon */}
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">
                      {post.likes.length} likes
                    </p>
                  </div>

                  {/* Comment Section */}
                  <div className="px-4 py-2">
                    {post.client.username === user?.username ? null : (
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          name="text"
                          className="flex-1 border-none focus:outline-none text-sm py-2 px-3 rounded-full bg-gray-100"
                          value={comment.text || ""}
                          onChange={handleCommentChange}
                        />

                        <button
                          type="button"
                          className="bg-bgBluchp text-bluchp rounded-full px-4 py-1 text-sm font-semibold hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => handleComment(post._id)}
                          disabled={commentMutation.isPending}
                        >
                          {commentMutation.isPending ? (
                            <LoaderCircle size={12} className="animate-spin" />
                          ) : (
                            "Post"
                          )}
                        </button>
                      </div>
                    )}
                    {/* Display Comments */}
                    {/* {post.comments?.map((comment, idx) => (
                      <div key={idx} className="text-sm text-gray-800 mb-2">
                        <span className="font-semibold">{comment}</span>:{" "}
                        {comment}
                      </div>
                    ))} */}
                  </div>
                </div>
              ))}
              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message="Are you sure you want to delete this post?"
                isPending={mutation.isPending}
              />
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="font-bold font-mono text-bgBluchp dark:text-bluchp">
            Too Use this Feature, Please Login or Signup First
          </h2>
          <Link to="/dashboard/home" className="text-white mt-4">
            <Button className="w-15 dark:text-bgBluchp dark:bg-bluchp font-bold  bg-bgBluchp text-bluchp ">
              Login
            </Button>
          </Link>
        </div>
      )}
      <CommentsModal
        isOpen={isCommentsModalOpen}
        comments={selectedPostComments}
        onClose={() => setIsCommentsModalOpen(false)}
      />
    </>
  );
};

export default UserCard;
