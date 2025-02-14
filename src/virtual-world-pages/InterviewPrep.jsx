import React, { useState, useEffect } from 'react';
import { Search, Briefcase, GraduationCap, Code, Filter, ArrowLeft, Bell, User, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InterviewPrep = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('web');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define categories with icons (here using the Code icon for simplicity)
  const categories = [
    { id: 'web', name: 'Web Development', icon: Code },
    { id: 'android', name: 'Android Development', icon: Code },
    { id: 'data', name: 'Data Science', icon: Code },
    { id: 'cloud', name: 'Cloud Computing', icon: Code },
    { id: 'system', name: 'System Design', icon: Code }
  ];

  // Define filter options
  const filters = [
    { id: 'all', name: 'All Questions' },
    { id: 'student', name: 'For Students' },
    { id: 'experienced', name: 'For Experienced' },
    { id: 'company', name: 'Company Specific' }
  ];

  // Simulate an API call to fetch dynamic interview questions
  const fetchQuestions = () => {
    setLoading(true);
    setTimeout(() => {
      const fetchedQuestions = [
        {
          q: "Explain the difference between localStorage and sessionStorage",
          level: "student",
          type: "web",
          companies: ["Amazon", "Microsoft"],
          a: "Both are web storage solutions, but localStorage persists until explicitly cleared while sessionStorage only lasts for the duration of the browser session. Both offer around 5MB storage capacity."
        },
        {
          q: "What is semantic HTML and why is it important?",
          level: "student",
          type: "web",
          companies: ["Google", "Meta"],
          a: "Semantic HTML uses meaningful tags like <header>, <nav>, <article> instead of generic <div>s. It improves accessibility, SEO, and code readability."
        },
        {
          q: "Explain CSS Box Model in detail",
          level: "student",
          type: "web",
          companies: ["Netflix", "Adobe"],
          a: "The CSS box model consists of content, padding, border, and margin layers. It defines how these elements work together to create spacing and layout."
        },
        {
          q: "What are React Hooks and their advantages?",
          level: "experienced",
          type: "web",
          companies: ["Meta", "Airbnb"],
          a: "Hooks are functions that allow using state and lifecycle features in functional components. They simplify code, promote reuse, and eliminate class components' complexity."
        },
        {
          q: "How do you optimize Android app performance?",
          level: "experienced",
          type: "android",
          companies: ["Google", "Samsung"],
          a: "Optimize by using efficient layouts, reducing memory usage, optimizing network calls, and using profiling tools to identify bottlenecks."
        },
        {
          q: "What is the role of ViewModel in Android architecture?",
          level: "student",
          type: "android",
          companies: ["Google"],
          a: "ViewModel stores and manages UI-related data in a lifecycle conscious way. It allows data to survive configuration changes such as screen rotations."
        },
        {
          q: "What is overfitting in machine learning?",
          level: "experienced",
          type: "data",
          companies: ["Facebook", "Google"],
          a: "Overfitting is when a model learns the training data too well including the noise, reducing its performance on unseen data."
        },
        {
          q: "What are the benefits of using cloud computing?",
          level: "student",
          type: "cloud",
          companies: ["Amazon", "Microsoft"],
          a: "Cloud computing offers scalability, flexibility, cost-efficiency, and enhanced collaboration."
        },
        {
          q: "How would you design a scalable chat application?",
          level: "experienced",
          type: "system",
          companies: ["WhatsApp", "Slack"],
          a: "I would design it using microservices, message queues, and load balancers, ensuring horizontal scaling and reliability."
        }
      ];
      setQuestions(fetchedQuestions);
      setLoading(false);
    }, 1500);
  };

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filter questions based on search query, category, and filter options
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.a.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = q.type === activeCategory;
    const matchesFilter = activeFilter === 'all' || 
                          (activeFilter === 'company' && q.companies.length > 0) ||
                          q.level === activeFilter;
    return matchesSearch && matchesCategory && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-lg">
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
                  <User size={20} />
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

      {/* Main Content */}
      <div className="pt-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Interview Preparation Platform</h1>
            <p className="text-gray-300 mt-2">
              Prepare for your dream job with our comprehensive question bank
            </p>
            <button 
              onClick={fetchQuestions}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Refresh Questions
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`p-4 rounded-lg border ${
                  activeCategory === category.id
                    ? 'bg-blue-900/50 border-blue-400 text-blue-200'
                    : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                } transition-colors`}
              >
                <category.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-blue-900/50 text-blue-200'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="text-center py-12">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="text-gray-400 text-lg"
              >
                Loading interview questions...
              </motion.p>
            </div>
          )}

          {/* Questions */}
          <AnimatePresence>
            {!loading && filteredQuestions.length > 0 && (
              <div className="space-y-6">
                {filteredQuestions.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{item.q}</h3>
                      <div className="flex gap-2">
                        {item.companies.map(company => (
                          <span key={company} className="px-3 py-1 bg-gray-700/50 text-gray-300 text-sm rounded-full">
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300">{item.a}</p>
                    <div className="mt-4 flex gap-2">
                      <span className="px-3 py-1 bg-blue-900/50 text-blue-200 text-sm rounded-full">
                        {item.level === 'student' ? 'Entry Level' : 'Experienced'}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* No Results Message */}
          {!loading && filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No questions found matching your search criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;
