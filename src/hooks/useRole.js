import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import axios from "axios";

const useRole = () => {
    const { user, loading } = useAuth();
    const [role, setRole] = useState(null);
    const [roleLoading, setRoleLoading] = useState(true);

    useEffect(() => {
        const fetchRole = async () => {
            if (user?.email) {
                try {
                    const res = await axios.get(
                        `http://localhost:5000/users/role/${user.email}`
                    );
                    setRole(res.data.role);
                } catch (err) {
                    console.error("Error fetching role:", err);
                } finally {
                    setRoleLoading(false);
                }
            } else if (!loading) {
                setRoleLoading(false);
            }
        };

        fetchRole();
    }, [user, loading]);

    return [role, roleLoading];
};

export default useRole;