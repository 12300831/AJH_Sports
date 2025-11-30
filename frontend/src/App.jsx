import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./Pages/HomePage/HomePage";
import ClubOverviewPage from "./Pages/Club/ClubOverviewPage";
import ClubJoinMainPage from "./Pages/Club/ClubJoinMainPage";
import ClubRedirectPage from "./Pages/Club/ClubRedirectPage";
import CoachesPage from "./Pages/Coaches/CoachesPage";
import Coachesname from "./Pages/Coaches/Coachesname";
import MichaelPage from "./Pages/Coaches/michael";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/clubs" element={<ClubOverviewPage />} />
        <Route path="/club" element={<ClubOverviewPage />} />
        <Route path="/clubs/join" element={<ClubJoinMainPage />} />
        <Route path="/clubs/redirect" element={<ClubRedirectPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/coaches/names" element={<Coachesname />} />
        <Route path="/coaches/michael" element={<MichaelPage />} />
      </Routes>
    </Router>
  );
}
