import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { FaVideo, FaMicrophone, FaVideoSlash, FaMicrophoneSlash, FaPhoneSlash, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const studentsList = [
  { id: "you", name: "You", status: "online", handRaised: false },
  { id: "2", name: "Mahak Sharma", status: "online", handRaised: false },
  { id: "3", name: "Rohan Verma", status: "online", handRaised: false },
  { id: "4", name: "Priya Singh", status: "online", handRaised: false },
  { id: "5", name: "Amit Gupta", status: "online", handRaised: false },
  { id: "6", name: "Neha Joshi", status: "offline", handRaised: false },
  { id: "7", name: "Suresh Mehta", status: "offline", handRaised: false },
  { id: "8", name: "Pooja Tiwari", status: "offline", handRaised: false },
  { id: "9", name: "Rahul Sharma", status: "offline", handRaised: false },
  { id: "10", name: "Divya Chauhan", status: "offline", handRaised: false },
];

const MeetingRoom = () => {
  const navigate = useNavigate();
  const [peerId, setPeerId] = useState("you"); // "You" will have ID 'you'
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [teamMembers, setTeamMembers] = useState([...studentsList]); // Ensure state immutability
  const [activeMembers, setActiveMembers] = useState([]);
  const remoteVideoRefs = useRef([]);
  const userVideoRef = useRef();

  useEffect(() => {
    const newPeer = new Peer();
    newPeer.on("open", (id) => {
      setPeerId(id);
      updateUserStatus(id, "online");
    });

    setPeer(newPeer);
    return () => updateUserStatus(peerId, "offline");
  }, []);

  const updateUserStatus = (id, status) => {
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === id ? { ...member, status } : member
      )
    );
  };

  const startMeeting = () => {
    navigator.mediaDevices.getUserMedia({ video: videoEnabled, audio: audioEnabled }).then((stream) => {
      setStream(stream);
      userVideoRef.current.srcObject = stream;
      setMeetingStarted(true);

      // Randomly select 5 members for live video
      const selectedMembers = studentsList.slice(0, 5).map((member, index) => ({
        ...member,
        status: "online",
        videoRef: remoteVideoRefs.current[index],
      }));
      setActiveMembers(selectedMembers);
    });
  };

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
    if (stream) stream.getVideoTracks()[0].enabled = !videoEnabled;
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
    if (stream) stream.getAudioTracks()[0].enabled = !audioEnabled;
  };

  const toggleRaiseHand = (userId) => {
    setTeamMembers((prevMembers) => {
      return prevMembers.map((member) =>
        member.id === userId
          ? { ...member, handRaised: !member.handRaised }
          : member
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white p-6">
      {/* Left Section - Meeting Area */}
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-4">Project Meeting Room</h1>

        {/* Video Section */}
        <div className="flex flex-wrap gap-6 justify-center">
          {/* Main User Video */}
          <div>
            <h2 className="text-lg font-semibold text-center">You</h2>
            <video ref={userVideoRef} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg shadow-lg"></video>
          </div>

          {/* Other Participants Videos */}
          {meetingStarted &&
            activeMembers.map((member, index) => (
              <div key={member.id}>
                <h2 className="text-lg font-semibold text-center">{member.name}</h2>
                <video ref={(el) => (remoteVideoRefs.current[index] = el)} autoPlay playsInline className="w-64 h-48 bg-black rounded-lg shadow-lg"></video>
              </div>
            ))}
        </div>

        {/* Controls */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button onClick={toggleVideo} className="bg-gray-700 px-6 py-3 rounded-full text-xl hover:bg-gray-600 transition-all">
            {videoEnabled ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={toggleAudio} className="bg-gray-700 px-6 py-3 rounded-full text-xl hover:bg-gray-600 transition-all">
            {audioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
          </button>
          <button onClick={() => toggleRaiseHand(peerId)} className="bg-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-600 transition-all">
            {teamMembers.find((member) => member.id === peerId)?.handRaised ? "Lower Hand 🖐" : "Raise Hand ✋"}
          </button>

          {!meetingStarted && (
            <button onClick={startMeeting} className="bg-green-600 px-6 py-3 rounded-lg hover:bg-green-700 transition-all">
              Start Meeting
            </button>
          )}
          <button onClick={() => navigate("/virtualdashboard")} className="bg-red-600 px-6 py-3 rounded-full text-xl hover:bg-red-700 transition-all">
            <FaPhoneSlash />
          </button>
        </div>

        {/* Meeting ID */}
        {meetingStarted && (
          <div className="mt-6">
            <p className="text-sm text-gray-400">Your Meeting ID: <span className="font-semibold">{peerId}</span></p>
          </div>
        )}
      </div>

      {/* Right Section - Team Members List */}
      <div className="w-80 bg-gray-800 p-4 rounded-lg shadow-md ml-6">
        <h2 className="text-lg font-semibold mb-2">Project Team</h2>
        <ul>
          {teamMembers.map((member) => (
            <li key={member.id} className="flex justify-between py-2">
              <span>
                {member.name} {member.handRaised ? <span className="text-yellow-400">✋</span> : ""}
              </span>
              <span className={member.status === "online" ? "text-green-400" : "text-red-400"}>
                <FaCircle className="inline-block mr-1" /> {member.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MeetingRoom;
