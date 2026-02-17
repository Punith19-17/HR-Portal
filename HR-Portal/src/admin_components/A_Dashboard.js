import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";

// Import EmployeeInfo.js
import EmployeeInfo from './EmployeeInfo'; 

// Import A_personalinfo.js
import A_personalinfo from './A_personalinfo';

// Import AttendanceTracker
import AttendanceTracker from './Attendance';

// Import A_leavestatus.js
import A_leavestatus from './A_leavestatus';

// Import A_holidays.js
import A_holidays from './A_holidays';

// Import DepartmentMaster.js
import DepartmentMaster from './DepartmentMaster';

// Import dashboard styles
import { styles, SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from './ADashboardStyles'; 

// --- Inline SVG Icon Definitions (Matching Figma/Lucide Icons) ---
const IconProps = ({ size = 24, color = 'currentColor', style = {} }) => ({
    width: size,
    height: size,
    fill: color,
    viewBox: "0 0 24 24",
    style: { ...style, display: 'inline-block', verticalAlign: 'middle' }
});

const FaUserFriends = (props) => ( // Users (Total Employees)
    <svg {...IconProps(props)} viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm-8 0c-.29 0-.62.02-1 .08.57.5 1 1.25 1 2.2V19h6v-2.5c0-.95-.43-1.7-1-2.2.04-.01.07-.02.1-.03 2.33 0 7 1.17 7 3.5V19h1.1v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const FaUserCheck = (props) => ( // UserCheck (Present Today)
    <svg {...IconProps(props)} viewBox="0 0 24 24">
        <path d="M15.41 16.59L12 13.17l-1.41 1.42L15.41 19 22 12.41 20.59 11l-5.18 5.18zM16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm-8 0c-.29 0-.62.02-1 .08.57.5 1 1.25 1 2.2V19h6v-2.5c0-.95-.43-1.7-1-2.2.04-.01.07-.02.1-.03 2.33 0 7 1.17 7 3.5V19h1.1v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
);

const FaUserX = (props) => ( // UserX (On Leave)
    <svg {...IconProps(props)} viewBox="0 0 24 24">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm-1 4.5l1.41-1.41L18 17l1.59-1.59L21 17l-1.41 1.41L21 19.83l-1.41 1.41L18 19.41l-1.59 1.59-1.41-1.41L16.59 18l-1.59-1.59z" />
    </svg>
);

const FaCalendar = (props) => ( // Calendar (Pending Approvals)
    <svg {...IconProps(props)} viewBox="0 0 24 24">
        <path d="M19 4h-2V2h-2v2H9V2H7v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zM5 7V6h14v1H5z" />
    </svg>
);

const FaTrendingUp = (props) => ( // +12%
    <svg {...IconProps(props)} size={14} viewBox="0 0 24 24">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 5.3-5.3L22 12V6z" />
    </svg>
);

const FaTrendingDown = (props) => ( // -3%
    <svg {...IconProps(props)} size={14} viewBox="0 0 24 24">
        <path d="M16 18l2.29-2.29-4.88-4.88-4 4-5.3-5.3-1.41 1.41L9.17 14l4 4 5.88-5.88L22 18z" />
    </svg>
);

const FaArrowUpRight = (props) => ( // Arrow for View All button
    <svg {...IconProps(props)} size={16} viewBox="0 0 24 24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
);

const FaClock = (props) => ( // Recent Activity time
    <svg {...IconProps(props)} size={12} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.62V7z" />
    </svg>
);

const FaSearch = (props) => ( // Search Icon
    <svg {...IconProps(props)} size={20}>
        <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 5L20.49 19l-5-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
);

const FaClipboardList = (props) => ( // Leaves, Attendance
    <svg {...IconProps(props)}>
        <path d="M16 10H8v2h8v-2zm-8 4h8v2H8v-2zm12-8h-2.18C17.4 6.36 16.29 6 15 6s-2.4.36-2.82 1H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 12H4V9h3.17L7 8.5V9h10V8.5L16.83 9H20v10z" />
    </svg>
);

const FaChartLine = (props) => ( // Dashboard icon
    <svg {...IconProps(props)}>
        <path d="M16 6l-4.5 5.5-3.5-3-5 5V20h16V6zm-2 12H4v-7.38l3.5-3 3.5 3 4 5.38z" />
    </svg>
);

const FaUsers = (props) => ( // Active Staff
    <svg {...IconProps(props)}>
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm8 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm-8 0c-.29 0-.62.02-1 .08.57.5 1 1.25 1 2.2V19h6v-2.5c0-.95-.43-1.7-1-2.2.04-.01.07-.02.1-.03 2.33 0 7 1.17 7 3.5V19h1.1v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    </svg>
);

const FaBell = (props) => ( // Notification Bell
    <svg {...IconProps(props)} size={20}>
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
);

const FaBars = (props) => ( // Holidays icon
    <svg {...IconProps(props)}>
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
);

const FaExternalLinkSquareAlt = (props) => ( // Events & Clubs, Functions
    <svg {...IconProps(props)}>
        <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </svg>
);

const FaUserCircle = (props) => ( // Logo icon
    <svg {...IconProps(props)}>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.93 0 3.5 1.57 3.5 3.5S13.93 12 12 12 8.5 10.43 8.5 8.5 10.07 5 12 5zm0 14.9c-2.84 0-5.3-.8-6.6-2.31.02-1.97 4.14-3.6 6.6-3.6 2.45 0 6.58 1.63 6.6 3.6-1.3 1.51-3.76 2.31-6.6 2.31z" />
    </svg>
);

const FaChevronRight = (props) => ( // Sidebar toggle icon
    <svg {...IconProps(props)} size={20}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
);
// --- End of Inline SVG Icon Definitions ---

// --- Mock Data (for Dashboard) ---
const departmentData = [
    { name: "Engineering", value: 85, color: "#3b82f6" },
    { name: "Marketing", value: 42, color: "#8b5cf6" },
    { name: "Sales", value: 38, color: "#10b981" },
    { name: "HR", value: 28, color: "#f59e0b" },
    { name: "Finance", value: 32, color: "#ef4444" },
    { name: "Others", value: 23, color: "#6b7280" },
];

const leaveRequests = [
    { id: 1, name: "Sarah Johnson", type: "Sick Leave", days: 2, status: "pending" },
    { id: 2, name: "Michael Chen", type: "Vacation", days: 6, status: "pending" },
    { id: 3, name: "Emily Davis", type: "Personal", days: 1, status: "pending" },
];

const recentActivities = [
    { id: 1, user: "James Wilson", action: "marked attendance", time: "2 mins ago" },
    { id: 2, user: "Lisa Anderson", action: "submitted leave request", time: "15 mins ago" },
    { id: 3, user: "David Martinez", action: "completed training", time: "1 hour ago" },
    { id: 4, user: "Jennifer Lee", action: "updated profile", time: "2 hours ago" },
];
// --- End of Mock Data ---

const ADashboard = () => {
    // We will use a local state to simulate the current page path.
    const [currentPage, setCurrentPage] = useState("/A_Dashboard"); 
    const [selectedStaffType, setSelectedStaffType] = useState(null); // Add this state for staff type
    
    // Updated navigate function to set the current page state
    const navigate = (path, staffType = null) => {
        console.log(`Navigating to: ${path}`, staffType ? `Staff Type: ${staffType}` : '');
        setCurrentPage(path);
        if (staffType) {
            setSelectedStaffType(staffType);
        }
    };

    const [hoveredButton, setHoveredButton] = useState(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const [dashboardData] = useState({
        totalEmployees: 248,
        presentToday: 232,
        onLeave: 12,
        pendingApprovals: 8
    });

    const SIDEBAR_WIDTH_EXPANDED_VAL = SIDEBAR_WIDTH_EXPANDED;
    const SIDEBAR_WIDTH_COLLAPSED_VAL = SIDEBAR_WIDTH_COLLAPSED;

    const toggleSidebar = useCallback(() => {
        setIsSidebarExpanded(prev => !prev);
    }, []);

    useEffect(() => {
        const fetchDashboardData = async () => {
            console.log("Fetching dashboard data...");
        };
        fetchDashboardData();
    }, []);

    // The handleNavigation now uses the updated local 'navigate' function.
    const handleNavigation = (path) => () => navigate(path);

    const handleQuickActions = () => {
        console.log("Quick Actions menu opened.");
    };
    
    // Data for the main info boxes (cards) - BRIGHTER, SHINIER GRADIENTS
    const infoBoxes = [
        { title: "Total Employees", value: dashboardData.totalEmployees, icon: FaUserFriends, gradient: "linear-gradient(135deg, #4c7cff 0%, #3a68e8 100%)", stat: "Active workforce", percent: "12%", trendIcon: FaTrendingUp, badgeBg: 'rgba(255, 255, 255, 0.25)' },
        { title: "Present Today", value: dashboardData.presentToday, icon: FaUserCheck, gradient: "linear-gradient(135deg, #18d363 0%, #0db853 100%)", stat: "Attendance rate", percent: "94%", trendIcon: null, badgeBg: 'rgba(255, 255, 255, 0.25)' },
        { title: "On Leave", value: dashboardData.onLeave, icon: FaUserX, gradient: "linear-gradient(135deg, #ffc73a 0%, #ffad1f 100%)", stat: "Today's absences", percent: "3%", trendIcon: FaTrendingDown, badgeBg: 'rgba(255, 255, 255, 0.25)' },
        { title: "Pending Approvals", value: dashboardData.pendingApprovals, icon: FaCalendar, gradient: "linear-gradient(135deg, #a766ff 0%, #8945f3 100%)", stat: "Requires action", percent: "Urgent", trendIcon: null, badgeBg: 'rgba(255, 255, 255, 0.25)' },
    ];

    // Helper function to dynamically apply button styles for collapsed/expanded state
    const getNavButtonStyle = (path, isExpanded) => {
        const isActive = currentPage === path; 
        const isHovered = hoveredButton === path;

        let style = { ...styles.navButton };

        if (isActive) {
            style = { ...style, ...styles.navButtonActive };
        }
        if (isHovered && !isActive) {
            style = { ...style, ...styles.navButtonHover };
        } else if (isHovered && isActive) {
            style = { ...style, backgroundColor: '#34455b' };
        }
        
        if (!isExpanded) {
            style = { ...style, justifyContent: 'center', padding: '12px 0', width: '100%', margin: '4px 0', };
            if (isActive) { style = { ...style, backgroundColor: '#34495e' }; }
        } else {
             style = { ...style, justifyContent: 'flex-start', paddingLeft: '10px' };
        }
        return style;
    };

    const dynamicSidebarStyle = useMemo(() => ({
        ...styles.sidebar,
        width: isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED_VAL : SIDEBAR_WIDTH_COLLAPSED_VAL,
        transition: 'width 0.3s ease-in-out',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        zIndex: 1000,
        overflowY: 'auto',
    }), [isSidebarExpanded]);

    const mainContentStyle = useMemo(() => ({
        ...styles.mainContentArea,
        marginLeft: isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED_VAL : SIDEBAR_WIDTH_COLLAPSED_VAL,
        width: `calc(100% - ${isSidebarExpanded ? SIDEBAR_WIDTH_EXPANDED_VAL : SIDEBAR_WIDTH_COLLAPSED_VAL}px)`,
        transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
    }), [isSidebarExpanded]);

    const getAvatarFallback = (name) => {
        const parts = name.split(" ");
        if (parts.length > 1) { return parts[0][0] + parts[1][0]; }
        return parts[0][0];
    };

    // Helper to determine the icon color based on the current page
    const getIconColor = (path) => {
        return currentPage === path ? 'white' : '#e6e6e6';
    };

    // --- RENDER FUNCTIONS ---

    const renderDashboardContent = () => (
        // Added the padding back here for the Dashboard view only
        <div style={styles.dashboardContent}> 
            {/* Dashboard Title & Date */}
            <div style={styles.dashboardHeader}>
                <h2 style={styles.pageTitle}>Dashboard</h2>
                <p style={styles.dateTextContext}>Saturday, October 25, 2025</p>
            </div>

            {/* Dashboard Cards (First Row) - Shine Effect Applied */}
            <div style={styles.cardGrid}>
                {infoBoxes.map((box, index) => (
                    <div 
                        key={index} 
                        style={{ ...styles.infoCard, background: box.gradient }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.4)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)'; }}
                    >
                        <div style={styles.cardHeader}>
                            <div style={styles.cardIconHeader}>
                                <box.icon size={24} color={'white'} />
                            </div>
                            <span 
                                style={{ ...styles.percentageBadge, backgroundColor: box.badgeBg, }}
                            >
                                {box.trendIcon && <box.trendIcon size={14} color={'white'} style={{ marginRight: '4px' }} />}
                                {box.percent}
                            </span>
                        </div>
                        <div style={styles.cardBody}>
                            <div style={styles.cardValue}>{box.value}</div> 
                            <div style={styles.cardTitle}>{box.title}</div>
                            <div style={styles.cardStat}>{box.stat}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Dynamic Content Sections (Two columns) - FIXED ALIGNMENT */}
            <div style={styles.contentSectionsRow}>
                
                {/* Left Section (66% Width) */}
                <div style={styles.leftContent}>
                    
                    {/* Attendance Trend (Top Left) */}
                    <div style={styles.sectionBlock}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Attendance Trend</h3>
                            <button style={styles.viewAllButton} onClick={() => console.log('View All Attendance')}>View All</button>
                        </div>
                        <p style={styles.sectionSubtitle}>Last 7 days overview</p>
                        <div style={{...styles.chartPlaceholder, minHeight: '300px'}}>
                            [Area Chart Placeholder: Last 7 days overview]
                        </div>
                    </div>
                    
                    {/* Pending Leave Requests (Bottom Left) - Ensure it expands to fit the remaining space if possible */}
                    <div style={styles.sectionBlock}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Pending Leave Requests</h3>
                            <button style={styles.approveViewAllButton} onClick={() => console.log('View All Requests')}>
                                View All 
                                <FaArrowUpRight size={16} color="white" style={{ marginLeft: '4px' }} />
                            </button>
                        </div>
                        <p style={styles.sectionSubtitle}>{leaveRequests.length} requests awaiting approval</p>
                        <div style={styles.listContainer}>
                            {leaveRequests.map((request) => (
                                <div key={request.id} style={styles.requestItem}>
                                    <div style={styles.requestInfo}>
                                        <div style={styles.avatarPlaceholder}>
                                            {getAvatarFallback(request.name)}
                                        </div>
                                        <div>
                                            <div style={styles.requestName}>{request.name}</div>
                                            <div style={styles.requestDetails}>{request.type} • {request.days} days</div>
                                        </div>
                                    </div>
                                    <div style={styles.requestActions}>
                                        <button style={styles.declineButton}>Decline</button>
                                        <button style={styles.approveButton}>Approve</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section (33% Width) */}
                <div style={styles.rightContent}>
                    
                    {/* Department Distribution (Top Right) */}
                    <div style={styles.sectionBlock}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Department Distribution</h3>
                            <button style={styles.detailsButton} onClick={() => console.log('Details')}>Details</button>
                        </div>
                        <p style={styles.sectionSubtitle}>Employee breakdown</p>
                        <div style={styles.pieChartWrapper}>
                            {/* Placeholder area for the chart - 45% width */}
                            <div style={{...styles.chartPlaceholder, height: '200px', width: '45%', minWidth: '45%'}}>
                                [Pie Chart Placeholder]
                            </div>
                            {/* Legend container filling remaining width - flex: 1 ensures it takes the rest */}
                            <div style={styles.legendContainer}>
                                {departmentData.map((dept) => (
                                    <div key={dept.name} style={styles.legendItem}>
                                        <div style={{...styles.legendColor, backgroundColor: dept.color}}></div>
                                        <span style={styles.legendName}>{dept.name}</span>
                                        <span style={styles.legendValue}>{dept.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity (Bottom Right) */}
                    <div style={styles.sectionBlock}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Recent Activity</h3>
                        </div>
                        <p style={styles.sectionSubtitle}>Latest updates</p>
                        <div style={styles.activityList}>
                            {recentActivities.map((activity) => (
                                <div key={activity.id} style={styles.activityItem}>
                                    <div style={styles.activityDot} />
                                    <div style={styles.activityText}>
                                        <p style={styles.activityMessage}>
                                            <span style={styles.activityUser}>{activity.user}</span>
                                            <span style={styles.activityAction}> {activity.action}</span>
                                        </p>
                                        <p style={styles.activityTime}>
                                            <FaClock size={12} color="#7f8c8d" style={{ marginRight: '4px' }} />
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button style={styles.viewAllActivityButton} onClick={() => console.log('View All Activity')}>View All Activity</button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.appContainer}>
            
            {/* Sidebar - Fixed Position */}
            <div style={dynamicSidebarStyle}>
                
                {/* Logo Area & Toggle Button */}
                <div style={styles.logoArea}>
                    <div style={styles.logoContainer}>
                        <FaUserCircle size={24} color={'#4285F4'} style={{ marginRight: isSidebarExpanded ? '8px' : '0', minWidth: '24px' }} />
                        {isSidebarExpanded && <h1 style={styles.logoText}>Admin Portal</h1>}
                    </div>
                    <button onClick={toggleSidebar} style={isSidebarExpanded ? styles.toggleButtonExpanded : styles.toggleButtonCollapsed} title={isSidebarExpanded ? "Collapse Menu" : "Expand Menu"}>
                        <FaChevronRight size={20} color="#ecf0f1" style={{ transform: isSidebarExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease-in-out'}} />
                    </button>
                </div>
                
                {/* Navigation Links */}
                <div style={styles.navGroup}>
                    {/* Dashboard Button */}
                    <button style={getNavButtonStyle("/A_Dashboard", isSidebarExpanded)} onClick={handleNavigation("/A_Dashboard")} onMouseEnter={() => setHoveredButton("/A_Dashboard")} onMouseLeave={() => setHoveredButton(null)} title={!isSidebarExpanded ? 'Dashboard' : ''}>
                        <FaChartLine size={20} color={getIconColor("/A_Dashboard")} style={styles.navIconInactive} /> 
                        {isSidebarExpanded && 'Dashboard'}
                    </button>
                    
                    {[
                        { path: "/EmployeeInfo", icon: FaUserFriends, label: "Employees" },
                        { path: "/Attendance", icon: FaClipboardList, label: "Attendance" },
                        { path: "/A_leavestatus", icon: FaClipboardList, label: "Leaves" },
                        { path: "/A_holidays", icon: FaBars, label: "Holidays" },
                        { path: "/Staffloggeed", icon: FaUsers, label: "Active Staff" },
                        { path: "/DepartmentMaster", icon: FaExternalLinkSquareAlt, label: "Events & Clubs" }, // CHANGED: Now navigates to DepartmentMaster
                        { path: "/Functions", icon: FaExternalLinkSquareAlt, label: "Functions" },
                    ].map(({ path, icon: Icon, label }) => (
                        <button key={path} style={getNavButtonStyle(path, isSidebarExpanded)} onClick={handleNavigation(path)} onMouseEnter={() => setHoveredButton(path)} onMouseLeave={() => setHoveredButton(null)} title={!isSidebarExpanded ? label : ''}>
                            <Icon size={20} color={getIconColor(path)} style={styles.navIconInactive} /> 
                            {isSidebarExpanded && label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area - Scrollable */}
            <div style={mainContentStyle}>
                
                {/* Top Header - Matches Screenshot */}
                <header style={styles.topHeader}>
                    {/* Search Bar Placeholder */}
                    <div style={styles.searchBarContainer}>
                        <FaSearch size={20} color="#7f8c8d" style={{ marginRight: '8px' }} />
                        <input type="text" placeholder="Search employees, attendance, leaves..." style={styles.searchInput} />
                    </div>
                    
                    {/* Header Info (Notifications, Admin & Quick Actions) */}
                    <div style={styles.headerInfo}>
                        
                        {/* MODIFICATION 1: Notification Icon placed immediately before Admin Profile */}
                        <div style={styles.notificationBell}><FaBell size={20} color="#7f8c8d" /></div>
                        
                        <div style={styles.adminProfile}>
                            <div style={styles.adminText}>
                                <p style={styles.adminName}>Admin User</p>
                                <p style={styles.adminRole}>Administrator</p>
                            </div>
                            <div style={styles.adminAvatar}>AD</div>
                        </div>

                        {/* Quick Actions Button (Remains) */}
                        <button style={styles.quickActionButton} onClick={handleQuickActions}>Quick Actions</button>
                    </div>
                </header>
                
                {/* Scrollable Main Content: Conditional Rendering */}
                <div style={{ overflowY: 'auto', height: 'calc(100vh - 80px)' }}>
                    {currentPage === "/EmployeeInfo" ? (
                        <EmployeeInfo handleNavigate={navigate} />
                    ) : currentPage === "/A_personalinfo" ? (
                        <A_personalinfo staffType={selectedStaffType} />
                    ) : currentPage === "/Attendance" ? (
                        <AttendanceTracker />
                    ) : currentPage === "/A_leavestatus" ? (
                        <A_leavestatus />
                    ) : currentPage === "/A_holidays" ? (
                        <A_holidays />
                    ) : currentPage === "/DepartmentMaster" ? ( // ADDED: Condition for DepartmentMaster
                        <DepartmentMaster />
                    ) : (
                        renderDashboardContent()
                    )}
                </div>
            </div>
        </div>
    );
};

export default ADashboard;