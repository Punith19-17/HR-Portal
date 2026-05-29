import React, { useState, useMemo, useEffect } from 'react';
import { employeeInfoStyles as styles } from './EmployeeInfoStyles';

// --- SVG Icons (keep all your existing icon definitions) ---
const FaSearch = ({ size = 20, color = 'currentColor', style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

const FaFilter = ({ size = 20, color = 'currentColor', style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
);

const FaExport = ({ size = 16, color = 'currentColor', style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const FaPlus = ({ size = 16, color = 'currentColor', style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const FaMoreVertical = ({ size = 18, color = 'currentColor', style = {} }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
        <circle cx="12" cy="12" r="1"></circle>
        <circle cx="12" cy="5" r="1"></circle>
        <circle cx="12" cy="19" r="1"></circle>
    </svg>
);

// --- Helper Functions ---
const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
};

// --- UPDATED Department Colors for your actual data ---
const getDeptColor = (dept) => {
    if (!dept) return '#6b7280';
    
    const deptLower = dept.toLowerCase();
    
    switch (deptLower) {
        case 'mba': return '#8b5cf6';        // Purple
        case 'mca': return '#4c7cff';        // Blue
        case 'engineering': return '#8b5cf6'; // Purple
        case 'marketing': return '#4c7cff';   // Blue
        case 'hr': return '#ef4444';          // Red
        case 'finance': return '#10b981';     // Green
        case 'sales': return '#f59e0b';       // Orange
        case 'professor': return '#8b5cf6';   // Purple
        case 'hod': return '#ef4444';         // Red
        case 'teacher': return '#4c7cff';     // Blue
        default: 
            // Generate consistent color based on department name
            const colors = [
                '#8b5cf6', '#4c7cff', '#ef4444', '#10b981', '#f59e0b',
                '#8b5cf6', '#4c7cff', '#ef4444', '#10b981', '#f59e0b'
            ];
            const index = dept.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
            return colors[index];
    }
};

// --- Staff Selection Modal Component ---
const StaffTypeModal = ({ onClose, onSelectStaffType }) => {
    const handleButtonClick = (path, staffType) => {
        console.log(`Selected staff type: ${staffType}`);
        onSelectStaffType(path, staffType); 
        onClose(); 
    };

    return (
        <div style={styles.modalBackdrop} onClick={onClose}>
            <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button style={styles.modalCloseButton} onClick={onClose}>&times;</button>
                <h3 style={styles.modalTitle}>Select Staff Type</h3>
                <div style={styles.modalButtonContainer}>
                    <button 
                        style={{...styles.modalButton, ...styles.modalButtonTeaching}}
                        onClick={() => handleButtonClick('/A_personalinfo', 'TEACHING_STAFF')} 
                    >
                        TEACHING STAFF
                    </button>
                    <button 
                        style={{...styles.modalButton, ...styles.modalButtonNonTeaching}}
                        onClick={() => handleButtonClick('/A_personalinfo', 'NON_TEACHING_STAFF')} 
                    >
                        NON-TEACHING STAFF
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Action Menu Styles ---
const actionMenuStyles = {
    container: {
      position: 'absolute',
      top: '30px',
      right: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '6px 0',
      zIndex: 10,
      minWidth: '160px',
      border: '1px solid #eee',
    },
    item: {
      padding: '10px 16px',
      cursor: 'pointer',
      fontSize: '14px',
      color: '#333',
      display: 'block',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
      border: 'none',
      width: '100%',
      textAlign: 'left',
    },
    itemHover: {
      backgroundColor: '#f9f9f9',
    },
    itemRemove: {
      color: '#ef4444',
    }
};

// --- Action Menu Component ---
const ActionMenu = ({ employeeId, onAction }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
  
    const handleActionClick = (action) => {
      onAction(employeeId, action);
    };
  
    return (
      <div style={actionMenuStyles.container} onClick={(e) => e.stopPropagation()}>
        <button 
          style={{ 
            ...actionMenuStyles.item, 
            ...(hoveredItem === 'view' ? actionMenuStyles.itemHover : {}) 
          }}
          onMouseEnter={() => setHoveredItem('view')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleActionClick('view_details')}
        >
          View Details
        </button>
        <button 
          style={{ 
            ...actionMenuStyles.item, 
            ...(hoveredItem === 'edit' ? actionMenuStyles.itemHover : {}) 
          }}
          onMouseEnter={() => setHoveredItem('edit')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleActionClick('edit')}
        >
          Edit
        </button>
        <button 
          style={{ 
            ...actionMenuStyles.item, 
            ...(hoveredItem === 'send' ? actionMenuStyles.itemHover : {}) 
          }}
          onMouseEnter={() => setHoveredItem('send')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleActionClick('send_message')}
        >
          Send Message
        </button>
        <button 
          style={{ 
            ...actionMenuStyles.item, 
            ...actionMenuStyles.itemRemove,
            ...(hoveredItem === 'remove' ? actionMenuStyles.itemHover : {}) 
          }}
          onMouseEnter={() => setHoveredItem('remove')}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleActionClick('remove')}
        >
          Remove
        </button>
      </div>
    );
};

// --- EmployeeInfo Component (Fixed with proper colors) ---
const EmployeeInfo = ({ handleNavigate = (path, staffType) => console.log(`Navigating to: ${path} with staff type: ${staffType}`) }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showStaffTypeModal, setShowStaffTypeModal] = useState(false);
    const [isAddButtonHovered, setIsAddButtonHovered] = useState(false); 
    const [openActionMenu, setOpenActionMenu] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Try multiple possible API endpoints
                const apiUrls = [
                    '/api/employees',
                    'http://localhost:5000/api/employees',
                    `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/employees`
                ];

                let response;
                let lastError;

                for (const apiUrl of apiUrls) {
                    try {
                        console.log(`Trying API URL: ${apiUrl}`);
                        response = await fetch(apiUrl, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        
                        if (response.ok) {
                            const result = await response.json();
                            
                            if (result.success) {
                                const transformedEmployees = result.data.map(emp => ({
                                    id: emp.employee_id,
                                    name: emp.name,
                                    contact: emp.email_id,
                                    phone: emp.contact || 'N/A',
                                    department: emp.department,
                                    position: emp.position,
                                    joinDate: emp.join_date,
                                    status: emp.status,
                                    color: getDeptColor(emp.department)
                                }));
                                
                                setEmployees(transformedEmployees);
                                console.log('Successfully fetched employees from API');
                                return;
                            }
                        }
                    } catch (err) {
                        lastError = err;
                        console.log(`Failed to fetch from ${apiUrl}:`, err.message);
                        continue;
                    }
                }

                // If all API calls failed, use mock data with proper colors
                throw new Error(lastError || 'All API endpoints failed. Using mock data.');

            } catch (err) {
                console.error('Error fetching employees:', err);
                setError(err.message);
                // Use mock data as fallback with proper colors
                const mockEmployees = [
                    { id: 'MCA2004', name: 'Hanumantu', contact: 'Hanumthu@gmail.com', phone: '636346425', department: 'MBA', position: 'Professor', joinDate: '06/15/2022', status: 'Active', color: getDeptColor('MBA') },
                    { id: 'MCA2002', name: 'Pavitra H', contact: 'hpavita35@gmail.com', phone: '6363308088', department: 'MCA', position: 'Professor', joinDate: '06/18/2024', status: 'Active', color: getDeptColor('MCA') },
                    { id: 'MCA2003', name: 'Prajwal A', contact: 'prajwal31@gmail.com', phone: '8073680416', department: 'MBA', position: 'HOD', joinDate: '12/18/2024', status: 'Active', color: getDeptColor('MBA') },
                    { id: 'MCA2001', name: 'Punith A', contact: 'puntihaaa85@gmail.com', phone: '636346425', department: 'MCA', position: 'Professor', joinDate: '01/02/2024', status: 'Active', color: getDeptColor('MCA') },
                    { id: 'MCA23', name: 'Punith A', contact: 'puntihaaa85@gmail.com', phone: '636346425', department: 'mca', position: 'teacher', joinDate: '06/10/2025', status: 'Active', color: getDeptColor('mca') },
                ];
                setEmployees(mockEmployees);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const filteredEmployees = useMemo(() => {
        if (!searchTerm) return employees;
        const lowerCaseSearch = searchTerm.toLowerCase();

        return employees.filter(emp =>
            emp.name.toLowerCase().includes(lowerCaseSearch) ||
            (emp.id && emp.id.toLowerCase().includes(lowerCaseSearch)) ||
            emp.contact.toLowerCase().includes(lowerCaseSearch) ||
            (emp.department && emp.department.toLowerCase().includes(lowerCaseSearch)) ||
            (emp.position && emp.position.toLowerCase().includes(lowerCaseSearch))
        );
    }, [searchTerm, employees]);

    // Click outside to close menu
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenActionMenu(null);
        };

        if (openActionMenu) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openActionMenu]);

    const handleAction = (employeeId, action) => {
        console.log(`Action: ${action} on employee ${employeeId}`);
    };

    const handleSelectStaffType = (path, staffType) => {
        handleNavigate(path, staffType);
    };

    const handleAddEmployeeClick = () => {
        console.log("Action: Add Employee button clicked.");
        setShowStaffTypeModal(true);
    };

    const addButtonStyles = {
        ...styles.addButton,
        ...(isAddButtonHovered ? styles.addButtonHover : {})
    };

    return (
        <div style={styles.container}>
            {showStaffTypeModal && (
                <StaffTypeModal 
                    onClose={() => setShowStaffTypeModal(false)}
                    onSelectStaffType={handleSelectStaffType}
                />
            )}

            <div style={styles.controlsBar}>
                <div style={styles.searchContainer}>
                    <FaSearch size={20} color="#7f8c8d" style={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                    <button style={styles.filterButton} title="Filter">
                        <FaFilter size={18} color="#7f8c8d" />
                    </button>
                </div>

                <div style={styles.actionButtons}>
                    <button style={styles.exportButton}>
                        <FaExport size={16} color="#7f8c8d" style={{ marginRight: '8px' }} />
                        Export
                    </button>
                    <button 
                        style={addButtonStyles}
                        onClick={handleAddEmployeeClick}
                        onMouseEnter={() => setIsAddButtonHovered(true)}
                        onMouseLeave={() => setIsAddButtonHovered(false)}
                    >
                        <FaPlus size={16} color="white" style={{ marginRight: '8px' }} />
                        Add Employee
                    </button>
                </div>
            </div>

            <div style={styles.tableCard}>
                {loading && (
                    <div style={styles.noResults}>Loading employees...</div>
                )}

                {error && (
                    <div style={{ ...styles.noResults, color: '#ef4444' }}>
                        <div style={{ marginBottom: '8px' }}>Note: Using demo data</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>API Connection: {error}</div>
                    </div>
                )}

                {!loading && employees.length > 0 && (
                    <>
                        <div style={{ ...styles.tableRow, ...styles.tableHeader }}>
                            <div style={{ ...styles.tableCell, flex: 2 }}>Employee</div>
                            <div style={{ ...styles.tableCell, flex: 2 }}>Contact</div>
                            <div style={{ ...styles.tableCell, flex: 1 }}>Department</div>
                            <div style={{ ...styles.tableCell, flex: 1.5 }}>Position</div>
                            <div style={{ ...styles.tableCell, flex: 1 }}>Join Date</div>
                            <div style={{ ...styles.tableCell, flex: 1 }}>Status</div>
                            <div style={{ ...styles.tableCell, flex: 0.5, textAlign: 'center' }}>Actions</div>
                        </div>

                        {filteredEmployees.map((employee, index) => (
                            <div key={employee.id} style={{ ...styles.tableRow, ...(index === filteredEmployees.length - 1 ? styles.lastRow : {}) }}>
                                <div style={{ ...styles.tableCell, flex: 2, display: 'flex', alignItems: 'center' }}>
                                    <div style={{ ...styles.avatar, backgroundColor: employee.color }}>
                                        {getInitials(employee.name)}
                                    </div>
                                    <div>
                                        <div style={styles.employeeName}>{employee.name}</div>
                                        <div style={styles.employeeId}>{employee.id}</div>
                                    </div>
                                </div>
                                
                                <div style={{ ...styles.tableCell, flex: 2, display: 'flex', flexDirection: 'column' }}>
                                    <div style={styles.contactEmail}>{employee.contact}</div>
                                    <div style={styles.contactPhone}>{employee.phone}</div>
                                </div>
                                
                                <div style={{ ...styles.tableCell, flex: 1 }}>
                                    <span style={{ ...styles.deptBadge, backgroundColor: getDeptColor(employee.department), color: 'white' }}>
                                        {employee.department}
                                    </span>
                                </div>
                                
                                <div style={{ ...styles.tableCell, flex: 1.5, ...styles.textSmall }}>
                                    {employee.position}
                                </div>
                                
                                <div style={{ ...styles.tableCell, flex: 1, ...styles.textSmall }}>
                                    {employee.joinDate}
                                </div>
                                
                                <div style={{ ...styles.tableCell, flex: 1 }}>
                                    <span style={styles.statusBadge}>
                                        {employee.status}
                                    </span>
                                </div>
                                
                                <div style={{ 
                                    ...styles.tableCell, 
                                    flex: 0.5, 
                                    justifyContent: 'center', 
                                    position: 'relative', 
                                    overflow: 'visible'
                                }}>
                                    <button 
                                        style={styles.actionMenuButton} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenActionMenu(openActionMenu === employee.id ? null : employee.id);
                                        }}
                                        title="View Actions"
                                    >
                                        <FaMoreVertical color="#7f8c8d" size={18} />
                                    </button>

                                    {openActionMenu === employee.id && (
                                        <ActionMenu
                                            employeeId={employee.id}
                                            onAction={(id, action) => {
                                                handleAction(id, action);
                                                setOpenActionMenu(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredEmployees.length === 0 && employees.length > 0 && (
                            <div style={styles.noResults}>No employees match your search.</div>
                        )}
                    </>
                )}

                {!loading && employees.length === 0 && !error && (
                    <div style={styles.noResults}>No employees found.</div>
                )}
            </div>
        </div>
    );
};

export default EmployeeInfo;