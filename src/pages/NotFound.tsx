import { useLocation } from "react-router-dom";
import { useEffect } from "react";

export const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="justify-center" style={{ margin: '0 auto' }}>
      <div className="center">
        <h1>404</h1>
        <p>Oops! Page not found</p>
        <a href="/">Return to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
