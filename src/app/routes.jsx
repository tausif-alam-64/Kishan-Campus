import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MainLayout from "../component/layout/MainLayout";
import Home from "../pages/public/Home";
import About from "../pages/public/About";
import Contect from "../pages/public/Contect";
import NotFound from "../pages/public/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children : [
            {
                index : true,
                element: <Home />
            },
            {
                path : "about",
                element : <About />
            },
            {
                path : "contect",
                element : <Contect />
            },
            {
                path : "*",
                element : <NotFound />
            }
        ]
    }
])

export default router;