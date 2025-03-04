import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import HireScopeSection from './components/HireScopeSection';
import WhyChooseSection from './components/WhyChooseSection';
import AboutSection from './components/AboutSection';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import AccountSetup from "./components/AccountSetup";
import FindJobs from './pages/FindJobs';
import FindFreelancers from './pages/FindFreelancers';
import PostProject from './pages/PostProject';
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Home from "./pages/Home";

import './index.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <HireScopeSection />
              <WhyChooseSection />
              <AboutSection />
            </>
          }
        />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/" element={<Home />} />
        <Route path="/AccountSetup" element={<AccountSetup />} />
        <Route path="/FindJobs" element={<FindJobs />} />
        <Route path="/FindFreelancers" element={<FindFreelancers/>}/>
        <Route path="/PostProject" element={<PostProject/>}/>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/MyProfile" element={<MyProfile />} />

      </Routes>
      <Footer />
    </Router>
  );
};

export default App;