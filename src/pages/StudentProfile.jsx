import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Award, DollarSign , ArrowLeft } from 'lucide-react';

const StudentProfile = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // State for the fetched profile data
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    about: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(null);

  const badgeBarWidth = progress && progress.badges ? Math.min(progress.badges * 10, 100) : 0;
  const creditsBarWidth = progress && progress.credits ? Math.min(progress.credits, 100) : 0;


  // Fetch profile data from the backend when the component mounts
  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:3000/profile", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`  // Attach the token here
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch profile data");
        }
        return res.json();
      })
      .then((data) => {
        setProfile({
          fullName: data.fullName,
          email: data.email,
          about: data.about || ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/progress", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch progress data");
        }
        return res.json();
      })
      .then(data => setProgress(data))
      .catch(err => console.error("Error fetching progress:", err));
    }
  }, []);
  
  const navigate = useNavigate()

  // Optionally display a loading or error state
  if (loading) return <div className="text-white p-4">Loading profile...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Left Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:static w-64 min-h-screen transition-transform duration-200 ease-in-out z-40`}>
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-600"></div>
          <span className="text-white font-bold text-3xl">Meta Mind</span>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-50 hover:text-gray-600 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Chat</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-50 hover:text-gray-600 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>Book a Session</span>
            </a>

            <a href="#" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-50 hover:text-gray-600 rounded-lg">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span>Help</span>
            </a>
            <a href="/studentdashboard" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-gray-50 hover:text-gray-600 rounded-lg">
               
              <ArrowLeft size={20} />
              <span>Back</span>
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Header */}
        <header className="px-4 md:px-8 py-4 text-white">
          <div className="flex items-center justify-end gap-3 md:gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#FFC3B2]">
                <img src="/api/placeholder/40/40" alt="Profile" className="w-full h-full rounded-full" />
              </div>
              <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6"></path>
              </svg>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-300">WELCOME BACK</div>
              <div className="font-medium font-bold">{profile.fullName}</div>
            </div>
          </div>
        </header>

        {/* Profile Section */}
        <div className="">
          <div className="p-4 md:p-0 relative">
            <h1 className="text-white text-xl md:text-3xl font-semibold mb-6">MY PROFILE</h1>

            <div className="flex flex-col lg:flex-row gap-10">
              {/* Main Profile Card */}
              <div className="rounded-xl bg-white text-black shadow-2xl p-4 md:p-8 w-full lg:max-w-3xl">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-8">
                  <div className="relative">
                    <img 
                      src="https://tse3.mm.bing.net/th?id=OIP.--sB_AG8cxvPbn4tFQU4YAHaJ4&pid=Api&P=0&h=180" 
                      alt="Profile" 
                      className="w-20 md:w-24 h-20 md:h-24 rounded-full bg-[#FFC3B2]"
                    />
                  </div>
                  <Link to="/profileform" className="text-black flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    Edit Your Profile
                  </Link>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Your Name</label>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span>{profile.fullName}</span>
                      <span className="text-xs text-gray-400">Edit</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                      <span>{profile.email}</span>
                      <span className="text-xs text-gray-400">Edit</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">About Me</label>
                    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg h-32">
                      <span className="text-gray-400">
                        {profile.about || "Write something about yourself..."}
                      </span>
                      <span className="text-xs text-gray-400">Edit</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="w-full lg:w-auto space-y-6">
                {/* Badges Earned */}
                <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full md:w-72 transform hover:scale-105 transition duration-300">
                  <div className="mb-6 flex items-center">
                    <Award className="w-6 h-6 text-[#FF8F6B] mr-2" />
                    <h3 className="text-sm font-medium">Badges Earned</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-[#FF8F6B] rounded-full" 
                        style={{ width: `${badgeBarWidth}%` }}
                      ></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#FF8F6B] flex items-center justify-center">
                      <span className="text-sm font-bold">{progress ? progress.badges : 0}</span>
                    </div>
                  </div>
                </div>

                {/* Credits Left */}
                <div className="bg-white text-black rounded-xl shadow-lg p-6 w-full md:w-72 transform hover:scale-105 transition duration-300">
                  <div className="mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 text-yellow-400 mr-2" />
                    <h3 className="text-sm font-medium">Credits Left</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-yellow-400 rounded-full" 
                        style={{ width: `${creditsBarWidth}%` }}
                      ></div>
                    </div>
                    <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                  </div>
                </div>

                <button onClick={(e) => navigate('/metamindpassport')} className="w-full py-3 bg-gradient-to-tr from-blue-500 to-purple-500 text-white font-bold rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                    View Passport
                  </button>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
