import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import RequireAuth from './hooks/require-auth';
import Intervals from './pages/Intervals';
import Items from './pages/Cities';
import Place from './pages/Place';
import Category from './pages/Category';
import SpecialCategory from './pages/SpecialCategory';
import Map from './pages/Map';
import ChangePhone from './pages/ChangePhone';
import User from './pages/User';
import GlobalSetting from './pages/GlobalSetting';
import Driver from './pages/Driver';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: (
        <RequireAuth>
          <DashboardLayout />
        </RequireAuth>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'user', element: <User /> },
        { path: 'category', element: <Category /> },
        { path: 'specialCategory', element: <SpecialCategory /> },
        { path: 'map', element: <Map /> },
        { path: 'intervals', element: <Intervals /> },
        { path: 'city', element: <Items /> },
        { path: 'place', element: <Place /> },
        { path: 'ChangePhone', element: <ChangePhone /> },
        { path: 'globalSetting', element: <GlobalSetting /> },
        { path: 'driver', element: <Driver /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: (
        <RequireAuth>
          <SimpleLayout />
        </RequireAuth>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
