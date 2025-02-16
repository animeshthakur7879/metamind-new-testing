import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { jsPDF } from 'jspdf';
import { FaArrowLeft } from 'react-icons/fa'; // Importing arrow icon
import {  useNavigate } from 'react-router-dom';

// Register Chart.js components
Chart.register(...registerables);

const ProjectReport = () => {
    const progressPieChartRef = useRef(null);
    const budgetBarChartRef = useRef(null);

    const navigate = useNavigate()

    useEffect(() => {
        // Create chart instances
        const ctxProgressPie = progressPieChartRef.current.getContext('2d');
        const ctxBudgetBar = budgetBarChartRef.current.getContext('2d');

        const progressPieChart = new Chart(ctxProgressPie, {
            type: 'pie',
            data: {
                labels: ['Completed', 'Ongoing', 'Pending'],
                datasets: [{
                    label: 'Project Status',
                    data: [40, 40, 20],
                    backgroundColor: ['#4CAF50', '#FF9800', '#2196F3'],
                    borderColor: ['#fff', '#fff', '#fff'],
                    borderWidth: 1
                }],
                options: {
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                    }
                }
            }
        });

        const budgetBarChart = new Chart(ctxBudgetBar, {
            type: 'bar',
            data: {
                labels: ['Budget', 'Spent', 'Remaining'],
                datasets: [{
                    label: 'Project Budget',
                    data: [500000, 200000, 300000],
                    backgroundColor: '#0094FF',
                    borderColor: '#fff',
                    borderWidth: 1
                }],
                options: {
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                    }
                }
            }
        });

        // Cleanup function to destroy charts on unmount
        return () => {
            progressPieChart.destroy();
            budgetBarChart.destroy();
        };
    }, []);

    const generatePDF = () => {
        const doc = new jsPDF();
        doc.text("Project Report: Virtual Reality Learning Platform", 10, 10);
        doc.text("Date: " + new Date().toLocaleDateString(), 10, 20);
        doc.text("Progress: 40% Completed", 10, 30);
        doc.text("Status: Ongoing", 10, 40);
        doc.save('project_report.pdf');
    };
    


    return (
        <div className="bg-gradient-to-r from-[#000002] to-[#1C388C] min-h-screen text-gray-200">
            {/* Navbar */}
            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-blue-950 to-gray-800 relative shadow-lg">
                <div className="flex items-center absolute left-5">
                    
                    <span className="text-2xl font-bold text-transparent md:ps-10 bg-clip-text bg-gradient-to-r from-[#2400F0] to-[#0094FF]">Meta Mind</span>
                </div>
                <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#2400F0] to-[#0094FF]"></span>
                <button  className="flex items-center bg-transparent text-white text-lg border-none cursor-pointer hover:bg-blue-600 rounded px-2 py-1 transition duration-300" onClick={() =>navigate('/industryhome')}>
                    <FaArrowLeft className="mr-2" /> Back
                </button>
            </div>

            {/* Report Container */}
            <div className="p-10 max-w-6xl mx-auto overflow-y-auto">
                <div className="bg-[#001928cc] rounded-lg p-5 mb-8 shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                    <div className="text-xl text-white font-bold mb-4">Project Overview</div>
                    <div className="text-lg mb-4">
                        <p>The "Virtual Reality Learning Platform" is an innovative educational tool designed to provide immersive learning experiences using virtual reality (VR) technology. The platform aims to enhance the learning process by allowing students to explore 3D environments and interact with virtual objects in real-time, making education more engaging and effective.</p>
                        <div className="mt-4">
                            <strong>Project Details:</strong>
                            <ul className="list-disc list-inside mt-2">
                                <li><strong>Project Start Date</strong>: March 15, 2024</li>
                                <li><strong>Estimated Completion Date</strong>: December 15, 2025</li>
                                <li><strong>Project Manager</strong>: John Doe</li>
                                <li><strong>Team Members</strong>: Jane Smith, Alan Brown, Sarah Lee, Kevin Black</li>
                                <li><strong>Stakeholders</strong>: ABC University, VR Tech Solutions</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-[#001928cc] rounded-lg p-5 mb-8 shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                    <div className="text-xl text-white font-bold mb-4">Project Status</div>
                    <div className="text-lg mb-4">
                        <p><strong>Current Status</strong>: Ongoing</p>
                        <p><strong>Progress</strong>: 40% Completed</p>
                        <p><strong>Completion Rate</strong>: 40%</p>
                        <div className="mt-4">
                            <strong>Milestones Achieved:</strong>
                            <ul className="list-disc list-inside mt-2">
                                <li>Initial platform concept design completed.</li>
                                <li>Prototype of the virtual classroom environment finished.</li>
                                <li>User testing of VR hardware conducted successfully.</li>
                            </ul>
                        </div>
                        <div className="mt-4">
                            <strong>Milestones Pending:</strong>
                            <ul className="list-disc list-inside mt-2">
                                <li>Full curriculum integration into the platform.</li>
                                <li>Final testing and debugging phase.</li>
                                <li>Full-scale implementation at participating educational institutions.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="bg-[#001928cc] rounded-lg p-5 mb-8 shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                    <div className="text-xl text-white font-bold mb-4">Project Timeline</div>
                    <div className="text-lg mb-4">
                        <table className="min-w-full border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="border border-gray-300 p-2">Milestone</th>
                                    <th className="border border-gray-300 p-2">Target Date</th>
                                    <th className="border border-gray-300 p-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 p-2">Concept Design & Planning</td>
                                    <td className="border border-gray-300 p-2">March 2024</td>
                                    <td className="border border-gray-300 p-2">Completed</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Prototype Development</td>
                                    <td className="border border-gray-300 p-2">June 2024</td>
                                    <td className="border border-gray-300 p-2">Completed</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Initial User Testing</td>
                                    <td className="border border-gray-300 p-2">August 2024</td>
                                    <td className="border border-gray-300 p-2">Completed</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Beta Testing</td>
                                    <td className="border border-gray-300 p-2">December 2024</td>
                                    <td className="border border-gray-300 p-2">Ongoing</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Full Curriculum Integration</td>
                                    <td className="border border-gray-300 p-2">March 2025</td>
                                    <td className="border border-gray-300 p-2">Pending</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Final Testing & Debugging</td>
                                    <td className="border border-gray-300 p-2">October 2025</td>
                                    <td className="border border-gray-300 p-2">Pending</td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 p-2">Launch</td>
                                    <td className="border border-gray-300 p-2">December 2025</td>
                                    <td className="border border-gray-300 p-2">Pending</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-between mb-8">
                    <div className="bg-[#001928cc] rounded-lg p-5 w-1/2 shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        <canvas ref={progressPieChartRef}></canvas>
                    </div>
                    <div className="bg-[#001928cc] rounded-lg p-5 w-1/2 shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out">
                        <canvas ref={budgetBarChartRef}></canvas>
                    </div>
                </div>

                <button className="mt-8 px-6 py-3 bg-[#0094FF] text-white text-lg rounded hover:bg-[#2400F0] shadow-lg transition duration-300" onClick={generatePDF}>
                    Generate PDF Report
                </button>
            </div>
        </div>
    );
};

export default ProjectReport;