import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [role, roleLoading] = useRole();

    if (loading || roleLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (user && role === "admin") {
        return children;
    }

    return <Navigate to="/" replace />;
};

export default AdminRoute;