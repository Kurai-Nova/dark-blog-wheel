import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import * as Pages from "@Pages";
import { BreadcrumbNav, Toaster } from "@Components";

import './App.scss'

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="blog-main">
      {location.pathname !== "/" && <BreadcrumbNav />}
      {children}
    </div>
  );
};

const App = () => (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Pages.Homepage />} />
          <Route path="/library" element={<Pages.Library />} />
          <Route path="/sport" element={<Pages.Sport />} />
          <Route path="/health" element={<Pages.Health />} />
          <Route path="/notes" element={<Pages.Notes />} />
          <Route path="/it" element={<Pages.ItSection />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<Pages.NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
);

export default App;
