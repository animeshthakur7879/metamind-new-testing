import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Grid,
  Book,
  Calendar,
  MessageCircle,
  Users,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

const CommunityPage = () => {
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", image: "" });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [communityPosts, setCommunityPosts] = useState([
    {
      id: 1,
      author: "Alice Johnson",
      avatar: "https://via.placeholder.com/40",
      time: "2 hours ago",
      title: "My Machine Learning Project",
      content: "Excited to share my latest project on machine learning. Let's discuss AI trends!",
      image: "https://via.placeholder.com/300",
      likes: 10,
      comments: [
        { id: 1, author: "Bob", content: "Great project!" },
        { id: 2, author: "Charlie", content: "Really interesting!" }
      ],
    },
    {
      id: 2,
      author: "Bob Smith",
      avatar: "https://via.placeholder.com/40",
      time: "5 hours ago",
      title: "JavaScript Resources",
      content: "I found some great resources for JavaScript beginners. Check them out!",
      image: null,
      likes: 15,
      comments: [
        { id: 1, author: "Alice", content: "Thanks for sharing!" }
      ],
    },
    {
      id: 3,
      author: "Charlie Davis",
      avatar: "https://via.placeholder.com/40",
      time: "1 day ago",
      title: "Looking for Study Buddies",
      content: "Anyone interested in joining my study group for the upcoming coding bootcamp?",
      image: null,
      likes: 8,
      comments: []
    },
  ]);
  const [visibleComments, setVisibleComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  const navItems = [
    { icon: Grid, label: "Dashboard", route: "/studentdashboard" },
    { icon: Book, label: "Courses", route: "/courses" },
    { icon: Calendar, label: "Schedule", route: "/stuedentschedule" },
    { icon: MessageCircle, label: "Messages", route: "/chatpage" },
    { icon: Users, label: "Community", route: "/communitypage" },
    { icon: Settings, label: "Settings", route: "/settings" },
    { icon: LogOut, label: "Logout", route: "/logout" },
  ];

  const handleLike = (postId) => {
    setCommunityPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const toggleCommentSection = (postId) => {
    setVisibleComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId) => {
    const commentText = commentInputs[postId];
    if (commentText && commentText.trim() !== "") {
      const newComment = {
        id: Date.now(),
        author: "You",
        content: commentText.trim(),
      };
      setCommunityPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
      setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    }
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    const newPostObj = {
      id: Date.now(),
      author: "You",
      avatar: "https://via.placeholder.com/40",
      time: "Just now",
      title: newPost.title,
      content: newPost.content,
      image: newPost.image ? newPost.image : null,
      likes: 0,
      comments: [],
    };
    setCommunityPosts(prev => [newPostObj, ...prev]);
    setNewPost({ title: "", content: "", image: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Sidebar */}
      <div className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed lg:static 
        w-64 lg:w-20 
        bg-indigo-600
        min-h-screen 
        flex flex-col 
        items-center 
        py-8 
        gap-8 
        transition-all 
        duration-300 
        ease-in-out
        z-40
        shadow-xl
      `}>
        {/* Logo */}
        <div
          onClick={() => navigate('/studentprofile')}
          className="w-12 h-12 rounded-xl mb-8 bg-cover cursor-pointer transform hover:scale-110 transition-transform duration-200"
          style={{ backgroundImage: "url('https://tse3.mm.bing.net/th?id=OIP.--sB_AG8cxvPbn4tFQU4YAHaJ4&pid=Api&P=0&h=180')" }}
        />
        {/* Nav Items */}
        {navItems.map((item, index) => (
          <button
            onClick={() => navigate(item.route)}
            key={index}
            className="text-white/70 hover:text-white p-3 rounded-xl hover:bg-white/20 transition-all duration-200 flex items-center gap-3 w-48 lg:w-auto relative transform hover:scale-105"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <item.icon size={24} />
            {hoveredIndex === index && (
              <span className="absolute left-14 bg-white text-purple-600 px-3 py-1 rounded-md text-sm shadow-lg animate-fade-in">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-20 p-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800">Community</h1>
          <p className="text-gray-500">
            Connect with peers, share ideas, and engage in thoughtful discussions.
          </p>
        </motion.header>

        {/* Search & New Post */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search community posts..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m1.48-5.64a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            New Post
          </motion.button>
        </motion.div>

        {/* Community Posts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {communityPosts.map((post) => (
            <motion.div
              key={post.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              {/* Post Content */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={post.avatar}
                    alt="avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {post.author}
                    </h2>
                    <p className="text-sm text-gray-500">{post.time}</p>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-700 mb-4">{post.content}</p>
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
              <div className="flex items-center gap-4 text-gray-500">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 9l-2 2m0 0l-2-2m2 2V3"
                    ></path>
                  </svg>
                  <span>{post.likes}</span>
                </button>
                <button
                  onClick={() => toggleCommentSection(post.id)}
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 8h10M7 12h4"
                    ></path>
                  </svg>
                  <span>{post.comments.length}</span>
                </button>
              </div>
              {/* Comment Section */}
              {visibleComments[post.id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="space-y-2">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-100 p-2 rounded-lg">
                        <span className="font-semibold">{comment.author}: </span>
                        <span>{comment.content}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition-colors"
                    >
                      Comment
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating "Create Post" Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-xl z-50"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </motion.button>

      {/* New Post Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Create New Post</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleNewPostSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <textarea
                  placeholder="What's on your mind?"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  required
                ></textarea>
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={newPost.image}
                  onChange={(e) =>
                    setNewPost({ ...newPost, image: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Post
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;