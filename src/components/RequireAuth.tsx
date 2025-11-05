import React from "react";
import { useCookies } from "react-cookie";
import { Navigate, useLocation } from "react-router-dom";

type Props = {
    children: React.ReactElement;
    isPublic?: boolean;
};

const RequireAuth: React.FC<Props> = ({ children, isPublic = false }) => {
    const [cookies] = useCookies(["user"]);
    const location = useLocation();
    const isAuthenticated = Boolean(cookies.user);

    if (isPublic) {
        if (isAuthenticated) {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    }

    if (!isAuthenticated) {
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return children;
};

export default RequireAuth;
