import React, { useEffect } from 'react';
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import StudentProfile from './pages/StudentProfile';
import { LogIn } from 'lucide-react';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
import ProfileForm from './pages/ProfileForm';
import MetamindPassport from './pages/Passport';
import Dashboard from './components/dashboard';
import StudentDashboard from './pages/StudentDashboard';
import SkillSurge from './pages/SkillSurge';
import { StudentProvider } from './context/Student/StudentContext';
import CaseStudyMain from './pages/CaseStudyMain';
import CodeContributePage from './pages/CodeContribute';
import OpenSourceProjects from './codecontributepages/OpenSourceProjects';
import CodingChallenges from './codecontributepages/codingchallenges';
import VirtualCompanyProjects from './virtual-world-pages/virtualCompanyProjects';
import IndustryDashboard from './Industry Pages/IndustryDashboard';
import WelcomePage from './virtual-world-pages/WelcomePage';
import VirtualRoomCreator from './virtual-world-pages/VirtualRoom';
import InterviewPrep from './virtual-world-pages/InterviewPrep';
import VirtualDashboard from './virtual-world-pages/VirtualDashboard';
import ChatRoom from './virtual-world-pages/ChatRoom';
import MeetingRoom from './virtual-world-pages/MeetingRoom';
import StudentSchedulePage from './SideNavbarPages/Schedule.jsx'
import ChatPage from './SideNavbarPages/ChatPage.jsx';
import CommunityPage from './SideNavbarPages/CommunityPage.jsx';
import IndustryHome from './Industry Pages/IndustryHome.jsx';
import BuildingPage from './virtual-world-pages/BuildingPage.jsx';
import IndustryWelcome from './Industry Pages/IndustryWelcome.jsx';
import SubmitProjectFormModal from './Industry Pages/SubmitProjectFormModal.jsx';
import ChatAssistant from './pages/ChatAssistant.jsx';
import AssesmentPortal from './assessment/AssesmentPortal.jsx';
import RoadmapGenerator from './assessment/RoadmapGenerator.jsx';
import TermsAndConditions from './assessment/TermsConditions.jsx';
import DynamicTest from './assessment/DynamicTest.jsx';
import TestResults from './assessment/TestResults.jsx';
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in milliseconds
      once: true,    // Whether animation should happen only once or every time you scroll
    });
  }, []);

  return (
    <BrowserRouter>
    <StudentProvider>
    <Routes>
        <Route path="/" element={<Home />} />         {/* Home Page */}
        <Route path="/login" element={<LoginPage />} />       {/* Login Page */}
        <Route path="/signup" element={<SignUpPage />} />     {/* Signup Page */}
        <Route path="/studentdashboard" element={<StudentDashboard/>} />
        <Route path="/studentprofile" element={<StudentProfile />} />
        <Route path="/profileform" element={<ProfileForm/>} />
        <Route path="/skillsurge" element={<SkillSurge/>} />
        <Route path="/casestudymain" element={<CaseStudyMain/>} />
        <Route path="/codecontribute" element={<CodeContributePage/>} />
        <Route path="/opensource" element={<OpenSourceProjects/>} />
        <Route path="/codingchallenges" element={<CodingChallenges/>} />
        <Route path="/virtualcompanyprojects" element={<VirtualCompanyProjects/>} />
        <Route path="/industrydashboard" element={<IndustryDashboard/>} />
        <Route path="/welcomepage" element={<WelcomePage/>} />
        <Route path="/virtualroom" element={<VirtualRoomCreator/>} />
        <Route path="/interviewprep" element={<InterviewPrep/>} />
        <Route path="/virtualdashboard" element={<VirtualDashboard/>} />
        <Route path="/chat" element={<ChatRoom/>} />
        <Route path="/meetingroom" element={<MeetingRoom/>} />
        <Route path="/studentschedule" element={<StudentSchedulePage/>} />
        <Route path="/chatpage" element={<ChatPage/>} />
        <Route path="/communitypage" element={<CommunityPage/>} />
        <Route path="/industryhome" element={<IndustryHome/>} />
        <Route path="/metamindpassport" element={<MetamindPassport/>} />
        <Route path="/buildingpage" element={<BuildingPage/>} />
        <Route path="/industrywelcome" element={<IndustryWelcome/>} />
        <Route path="/submitprojectform" element={<SubmitProjectFormModal/>} />
        <Route path="/chatassistant" element={<ChatAssistant/>} />
        <Route path="/assesmentportal" element={<AssesmentPortal/>} />
        <Route path="/roadmapgenerator" element={<RoadmapGenerator/>} />
        <Route path="/termsconditions" element={<TermsAndConditions/>} />
        <Route path="/testresult" element={<TestResults/>} />
        <Route path="/dynamictest" element={<DynamicTest/>} />

    </Routes>
    </StudentProvider>
    </BrowserRouter>
  );
};

export default App;

