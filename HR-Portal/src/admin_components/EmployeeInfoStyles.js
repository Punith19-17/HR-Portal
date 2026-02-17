// EmployeeInfoStyles.js

export const employeeInfoStyles = {
    // --- Container ---
    container: {
        padding: '0px 30px 30px 30px', // Adjusted for the main content area
        minHeight: 'calc(100vh - 60px)',
        fontFamily: 'Inter, Arial, sans-serif',
        boxSizing: 'border-box',
    },
    
    // --- Controls Bar ---
    controlsBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingTop: '20px', 
    },
    searchContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '8px 15px',
        flexGrow: 1,
        maxWidth: '450px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    searchIcon: {
        marginRight: '8px',
        flexShrink: 0,
    },
    searchInput: {
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        fontSize: '15px',
        color: '#333',
        flexGrow: 1,
        padding: '0',
    },
    filterButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '10px',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    actionButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    exportButton: {
        backgroundColor: 'white',
        color: '#7f8c8d',
        padding: '10px 18px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    },
    
    // --- [UPDATED] Button Styles ---
    addButton: {
        // Current base style (Vibrant Purple/Blue Gradient)
        background: 'linear-gradient(90deg, #6c5ce7, #8e44ad)',
        color: 'white',
        padding: '10px 18px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        transition: 'background 0.2s, box-shadow 0.2s', // Add transition for smoother hover
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 10px rgba(108, 92, 231, 0.4)',
    },
    addButtonHover: {
        // Visually distinct feedback for hover/click action
        boxShadow: '0 6px 15px rgba(108, 92, 231, 0.6)',
        transform: 'translateY(-1px)',
        background: 'linear-gradient(90deg, #7b6be9, #9e55bc)', // Slightly lighter/shifted gradient on hover
    },

    // --- Table Card ---
    tableCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        // overflow: 'hidden', // <-- ***** FIX IS HERE (line removed) *****
        border: '1px solid #e0e0e0', 
    },
    tableRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 25px',
        borderBottom: '1px solid #f0f0f0',
    },
    lastRow: {
        borderBottom: 'none',
    },
    tableHeader: {
        backgroundColor: '#f8f9fa',
        fontWeight: '600',
        color: '#7f8c8d',
        fontSize: '14px',
        textTransform: 'uppercase',
        paddingTop: '15px',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0',
    },
    tableCell: {
        paddingRight: '15px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        overflow: 'hidden', // <-- This is OK, it applies to text *inside* the cell
        textOverflow: 'ellipsis',
    },

    // --- Employee Details ---
    avatar: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '12px',
        flexShrink: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    employeeName: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#2c3e50',
        lineHeight: 1.3,
    },
    employeeId: {
        fontSize: '13px',
        color: '#7f8c8d',
        lineHeight: 1.3,
    },

    // --- Contact Details ---
    contactEmail: {
        fontSize: '14px',
        color: '#3498db',
        lineHeight: 1.5,
    },
    contactPhone: {
        fontSize: '14px',
        color: '#7f8c8d',
        lineHeight: 1.5,
    },
    textSmall: {
        fontSize: '14px',
        color: '#64748b',
    },
    
    // --- Badges ---
    deptBadge: {
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 8px',
        borderRadius: '4px',
        textShadow: '0 1px 1px rgba(0,0,0,0.1)',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    },
    statusBadge: {
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 10px',
        borderRadius: '15px',
        backgroundColor: '#d1fae5',
        color: '#059669',
        display: 'inline-block',
        whiteSpace: 'nowrap',
    },
    
    // --- Actions ---
    actionMenuButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '5px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s',
    },
    
    // --- Empty State ---
    noResults: {
        textAlign: 'center',
        padding: '50px',
        fontSize: '16px',
        color: '#7f8c8d',
        backgroundColor: '#f9fafc',
    },

    // --- [UPDATED] Modal structure ---
    modalBackdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        maxWidth: '450px',
        width: '90%',
        textAlign: 'center',
        position: 'relative',
    },
    modalTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#2c3e50',
        marginBottom: '25px',
    },
    modalButtonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
    },
    modalButton: {
        flex: 1,
        padding: '15px 10px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        border: 'none',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textShadow: '0 1px 1px rgba(0,0,0,0.1)',
    },
    modalCloseButton: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'none',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        color: '#95a5a6',
    },

    // --- [NEW] MODAL Button Gradients ---
    modalButtonTeaching: {
        // Light Blue/Cyan Gradient
        background: 'linear-gradient(45deg, #42a5f5 0%, #00bcd4 100%)',
        color: 'white',
    },
    modalButtonNonTeaching: {
        // Light Orange/Red Gradient
        background: 'linear-gradient(45deg, #ff9800 0%, #ff5722 100%)',
        color: 'white',
    },
};