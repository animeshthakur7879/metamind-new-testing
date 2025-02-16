import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Bell, User } from 'lucide-react';

const AiInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(60); // seconds per question
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  // New state for the button text
  const [buttonText, setButtonText] = useState("Check Status");
  // New state to track whether the camera stream has started
  const [cameraStarted, setCameraStarted] = useState(false);

  const recognitionRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const videoRef = useRef(null);

  // Fetch questions from backend running on port 3000
  const fetchQuestions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/generate-questions');
      if (!response.ok) {
        throw new Error('Failed to fetch questions.');
      }
      const data = await response.json();
      setQuestions(data);
      setCurrentQuestionIndex(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Modified text-to-speech function accepting a callback
  const speakQuestion = (text, callback) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        if (callback) callback();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      if (callback) callback();
    }
  };

  // Start speech recognition to capture your spoken answer
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error('Speech Recognition API not supported in this browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: transcript }));
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  // Start a timer and recognition for the current question
  const startQuestion = () => {
    if (!questions[currentQuestionIndex]) return;

    // First, speak the question; once it's done, start the timer and recognition.
    speakQuestion(questions[currentQuestionIndex].question, () => {
      // Reset timer to 60 seconds
      setTimer(60);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      timerIntervalRef.current = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(timerIntervalRef.current);
            if (recognitionRef.current) {
              recognitionRef.current.stop();
            }
            handleNextQuestion();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
      // Begin speech recognition after the question is spoken
      startRecognition();
    });
  };

  // Move to next question or submit answers when finished
  const handleNextQuestion = () => {
    if (!answers[currentQuestionIndex]) {
      setAnswers(prev => ({ ...prev, [currentQuestionIndex]: '' }));
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeout(() => {
        startQuestion();
      }, 1000);
    } else {
      submitAnswers();
    }
  };

  // Submit collected answers to backend for evaluation
  const submitAnswers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:3000/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        throw new Error('Failed to evaluate answers.');
      }
      const result = await res.json();
      setFeedback(result.feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to start the camera manually
  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play()
              .then(() => setCameraStarted(true))
              .catch((err) => console.error("Error playing video", err));
          }
        })
        .catch((err) => {
          console.error('Error accessing camera:', err);
        });
    }
  };

  // Initialize camera preview automatically
  useEffect(() => {
    startCamera();
  }, []);

  // Fetch questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  // Start the current question whenever questions load or the index changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      startQuestion();
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) recognitionRef.current.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, questions]);

  return (
    <>
      {/* Global Styles & Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .gradient-button { background: linear-gradient(to right, #3b82f6, #8b5cf6); }
        .gradient-button:hover { opacity: 0.9; }
      `}</style>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110">
                <ArrowLeft size={20} className="transform transition-transform hover:rotate-12" />
              </button>
              <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-pulse">
                MetaMind
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {["Home", "Courses", "Community", "Resources"].map((item) => (
                <a key={item} href="#" className="text-gray-300 hover:text-white transition-all duration-300 relative group">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110 relative">
                <Bell size={20} className="transform transition-transform hover:rotate-12" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
              </button>
              <div className="relative">
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110">
                  <User size={20} className="transform transition-transform hover:rotate-12" />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl border border-gray-800 transform transition-all duration-300 animate-slideIn">
                    {["Profile", "Settings", "Help Center"].map((item) => (
                      <a key={item} href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:translate-x-2">
                        {item}
                      </a>
                    ))}
                    <hr className="border-gray-800 my-1" />
                    <a href="#" className="block px-4 py-2 text-red-400 hover:bg-gray-800 transition-all duration-300 hover:translate-x-2">
                      Sign Out
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 p-4 pt-20">
        <div className="max-w-3xl mx-auto bg-gray-800 text-white shadow rounded p-6 animate-fadeIn">
          <h1 className="text-2xl font-bold mb-4 text-center">AI Voice Interview</h1>
          {loading && <p className="text-white text-center">Loading...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Interview in progress */}
          {!loading && !feedback && questions.length > 0 && (
            <div className="flex flex-col md:flex-row md:space-x-6">
              {/* Camera Preview (Left Half) */}
              <div className="md:w-1/2 flex justify-center items-center mb-4 md:mb-0 md:h-64 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  onLoadedMetadata={() => {
                    videoRef.current.play().then(() => setCameraStarted(true))
                      .catch((err) => console.error("Error auto-playing video:", err));
                  }}
                  className="w-full h-full object-cover border border-gray-700 rounded shadow-md"
                />
                {!cameraStarted && (
                  <button
                    onClick={startCamera}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white font-semibold"
                  >
                    Start Camera
                  </button>
                )}
              </div>

              {/* Question & Controls (Right Half) */}
              <div className="md:w-1/2">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <p className="text-lg mt-2">
                    {questions[currentQuestionIndex].question}
                  </p>
                  <p className="mt-2 text-red-400 font-bold">
                    Time left: {timer} seconds
                  </p>
                </div>
                <div className="mb-4">
                  <p className="text-gray-300">
                    Please answer by speaking. Your response will be captured automatically.
                  </p>
                </div>
                {/* Display recognized answer */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Your Answer:</h3>
                  <p className="text-gray-300">
                    {answers[currentQuestionIndex] || "Listening..."}
                  </p>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      if (recognitionRef.current) recognitionRef.current.stop();
                      clearInterval(timerIntervalRef.current);
                      handleNextQuestion();
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transform transition-all duration-300 hover:scale-105"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Feedback / Assessment Window */}
          {feedback && (
            <div className="mt-6 bg-gray-900 border border-gray-800 rounded-lg p-6 animate-fadeIn">
              <h2 className="text-xl font-bold mb-2 text-white">Feedback</h2>
              <pre className="bg-gray-800 p-4 rounded text-sm text-gray-300 overflow-x-auto">
                {JSON.stringify(feedback, null, 2)}
              </pre>
              <button
                onClick={() => {
                  setButtonText("Not Selected");
                }}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full transform transition-all duration-300 hover:scale-105"
              >
                {buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AiInterview;
