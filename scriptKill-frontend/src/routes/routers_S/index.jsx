import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../../pages/loginPage/login'
import Register from '../../pages/loginPage/register'
import Home from '../../pages/homePage/home'



const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register/:phone',
        element: <Register />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '/',
        //重定向
        element: <Navigate to="/login" replace />,
    }
]);

export default router;