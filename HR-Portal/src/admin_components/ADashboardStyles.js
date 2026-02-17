// ADashboardStyles.js

// This file contains all the CSS-in-JS styles exported as an object.

export const SIDEBAR_WIDTH_EXPANDED = '230px';
export const SIDEBAR_WIDTH_COLLAPSED = '70px';

export const styles = {
    appContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f4f6f8',
        fontFamily: 'Inter, Arial, sans-serif',
        overflowX: 'hidden',
    },
    
    // --- Sidebar Styles (DARKER & SHINIER TEXT) ---
    sidebar: {
        backgroundColor: '#17202d', // Even darker navy
        padding: '20px 0',
        boxShadow: '2px 0 5px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
        color: '#ecf0f1',
        flexShrink: 0,
        justifyContent: 'flex-start', // Changed to flex-start to remove help section spacing
        minHeight: '100vh',
        zIndex: 1000,
        overflow: 'hidden',
    },
    logoArea: {
        padding: '0 10px 30px 10px',
        borderBottom: '1px solid #34495e',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '40px',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        // Increased contrast for logo text
        textShadow: '0 0 5px rgba(255,255,255,0.3)',
    },
    logoText: {
        fontSize: '20px',
        fontWeight: '700',
        margin: 0,
        textAlign: 'left',
        color: 'white',
        whiteSpace: 'nowrap',
    },
    toggleButtonExpanded: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        marginRight: '10px',
        transition: 'background-color 0.2s',
        borderRadius: '4px',
    },
    toggleButtonCollapsed: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        margin: '0 auto',
        transition: 'background-color 0.2s',
        borderRadius: '4px',
    },
    navGroup: {
        flexGrow: 1,
        padding: '0 5px',
        overflowY: 'auto',
    },
    navButton: {
        display: 'flex',
        alignItems: 'center',
        width: 'calc(100% - 8px)',
        padding: '12px 10px',
        margin: '4px 0',
        backgroundColor: 'transparent',
        border: 'none',
        color: '#e6e6e6', // Brighter default text color
        textAlign: 'left',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        transition: 'background-color 0.2s, color 0.2s',
        whiteSpace: 'nowrap',
    },
    navButtonHover: {
        backgroundColor: '#27344a', // Darker hover background
        color: 'white', // Bright text on hover
    },
    navButtonActive: {
        backgroundColor: '#27344a', // Active slightly darker background
        fontWeight: '600',
        color: 'white',
    },
    navIconActive: {
        marginRight: '10px',
        color: 'white',
        minWidth: '20px',
        filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.8))', // Added back icon shine
    },
    navIconInactive: {
        marginRight: '10px',
        color: '#e6e6e6',
        minWidth: '20px',
    },

    // --- Main Content Area & Header ---
    mainContentArea: {
        flexGrow: 1,
        minHeight: '100vh',
        position: 'relative',
    },
    topHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 30px',
        backgroundColor: '#fcfcfc', 
        boxShadow: '0 3px 5px rgba(0,0,0,0.08)', 
        position: 'sticky',
        top: 0,
        zIndex: 500,
        width: '100%',
        height: '60px',
        boxSizing: 'border-box', // Crucial to include padding/border in width
    },
    searchBarContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '8px 12px',
        flexGrow: 1,
        maxWidth: '400px',
        marginRight: '15px',
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        color: '#333',
        width: '100%',
    },
    headerInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexShrink: 0, 
    },
    notificationBell: {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
    },
    adminProfile: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexDirection: 'row-reverse',
    },
    adminText: {
        textAlign: 'right', 
        fontSize: '12px',
        lineHeight: 1.2,
        color: '#333',
    },
    adminName: {
        margin: 0,
        fontWeight: '600',
    },
    adminRole: {
        margin: 0,
        color: '#7f8c8d',
        fontSize: '12px',
    },
    adminAvatar: {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        backgroundImage: 'linear-gradient(45deg, #4285F4, #9B2CFF)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    exportButton: {
        backgroundColor: 'white',
        color: '#7f8c8d',
        padding: '8px 15px',
        borderRadius: '5px',
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'all 0.2s',
        height: '40px',
        flexShrink: 0, 
    },
    quickActionButton: {
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        flexShrink: 0, 
    },
    
    // --- Dashboard Content ---
    dashboardContent: {
        padding: '0 30px 30px 30px',
        paddingTop: '20px',
    },
    dashboardHeader: {
        marginBottom: '20px',
    },
    pageTitle: {
        fontSize: '28px',
        fontWeight: '700',
        margin: 0,
        color: '#2c3e50',
    },
    dateTextContext: {
        fontSize: '14px',
        color: '#7f8c8d',
        marginTop: '4px',
        marginBottom: 0,
    },

    // --- Info Card Grid ---
    cardGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
    },
    infoCard: {
        borderRadius: '10px',
        padding: '20px',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative',
        overflow: 'hidden',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    cardIconHeader: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    percentageBadge: {
        display: 'flex',
        alignItems: 'center',
        padding: '4px 8px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        opacity: 0.9,
    },
    cardBody: {
        marginTop: '5px',
    },
    cardValue: {
        fontSize: '32px',
        fontWeight: '700',
        lineHeight: 1.1,
        marginBottom: '5px',
        filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.3))',
    },
    cardTitle: {
        fontSize: '16px',
        fontWeight: '500',
        marginBottom: '5px',
        opacity: 0.9,
    },
    cardStat: {
        fontSize: '12px',
        opacity: 0.7,
    },

    // --- Content Sections Row (The key change for alignment) ---
    contentSectionsRow: {
        display: 'flex',
        gap: '20px',
        // Align all items to the top
        alignItems: 'flex-start', 
    },
    leftContent: {
        flex: 1, // Takes remaining space
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    rightContent: {
        flex: '0 0 380px', // Fixed width for the right column, similar to the screenshot
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    
    // --- Section Block Card Styling ---
    sectionBlock: {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle shadow like the image
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#2c3e50',
        margin: 0,
    },
    sectionSubtitle: {
        fontSize: '14px',
        color: '#7f8c8d',
        marginTop: '4px',
        marginBottom: '15px',
    },
    
    // --- Attendance Trend Chart (Left) ---
    chartPlaceholder: {
        backgroundColor: '#f0f4ff', // Light blue background for the chart
        border: '1px solid #d4e3ff',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3b82f6',
        fontSize: '14px',
        fontWeight: '500',
        position: 'relative', // for positioning graph elements
        overflow: 'hidden',
        minHeight: '260px', // Adjusted height to match screenshot proportions
    },
    viewAllButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#3b82f6',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0',
    },
    
    // --- Department Distribution (Right) ---
    pieChartWrapper: {
        display: 'flex',
        alignItems: 'flex-start', // Align chart and legend to the top
        gap: '20px',
        minHeight: '200px',
    },
    // Donut Chart Placeholder styles in ADashboard.js will use chartPlaceholder's minHeight, 
    // but we need to ensure the wrapper can accommodate a good-sized chart.
    
    legendContainer: {
        flex: 1, // Takes the rest of the space
        display: 'flex',
        flexDirection: 'column',
        gap: '12px', // Space between legend items
        paddingTop: '15px', // Optional: for alignment with the center of the chart
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#555',
    },
    legendColor: {
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        marginRight: '8px',
        flexShrink: 0,
    },
    legendName: {
        flex: 1, // Takes space between color and value
        display: 'flex',
        alignItems: 'center',
    },
    legendValue: {
        fontWeight: '600',
        color: '#2c3e50',
        flexShrink: 0,
        marginLeft: '10px',
    },
    detailsButton: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#7f8c8d',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '0',
    },

    // --- Pending Leave Requests (Bottom Left) ---
    approveViewAllButton: {
        backgroundColor: '#10b981',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        transition: 'background-color 0.2s',
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    requestItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #f0f0f0',
    },
    requestItemLast: {
        borderBottom: 'none', // For the last item
    },
    requestInfo: {
        display: 'flex',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#e6e6e6',
        color: '#7f8c8d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '10px',
        flexShrink: 0,
    },
    requestName: {
        fontWeight: '600',
        color: '#333',
        fontSize: '15px',
    },
    requestDetails: {
        color: '#7f8c8d',
        fontSize: '13px',
    },
    requestActions: {
        display: 'flex',
        gap: '8px',
        flexShrink: 0,
    },
    approveButton: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '6px 10px',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
    },
    declineButton: {
        backgroundColor: '#f4f6f8',
        color: '#555',
        padding: '6px 10px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '500',
    },
    
    // --- Recent Activity (Bottom Right) ---
    activityList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    activityItem: {
        display: 'flex',
        alignItems: 'flex-start',
        borderLeft: '2px solid #e0e0e0', // Timeline line
        paddingLeft: '15px',
        position: 'relative',
    },
    activityDot: {
        position: 'absolute',
        left: '-7px',
        top: '3px',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: '#3b82f6',
        border: '2px solid white',
        boxShadow: '0 0 0 2px #e0e0e0',
    },
    activityText: {
        flex: 1,
        lineHeight: 1.4,
    },
    activityMessage: {
        margin: 0,
        fontSize: '14px',
        color: '#333',
        fontWeight: '500',
    },
    activityUser: {
        fontWeight: '600',
        color: '#2c3e50',
    },
    activityAction: {
        color: '#555',
    },
    activityTime: {
        margin: '2px 0 0 0',
        fontSize: '11px',
        color: '#7f8c8d',
        display: 'flex',
        alignItems: 'center',
    },
    viewAllActivityButton: {
        width: '100%',
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f4f6f8',
        border: '1px solid #e0e0e0',
        borderRadius: '5px',
        color: '#555',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
};