import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// --- Icons from Lucide/Figma Design ---
const ClockIcon = (props) => (
  <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const CheckIcon = (props) => (
  <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);
const XIcon = (props) => (
  <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>
);
const EyeIcon = (props) => (
    <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
const AlertCircleIcon = (props) => (
    <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);
const CheckCircleIcon = (props) => (
    <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);
const XCircleIcon = (props) => (
    <svg {...props} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6"></path><path d="m9 9 6 6"></path></svg>
);
// --- End Icons ---


// --- Data Transformation & Status Logic ---

const transformLeaveRequest = (request) => {
    const start = new Date(request.start_date);
    const end = new Date(request.end_date);
    const days = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    const appliedDate = new Date(request.applied_on || request.start_date);
    const statusText = request.status || "Pending";

    return {
        id: request.id,
        employeeName: request.name || "Unknown Employee",
        employeeId: request.employee_id || "N/A",
        leaveType: request.leave_type || "N/A",
        startDate: request.start_date,
        endDate: request.end_date,
        days: isNaN(days) ? 1 : Math.max(1, days), 
        reason: request.reason || "Not specified",
        status: statusText.charAt(0).toUpperCase() + statusText.slice(1).toLowerCase(),
        // Formatting appliedOn to match the uploaded pic: MM/DD/YYYY
        appliedOn: appliedDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        originalData: request 
    };
};

const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const statusText = status || "Pending";
    let icon = null;
    let className = "badge-pending";

    switch (statusLower) {
        case "pending":
            icon = <ClockIcon className="w-3 h-3 mr-1" />;
            className = "badge-pending";
            break;
        case "approved":
            icon = <CheckIcon className="w-3 h-3 mr-1" />;
            className = "badge-approved";
            break;
        case "rejected":
            icon = <XIcon className="w-3 h-3 mr-1" />;
            className = "badge-rejected";
            break;
        default:
            icon = <ClockIcon className="w-3 h-3 mr-1" />; 
            className = "badge-pending";
    }

    return (
        <span className={`status-badge ${className}`}>
            {icon}
            {statusText}
        </span>
    );
};

const getInitials = (name) => {
    const parts = name.split(" ").filter(p => p.length > 0);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}


const useLeaveData = () => {
    const [rawRequests, setRawRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            const mockLeaves = [
                { id: 1, employee_id: 'MCA2002', name: 'Pavitra H', leave_type: 'Casual Leave', start_date: '2025-06-12', end_date: '2025-06-12', reason: 'Personal work', status: 'Pending', applied_on: '2025-06-12' },
                { id: 2, employee_id: 'EMP002', name: 'Michael Chen', leave_type: 'Vacation', start_date: '2025-11-10', end_date: '2025-11-15', reason: 'Family vacation', status: 'Pending', applied_on: '2025-10-23' },
                { id: 3, employee_id: 'EMP003', name: 'Emily Davis', leave_type: 'Personal Leave', start_date: '2025-10-30', end_date: '2025-10-30', reason: 'Personal work', status: 'Pending', applied_on: '2025-10-25' },
                { id: 4, employee_id: 'EMP004', name: 'James Wilson', leave_type: 'Sick Leave', start_date: '2025-10-20', end_date: '2025-10-22', reason: 'Flu', status: 'Approved', applied_on: '2025-10-19' },
                { id: 5, employee_id: 'EMP005', name: 'Lisa Anderson', leave_type: 'Vacation', start_date: '2025-10-15', end_date: '2025-10-16', reason: 'Weekend getaway', status: 'Rejected', applied_on: '2025-10-14' },
                { id: 6, employee_id: 'EMP006', name: 'David Martinez', leave_type: 'Sick Leave', start_date: '2025-10-18', end_date: '2025-10-19', reason: 'Medical checkup', status: 'Approved', applied_on: '2025-10-17' },
            ];

            try {
                setLoading(true);
                const response = await fetch("http://localhost:5000/api/leave-requests", {
                    headers: { 'Accept': 'application/json' }
                });
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status}`);
                }
                
                const data = await response.json();
                setRawRequests(data.data || []);
                setError(null);
                
            } catch (err) {
                console.error("API Error:", err);
                setRawRequests(mockLeaves); 
                setError("Error fetching live data. Displaying mock data.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaveRequests();
    }, []);

    const transformedRequests = useMemo(() => rawRequests.map(transformLeaveRequest), [rawRequests]);

    const pendingLeaves = transformedRequests.filter((l) => l.status === "Pending");
    const approvedLeaves = transformedRequests.filter((l) => l.status === "Approved");
    const rejectedLeaves = transformedRequests.filter((l) => l.status === "Rejected");

    return { 
        transformedRequests, 
        pendingLeaves, 
        approvedLeaves, 
        rejectedLeaves, 
        loading, 
        error 
    };
};

// --- Sub-Components (Table, Actions) ---

const LeaveTable = ({ leaves, setSelectedLeave }) => (
    <div className="table-wrapper">
        <table className="leave-table">
            <thead>
                <tr className="table-header-row">
                    <th className="employee-column">Employee</th>
                    <th>Leave Type</th>
                    <th>Duration</th>
                    <th>Days</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {leaves.length === 0 ? (
                    <tr className="table-row">
                        <td colSpan={7} className="text-center no-data py-8">
                            No leave requests found
                        </td>
                    </tr>
                ) : (
                    leaves.map((leave) => (
                        <tr key={leave.id} className="table-row hover-bg">
                            <td className="table-cell employee-cell">
                                <div className="flex-center-y gap-3">
                                    <div className="avatar">
                                        <div className="avatar-fallback">
                                            {getInitials(leave.employeeName)}
                                        </div>
                                    </div>
                                    <div className="employee-info">
                                        <div className="text-primary-dark font-medium">{leave.employeeName}</div>
                                        <div className="text-xs text-secondary-text">{leave.employeeId}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="table-cell">
                                <span className="leave-type-badge">{leave.leaveType}</span>
                            </td>
                            <td className="table-cell duration-cell text-secondary-text">
                                <div className="text-sm">
                                    {new Date(leave.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    {" - "}
                                    {new Date(leave.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </div>
                            </td>
                            <td className="table-cell text-primary-dark font-medium days-column">{leave.days} days</td>
                            <td className="table-cell text-secondary-text applied-on-column">
                                {leave.appliedOn}
                            </td>
                            <td className="table-cell status-column">
                                {getStatusBadge(leave.status)}
                            </td>
                            <td className="table-cell text-right actions-column">
                                <div className="action-button-group">
                                    {/* View/Eye Button (always visible) */}
                                    <button
                                        className="action-button action-ghost"
                                        onClick={() => setSelectedLeave(leave)} // Open the mock dialog
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                    
                                    {leave.status === "Pending" && (
                                        <>
                                            {/* Approve Button */}
                                            <button
                                                className="action-button action-approve"
                                                onClick={() => console.log("Approved:", leave.id)}
                                            >
                                                <CheckIcon className="w-4 h-4" />
                                            </button>
                                            {/* Reject Button */}
                                            <button 
                                                className="action-button action-reject"
                                                onClick={() => console.log("Rejected:", leave.id)}
                                            >
                                                <XIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    </div>
);


// --- Main Component ---
const LeaveApplications = () => {
    const navigate = useNavigate();
    const { transformedRequests, pendingLeaves, approvedLeaves, rejectedLeaves, loading, error } = useLeaveData();
    const [activeTab, setActiveTab] = useState("pending");
    const [selectedLeave, setSelectedLeave] = useState(null); // State for mock dialog

    const handleBackClick = () => {
        navigate('/A_Dashboard');
    };

    const currentRequests = useMemo(() => {
        switch (activeTab) {
            case 'approved':
                return approvedLeaves;
            case 'rejected':
                return rejectedLeaves;
            case 'history':
                return transformedRequests;
            case 'pending':
            default:
                return pendingLeaves;
        }
    }, [activeTab, pendingLeaves, approvedLeaves, rejectedLeaves, transformedRequests]);

    // Use specific date from Figma screenshot
    const today = "Thursday, October 30, 2025"; 

    return (
        <>
            <style>
                {`
                :root {
                    /* Base Colors (Sourced from Figma CSS/Tailwind) */
                    --bg-page: #f9faff; /* Slightly softer background */
                    --bg-card: #ffffff;
                    --text-primary: #030213; /* Near Black */
                    --text-secondary: #717182; /* Muted Gray */
                    --border-color: rgba(0, 0, 0, 0.1);
                    --radius-lg: 10px; /* 0.625rem */
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);

                    /* Status Colors */
                    --color-pending-bg: #fffbf0; 
                    --color-pending-text: #b45309; 
                    --color-approved-bg: #f0fff4; 
                    --color-approved-text: #047857; 
                    --color-rejected-bg: #fff5f5; 
                    --color-rejected-text: #ef4444; 

                    /* Card-Specific Accent Colors (Figma Output) */
                    --card-pending-bg: #fffde6; /* Light Yellow/Orange Gradient Base */
                    --card-pending-accent: #f97316; /* Orange icon */
                    --card-approved-bg: #ecfdf5; /* Light Green Gradient Base */
                    --card-approved-accent: #10b981; /* Green icon */
                    --card-rejected-bg: #fef2f2; /* Light Red/Pink Gradient Base */
                    --card-rejected-accent: #d4183d; /* Red icon */
                    
                    /* Button Colors */
                    --btn-approve-bg: #10b981; 
                    --btn-approve-hover: #047857;
                    --btn-reject-bg: #ef4444; 
                    --btn-reject-hover: #dc2626;

                    /* Tabs specific colors */
                    --tabs-bg: #f3f4f6; /* Light gray from image */
                    --tabs-active-bg: #ffffff;
                }

                .page-container {
                    padding: 1.5rem;
                    background-color: var(--bg-page);
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                /* --- Header --- */
                .header-wrapper {
                    padding-bottom: 0.5rem;
                }
                .header-title {
                    font-size: 1.6rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                }
                .header-date {
                    font-size: 0.875rem;
                    color: var(--text-secondary);
                    margin-top: 0.25rem;
                }
                
                /* --- Stats Cards Grid --- */
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }
                @media (max-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }

                .card-base {
                    background-color: var(--bg-card); /* Base color for layered effects */
                    border-radius: var(--radius-lg);
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
                    padding: 1.5rem;
                    position: relative;
                    overflow: hidden;
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }
                /* Figma-specific Card Backgrounds */
                .card-pending { 
                    background: linear-gradient(135deg, var(--card-pending-bg) 0%, #fff8e1 100%);
                    border-left: 6px solid #fcd34d; /* Subtle yellow line */
                }
                .card-approved { 
                    background: linear-gradient(135deg, var(--card-approved-bg) 0%, #d1fae5 100%); 
                    border-left: 6px solid #6ee7b7; /* Subtle green line */
                }
                .card-rejected { 
                    background: linear-gradient(135deg, var(--card-rejected-bg) 0%, #fecaca 100%); 
                    border-left: 6px solid #fca5a5; /* Subtle red line */
                }


                .card-content {
                    position: relative;
                    z-index: 10;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .card-icon-wrapper {
                    width: 38px; /* Slightly larger icon wrapper */
                    height: 38px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    margin-bottom: 0.5rem;
                    background-color: var(--bg-card); /* White center */
                    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
                    /* Added accent ring color to match Figma design */
                    border: 1px solid currentColor; 
                }
                /* Icon colors */
                .card-pending .card-icon-wrapper { color: var(--card-pending-accent); }
                .card-approved .card-icon-wrapper { color: var(--card-approved-accent); }
                .card-rejected .card-icon-wrapper { color: var(--card-rejected-accent); }

                .card-icon { width: 22px; height: 22px; }
                
                .card-title {
                    font-size: 1rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    line-height: 1.2;
                }

                .card-value-row { 
                    display: flex; 
                    align-items: baseline; 
                    gap: 0.25rem; 
                }
                .main-count { 
                    font-size: 1.5rem; 
                    font-weight: 700; 
                    line-height: 1;
                    /* Bolder colors matching Figma */
                    color: var(--text-primary);
                }
                .card-pending .main-count { color: #9a3412; }
                .card-approved .main-count { color: #065f46; }
                .card-rejected .main-count { color: #b91c1c; }
                
                .secondary-text { 
                    color: var(--text-secondary); 
                    font-size: 0.75rem; 
                    font-weight: 500;
                }

                .card-sub-row { 
                    font-size: 0.8rem; 
                    padding-top: 0.5rem; 
                    border-top: 1px solid rgba(0, 0, 0, 0.05); 
                    font-weight: 500;
                }
                .card-pending .sub-info { color: #d97706; }
                .card-approved .sub-info { color: #10b981; }
                .card-rejected .sub-info { color: #ef4444; }


                /* Corner Labels (Urgent, Active, Closed) */
                .corner-label {
                    position: absolute;
                    top: 1.5rem; 
                    right: 1.5rem;
                    padding: 0.2rem 0.6rem;
                    border-radius: 9999px; /* Pill shape */
                    font-size: 0.7rem;
                    font-weight: 600;
                }
                .card-pending .corner-label { 
                    background-color: #fef3c7; 
                    color: #d97706; 
                }
                .card-approved .corner-label { 
                    background-color: #d1fae5; 
                    color: #059669; 
                }
                .card-rejected .corner-label { 
                    background-color: #fecaca; 
                    color: #dc2626; 
                }


                /* --- Tabs and Table Container --- */
                .table-card {
                    background-color: var(--bg-card);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow);
                }
                .tabs-list-wrapper {
                    /* --- MODIFIED FOR PILL BACKGROUND --- */
                    background-color: var(--tabs-bg); 
                    border-radius: var(--radius-lg);
                    padding: 0.5rem; /* Padding inside the gray box */
                    margin-bottom: 1.5rem; /* Space below the tab bar */
                    width: fit-content;
                    border-bottom: none;
                }
                .tabs-list {
                    display: flex;
                    gap: 0; /* Remove gap between buttons */
                }
                .tab-trigger {
                    padding: 0.5rem 1rem;
                    border: none;
                    background: transparent;
                    color: var(--text-secondary);
                    font-weight: 500;
                    cursor: pointer;
                    border-bottom: none; 
                    transition: all 0.15s ease;
                    display: flex;
                    align-items: center;
                    border-radius: var(--radius-lg); /* Rounded pills */
                    white-space: nowrap;
                    margin-right: 0;
                }
                .tab-trigger:hover:not(.active) {
                    color: var(--text-primary);
                }
                .tab-trigger.active {
                    color: var(--text-primary);
                    background-color: var(--tabs-active-bg); /* White background for active tab */
                    font-weight: 600;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }
                .tab-badge {
                    margin-left: 0.5rem;
                    padding: 0.1rem 0.5rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    background-color: #fef08a; 
                    color: #a16207; 
                    font-weight: 600;
                }


                /* --- Table Styling --- */
                .table-wrapper {
                    overflow-x: auto;
                    padding: 0 0 1.5rem 0;
                }
                .leave-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }
                .table-header-row {
                    background-color: var(--bg-card); /* White background for seamless look */
                    border-bottom: 1px solid var(--border-color);
                }
                .leave-table th {
                    text-align: left;
                    padding: 1rem 1.5rem 0.75rem 1.5rem; /* More vertical padding */
                    color: var(--text-secondary);
                    font-weight: 600;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    white-space: nowrap;
                }
                .leave-table td {
                    padding: 1rem 1.5rem; /* More vertical padding for row spacing */
                    border-bottom: 1px solid var(--border-color);
                    color: var(--text-primary);
                    vertical-align: middle;
                    white-space: nowrap;
                    font-weight: 500;
                }
                .table-row:last-child td {
                    border-bottom: none;
                }
                .hover-bg:hover {
                    background-color: #fcfcfc;
                }

                /* Specific Column Layouts */
                .employee-column { width: 25%; }
                .days-column { width: 8%; }
                .applied-on-column { width: 12%; }
                .actions-column { width: 10%; }


                /* Employee Cell Avatar/Details */
                .flex-center-y { display: flex; align-items: center; }
                .gap-3 { gap: 0.75rem; }

                .avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .avatar-fallback {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #ffffff;
                    background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .employee-info .text-primary-dark { color: var(--text-primary); font-weight: 600;}
                .employee-info .text-xs { font-size: 0.75rem; }

                /* Leave Type Badge */
                .leave-type-badge {
                    display: inline-block;
                    padding: 0.2rem 0.6rem;
                    border-radius: 9999px; /* Pill shape */
                    background-color: #e9ebef; /* Muted background */
                    color: var(--text-primary);
                    font-size: 0.7rem;
                    font-weight: 500;
                }

                /* Status Badges - Figma colors */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 0.2rem 0.6rem;
                    border-radius: 9999px; /* Pill shape */
                    font-size: 0.75rem;
                    font-weight: 600;
                    border: 1px solid transparent;
                }
                .status-badge svg { margin-right: 0.25rem; width: 0.75rem; height: 0.75rem; }

                .badge-pending { 
                    background-color: #fffde6; /* Light yellow from card bg */
                    color: #d97706; /* Darker orange/amber text */
                    border-color: #fde047; 
                }
                .badge-approved { 
                    background-color: #d1fae5; 
                    color: #059669; 
                    border-color: #a7f3d0; 
                }
                .badge-rejected { 
                    background-color: #fecaca; 
                    color: #dc2626; 
                    border-color: #fca5a5; 
                }

                /* Action Buttons (Figma Style) */
                /* Container for side-by-side buttons */
                .action-button-group {
                    display: flex;
                    align-items: center;
                    /* --- MODIFICATION: Added gap for spacing --- */
                    gap: 8px; 
                    padding: 0.25rem 0; 
                    border-radius: 6px; 
                }
                
                /* Base Action Button Style */
                .action-button {
                    width: 32px; 
                    height: 32px;
                    border-radius: 6px; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 0;
                    cursor: pointer;
                    border: none;
                    transition: all 0.15s ease;
                    flex-shrink: 0; 
                    box-shadow: none; 
                }
                .action-button svg { width: 1.1rem; height: 1.1rem; }

                /* Eye/View Button (Ghost/Outline) - Needs separate space */
                .action-ghost {
                    background: transparent;
                    color: var(--text-secondary);
                    border: none;
                    margin-right: 0; /* Removed margin-right to fix button spacing */
                    border-radius: 50%;
                }
                .action-ghost:hover {
                    background-color: var(--bg-page);
                    color: var(--text-primary);
                }

                /* Approve/Reject Button Group Wrapper */
                .approve-reject-group {
                    display: flex;
                    border-radius: 6px;
                    overflow: hidden; /* Ensures buttons stick together */
                }

                /* Approve Button (Solid Green) */
                .action-approve {
                    background-color: var(--btn-approve-bg);
                    color: white;
                    margin-right: 0; 
                    border-radius: 0; 
                    /* Set specific rounded corner on the left */
                    border-top-left-radius: 6px; 
                    border-bottom-left-radius: 6px;
                }
                .action-approve:hover {
                    background-color: var(--btn-approve-hover);
                }

                /* Reject Button (Solid Red) */
                .action-reject {
                    background-color: var(--btn-reject-bg);
                    color: white;
                    margin-left: 0; /* Important: remove gap with approve */
                    border-radius: 0;
                    /* Set specific rounded corner on the right */
                    border-top-right-radius: 6px; 
                    border-bottom-right-radius: 6px;
                }
                .action-reject:hover {
                    background-color: var(--btn-reject-hover);
                }
                `}
            </style>
            
            <div className="page-container">
                {/* Header */}
                <div className="header-wrapper">
                    <h1 className="header-title">Leaves</h1>
                    <p className="header-date">{today}</p>
                </div>
                
                {/* Status/Error Messages */}
                {loading && <p className="text-secondary" style={{ padding: '1rem 0' }}>Loading leave requests...</p>}
                {error && <p className="error-message" style={{ color: 'var(--card-rejected-accent)' }}>Error: {error}</p>}


                {/* --- Stats Cards Grid --- */}
                <div className="stats-grid">
                    
                    {/* 1. Pending Approvals Card */}
                    <div className="card-base card-pending">
                        <span className="corner-label">Urgent</span>
                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <AlertCircleIcon className="card-icon" />
                            </div>
                            <div className="card-title">Pending Approvals</div>
                            <div className="card-value-row">
                                <span className="main-count">{pendingLeaves.length}</span>
                                <span className="secondary-text">Requests</span>
                            </div>
                            <div className="card-sub-row sub-info">Requires action</div>
                        </div>
                    </div>

                    {/* 2. Approved This Month Card */}
                    <div className="card-base card-approved">
                        <span className="corner-label">Active</span>
                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <CheckCircleIcon className="card-icon" />
                            </div>
                            <div className="card-title">Approved This Month</div>
                            <div className="card-value-row">
                                <span className="main-count">{approvedLeaves.length}</span>
                                <span className="secondary-text">Leaves</span>
                            </div>
                            <div className="card-sub-row sub-info">Successfully processed</div>
                        </div>
                    </div>

                    {/* 3. Rejected Card */}
                    <div className="card-base card-rejected">
                        <span className="corner-label">Closed</span>
                        <div className="card-content">
                            <div className="card-icon-wrapper">
                                <XCircleIcon className="card-icon" />
                            </div>
                            <div className="card-title">Rejected</div>
                            <div className="card-value-row">
                                <span className="main-count">{rejectedLeaves.length}</span>
                                <span className="secondary-text">Requests</span>
                            </div>
                            <div className="card-sub-row sub-info">Declined requests</div>
                        </div>
                    </div>
                </div>

                {/* --- Tabs and Table --- */}
                <div className="table-card">
                    <div className="tabs-list-wrapper">
                        <div className="tabs-list">
                            
                            <button
                                className={`tab-trigger ${activeTab === 'pending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('pending')}
                            >
                                Pending
                                {pendingLeaves.length > 0 && <span className="tab-badge">{pendingLeaves.length}</span>}
                            </button>
                            
                            <button
                                className={`tab-trigger ${activeTab === 'approved' ? 'active' : ''}`}
                                onClick={() => setActiveTab('approved')}
                            >
                                Approved
                            </button>
                            
                            <button
                                className={`tab-trigger ${activeTab === 'rejected' ? 'active' : ''}`}
                                onClick={() => setActiveTab('rejected')}
                            >
                                Rejected
                            </button>
                            
                            <button
                                className={`tab-trigger ${activeTab === 'history' ? 'active' : ''}`}
                                onClick={() => setActiveTab('history')}
                            >
                                All History
                            </button>
                        </div>
                    </div>

                    {/* Table Content */}
                    <LeaveTable leaves={currentRequests} setSelectedLeave={setSelectedLeave} />
                </div>
                
                {/* Back button (styled separately to avoid interfering with Figma styles) */}
                
            </div>
            
            {/* Mock Dialog/Modal for Detail View (Simplified for display) */}
            {selectedLeave && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Leave Request Details</h3>
                        <p style={{ marginBottom: '0.5rem' }}>**Employee:** {selectedLeave.employeeName} ({selectedLeave.employeeId})</p>
                        <p style={{ marginBottom: '0.5rem' }}>**Leave Type:** {selectedLeave.leaveType}</p>
                        <p style={{ marginBottom: '0.5rem' }}>**Duration:** {new Date(selectedLeave.startDate).toLocaleDateString()} to {new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                        <p style={{ marginBottom: '0.5rem' }}>**Reason:** {selectedLeave.reason}</p>
                        <p style={{ marginBottom: '1rem' }}>**Status:** {getStatusBadge(selectedLeave.status)}</p>
                        
                        {selectedLeave.status === "Pending" && (
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="action-button action-approve" style={{ flexGrow: 1, height: '36px' }} onClick={() => { console.log("Approved mock:", selectedLeave.id); setSelectedLeave(null); }}>Approve</button>
                                <button className="action-button action-reject" style={{ flexGrow: 1, height: '36px' }} onClick={() => { console.log("Rejected mock:", selectedLeave.id); setSelectedLeave(null); }}>Reject</button>
                            </div>
                        )}
                        <button 
                            onClick={() => setSelectedLeave(null)} 
                            style={{ marginTop: '1rem', background: 'var(--bg-page)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.5rem 1rem', cursor: 'pointer' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LeaveApplications;