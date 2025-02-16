import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, User , Menu } from "lucide-react";


// Custom Button Component
const Button = ({
  children,
  variant = "default",
  onClick,
  className = "",
  size = "default",
}) => {
  const baseStyles =
    "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]";
  const variants = {
    default: "bg-[#4F46E5] text-white hover:bg-[#4338CA]",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
  };
  const sizes = {
    default: "px-4 py-2",
    sm: "px-2 py-1 text-sm",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Custom Input Component
const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] ${className}`}
      {...props}
    />
  );
};

// Custom Textarea Component
const Textarea = ({ className = "", ...props }) => {
  return (
    <textarea
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-[#4F46E5] ${className}`}
      {...props}
    />
  );
};

// Custom Badge Component
const Badge = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#EEF2FF] text-[#4F46E5] ${className}`}
    >
      {children}
    </span>
  );
};

// Custom Card Component
const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

// Back Button Component
const BackButton = ({ onClick, className = "" }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`flex text-xl items-center absolute top-5 left-5 px-3 py-2 rounded-md font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] text-[#4F46E5] hover:bg-[#EEF2FF] ${className}`}
      onClick={() => {
        if (onClick) onClick();
        navigate("/studentdashboard");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      Back
    </button>
  );
};

// Icons
const Icons = {
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Search: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Star: ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Edit: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  ),
  Trash: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  Close: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

export default function NotesApp() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [favorites, setFavorites] = useState(new Set());
  const [filter, setFilter] = useState("all");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    const savedFavorites = localStorage.getItem("favorites");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("favorites", JSON.stringify(Array.from(favorites)));
  }, [notes, favorites]);

  const handleBack = () => {
    // Close the modal if open
    if (isCreating) {
      setIsCreating(false);
      setEditingIndex(null);
      setTitle("");
      setDescription("");
    }
  };

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      const timestamp = new Date().toISOString();
      if (editingIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editingIndex] = {
          title,
          description,
          timestamp,
          lastModified: timestamp,
        };
        setNotes(updatedNotes);
        setEditingIndex(null);
      } else {
        setNotes([
          ...notes,
          {
            title,
            description,
            timestamp,
            lastModified: timestamp,
          },
        ]);
      }
      setTitle("");
      setDescription("");
      setIsCreating(false);
    }
  };

  const handleEdit = (index) => {
    setTitle(notes[index].title);
    setDescription(notes[index].description);
    setEditingIndex(index);
    setIsCreating(true);
  };

  const handleDelete = (index) => {
    const updatedFavorites = new Set(favorites);
    updatedFavorites.delete(index);
    setFavorites(updatedFavorites);
    setNotes(notes.filter((_, i) => i !== index));
  };

  const toggleFavorite = (index) => {
    const updatedFavorites = new Set(favorites);
    if (updatedFavorites.has(index)) {
      updatedFavorites.delete(index);
    } else {
      updatedFavorites.add(index);
    }
    setFavorites(updatedFavorites);
  };

  const filteredAndSortedNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase());
      const noteIndex = notes.indexOf(note);
      const matchesFilter =
        filter === "all" || (filter === "favorites" && favorites.has(noteIndex));
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      return sortOrder === "asc"
        ? new Date(a.lastModified) - new Date(b.lastModified)
        : new Date(b.lastModified) - new Date(a.lastModified);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEF2FF] to-[#F5F3FF] p-6">

{/* Navbarr */}

<nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center">
              <button
                onClick={() => window.history.back()}
                className="p-2 rounded-full text-white hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-white">MetaMind</h1>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-white/90 hover:text-white transition-colors">Home</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Courses</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Community</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors">Resources</a>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 rounded-full text-white hover:bg-white/10 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full text-white hover:bg-white/10 transition-colors"
                >
                  <User  size={20} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1">
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</a>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Help Center</a>
                    <hr className="my-1" />
                    <a href="#" className="block px-4 py-2 text-red-600 hover:bg-gray-100">Sign Out</a>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button className="md:hidden p-2 rounded-full text-white hover:bg-white/10 transition-colors">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>




      <div className="max-w-6xl mt-30 mx-auto">
        {/* Header with Back Button */}
        <div className="flex justify-between mt-10 items-center mb-8">
          <div className="flex items-center">
            <BackButton onClick={handleBack} className="mr-4" />
            <h1 className="text-3xl font-bold text-[#4F46E5]">My Notes</h1>
          </div>
          <Button className="bg-gradient-to-tr from-blue-500 to-purple-500" onClick={() => setIsCreating(true)}>
            <div className=" flex items-center">
              <Icons.Plus />
              <span className="ml-2 ">New Note</span>
            </div>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Icons.Search />
            </span>
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setFilter(filter === "all" ? "favorites" : "all")}
          >
            {filter === "all" ? "All Notes" : "Favorites"}
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            }
          >
            {sortOrder === "asc" ? "Oldest First" : "Newest First"}
          </Button>
        </div>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setIsCreating(false);
                  setEditingIndex(null);
                  setTitle("");
                  setDescription("");
                }
              }}
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: 20 }}
                className="w-full max-w-lg bg-white rounded-lg p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold text-[#4F46E5]">
                    {editingIndex !== null ? "Edit Note" : "Create Note"}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingIndex(null);
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    <Icons.Close />
                  </Button>
                </div>
                <Input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-4"
                />
                <Textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mb-4 h-32"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditingIndex(null);
                      setTitle("");
                      setDescription("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit}>
                    {editingIndex !== null ? "Update" : "Create"}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredAndSortedNotes.map((note, index) => (
              <motion.div
                key={note.timestamp}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-[#4F46E5]">
                        {note.title}
                      </h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(index)}
                        className={
                          favorites.has(index)
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }
                      >
                        <Icons.Star filled={favorites.has(index)} />
                      </Button>
                    </div>
                    <p className="text-gray-600 mb-4 break-words">
                      {note.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <Badge>
                        {new Date(note.lastModified).toLocaleDateString()}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(index)}
                        >
                          <Icons.Edit />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Icons.Trash />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredAndSortedNotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {searchTerm
                ? "No notes found matching your search"
                : filter === "favorites"
                ? "No favorite notes yet"
                : "No notes yet"}
            </p>
            <Button className="bg-gradient-to-tr from-blue-500 to-purple-500" onClick={() => setIsCreating(true)}>
              Create your first note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
