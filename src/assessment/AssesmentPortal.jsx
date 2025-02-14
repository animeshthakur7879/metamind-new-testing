import React from 'react'
import { useNavigate } from 'react-router-dom';

const AssesmentPortal = () => {


    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md text-center">
            <h1 className="text-2xl font-bold mb-4">Welcome to the Assessment Portal</h1>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/dynamictest')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Start a New Test
              </button>
              <button
                onClick={() => navigate('/testresults')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      );
      
}

export default AssesmentPortal

