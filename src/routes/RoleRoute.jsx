import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import NavBar from "../component/common/NavBar";

const RoleRoute = ({role}) => {
    const {userRole} = useAuth();

    if(userRole !== role){
        return <Navigate to="/login" replace />
    }
         
    return <main>
         <NavBar />
        <Outlet />
    </main>
}

export default RoleRoute;