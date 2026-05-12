import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Home.css';

// ─── Privilege ID → Top-level Module mapping ───────────────────────────────
// If ANY of the moduleIds in privileges matches one of these sets,
// that top-level module card is shown.
const PRIVILEGE_MODULE_MAP = {
    PLMN: {
        triggerIds: ['CLC', 'CMS', 'TSG'],   // any one of these → show PLMN card
        label: 'PLMN Services',
        desc: 'Network configuration, subscriber and traffic management',
        icon: '🌐',
        color: 'mod-blue',
        num: '01',
        route: '/plmn',
    },
    BILLING: {
        triggerIds: ['RAT'],
        label: 'Billing Management',
        desc: 'Invoicing, rate plans, payment gateway and revenue',
        icon: '💳',
        color: 'mod-teal',
        num: '02',
        route: '/billing',
    },
    UMS: {
        triggerIds: ['UMS'],
        label: 'User Management System',
        desc: 'Accounts, roles, permissions and access control',
        icon: '👤',
        color: 'mod-amber',
        num: '03',
        route: '/ums',
    },
    ICB: {
        triggerIds: ['ICB'],
        label: 'InterConnect Billing',
        desc: 'Carrier relations, settlement and traffic exchange',
        icon: '🔁',
        color: 'mod-purple',
        num: '04',
        route: '/icb',
    },
    TMS: {
        triggerIds: ['TMS'],
        label: 'Trouble Ticket Management',
        desc: 'Open issues, escalations, knowledge base and reports',
        icon: '🎫',
        color: 'mod-coral',
        num: '05',
        route: '/tms',
    },
    RMS: {
        triggerIds: ['RMS'],
        label: 'Roaming Management Server',
        desc: 'Partners, CAMEL services, TAP files and coverage maps',
        icon: '🌍',
        color: 'mod-green',
        num: '06',
        route: '/rms',
    },
};

const Home = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');

    // Pull user data from Redux (set by authSlice on login)
    const user = useSelector((state) => state.auth.user);
    const userName = user?.userName || 'User';
    const networkName = user?.networkName || 'Network';

    // Extract unique moduleIds from privileges array
    const privilegeModuleIds = useMemo(() => {
        const privileges = user?.privileges || [];
        return new Set(privileges.map((p) => p.moduleId));
    }, [user]);

    // Determine which top-level module cards to show
    const visibleModules = useMemo(() => {
        return Object.entries(PRIVILEGE_MODULE_MAP).filter(([, meta]) =>
            meta.triggerIds.some((id) => privilegeModuleIds.has(id))
        );
    }, [privilegeModuleIds]);

    // Which sub-module IDs the user actually has access to (for passing to sub-pages)
    const getGrantedSubModules = (triggerIds) =>
        triggerIds.filter((id) => privilegeModuleIds.has(id));

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return visibleModules;
        return visibleModules.filter(([, meta]) =>
            meta.label.toLowerCase().includes(q) ||
            meta.desc.toLowerCase().includes(q)
        );
    }, [visibleModules, search]);

    return (
        <div className="home-root">
            <div className="home-inner">

                <div className="home-header-row">
                    <div>
                        <h1 className="home-title">
                            Select a <span className="home-title-accent">module</span>
                        </h1>
                        <p className="home-subtitle">
                            Welcome back, <strong>{userName}</strong> — {visibleModules.length} modules available on <strong>{networkName}</strong>
                        </p>
                    </div>

                    <div className="home-controls">
                        <div className="search-box">
                            <svg className="search-icon" viewBox="0 0 20 20" fill="none">
                                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5" />
                                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <input
                                className="search-input"
                                type="text"
                                placeholder="Search modules..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="view-toggle">
                            <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="Grid view">
                                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                    <rect x="2" y="2" width="7" height="7" rx="1" /><rect x="11" y="2" width="7" height="7" rx="1" />
                                    <rect x="2" y="11" width="7" height="7" rx="1" /><rect x="11" y="11" width="7" height="7" rx="1" />
                                </svg>
                            </button>
                            <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="List view">
                                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                                    <rect x="2" y="3" width="16" height="3" rx="1" /><rect x="2" y="9" width="16" height="3" rx="1" />
                                    <rect x="2" y="15" width="16" height="3" rx="1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="home-empty">
                        <svg viewBox="0 0 48 48" fill="none" width="48" height="48">
                            <circle cx="22" cy="22" r="14" stroke="currentColor" strokeWidth="2" />
                            <path d="M32 32L42 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <p>
                            {search
                                ? <>No modules match "<strong>{search}</strong>"</>
                                : 'No modules assigned to your account.'}
                        </p>
                    </div>
                ) : (
                    <div className={`modules-container ${view === 'list' ? 'modules-list' : 'modules-grid'}`}>
                        {filtered.map(([key, meta], idx) => {
                            const granted = getGrantedSubModules(meta.triggerIds);
                            return (
                                <div
                                    key={key}
                                    className={`module-card ${meta.color}`}
                                    style={{ animationDelay: `${idx * 60}ms` }}
                                    onClick={() => navigate(meta.route, { state: { grantedSubModules: granted } })}
                                >
                                    <div className="card-num">{meta.num}</div>
                                    <div className="card-icon-wrap">
                                        <span className="card-icon">{meta.icon}</span>
                                    </div>
                                    <div className="card-body">
                                        <h2 className="card-title">{meta.label}</h2>
                                        <p className="card-desc">{meta.desc}</p>
                                        {/* Show which sub-modules are accessible */}
                                        <div className="card-tags">
                                            {granted.map((id) => (
                                                <span key={id} className="card-tag">{id}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <button
                                            className="open-link"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(meta.route, { state: { grantedSubModules: granted } });
                                            }}
                                        >
                                            Open module
                                            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
                                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;