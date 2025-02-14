import React, { useState, useEffect } from 'react';
import { User, Badge, Code } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MetamindPassport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  const studentData = {
    name: "Rahul Kumar",
    badges: 12,
    skills: ["JavaScript", "React", "Node.js", "Python"],
    openSourceProjects: 5,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setShowGlow(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleVirtualWorld = () => {
    setIsApproved(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex justify-center items-center p-4">
      <motion.button
        onClick={() => window.history.back()}
        className="fixed top-8 right-6 px-6 py-3 bg-gradient-to-r from-black to-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.div
              key="closed"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-[#2B4570] shadow-2xl max-w-md mx-auto rounded-lg p-6 relative min-h-[600px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.1'/%3E%3C/svg%3E")`,
              }}
            >
              <motion.div
                className={`text-[#DAA520] text-4xl text-center font-bold mt-5 mb-20 tracking-[0.25em] font-serif ${
                  showGlow ? 'animate-pulse' : ''
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                PASSPORT
              </motion.div>

              <motion.div
                className="flex flex-col items-center justify-center mb-8"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 360 }}
                transition={{ duration: 2, once: true }}
              >
                <div className="w-32 h-32 mb-4 relative">
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <motion.path
                        d="M50 10 C30 10 10 30 10 50 C10 70 30 90 50 90 C70 90 90 70 90 50 C90 30 70 10 50 10"
                        fill="none"
                        stroke="#DAA520"
                        strokeWidth="4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2 }}
                      />
                      <motion.path
                        d="M50 10 L50 90 M10 50 L90 50"
                        stroke="#DAA520"
                        strokeWidth="4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1 }}
                      />
                    </svg>
                  </motion.div>
                </div>
                <motion.h1
                  className="text-[#DAA520] text-3xl font-bold font-serif"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  Metamind
                </motion.h1>
              </motion.div>

              <motion.button
                onClick={() => setIsOpen(true)}
                className="absolute bottom-4 right-4 bg-[#DAA520] text-[#2B4570] px-6 py-3 rounded-lg font-semibold shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "#B8860B",
                  boxShadow: "0 0 20px rgba(218, 165, 32, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Open
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-4"
            >
              <motion.div
                className="flex-1 bg-[#2B4570] rounded-lg shadow-2xl p-8 min-h-[600px]"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="font-serif tracking-wider">
                  <motion.h1
                    className="text-[#DAA520] text-2xl mb-6 relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Terms and Conditions
                    <motion.div
                      className="absolute -bottom-2 left-0 h-0.5 bg-[#DAA520]"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    />
                  </motion.h1>
                  {['Irrevocable Commitment', 'Uncompromising Platform Integrity', 'Mandatory Interview Compliance'].map((title, index) => (
                    <motion.div
                      key={title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-[#1a2b44] p-4 rounded-lg mb-4 transform hover:scale-[1.02] transition-transform"
                    >
                      <h3 className="text-[#DAA520] font-semibold mb-2">{title}</h3>
                      <p className="text-gray-300 font-light text-sm leading-relaxed">
                        {getTermDescription(title)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="flex-1 bg-[#E8DCD9] rounded-lg shadow-2xl p-8 min-h-[600px]"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <div className="flex flex-col space-y-6">
                  <motion.div
                    className="w-32 h-32 mx-auto bg-[#2B4570] rounded-full overflow-hidden shadow-lg"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(43, 69, 112, 0.5)" }}
                  >
                    <User className="w-full h-full p-4 text-[#DAA520]" />
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-center text-[#2B4570] font-serif"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {studentData.name}
                  </motion.h2>

                  <motion.div
                    className="flex items-center justify-center space-x-2 bg-[#2B4570] p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Badge className="w-6 h-6 text-[#DAA520]" />
                    <span className="font-semibold text-[#DAA520]">
                      {studentData.badges} Badges Earned
                    </span>
                  </motion.div>

                  <motion.div className="space-y-3">
                    <h3 className="font-semibold text-center text-[#2B4570]">Skills</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {studentData.skills.map((skill, index) => (
                        <motion.span
                          key={skill}
                          className="bg-[#2B4570] text-[#DAA520] px-4 py-2 rounded-full text-sm font-medium shadow-md"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ 
                            scale: 1.1,
                            backgroundColor: "#1a2b44",
                            boxShadow: "0 0 15px rgba(218, 165, 32, 0.3)"
                          }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center justify-center space-x-2 bg-[#2B4570] p-3 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                  >
                    <Code className="w-6 h-6 text-[#DAA520]" />
                    <span className="text-[#DAA520]">
                      {studentData.openSourceProjects} Open Source Projects
                    </span>
                  </motion.div>

                  {!isApproved ? (
                    <motion.button
                      onClick={handleVirtualWorld}
                      className="mt-4 bg-[#2B4570] text-[#DAA520] font-bold py-3 px-6 rounded-lg w-full shadow-lg relative overflow-hidden"
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: "0 0 20px rgba(218, 165, 32, 0.3)"
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-[#DAA520]"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.5 }}
                        style={{ opacity: 0.2 }}
                      />
                      Enter Virtual World
                    </motion.button>
                  ) : (
                    <motion.div
                      className="relative mt-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div className="border-8 border-[#DAA520] rounded-lg p-4 text-[#DAA520] font-bold text-xl text-center font-serif backdrop-blur-sm">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-[#DAA520]"
                          style={{ opacity: 0.1 }}
                        />
                        APPROVED
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const getTermDescription = (term) => {
  const descriptions = {
    'Irrevocable Commitment': 'Once engaged in a virtual company project, premature withdrawal is strictly prohibited. Any exit must be substantiated with a legitimate justification and requires formal approval.',
    'Uncompromising Platform Integrity': 'Any activity jeopardizing the sanctity of the virtual world, including but not limited to dissemination of false information, engagement in unethical practices, or system exploitation, will result in stringent repercussions.',
    'Mandatory Interview Compliance': 'Application to any company project necessitates compulsory participation in the interview process. Given the invaluable nature of hiring managers\' time, selection without an interview is categorically impermissible.'
  };
  return descriptions[term];
};

export default MetamindPassport;