import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still checking if user is logged in
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // User is logged in → show the page
  if (user) {
    return children;
  }

  // Not logged in → redirect to login
  // We save where they were trying to go using "state"
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;