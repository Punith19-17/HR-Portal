import React, { useState, useMemo } from 'react';
// Import all necessary icons, including new ones for the stat card design and trends
import { Calendar as CalendarIcon, Download, Plus, CheckCircle, Clock, XCircle, ChevronUp, ChevronDown } from 'lucide-react';

// --- SVG Icons for Buttons (Replaced with Lucide for consistency) ---
const CalendarIconSVG = () => <CalendarIcon size={16} />;
const DownloadIcon = () => <Download size={16} />;
const PlusIcon = () => <Plus size={16} />;
// --- End SVG Icons ---

// Hardcoded data to match the Figma calendar screenshot
const figmaCalendarData = {
    "1": { status: "A", type: "GEN", background: "data" },
    "2": { status: "H", type: "GEN", background: "holiday" },
    "3": { status: "A", type: "GEN", background: "data" },
    "4": { status: "H", type: "GEN", background: "holiday" },
    "6": { status: "A", type: "GEN", background: "data" },
    "7": { status: "A", type: "GEN", background: "data" },
    "8": { status: "A", type: "GEN", background: "data" },
    "9": { status: "A", type: "GEN", background: "data" },
    "10": { status: "A", type: "GEN", background: "data" },
    "11": { status: "H", type: "GEN", background: "holiday" },
    "13": { status: "A", type: "GEN", background: "data" },
    "14": { status: "A", type: "GEN", background: "data" },
    "15": { status: "A", type: "GEN", background: "data" },
    "16": { status: "A", type: "GEN", background: "data" },
    "17": { status: "A", type: "GEN", background: "data" },
    "18": { status: "H", type: "GEN", background: "holiday" },
    "20": { status: "H", type: "GEN", background: "holiday" },
    "21": { status: "A", type: "GEN", background: "data" },
    "22": { status: "A", type: "GEN", background: "data" },
    "23": { status: "A", type: "GEN", background: "data" },
    "24": { status: "A", type: "GEN", background: "data" },
    "25": { status: "H", type: "GEN", background: "holiday" },
    "27": { status: "A", type: "GEN", background: "data" },
    "28": { status: "A", type: "GEN", background: "data" },
};

// Data from the uploaded image
const recentAttendanceData = [
    { id: 'EMP001', name: 'Sarah Johnson', date: '10/25/2025', checkIn: '09:00 AM', checkOut: '06:00 PM', workingHours: '9.0 hrs', status: 'Present' },
    { id: 'EMP002', name: 'Michael Chen', date: '10/25/2025', checkIn: '09:15 AM', checkOut: '06:30 PM', workingHours: '9.25 hrs', status: 'Late' },
    { id: 'EMP003', name: 'Emily Davis', date: '10/25/2025', checkIn: '08:55 AM', checkOut: '05:55 PM', workingHours: '9.0 hrs', status: 'Present' },
    { id: 'EMP004', name: 'James Wilson', date: '10/25/2025', checkIn: '-', checkOut: '-', workingHours: '0 hrs', status: 'Absent' },
    { id: 'EMP005', name: 'Lisa Anderson', date: '10/25/2025', checkIn: '09:00 AM', checkOut: '01:00 PM', workingHours: '4.0 hrs', status: 'Half Day' },
    { id: 'EMP006', name: 'David Martinez', date: '10/25/2025', checkIn: '08:50 AM', checkOut: '06:10 PM', workingHours: '9.3 hrs', status: 'Present' },
];

// Hardcoded data for the stat cards from Figma
const figmaStats = {
    present: { count: 3, percent: "50%" },
    late: { count: 1, percent: "17%" },
    absent: { count: 1, percent: "17%" },
};

// Helper to map status string to a CSS class for the new table
const getStatusClass = (status) => {
    switch (status) {
        case 'Present':
            return 'status-present-badge';
        case 'Late':
            return 'status-late-badge';
        case 'Absent':
            return 'status-absent-badge';
        case 'Half Day':
            return 'status-halfday-badge';
        default:
            return 'status-default-badge';
    }
};


