import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { useSelector } from "react-redux";

import HomeLayout from "../layouts/HomeLayout";
import ModuleLayout from "../layouts/ModuleLayout";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../modules/home/pages/Home";
import Login from "../modules/auth/pages/Login";
import { ToastContainer } from "react-toastify";

/* =========================
   NETWORK MANAGEMENT SCREENS
========================= */

import NetworkManagementGrid from "../screens/NetworkManagementGrid";
import NetworkManagement from "../screens/NetworkManagement";
import NetworkManagementModify from "../screens/NetworkManagementModify";
import NetworkView from "../screens/NetworkView";
import NetworkChangePassword from "../screens/NetworkChangePassword";
import NetworkConfigure from "../screens/NetworkConfigure";
import NetworkMessagePage from "../screens/Networkstatus";
import NetworkStatusCode from "../screens/NetworkStatusCode";
import NetworkStatusModify from "../screens/NetworkStatusModify";

/* =========================
   ADMIN ROUTE
========================= */

const AdminRoute = ({ children }) => {

    const {
        isAuthenticated,
        user,
    } = useSelector((state) => state.auth);

    // NOT LOGGED IN

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // NORMAL USER TRYING ADMIN

    if (user?.networkId !== 0) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

/* =========================
   USER ROUTE
========================= */

const UserRoute = ({ children }) => {

    const {
        isAuthenticated,
        user,
    } = useSelector((state) => state.auth);

    // NOT LOGGED IN

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // ADMIN TRYING USER ROUTES

    if (user?.networkId === 0) {
        return <Navigate to="/admin" replace />;
    }

    return children;
};

function AppRoutes() {

    const {
        isAuthenticated,
        user,
    } = useSelector((state) => state.auth);

    const isAdmin =
        user?.networkId === 0;

    return (

        <BrowserRouter>

            <Routes>

                {/* DEFAULT */}

                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            isAdmin
                                ? <Navigate to="/admin" replace />
                                : <Navigate to="/home" replace />
                        ) : (
                            <Navigate to="/login" replace />
                        )
                    }
                />

                {/* LOGIN */}

                <Route element={<AuthLayout />}>

                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                isAdmin
                                    ? <Navigate to="/admin" replace />
                                    : <Navigate to="/home" replace />
                            ) : (
                                <Login />
                            )
                        }
                    />

                </Route>

                {/* ADMIN ROUTES */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >

                    {/* DEFAULT ADMIN PAGE */}

                    <Route
                        index
                        element={<NetworkManagementGrid />}
                    />

                    {/* NETWORK MANAGEMENT */}

                    <Route
                        path="networkmanagementgrid"
                        element={<NetworkManagementGrid />}
                    />

                    <Route
                        path="networkmanagement"
                        element={<NetworkManagement />}
                    />

                    <Route
                        path="networkmanagementmodify/:networkId"
                        element={<NetworkManagementModify />}
                    />

                    <Route
                        path="network-view/:networkId"
                        element={<NetworkView />}
                    />

                    <Route
                        path="networkchangepassword/:networkId"
                        element={<NetworkChangePassword />}
                    />

                    <Route
                        path="network-configure/:networkId/:networkName"
                        element={<NetworkConfigure />}
                    />

                    {/* STATUS / RESULT SCREENS */}

                    <Route
                        path="network-status"
                        element={<NetworkMessagePage />}
                    />

                    <Route
                        path="network-status-code"
                        element={<NetworkStatusCode />}
                    />

                    <Route
                        path="network-statusmodify"
                        element={<NetworkStatusModify />}
                    />

                </Route>

                {/* USER HOME */}

                <Route
                    element={
                        <UserRoute>
                            <HomeLayout />
                        </UserRoute>
                    }
                >

                    <Route
                        path="/home"
                        element={<Home />}
                    />

                </Route>

                {/* USER MODULES */}

                <Route
                    element={
                        <UserRoute>
                            <ModuleLayout />
                        </UserRoute>
                    }
                >

                    <Route
                        path="/plmn"
                        element={<div>PLMN</div>}
                    />

                </Route>

                {/* FALLBACK */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={
                                isAuthenticated
                                    ? (
                                        isAdmin
                                            ? "/admin"
                                            : "/home"
                                    )
                                    : "/login"
                            }
                            replace
                        />
                    }
                />

            </Routes>

            <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

        </BrowserRouter>
    );
}

export default AppRoutes;