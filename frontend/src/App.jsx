
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import ClubOverviewPage from "./Pages/Club/ClubOverviewPage";
import ClubJoinMainPage from "./Pages/Club/ClubJoinMainPage";
import ClubRedirectPage from "./Pages/Club/ClubRedirectPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/clubs" replace />} />
        <Route path="/clubs" element={<ClubOverviewPage />} />
        <Route path="/club" element={<ClubOverviewPage />} />
        <Route path="/clubs/join" element={<ClubJoinMainPage />} />
        <Route path="/clubs/redirect" element={<ClubRedirectPage />} />
      </Routes>
    </Router>
  );
}