const AttendanceTracker = () => {
    // We hardcode the date to October 30, 2025, to match the Figma header
    const headerDate = new Date('2025-10-30T10:00:00');
    
    // State for the calendar navigation, defaulting to October 2025
    const [currentMonth, setCurrentMonth] = useState(9); // 9 = October
    const [currentYear, setCurrentYear] = useState(2025);

    // State for the date input in the action bar
    const [selectedDate, setSelectedDate] = useState('2025-10-29');
    
    const [showLegends, setShowLegends] = useState(true);
    
    // States for the employee table (data would come from your API)
    const [employees, setEmployees] = useState([]);
    const [attendance, setAttendance] = useState({});

    // Get current day string for header
    const getHeaderDateString = () => {
        return headerDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // --- Calendar Generation (Modified for Sunday Holiday 'H') ---
    const calendarWeeks = useMemo(() => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const prevLastDay = new Date(currentYear, currentMonth, 0);
        const firstDayOfWeek = firstDay.getDay(); // 0 = Sunday, 1 = Monday, ...
        
        const days = [];
        
        // Previous month's trailing days
        for (let i = firstDayOfWeek; i > 0; i--) {
            days.push({
                date: prevLastDay.getDate() - i + 1,
                month: -1, // Previous month
            });
        }
        
        // Current month's days
        const today = headerDate.getDate(); // 30
        const isTodayInView = headerDate.getMonth() === currentMonth && headerDate.getFullYear() === currentYear;
        
        for (let i = 1; i <= lastDay.getDate(); i++) {
            // Check for Sunday
            const date = new Date(currentYear, currentMonth, i);
            const dayOfWeek = date.getDay(); // 0 = Sunday

            let dayData = figmaCalendarData[i] || {};
            
            // Add 'H' for Sunday
            if (dayOfWeek === 0) { // Sunday
                dayData = { status: "H", type: "HOLIDAY", background: "holiday" };
            }
            
            days.push({
                date: i,
                month: 0, // Current month
                isToday: isTodayInView && i === today,
                ...dayData // Add status, type, and background
            });
        }
        
        // Next month's leading days
        const nextDays = (7 - (days.length % 7)) % 7;
        for (let i = 1; i <= nextDays; i++) {
            days.push({
                date: i,
                month: 1, // Next month
            });
        }
        
        // Group days into weeks
        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push({
                days: days.slice(i, i + 7)
            });
        }
        return weeks;
    }, [currentMonth, currentYear, headerDate]);
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const navigateMonth = (direction) => {
        let newMonth = currentMonth + direction;
        let newYear = currentYear;
        
        if (newMonth > 11) { newMonth = 0; newYear++; } 
        else if (newMonth < 0) { newMonth = 11; newYear--; }
        
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    // --- Placeholder Functions for Buttons ---
    const handleMarkAttendance = (e) => {
        e.preventDefault();
        console.log("Marking attendance for:", selectedDate);
    };
    
    const handleRecentRecordsExport = () => {
        console.log("Exporting Recent Attendance Records...");
        // Add your export logic for this specific table here
    };


    // --- Render ---
    return (
        <>
            <style>
                {`
                    /* ---
                      ATTENDANCE.CSS (INLINED) - UPDATED FOR UNIQUE STAT CARDS
                    --- */

                    /* --- Root Variables (Colors & Styles from Figma) --- */
                    :root {
                        --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        --page-bg: #f9faff;
                        --card-bg: #ffffff;
                        --border-color: #e5e7eb;
                        --text-primary: #111827; /* Black */
                        --text-secondary: #6b7280; /* Gray */
                        --text-tertiary: #9ca3af;
                        --radius-lg: 0.625rem;
                        --radius-md: 0.5rem;
                        --radius-sm: 0.375rem;
                        --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.05);

                        /* Primary Button Colors */
                        --primary-color: #6366f1;
                        --primary-color-hover: #4f46e5;
                        --primary-text: #ffffff;

                        /* Stat Card Colors from Figma */
                        --present-bg-light: #F3F8FF; /* Light blue/grey background base */
                        --present-badge: #3B82F6; /* Blue indicator color */
                        --present-text: #166534;
                        --trend-up: #10B981;
                        
                        --late-bg-light: #FFFBF5; /* Light yellow background base */
                        --late-badge: #F59E0B; /* Orange/Yellow indicator color */
                        --late-text: #854d0e;

                        --absent-bg-light: #FFF5F7; /* Light pink background base */
                        --absent-badge: #EC4899; /* Pink indicator color */
                        --absent-text: #991b1b;
                        --trend-down: #ef4444;

                        /* Colors for new table badges */
                        --halfday-bg: #eff6ff; /* Light blue */
                        --halfday-text: #2563eb; /* Blue */
                        
                        /* Calendar Colors from Figma */
                        --calendar-data-bg: #fffbeb; 
                        --calendar-holiday-bg: #eff6ff; 
                        --calendar-today-bg: #3b82f6; 
                        --calendar-status-absent: #ef4444; 
                        --calendar-status-holiday: #3b82f6;
                    }

                    /* --- Base Styles --- */
                    .attendance-tracker-body {
                        margin: 0;
                        background-color: var(--page-bg);
                        font-family: var(--font-family);
                        color: var(--text-primary);
                    }

                    .card {
                        background-color: var(--card-bg);
                        border-radius: var(--radius-lg);
                        border: 1px solid var(--border-color);
                        box-shadow: var(--shadow);
                        padding: 1.5rem;
                    }

                    /* --- Main Layout --- */
                    .attendance-management {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                        padding: 1.5rem;
                        max-width: 1400px;
                        margin: 0 auto;
                    }
                    
                    /* Grid layout for Table and Calendar */
                    .main-content-grid {
                        display: grid;
                        grid-template-columns: 1.2fr 0.8fr; 
                        gap: 1.5rem;
                        align-items: flex-start;
                    }
                    
                    @media (max-width: 1024px) {
                        .main-content-grid {
                            grid-template-columns: 1fr;
                        }
                    }

                    /* --- Stats Grid (3 Columns) --- */
                    .stats-grid {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 1.5rem;
                    }

                    /* === NEW UNIQUE STAT CARD DESIGN (Similar to Holiday Calendar) === */
                    .stat-card { 
                        background-color: var(--card-bg);
                        border-radius: var(--radius-lg);
                        border: 1px solid var(--border-color);
                        box-shadow: var(--shadow);
                        padding: 24px; 
                        position: relative; 
                        overflow: hidden;
                        transition: transform 0.2s, box-shadow 0.2s;
                        display: flex;
                        flex-direction: column;
                    }

                    .stat-card:hover {
                        box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
                        transform: translateY(-2px);
                    }
                    
                    /* Diagonal Background Shape (To mimic the image) */
                    .stat-card::before {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: var(--radius-lg);
                        clip-path: polygon(0 80%, 100% 50%, 100% 100%, 0% 100%); /* Diagonal shape at bottom */
                        opacity: 0.15;
                        z-index: 0;
                    }

                    /* Content containers */
                    .stat-content {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        position: relative;
                        z-index: 1;
                    }

                    .stat-label { 
                        margin: 0; 
                        font-size: 0.875rem; 
                        font-weight: 500; 
                        color: var(--text-secondary);
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    /* The main metric count */
                    .stat-value { 
                        font-size: 2.5rem; /* Large font size */
                        font-weight: 800; 
                        color: var(--text-primary);
                        margin: 8px 0 12px 0; 
                        line-height: 1.1;
                        position: relative;
                        z-index: 1;
                    }

                    .stat-trend { 
                        display: flex; 
                        align-items: center; 
                        gap: 0.25rem; 
                        font-size: 0.875rem; 
                        margin: 0;
                        font-weight: 600;
                        position: relative;
                        z-index: 1;
                    }
                    
                    /* Large Icon Container (Styled to match the image's "floating" look) */
                    .stat-icon-container {
                        padding: 12px;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white; 
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                        line-height: 1;
                        align-self: flex-start;
                        margin-left: 10px;
                    }
                    .stat-icon-container svg {
                        width: 24px;
                        height: 24px;
                    }


                    /* --- PRESENT CARD (Blue/Green) --- */
                    .stat-present::before { background-color: var(--present-badge); }
                    .stat-present .stat-label .dot { background-color: var(--present-badge); }
                    .stat-present .stat-icon-container { 
                        background: linear-gradient(135deg, #63b3ed, var(--present-badge));
                        box-shadow: 0 8px 15px -5px rgba(59, 130, 246, 0.6);
                    }
                    .stat-present .stat-trend { color: var(--trend-up); }
                    
                    /* --- LATE CARD (Orange/Yellow) --- */
                    .stat-late::before { background-color: var(--late-badge); }
                    .stat-late .stat-label .dot { background-color: var(--late-badge); }
                    .stat-late .stat-icon-container { 
                        background: linear-gradient(135deg, #fbbf24, var(--late-badge));
                        box-shadow: 0 8px 15px -5px rgba(245, 158, 11, 0.6);
                    }
                    .stat-late .stat-trend { color: var(--late-badge); }

                    /* --- ABSENT CARD (Pink/Red) --- */
                    .stat-absent::before { background-color: var(--absent-badge); }
                    .stat-absent .stat-label .dot { background-color: var(--absent-badge); }
                    .stat-absent .stat-icon-container { 
                        background: linear-gradient(135deg, #f9a8d4, var(--absent-badge));
                        box-shadow: 0 8px 15px -5px rgba(236, 72, 153, 0.6);
                    }
                    .stat-absent .stat-trend { color: var(--trend-down); }


                    /* --- Action Bar (Styles remain) --- */
                    .action-bar {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                    /* ... (Action bar styles unchanged) ... */
                    .action-controls-left, .action-controls-right { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; }
                    .date-input-wrapper { position: relative; }
                    .date-input { font-family: var(--font-family); font-size: 0.875rem; font-weight: 500; padding: 0.625rem 0.75rem; padding-right: 2.5rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background-color: #fff; min-height: 38px; box-sizing: border-box; }
                    .btn { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-family: var(--font-family); font-size: 0.875rem; font-weight: 600; padding: 0.625rem 1rem; border: 1px solid transparent; border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s ease; min-height: 38px; box-sizing: border-box; }
                    
                    /* Gradient for Mark Attendance Button */
                    .btn-primary {
                        background-image: linear-gradient(to right, #4f46e5, #a855f7); 
                        color: var(--primary-text);
                        border: none;
                    }
                    .btn-primary:hover:not(:disabled) {
                        background-image: linear-gradient(to right, #4338ca, #9333ea);
                        border: none;
                    }

                    .btn-outline { background-color: var(--card-bg); color: var(--text-primary); border-color: var(--border-color); box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
                    .btn-outline:hover:not(:disabled) { background-color: var(--page-bg); }
                    .btn-calendar { background-color: var(--card-bg); color: var(--text-secondary); border-color: var(--border-color); font-weight: 500; }
                    .btn-calendar:hover:not(:disabled) { background-color: var(--page-bg); color: var(--text-primary); }


                    /* --- Calendar Card (Styles remain) --- */
                    .calendar-card { padding: 1rem; padding-bottom: 0; padding-left: 0; padding-right: 0; }
                    .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; padding: 0 1rem; }
                    .calendar-title { margin: 0; font-size: 1.125rem; font-weight: 600; }
                    .calendar-nav-btn { background: none; border: none; color: var(--primary-color); font-weight: 500; font-size: 0.875rem; padding: 0.25rem 0.5rem; cursor: pointer; border-radius: var(--radius-sm); }
                    .calendar-nav-btn:hover { background-color: #f4f4f5; }

                    .calendar-grid-container { border-top: 1px solid var(--border-color); overflow: hidden; }
                    .calendar-week-header { display: grid; grid-template-columns: repeat(7, 1fr); background-color: var(--page-bg); }
                    .calendar-week-header .week-day { padding: 0.5rem 0.25rem; text-align: center; font-size: 0.8125rem; font-weight: 500; color: var(--text-secondary); }
                    .calendar-weeks-body { display: flex; flex-direction: column; }
                    .calendar-week-row { display: grid; grid-template-columns: repeat(7, 1fr); border-bottom: 1px solid var(--border-color); }
                    .calendar-week-row:last-child { border-bottom: none; }
                    .calendar-days-grid { display: contents; }
                    .calendar-day { min-height: 55px; padding: 0.25rem; border-right: 1px solid var(--border-color); font-size: 0.8125rem; color: var(--text-primary); position: relative; }
                    .calendar-day:nth-child(7) { border-right: none; }
                    .calendar-day.other-month { color: var(--text-tertiary); background-color: #fcfcfc; }
                    .calendar-day.other-month .day-number { color: var(--text-tertiary); }
                    .calendar-day.day-has-data { background-color: var(--calendar-data-bg); }
                    .calendar-day.day-is-holiday { background-color: var(--calendar-holiday-bg); }

                    .day-number { font-weight: 500; font-size: 0.8125rem; padding: 0.25rem; color: var(--text-secondary); display: inline-block; }
                    .day-number.today { background-color: var(--calendar-today-bg); color: var(--primary-text); border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: 600; margin: 0; }
                    .day-status { margin-top: 0.25rem; }
                    .status-dot { display: inline-block; font-weight: 700; font-size: 0.875rem; line-height: 1; }
                    .status-dot.status-A { color: var(--calendar-status-absent); }
                    .status-dot.status-H { color: var(--calendar-status-holiday); }
                    .day-type { font-size: 0.625rem; color: var(--text-tertiary); margin-left: 0.25rem; display: inline-block; }


                    /* --- Legends Card (Styles remain) --- */
                    .legends-card { padding-bottom: 0.5rem; }
                    .legends-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 1rem; }
                    .legends-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; }
                    .legends-toggle { background: none; border: none; font-size: 1rem; cursor: pointer; color: var(--text-secondary); }
                    .legends-content { margin-top: 0; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
                    .legend-subtitle { font-size: 0.875rem; font-weight: 600; color: var(--text-secondary); margin-top: 1.5rem; margin-bottom: 0.75rem; }
                    .legends-grid-figma { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
                    .legend-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--text-secondary); }
                    .legend-dot { display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; width: 20px; height: 20px; border-radius: 50%; color: #fff; }
                    .legend-dot.present { background-color: var(--present-badge); }
                    .legend-dot.absent { background-color: var(--absent-badge); }
                    .legend-dot.off { background-color: #9ca3af; }
                    .legend-dot.rest { background-color: #a78bfa; }
                    .legend-dot.leave { background-color: #c084fc; }
                    .legend-dot.duty { background-color: #2dd4bf; }
                    .legend-dot.holiday { background-color: var(--calendar-status-holiday); }
                    .day-type .legend-item span { font-size: 1.25rem; color: var(--text-secondary); width: 20px; text-align: center; display: flex; align-items: center; justify-content: center; }
                    .day-type .legend-item span svg { width: 18px; height: 18px; stroke-width: 1.5; }
                    .day-type-half { width: 14px; height: 14px; border-radius: 50%; background: linear-gradient(90deg, var(--text-primary) 50%, var(--border-color) 50%); }


                    /* --- Employee List Table (Styles remain) --- */
                    .employee-list-card { padding: 0; height: fit-content; background-color: var(--card-bg); }
                    .table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0; padding: 1rem 1rem 0.75rem; }
                    .table-header h3 { margin: 0; font-size: 1.125rem; font-weight: 600; color: var(--text-primary); }
                    .table-container { width: 100%; overflow-x: auto; border-top: 1px solid var(--border-color); }
                    .attendance-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
                    .attendance-table th, .attendance-table td { padding: 0.75rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); white-space: nowrap; }
                    .attendance-table th { background-color: var(--page-bg); color: var(--text-primary); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; }
                    .attendance-table tbody tr:last-child td { border-bottom: none; }
                    .attendance-table tbody tr:hover { background-color: #fcfcfc; }

                    /* Status Badges for new table */
                    .status-badge-container { display: inline-block; padding: 0.125rem 0.625rem; border-radius: 9999px; font-weight: 500; font-size: 0.8125rem; }
                    .status-present-badge { background-color: var(--present-bg); color: var(--present-text); }
                    .status-late-badge { background-color: var(--late-bg); color: var(--late-text); }
                    .status-absent-badge { background-color: var(--absent-bg); color: var(--absent-text); }
                    .status-halfday-badge { background-color: var(--halfday-bg); color: var(--halfday-text); }


                    /* --- Responsive Design (Styles remain) --- */
                    @media (max-width: 1200px) {
                        .stats-grid { grid-template-columns: 1fr; }
                    }
                    @media (max-width: 1024px) { 
                        .main-content-grid { grid-template-columns: 1fr; }
                    }
                    @media (max-width: 768px) {
                        .attendance-management { padding: 1rem; gap: 1rem; }
                        .action-bar, .action-controls-left, .action-controls-right { flex-direction: column; align-items: stretch; width: 100%; }
                        .calendar-card { padding: 0; }
                        .calendar-header { padding: 1rem; margin-bottom: 1rem; }
                        .calendar-week-header, .calendar-week-row { grid-template-columns: repeat(7, 1fr); }
                        .calendar-day { min-height: 50px; padding: 0.25rem; font-size: 0.75rem; }
                        .day-number { font-size: 0.75rem; }
                        .day-number.today { width: 24px; height: 24px; }
                        .day-status { margin-top: 0.25rem; }
                        .status-dot { font-size: 0.875rem; }
                        .day-type { font-size: 0.625rem; }
                        .legends-grid-figma { grid-template-columns: 1fr; }
                        .attendance-table th, .attendance-table td { padding: 0.75rem 1rem; }
                        .table-header { padding: 1rem 1rem 0; flex-direction: column; align-items: flex-start; gap: 0.5rem; }
                    }
                `}
            </style>
            
            <div className="attendance-management attendance-tracker-body">
                
                {/* Page Header */}
                <div className="attendance-header">
                    <h1>Attendance</h1>
                    <p>{getHeaderDateString()}</p>
                </div>

                {/* Stats Cards (3 columns) */}
                <div className="stats-grid">
                    {/* 1. Present Card (Blue/Green) */}
                    <div className="stat-card stat-present">
                        {/* Diagonal background provided by ::before CSS pseudo-element */}
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">
                                    <span className="dot" style={{width: '8px', height: '8px', borderRadius: '50%'}}></span>
                                    Present
                                </p>
                                <p className="stat-value">{figmaStats.present.count}</p>
                            </div>
                            {/* Icon container */}
                            <div className="stat-icon-container">
                                <CheckCircle />
                            </div>
                        </div>
                        <div className="stat-trend trend-up">
                            <ChevronUp size={16} />
                            {figmaStats.present.percent}
                        </div>
                    </div>

                    {/* 2. Late Card (Orange/Yellow) */}
                    <div className="stat-card stat-late">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">
                                    <span className="dot" style={{width: '8px', height: '8px', borderRadius: '50%'}}></span>
                                    Late
                                </p>
                                <p className="stat-value">{figmaStats.late.count}</p>
                            </div>
                            <div className="stat-icon-container">
                                <Clock />
                            </div>
                        </div>
                        <div className="stat-trend trend-neutral">
                            {figmaStats.late.percent}
                        </div>
                    </div>

                    {/* 3. Absent Card (Pink/Red) */}
                    <div className="stat-card stat-absent">
                        <div className="stat-content">
                            <div>
                                <p className="stat-label">
                                    <span className="dot" style={{width: '8px', height: '8px', borderRadius: '50%'}}></span>
                                    Absent
                                </p>
                                <p className="stat-value">{figmaStats.absent.count}</p>
                            </div>
                            <div className="stat-icon-container">
                                <XCircle />
                            </div>
                        </div>
                        <div className="stat-trend trend-down">
                            <ChevronDown size={16} />
                            {figmaStats.absent.percent}
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <form className="action-bar card" onSubmit={handleMarkAttendance}>
                    <div className="action-controls-left">
                        <div className="date-input-wrapper">
                            <input
                                type="date"
                                id="date-picker"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="date-input"
                                required
                            />
                        </div>
                        <button type="button" className="btn btn-calendar">
                            <CalendarIconSVG />
                            Attendance Calendar
                        </button>
                    </div>
                    
                    <div className="action-controls-right">
                        <button type="submit" className="btn btn-primary">
                            <PlusIcon />
                            Mark Attendance
                        </button>
                    </div>
                </form>

                {/* Main Content Grid (Swapped) */}
                <div className="main-content-grid">

                    {/* Column 1: Calendar View (Now on Left) */}
                    <div className="calendar-card card">
                        <div className="calendar-header">
                            <button
                                type="button"
                                onClick={() => navigateMonth(-1)}
                                className="calendar-nav-btn"
                            >
                                &lt; Prev
                            </button>
                            <h3 className="calendar-title">{monthNames[currentMonth]} {currentYear}</h3>
                            <button
                                type="button"
                                onClick={() => navigateMonth(1)}
                                className="calendar-nav-btn"
                            >
                                Next &gt;
                            </button>
                        </div>

                        <div className="calendar-grid-container">
                            {/* Days of Week Header */}
                            <div className="calendar-week-header">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                    <div key={day} className="week-day">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Weeks/Days */}
                            <div className="calendar-weeks-body">
                                {calendarWeeks.map((week, weekIndex) => (
                                    <div className="calendar-week-row" key={weekIndex}>
                                        <div className="calendar-days-grid">
                                            {week.days.map((day, dayIndex) => {
                                                const isCurrentMonth = day.month === 0;
                                                let dayClasses = "calendar-day";
                                                if (!isCurrentMonth) dayClasses += " other-month";
                                                if (day.background === 'data') dayClasses += " day-has-data";
                                                if (day.background === 'holiday') dayClasses += " day-is-holiday";

                                                return (
                                                    <div
                                                        key={dayIndex}
                                                        className={dayClasses}
                                                    >
                                                        <span className={`day-number ${day.isToday ? 'today' : ''}`}>
                                                            {day.date}
                                                        </span>
                                                        
                                                        {isCurrentMonth && day.status && (
                                                            <div className="day-status">
                                                                <span className={`status-dot status-${day.status}`}>{day.status}</span>
                                                                {/* Don't show "HOLIDAY" type for Sundays, "H" is enough */}
                                                                {day.type && day.type !== 'HOLIDAY' && (
                                                                    <span className="day-type">{day.type}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Recent Attendance Records (Now on Right) */}
                    <div className="employee-list-card card">
                        <div className="table-header">
                            <h3>Recent Attendance Records</h3>
                            <button type="button" onClick={handleRecentRecordsExport} className="btn btn-outline">
                                <DownloadIcon />
                                Export
                            </button>
                        </div>
                        <div className="table-container">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Employee ID</th>
                                        <th>Employee Name</th>
                                        <th>Date</th>
                                        <th>Check In</th>
                                        <th>Check Out</th>
                                        <th>Working Hours</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAttendanceData.map((emp) => (
                                        <tr key={emp.id}>
                                            <td>{emp.id}</td>
                                            <td>{emp.name}</td>
                                            <td>{emp.date}</td>
                                            <td>{emp.checkIn}</td>
                                            <td>{emp.checkOut}</td>
                                            <td>{emp.workingHours}</td>
                                            <td>
                                                <span className={`status-badge-container ${getStatusClass(emp.status)}`}>
                                                    {emp.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div> 
                {/* End Main Content Grid */}


                {/* Legends Section */}
                <div className="legends-card card">
                    <div className="legends-header" onClick={() => setShowLegends(!showLegends)}>
                        <h3>Legends</h3>
                        <button className="legends-toggle">
                            {showLegends ? '▲' : '▼'}
                        </button>
                    </div>

                    {showLegends && (
                        <div className="legends-content">
                            <div className="legends-grid-figma">
                                <div className="legend-item"><span className="legend-dot present">P</span> Present</div>
                                <div className="legend-item"><span className="legend-dot absent">A</span> Absent</div>
                                <div className="legend-item"><span className="legend-dot off">O</span> Off Day</div>
                                <div className="legend-item"><span className="legend-dot rest">R</span> Rest Day</div>
                                <div className="legend-item"><span className="legend-dot leave">L</span> Leave</div>
                                <div className="legend-item"><span className="legend-dot duty">OD</span> On Duty</div>
                                <div className="legend-item"><span className="legend-dot holiday">H</span> Holiday</div>
                            </div>
                            <h4 className="legend-subtitle">Day Type</h4>
                            <div className="legends-grid-figma day-type">
                                <div className="legend-item"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 18a5 5 0 0 0-10 0Z"/><path d="M12 2v10"/><path d="M4.2 10.2 3 12"/><path d="m21 12-1.2-1.8"/><path d="M12 18H3.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 4.4 0"/><path d="M20.5 13a2.5 2.5 0 0 1 0 5H12"/></svg></span> Rest Day</div>
                                <div className="legend-item"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></span> Off Day</div>
                                <div className="legend-item"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m16 4-2 2-2-2"/><path d="M12 11v11"/><path d="M18.8 15.2A5 5 0 0 0 12 13a5 5 0 0 0-6.8 2.2"/><path d="M20 10.3A5 5 0 0 0 12 8a5 5 0 0 0-8 2.3"/></svg></span> Holiday</div>
                                <div className="legend-item"><span className="day-type-half"></span> Half Day</div>
                                <div className="legend-item"><span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 4.5 15 2l2.5 2.5"/><path d="M15 2v14.5"/><path d="M10.1 5.1 5.3 10l-2.8 8.8c-.2.5 0 .8.6.8h17.8c.6 0 .8-.4.6-.8L18.7 10l-4.8-4.9"/><path d="m11.5 4.5-2.5 2.5 2.5 2.5"/></svg></span> Plant Shutdown</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* This original table will not render, as 'employees' is an empty array */
                }
                {employees.length > 0 && (
                    <div className="employee-list-card card">
                        <div className="table-header">
                            <h3>Attendance Records for {selectedDate}</h3>
                        </div>
                        <div className="table-container">
                            <table className="attendance-table">
                                {/* ... (original table structure) ... */}
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default AttendanceTracker;