// import { Outlet } from "react-router-dom";
// import Header from "../components/common/Header";
// import Footer from "../components/common/Footer";
// import "../styles/layout.css";

// function AdminLayout() {
//     return (
//         <div className="admin-layout">
//             {/* Header */}
//             <Header />

//             {/* Main Layout */}
//             <div className="admin-body">

//                 {/* Sidebar */}
//                 <aside className="admin-sidebar">
//                     <nav className="sidebar-menu">
//                         <ul>
//                             <li className="active">
//                                 <span className="menu-icon">🌐</span>
//                                 <span>Network Management</span>
//                             </li>
//                         </ul>
//                     </nav>
//                 </aside>

//                 {/* Content Area */}
//                 <main className="admin-content">
//                     <div className="content-wrapper">
//                         <Outlet />
//                     </div>
//                 </main>
//             </div>

//             {/* Footer */}
//             <Footer />
//         </div>
//     );
// }

// export default AdminLayout;

import { Outlet, useNavigate, useLocation } from "react-router-dom";

import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

import "../styles/layout.css";

function AdminLayout() {

    const navigate = useNavigate();

    const location = useLocation();

    return (

        <div className="admin-layout">

            {/* Header */}

            <Header />

            {/* Main Layout */}

            <div className="admin-body">

                {/* Sidebar */}

                <aside className="admin-sidebar">

                    <nav className="sidebar-menu">

                        <ul>

                            <li
                                className={
                                    location.pathname.includes("/network")
                                        ? "active"
                                        : ""
                                }
                                onClick={() =>
                                    navigate("/networkmanagementgrid")
                                }
                            >

                                <span className="menu-icon">
                                    🌐
                                </span>

                                <span>
                                    Network Management
                                </span>

                            </li>

                        </ul>

                    </nav>

                </aside>

                {/* Content Area */}

                <main className="admin-content">

                    <div className="content-wrapper">

                        <Outlet />

                    </div>

                </main>

            </div>

            {/* Footer */}

            <Footer />

        </div>
    );
}

export default AdminLayout;