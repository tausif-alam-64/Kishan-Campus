import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"

const RoleRoute = ({role}) => {
    const {userRole} = useAuth();

    if(userRole !== role){
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default RoleRoute;