import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const BuildingPage = () => {
    const [hoveredBuilding, setHoveredBuilding] = useState(null);
    const navigate = useNavigate();

    const handleBuildingClick = () => {
        navigate('/welcomepage');
    };

    const buildings = {
        building1: {
            name: "Tesla",
            description: "Automobile Company",
            src: "image-removebg-preview (8).png",
            position: "left-[10%]"
        },
        building2: {
            name: "47Billion",
            description: "IT Company",
            src: "image-removebg-preview (7).png",
            position: "left-[40%]"
        },
        building3: {
            name: "Amazon",
            description: "E-commerce Comapany",
            src: "image-removebg-preview (6).png",
            position: "left-[75%]"
        }
    };

    return (
        <div className="background flex items-center justify-center min-h-screen">
            {/* Stars Background - Keeping your original */}
            <div className="stars">
                <img
                    alt="A starry night sky"
                    className="w-full h-full object-cover"
                    src="https://storage.googleapis.com/a1aa/image/tEFvcmzIRHb3E3BlsUXKHTzZIncz9ZdCWJglp7ICGs0.jpg"
                />
            </div>
            <div className="web"></div>

            {/* Enhanced Title with Animation */}
            <motion.h1 
                className=" bg-gradient-to-tr from-blue-500 text-6xl font-bold mt-10 to-purple-500 bg-clip-text text-transparent absolute top-5 left-1/2 transform -translate-x-1/2"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                    type: "spring",
                    stiffness: 100,
                    damping: 10
                }}
            >
                Virtual World
                <motion.div 
                    className="text-blue-300 mt-6 text-xl text-center mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    Explore the Digital Frontier
                </motion.div>
            </motion.h1>

            {/* Animated Back Button */}
            <motion.button 
                className="back-button"
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate('/studentdashboard')}
            >
                <i className="fas fa-arrow-left" /> Back
            </motion.button>

            {/* Buildings with Hover Effects and Click Navigation */}
            {Object.entries(buildings).map(([key, building], index) => (
                <motion.div
                    key={key}
                    className={`building ${key === 'building1' ? 'building-1' : key === 'building2' ? 'building-2' : 'building-3'}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    onMouseEnter={() => setHoveredBuilding(key)}
                    onMouseLeave={() => setHoveredBuilding(null)}
                    onClick={handleBuildingClick}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img
                        src={building.src}
                        alt={`${building.name} building`}
                        className="w-full h-full object-contain transition-all duration-300"
                    />
                    
                    {/* Info Popup on Hover */}
                    {hoveredBuilding === key && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-64 bg-black bg-opacity-80 backdrop-blur-md rounded-lg p-4 text-white shadow-lg"
                        >
                            <h3 className="text-xl font-bold mb-2 text-blue-400">
                                {building.name}
                            </h3>
                            <p className="text-sm text-blue-200">
                                {building.description}
                            </p>
                            <p className="text-xs text-blue-300 mt-2 italic">
                                Click to enter
                            </p>
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                                <div className="w-4 h-4 bg-black bg-opacity-80 rotate-45" />
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            ))}

            {/* Floating Particles */}
            {[...Array(15)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: Math.random()
                    }}
                    animate={{
                        y: [null, "-20%"],
                        opacity: [null, 0]
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            ))}

            <style jsx>{`
                .background {
                    background: radial-gradient(circle, rgba(0, 0, 51, 1) 0%, rgba(0, 0, 102, 1) 100%);
                    position: relative;
                    overflow: hidden;
                }
                .stars {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    opacity: 0.2;
                }
                .web {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg,rgb(12, 4, 57),rgb(1, 3, 5), rgb(12, 4, 57)), rgba(6, 23, 48, 0.3);
                    mix-blend-mode: screen;
                }
                .building {
                    position: absolute;
                    bottom: 0;
                    object-fit: contain;
                    max-height: 100vh;
                    filter: brightness(1.5);
                    cursor: pointer;
                }
                .building-1 {
                    left: 10%;
                    width: 150px;
                }
                .building-2 {
                    left: 40%;
                    width: 200px;
                }
                .building-3 {
                    left: 75%;
                    width: 200px;
                }
                .gradient-text {
                    background: linear-gradient(90deg, #2400F0, #0094FF, #2F0AFF);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-size: 2.5rem;
                    font-weight: bold;
                }
                .back-button {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    padding: 10px 15px;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    color: white;
                }
                .back-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `}</style>
        </div>
    );
};

export default BuildingPage;