
import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Library from "./pages/Library";
import Sport from "./pages/Sport";
import BreadcrumbNav from "./components/BreadcrumbNav";
import React from "react";

import './App.scss'

const Layout: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== "/" && <BreadcrumbNav />}
      {children}
    </>
  );
};

const App = () => (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/library" element={<Library />} />
          <Route path="/sport" element={<Sport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
);

export default App;
