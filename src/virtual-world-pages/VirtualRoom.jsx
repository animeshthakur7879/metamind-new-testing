import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const VirtualRoomCreator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    purpose: '',
    participants: '1',
    durationType: 'hours',
    duration: '1',
  });
  const [price, setPrice] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const purposes = [
    'Team Meeting',
    'Virtual Classroom',
    'Gaming Session',
    'Project Collaboration',
    'Social Gathering',
    'Workshop',
    'Other',
  ];

  const calculatePrice = () => {
    let basePrice = 50;
    const participantsCost = Math.ceil(parseInt(formData.participants) / 5) * 20;
    
    let durationCost = 0;
    if (formData.durationType === 'hours') {
      durationCost = parseInt(formData.duration) * 15;
    } else {
      durationCost = parseInt(formData.duration) * 24 * 12;
    }
    
    const purposeCost = {
      'Team Meeting': 30,
      'Virtual Classroom': 40,
      'Gaming Session': 50,
      'Project Collaboration': 45,
      'Social Gathering': 25,
      'Workshop': 60,
      'Other': 30,
    };

    const totalPrice = basePrice + participantsCost + durationCost + (purposeCost[formData.purpose] || 0);
    setPrice(totalPrice);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-black p-8 relative overflow-hidden">
      {/* Ambient Cloud Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-cloud opacity-0"
            style={{
              top: `${Math.random() * 100}%`,
              left: `-20%`,
              animationDelay: `${i * 3}s`,
              animationDuration: '15s',
              animationIterationCount: 'infinite',
            }}
          >
            <div className="w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto bg-black/50 backdrop-blur-sm p-8 rounded-xl border border-blue-500/30 shadow-xl relative z-10"
      >
        {/* Header Section */}
        <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.1 }}
            className="mb-4 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            ← Back
          </motion.button>
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Virtual Room</h1>
          <p className="text-blue-300">Fill in the details to create your perfect virtual space</p>
        </motion.div>

        {/* Form Section */}
        <div className="space-y-6">
          <motion.div className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <label className="block text-blue-300 mb-2">Name</label>
            <motion.input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              whileFocus={{ scale: 1.02 }}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="Enter your name"
            />
          </motion.div>

          <motion.div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <label className="block text-blue-300 mb-2">Email</label>
            <motion.input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              whileFocus={{ scale: 1.02 }}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
              placeholder="Enter your email"
            />
          </motion.div>

          <motion.div className="animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <label className="block text-blue-300 mb-2">Purpose of Room</label>
            <motion.select
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              whileFocus={{ scale: 1.02 }}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
            >
              <option value="">Select purpose</option>
              {purposes.map(purpose => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </motion.select>
          </motion.div>

          <motion.div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <label className="block text-blue-300 mb-2">Number of Participants</label>
            <motion.input
              type="number"
              name="participants"
              value={formData.participants}
              onChange={handleInputChange}
              min="1"
              max="100"
              whileFocus={{ scale: 1.02 }}
              className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
            />
          </motion.div>

          <motion.div className="grid grid-cols-2 gap-4 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
            <div>
              <label className="block text-blue-300 mb-2">Duration Type</label>
              <motion.select
                name="durationType"
                value={formData.durationType}
                onChange={handleInputChange}
                whileFocus={{ scale: 1.02 }}
                className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </motion.select>
            </div>
            <div>
              <label className="block text-blue-300 mb-2">Duration</label>
              <motion.input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                max={formData.durationType === 'hours' ? '24' : '30'}
                whileFocus={{ scale: 1.02 }}
                className="w-full bg-black/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
          </motion.div>

          <motion.button
            onClick={calculatePrice}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors mt-8 animate-fadeIn"
            style={{ animationDelay: '0.6s' }}
          >
            Calculate Price
          </motion.button>

          {price !== null && (
            <motion.div className="mt-6 space-y-4 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-black/50 border border-blue-500/30 rounded-lg"
              >
                <h3 className="text-xl font-semibold text-white mb-2">Estimated Price</h3>
                <p className="text-3xl font-bold text-blue-400">${price}</p>
                <p className="text-sm text-blue-300 mt-2">
                  This is an estimated cost based on your selections
                </p>
              </motion.div>

              <div className="flex gap-4 flex-wrap">
                <motion.button
                  onClick={() => setShowPayment(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
                >
                  Proceed to Payment
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg transition-colors"
                >
                  Get Accurate Quote
                </motion.button>
              </div>

              {showPayment && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-4 bg-black/50 border border-blue-500/30 rounded-lg"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">Payment Options</h3>
                  <div className="space-y-3">
                    <motion.button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Pay with Card
                    </motion.button>
                    <motion.button
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Pay with UPI
                    </motion.button>
                    <motion.button
                      className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Pay with Crypto
                    </motion.button>
                  </div>
                  <p className="text-sm text-blue-300 mt-4">
                    Accurate cost will be provided within 4 hours after review
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes cloud {
          0% {
            opacity: 0;
            transform: translateX(0%);
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 0;
            transform: translateX(1000%);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-cloud {
          animation: cloud linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default VirtualRoomCreator;
