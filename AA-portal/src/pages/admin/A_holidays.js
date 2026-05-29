import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, Plus, Edit, Trash2, List, Calendar as CalendarIcon, Search, Zap, GraduationCap, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Utility Functions for Dates ---
const formatShortDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const formatFullDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const formatDayName = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
const today = new Date("2025-11-05T00:00:00"); // Simulating today's date (November 5, 2025)
const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

// Color Mapping
const colorMap = {
    Public: "#3B82F6",    // Blue
    Institute: "#F59E0B", // Orange
    Festival: "#EC4899",  // Pink
    Regional: "#10B981",  // Green
};
const indicatorMap = {
    Public: "#E0F2FE", Regional: "#D1FAE5", Festival: "#FCE7F6", Institute: "#FEF3C7",
};

// --- START: StatCard Component Defined Separately (Final Figma Match) ---
const StatCard = ({ title, count, icon, indicatorColor, indicatorBgColor, footerText, footerBg, footerColor, iconBgColor, totalPublic, totalRegional }) => (
    <div className="stat-card" style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        padding: '24px',
    }}>
        {/* Large Background Shape */}
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: indicatorBgColor,
            borderRadius: '12px',
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0% 100%)',
            opacity: 0.1,
            zIndex: 0,
        }}></div>

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexGrow: 1, position: 'relative', zIndex: 1 }}>

            <div style={{ flex: 1 }}>
                {/* Indicator Dot and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: indicatorColor,
                    }}></div>
                    <p style={{
                        fontSize: '14px',
                        color: '#717182',
                        margin: 0,
                        fontWeight: '500'
                    }}>
                        {title}
                    </p>
                </div>

                {/* Main Count and Breakdown */}
                {title === "Total Holidays" ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '8px 0 12px 0' }}>
                        <p style={{
                            fontSize: '44px',
                            fontWeight: '800',
                            color: '#030213',
                            margin: 0,
                            lineHeight: '1.2'
                        }}>
                            {count}
                        </p>
                        {/* Badges for Total Holidays card */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', fontSize: '14px' }}>
                            {/* Public Badge */}
                            <span style={{
                                padding: '4px 8px',
                                fontSize: '12px',
                                fontWeight: '500',
                                borderRadius: '6px',
                                backgroundColor: '#E0F2FE',
                                color: '#0C4A6E',
                                border: `1px solid #0C4A6E30`
                            }}>
                                Public: <span style={{ fontWeight: '600' }}>{totalPublic}</span>
                            </span>
                            {/* Regional Badge */}
                            <span style={{
                                padding: '4px 8px',
                                fontSize: '12px',
                                fontWeight: '500',
                                borderRadius: '6px',
                                backgroundColor: '#D1FAE5',
                                color: '#065F46',
                                border: `1px solid #065F4630`
                            }}>
                                Regional: <span style={{ fontWeight: '600' }}>{totalRegional}</span>
                            </span>
                        </div>
                    </div>
                ) : (
                    <>
                        <p style={{
                            fontSize: '44px',
                            fontWeight: '800',
                            color: '#030213',
                            margin: '8px 0 12px 0',
                            lineHeight: '1.2'
                        }}>
                            {count}
                        </p>
                        {/* Default Footer Badges for Festivals and Institute cards */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                            {footerText.map((text, index) => (
                                <span key={index} style={{
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                    fontWeight: '500',
                                    borderRadius: '6px',
                                    backgroundColor: footerBg[index],
                                    color: footerColor[index],
                                    border: `1px solid ${footerColor[index]}30`
                                }}>
                                    {text}
                                </span>
                            ))}
                        </div>
                    </>
                )}

            </div>

            {/* Right-aligned icon */}
            <div style={{
                padding: '12px',
                background: iconBgColor,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 15px -5px ${indicatorColor}99`,
                alignSelf: 'flex-start',
                marginLeft: '10px',
                zIndex: 1,
            }}>
                {icon}
            </div>
        </div>
    </div>
);
// --- END: StatCard Component Defined Separately ---

// --- START: CalendarView Component ---
const CalendarView = ({ holidays, openEditDialog }) => {
    const [currentDate, setCurrentDate] = useState(new Date("2025-11-01T00:00:00")); // Start at November 2025

    // Function to handle month navigation
    const changeMonth = (delta) => {
        const newDate = new Date(currentDate.getTime());
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    // Helper function to check for the Nth occurrence of a day of the week (e.g., 2nd Saturday)
    const isNthDayOfWeek = useCallback((date, dayOfWeek, n) => {
        if (date.getDay() !== dayOfWeek) return false;
        const dayOfMonth = date.getDate();
        // Calculate which occurrence this day is (1st, 2nd, 3rd, 4th, 5th)
        const occurrence = Math.floor((dayOfMonth - 1) / 7) + 1;
        return occurrence === n;
    }, []);

    // Prepare holidays grouped by date for fast lookup
    const holidaysMap = useMemo(() => {
        const map = new Map();
        holidays.forEach(h => {
            if (!map.has(h.date)) {
                map.set(h.date, []);
            }
            map.get(h.date).push(h);
        });
        return map;
    }, [holidays]);

    // Calculate calendar grid days
    const calendarDays = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        // Get the day of the week (0=Sun, 6=Sat). We want to start the grid on Sunday.
        const startDayOfWeek = firstDayOfMonth.getDay(); 
        
        const days = [];
        
        // Days from previous month
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startDayOfWeek; i > 0; i--) {
            days.push({
                date: new Date(year, month - 1, prevMonthLastDay - i + 1),
                isCurrentMonth: false
            });
        }

        // Days of current month
        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }
        
        // Days from next month (fill up to 42 spots for 6 rows * 7 columns)
        let dayIndex = 1;
        while (days.length < 42) {
            days.push({
                date: new Date(year, month + 1, dayIndex),
                isCurrentMonth: false
            });
            dayIndex++;
        }

        return days;
    }, [currentDate]);


    // Determine the next 2 upcoming holidays from today
    const upcomingHolidays = useMemo(() => {
        const sorted = holidays.filter(h => new Date(h.date).getTime() >= today.getTime())
                               .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.slice(0, 2);
    }, [holidays]);


    // Component for a single holiday event item in the sidebar
    const HolidayCard = ({ holiday }) => (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '16px',
            position: 'relative',
        }}>
            {/* Colored vertical bar */}
            <div style={{ 
                width: '4px', 
                height: '100%', 
                backgroundColor: holiday.color,
                borderRadius: '2px',
                position: 'absolute',
                left: 0,
                top: 0
            }}></div>
            
            <div style={{ marginLeft: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#1f2937', 
                        margin: 0 
                    }}>
                        {holiday.name}
                    </h4>
                    <span style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                        color: holiday.color,
                        backgroundColor: indicatorMap[holiday.type],
                        border: `1px solid ${holiday.color}40`
                    }}>
                        {holiday.type}
                    </span>
                </div>
                <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 4px 0', fontWeight: '500' }}>
                    {formatFullDate(holiday.date)} - {holiday.day}
                </p>
                <p style={{ fontSize: '13px', color: '#717182', margin: 0 }}>
                    {holiday.description}
                </p>
            </div>
        </div>
    );


    // Component for the legend item
    const LegendItem = ({ type, color }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: color }}></div>
            <span style={{ fontSize: '14px', color: '#4b5563' }}>{type}</span>
        </div>
    );

    return (
        <div style={{ display: 'flex', gap: '24px' }}>
            {/* Left Column: Calendar Grid */}
            <div className="calendar-main-panel" style={{ 
                flex: '3', 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '24px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb'
            }}>
                {/* Header */}
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                    Calendar View
                </h3>
                <p style={{ fontSize: '14px', color: '#717182', margin: '0 0 24px 0' }}>
                    Visual representation of all holidays
                </p>

                {/* Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <button 
                        onClick={() => changeMonth(-1)} 
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ChevronLeft size={18} color="#4b5563" />
                    </button>

                    <h4 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                        {currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                    </h4>

                    <button 
                        onClick={() => changeMonth(1)} 
                        style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                        <ChevronRight size={18} color="#4b5563" />
                    </button>
                </div>

                {/* Day Labels */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#4b5563', marginBottom: '8px' }}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <div key={day} style={{ padding: '8px 0' }}>{day}</div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px' }}>
                    {calendarDays.map((day, index) => {
                        const dateString = day.date.toISOString().slice(0, 10);
                        const dayNumber = day.date.getDate();
                        const events = holidaysMap.get(dateString) || [];
                        const dayOfWeek = day.date.getDay(); // 0 = Sunday, 6 = Saturday
                        
                        // --- NEW HOLIDAY LOGIC: Determine Type and Color ---
                        let determinedType = null;
                        let determinedColor = null;

                        // 1. Check for existing explicitly set holidays (Highest Priority)
                        if (events.length > 0 && day.isCurrentMonth) {
                            determinedType = events[0].type;
                            determinedColor = events[0].color;
                        } 
                        
                        // 2. Apply automatic rules if no explicit holiday is set (Lower Priority)
                        if (!determinedType && day.isCurrentMonth) {
                            if (dayOfWeek === 0) { // Sunday (0) -> Public Holiday
                                determinedType = 'Public';
                                determinedColor = colorMap.Public;
                            } else if (dayOfWeek === 6) { // Saturday (6)
                                if (isNthDayOfWeek(day.date, 6, 2) || isNthDayOfWeek(day.date, 6, 4)) {
                                    // 2nd or 4th Saturday -> Institute Holiday
                                    determinedType = 'Institute';
                                    determinedColor = colorMap.Institute;
                                }
                            }
                        }
                        
                        const isToday = isSameDay(day.date, today); 
                        const isHoliday = !!determinedType;

                        // Styles based on conditions
                        let cellStyle = {
                            padding: '12px 0',
                            textAlign: 'center',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: day.isCurrentMonth ? '#1f2937' : '#9ca3af',
                            position: 'relative',
                            cursor: isHoliday ? 'pointer' : 'default',
                        };

                        let dayNumberStyle = {
                            display: 'inline-flex',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s',
                        };

                        // Apply marker styles
                        if (isHoliday && day.isCurrentMonth) {
                            // Default styling for holidays (solid color circle matching type)
                            dayNumberStyle = { 
                                ...dayNumberStyle,
                                backgroundColor: determinedColor, 
                                color: 'white',
                                fontWeight: '700',
                            };
                            
                            // Special case: If it's a holiday AND today (to match the hollow blue circle in the original screenshot example)
                            if (isToday) { 
                                dayNumberStyle = { 
                                    ...dayNumberStyle, 
                                    backgroundColor: 'white', 
                                    color: determinedColor, 
                                    border: `2px solid ${determinedColor}`,
                                    fontWeight: '700',
                                };
                            }
                            
                        } else if (isToday) {
                            // Default Today marker (if not a holiday)
                            dayNumberStyle = { 
                                ...dayNumberStyle,
                                border: '2px solid #3B82F6', 
                                color: '#3B82F6',
                                fontWeight: '700',
                            };
                        }
                        
                        const handleDayClick = () => {
                            if (isHoliday) {
                                // For demonstration, log the holiday details
                                console.log(`Holiday clicked: ${determinedType || events[0].type} on ${dateString}`);
                            }
                        };

                        return (
                            <div key={index} style={cellStyle} onClick={handleDayClick}>
                                <div style={dayNumberStyle}>
                                    {dayNumber}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                    <LegendItem type="Public" color={colorMap.Public} />
                    <LegendItem type="Institute" color={colorMap.Institute} />
                    <LegendItem type="Festival" color={colorMap.Festival} />
                    <LegendItem type="Regional" color={colorMap.Regional} />
                </div>
            </div>

            {/* Right Column: Upcoming Holidays Sidebar */}
            <div className="upcoming-holidays-sidebar" style={{ 
                flex: '2', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '20px' 
            }}>
                <div style={{
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    padding: '24px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                        Upcoming Holidays
                    </h3>
                    <p style={{ fontSize: '14px', color: '#717182', margin: '0 0 20px 0' }}>
                        Next {upcomingHolidays.length} holidays
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {upcomingHolidays.length > 0 ? (
                            upcomingHolidays.map(holiday => (
                                <HolidayCard key={holiday.id} holiday={holiday} />
                            ))
                        ) : (
                            <p style={{ color: '#9ca3af', fontSize: '14px', textAlign: 'center', padding: '16px 0' }}>
                                No upcoming holidays found.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- END: CalendarView Component ---


const HolidayCalendar = () => {
    // Mock data for holidays (Festival/Regional/Custom holidays are kept)
    const initialHolidays = [
        // Custom Public/Regional/Festival holidays that should override generic rules:
        { id: "H001", name: "New Year's Day", date: "2025-01-01", day: "Wednesday", type: "Public", description: "First day of the Gregorian calendar year", color: colorMap.Public },
        { id: "H002", name: "Republic Day", date: "2025-01-26", day: "Sunday", type: "Public", description: "Commemoration of the Constitution of India", color: colorMap.Public }, // Explicit holiday on a Sunday
        { id: "H004", name: "Holi", date: "2025-03-14", day: "Friday", type: "Festival", description: "Festival of Colors", color: colorMap.Festival },
        { id: "H005", name: "Good Friday", date: "2025-04-18", day: "Friday", type: "Regional", description: "Christian holiday commemorating the crucifixion of Jesus", color: colorMap.Regional },
        { id: "H006", name: "May Day", date: "2025-05-01", day: "Thursday", type: "Public", description: "International Workers' Day", color: colorMap.Public },
        { id: "H007", name: "Summer Break", date: "2025-05-20", day: "Tuesday", type: "Institute", description: "Start of Summer Academic Break", color: colorMap.Institute },
        { id: "H008", name: "Eid al-Fitr", date: "2025-06-05", day: "Thursday", type: "Regional", description: "End of Ramadan", color: colorMap.Regional },
        { id: "H009", name: "Independence Day", date: "2025-08-15", day: "Friday", type: "Public", description: "Commemoration of India's independence", color: colorMap.Public },
        { id: "H010", name: "Ganesh Chaturthi", date: "2025-09-05", day: "Friday", type: "Festival", description: "Birth of the elephant-headed God Ganesha", color: colorMap.Festival },
        { id: "H011", name: "Gandhi Jayanti", date: "2025-10-02", day: "Thursday", type: "Public", description: "Birth anniversary of Mahatma Gandhi", color: colorMap.Public },
        { id: "H012", name: "Institute Day", date: "2025-11-20", day: "Thursday", type: "Institute", description: "Institute Foundation Day", color: colorMap.Institute },
        // Custom events for November (matching the original screenshot context)
        { id: "H013", name: "Autumn Celebration", date: "2025-11-05", day: "Tuesday", type: "Festival", description: "Commencement of the Autumn festival period", color: colorMap.Festival }, // Today marker
        { id: "H014", name: "Staff Training Day", date: "2025-11-06", day: "Wednesday", type: "Institute", description: "Mandatory training for all faculty", color: colorMap.Institute },
        { id: "H015", name: "World Mother's Day", date: "2025-11-23", day: "Sunday", type: "Regional", description: "Honoring mothers and motherhood", color: colorMap.Regional }, // Explicit Regional holiday on a Sunday
        { id: "H016", name: "Christmas Day", date: "2025-12-25", day: "Thursday", type: "Public", description: "Christian holiday celebrating the birth of Jesus Christ", color: colorMap.Public },
    ];

    const [holidays, setHolidays] = useState(initialHolidays);
    const [viewMode, setViewMode] = useState("Calendar"); // Start in Calendar view
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingHoliday, setEditingHoliday] = useState(null);
    const [filterMonth, setFilterMonth] = useState("");
    const [filterYear, setFilterYear] = useState("2025");
    const [filteredHolidays, setFilteredHolidays] = useState(initialHolidays);
    const [isFiltered, setIsFiltered] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        date: "",
        type: "Public",
        description: "",
    });

    // Calculate dynamic counts for the Stat Cards
    const allHolidays = useMemo(() => {
        const generatedHolidays = {};
        const tempDate = new Date("2025-01-01");
        
        // Generate automatic holidays for the entire year 2025 for accurate counting
        while (tempDate.getFullYear() === 2025) {
            const dateString = tempDate.toISOString().slice(0, 10);
            const dayOfWeek = tempDate.getDay();
            let type = null;

            if (dayOfWeek === 0) { // Sunday
                type = 'Public';
            } else if (dayOfWeek === 6) { // Saturday
                const dayOfMonth = tempDate.getDate();
                const occurrence = Math.floor((dayOfMonth - 1) / 7) + 1;
                if (occurrence === 2 || occurrence === 4) {
                    type = 'Institute';
                }
            }
            
            if (type && !generatedHolidays[dateString]) {
                 // Check if a manual holiday already exists for this date
                if (!holidays.some(h => h.date === dateString)) {
                    generatedHolidays[dateString] = { type };
                }
            }
            tempDate.setDate(tempDate.getDate() + 1);
        }
        
        return [...holidays, ...Object.keys(generatedHolidays).map(date => ({
            id: 'A' + date,
            date: date,
            type: generatedHolidays[date].type,
            color: colorMap[generatedHolidays[date].type],
        }))];
    }, [holidays]);


    const totalHolidays = allHolidays.length;
    const publicHolidays = allHolidays.filter(h => h.type === 'Public').length;
    const instituteHolidays = allHolidays.filter(h => h.type === 'Institute').length;
    const festivalHolidays = allHolidays.filter(h => h.type === 'Festival').length;
    const regionalHolidays = allHolidays.filter(h => h.type === 'Regional').length;
    // --- END: Stat Card Calculation ---


    // --- START: Form and CRUD Functions (Kept for completeness) ---
    const resetForm = () => {
        setFormData({
            name: "", date: "", type: "Public", description: "",
        });
    };

    const closeDialog = () => {
        setIsAddDialogOpen(false);
        setEditingHoliday(null);
        resetForm();
    };

    const handleAddHoliday = () => {
        if (!formData.name || !formData.date) return;
        const date = new Date(formData.date + "T00:00:00");
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        
        const newHoliday = {
            id: `H${String(holidays.length + 1).padStart(3, "0")}`,
            name: formData.name, date: formData.date, day: dayName, type: formData.type,
            description: formData.description, color: colorMap[formData.type],
        };
        setHolidays([...holidays, newHoliday]);
        setIsAddDialogOpen(false);
        resetForm();
    };

    const handleEditHoliday = () => {
        if (!editingHoliday || !formData.name || !formData.date) return;
        const date = new Date(formData.date + "T00:00:00");
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });

        const updatedHoliday = {
            ...editingHoliday, name: formData.name, date: formData.date, day: dayName,
            type: formData.type, description: formData.description, color: colorMap[formData.type],
        };
        setHolidays(holidays.map((h) => (h.id === editingHoliday.id ? updatedHoliday : h)));
        setEditingHoliday(null);
        resetForm();
    };

    const handleDeleteHoliday = (id) => {
        console.log("Deleting holiday with ID:", id);
        setHolidays(holidays.filter((h) => h.id !== id));
        if (isFiltered) {
            setFilteredHolidays(filteredHolidays.filter((h) => h.id !== id));
        }
    };

    const openEditDialog = (holiday) => {
        setEditingHoliday(holiday);
        setFormData({
            name: holiday.name, date: holiday.date, type: holiday.type,
            description: holiday.description || "",
        });
        setIsAddDialogOpen(true); // Open the dialog for editing
    };


    const handleFilterHolidays = useCallback(() => {
        if (!filterMonth && !filterYear) {
            setFilteredHolidays(holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            setIsFiltered(false);
            return;
        }
        const filtered = holidays.filter((holiday) => {
            const holidayDate = new Date(holiday.date);
            const holidayMonth = holidayDate.getMonth() + 1;
            const holidayYear = holidayDate.getFullYear().toString();
            const monthMatch = !filterMonth || holidayMonth === parseInt(filterMonth);
            const yearMatch = !filterYear || holidayYear === filterYear;
            return monthMatch && yearMatch;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setFilteredHolidays(filtered);
        setIsFiltered(true);
    }, [holidays, filterMonth, filterYear]);

    const displayedHolidays = isFiltered ? filteredHolidays : holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const months = [
        { value: "1", label: "January" }, { value: "2", label: "February" }, { value: "3", label: "March" },
        { value: "4", label: "April" }, { value: "5", label: "May" }, { value: "6", label: "June" },
        { value: "7", label: "July" }, { value: "8", label: "August" }, { value: "9", label: "September" },
        { value: "10", label: "October" }, { value: "11", label: "November" }, { value: "12", label: "December" },
    ];
    const years = ["2024", "2025", "2026", "2027"];
    // --- END: Form and CRUD Functions ---

    return (
        <div className="holiday-calendar-container" style={{ 
            padding: '24px', 
            backgroundColor: '#f8f9fa', 
            minHeight: '100vh', 
            fontFamily: 'Inter, Arial, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            gap: '60px' // Adjusted gap for better spacing
        }}>

            {/* 1. Top Navigation and Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h1 style={{ 
                        fontSize: '18px', 
                        fontWeight: '600', 
                        color: '#1f2937', 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center' 
                    }}>
                        <span style={{ 
                            marginRight: '8px', 
                            color: '#6b7280', 
                            cursor: 'pointer', 
                            fontWeight: 'bold' 
                        }}>
                            &lt;
                        </span>
                        Holidays
                    </h1>
                </div>
                <p style={{ 
                    fontSize: '14px', 
                    color: '#717182', 
                    margin: 0 
                }}>
                    {formatDayName(today)}, {formatFullDate(today)}
                </p>
            </div>

            {/* 2. Statistics Cards */}
            <div className="stats-cards" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
            }}>

                {/* 1. Total Holidays Card (Blue) */}
                <StatCard
                    title="Total Holidays"
                    count={totalHolidays}
                    icon={<CalendarDays size={24} color="white" />}
                    indicatorColor="#3B82F6"
                    indicatorBgColor="#3B82F6"
                    totalPublic={publicHolidays}
                    totalRegional={regionalHolidays}
                    footerText={[]}
                    footerBg={[]}
                    footerColor={[]}
                    iconBgColor="linear-gradient(135deg, #5c97f2, #3B82F6)"
                />

                {/* 2. Festivals Card (Pink) */}
                <StatCard
                    title="Festivals"
                    count={festivalHolidays}
                    icon={<Sparkles size={24} color="white" />}
                    indicatorColor="#EC4899"
                    indicatorBgColor="#EC4899"
                    footerText={['Celebrations']}
                    footerBg={['#fbcfe8']}
                    footerColor={['#be185d']}
                    iconBgColor="linear-gradient(135deg, #ff80a5, #EC4899)"
                />

                {/* 3. Institute Card (Orange) */}
                <StatCard
                    title="Institute"
                    count={instituteHolidays}
                    icon={<GraduationCap size={24} color="white" />}
                    indicatorColor="#F59E0B"
                    indicatorBgColor="#F59E0B"
                    footerText={['Academic']}
                    footerBg={['#fef3c7']}
                    footerColor={['#d97706']}
                    iconBgColor="linear-gradient(135deg, #ffc977, #F59E0B)"
                />
            </div>

            {/* 3. Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Header Card with Title and Controls */}
                <div className="header-card" style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e5e7eb'
                }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px'
                    }}>
                        <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Calendar Icon */}
                            <div className="icon-container" style={{
                                padding: '12px',
                                background: 'linear-gradient(135deg, #8b5cf6, #3B82F6)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)'
                            }}>
                                <CalendarDays size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{ 
                                    color: '#1f2937', 
                                    fontSize: '20px', 
                                    fontWeight: '700', 
                                    margin: 0,
                                    letterSpacing: '-0.025em'
                                }}>
                                    Holiday Calendar 2025
                                </h2>
                                <p style={{ 
                                    color: '#717182', 
                                    fontSize: '14px', 
                                    margin: '4px 0 0 0',
                                    fontWeight: '400'
                                }}>
                                    Manage company holidays, festivals, and observances
                                </p>
                            </div>
                        </div>

                        {/* View Toggle and Add Button */}
                        <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {/* View Toggle (List/Calendar) */}
                            <div className="view-toggle" style={{
                                display: 'flex',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '8px',
                                padding: '4px',
                                border: '1px solid #e5e7eb'
                            }}>
                                {/* List Button */}
                                <button
                                    style={{
                                        padding: '8px 16px', 
                                        borderRadius: '6px', 
                                        border: 'none',
                                        backgroundColor: viewMode === 'List' ? '#030213' : 'transparent',
                                        color: viewMode === 'List' ? 'white' : '#6b7280',
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        fontSize: '14px', 
                                        fontWeight: '500', 
                                        transition: 'all 0.2s',
                                        minWidth: '80px',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setViewMode('List')}
                                >
                                    <List size={16} /> List
                                </button>
                                {/* Calendar Button */}
                                <button
                                    style={{
                                        padding: '8px 16px', 
                                        borderRadius: '6px', 
                                        border: 'none',
                                        backgroundColor: viewMode === 'Calendar' ? '#030213' : 'transparent',
                                        color: viewMode === 'Calendar' ? 'white' : '#6b7280',
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        fontSize: '14px', 
                                        fontWeight: '500', 
                                        transition: 'all 0.2s',
                                        minWidth: '80px',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setViewMode('Calendar')}
                                >
                                    <CalendarIcon size={16} /> Calendar
                                </button>
                            </div>
                            {/* Add Holiday Button (Purple Gradient) */}
                            <button
                                style={{
                                    padding: '10px 20px', 
                                    borderRadius: '8px', 
                                    border: 'none',
                                    background: 'linear-gradient(90deg, #8b5cf6, #3B82F6)',
                                    color: 'white', 
                                    cursor: 'pointer', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '8px',
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    boxShadow: '0 4px 10px rgba(139, 92, 246, 0.4)', 
                                    transition: 'all 0.2s',
                                    minWidth: '140px',
                                    justifyContent: 'center'
                                }}
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                <Plus size={16} /> Add Holiday
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Content Switcher */}
                {viewMode === 'List' ? (
                    /* List View Content */
                    <div className="list-view" style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '24px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                                <div>
                                    <h3 style={{
                                        color: '#1f2937', 
                                        fontSize: '18px', 
                                        fontWeight: '600', 
                                        margin: 0
                                    }}>All Holidays</h3>
                                    <p style={{
                                        color: '#717182', 
                                        fontSize: '14px', 
                                        margin: '4px 0 0 0'
                                    }}>
                                        Complete list of holidays for the year
                                    </p>
                                </div>

                                {/* Filter Controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                    <select
                                        value={filterMonth}
                                        onChange={(e) => setFilterMonth(e.target.value)}
                                        style={{
                                            width: '150px', 
                                            padding: '10px 12px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #d1d5db', 
                                            fontSize: '14px', 
                                            backgroundColor: '#f8f9fa', 
                                            color: filterMonth ? '#1f2937' : '#6b7280',
                                            appearance: 'none', 
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`, 
                                            backgroundRepeat: 'no-repeat', 
                                            backgroundPosition: 'right 0.75rem center', 
                                            backgroundSize: '1.5em 1.5em',
                                        }}
                                    >
                                        <option value="">Select Month</option>
                                        {months.map((month) => (
                                            <option key={month.value} value={month.value}>{month.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={filterYear}
                                        onChange={(e) => setFilterYear(e.target.value)}
                                        style={{
                                            width: '120px', 
                                            padding: '10px 12px', 
                                            borderRadius: '8px', 
                                            border: '1px solid #d1d5db', 
                                            fontSize: '14px', 
                                            backgroundColor: '#f8f9fa', 
                                            color: filterYear ? '#1f2937' : '#6b7280',
                                            appearance: 'none', 
                                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3e%3cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3c/svg%3e")`, 
                                            backgroundRepeat: 'no-repeat', 
                                            backgroundPosition: 'right 0.75rem center', 
                                            backgroundSize: '1.5em 1.5em',
                                        }}
                                    >
                                        <option value="">Select Year</option>
                                        {years.map((year) => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleFilterHolidays}
                                        disabled={!filterMonth && !filterYear}
                                        style={{
                                            padding: '10px 16px', 
                                            borderRadius: '8px', 
                                            border: 'none', 
                                            backgroundColor: '#3B82F6', 
                                            color: 'white', 
                                            cursor: 'pointer',
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            fontSize: '14px', 
                                            fontWeight: '500', 
                                            opacity: (!filterMonth && !filterYear) ? 0.6 : 1, 
                                            transition: 'opacity 0.2s, background-color 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = (!filterMonth && !filterYear) ? '#3B82F6' : '#2563eb'} 
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                                    >
                                        <Search size={16} /> Show
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Holidays Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563', width: '120px' }}>Date</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563', width: '120px' }}>Day</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Holiday Name</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563', width: '120px' }}>Type</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#4b5563' }}>Description</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#4b5563', width: '100px' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedHolidays.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: 'center', padding: '32px 16px', color: '#6b7280', fontSize: '16px' }}>
                                                No holidays found for the selected period
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedHolidays.map((holiday) => (
                                            <tr key={holiday.id} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background-color 0.1s' }}>
                                                <td style={{ padding: '16px 12px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: '4px', height: '40px', borderRadius: '2px', backgroundColor: holiday.color }}></div>
                                                        <div>
                                                            <div style={{ fontSize: '12px', color: '#717182', textTransform: 'uppercase', fontWeight: '500' }}>
                                                                {new Date(holiday.date).toLocaleDateString("en-US", { month: "short" })}
                                                            </div>
                                                            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                                                                {new Date(holiday.date).getDate()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px' }}>{holiday.day}</td>
                                                <td style={{ padding: '16px', color: '#1f2937', fontSize: '14px', fontWeight: '500' }}>{holiday.name}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '4px 10px', 
                                                        borderRadius: '16px', 
                                                        fontSize: '12px', 
                                                        fontWeight: '500', 
                                                        color: 'white', 
                                                        backgroundColor: holiday.color,
                                                    }}>
                                                        {holiday.type}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', maxWidth: '300px', color: '#717182', fontSize: '14px' }}>
                                                    {holiday.description || "No description"}
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                        <button onClick={() => openEditDialog(holiday)} title="Edit" style={{
                                                            padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.1s'
                                                        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                                            <Edit size={16} color="#4b5563" />
                                                        </button>
                                                        <button onClick={() => handleDeleteHoliday(holiday.id)} title="Delete" style={{
                                                            padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'background-color 0.1s'
                                                        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Calendar View Content */
                    <CalendarView holidays={holidays} openEditDialog={openEditDialog} />
                )}
            </div>

            {/* 5. Add/Edit Holiday Dialog */}
            {(isAddDialogOpen || editingHoliday) && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px', width: '450px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: '0 0 8px 0' }}>
                                {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
                            </h3>
                            <p style={{ color: '#717182', fontSize: '14px', margin: '0 0 24px 0' }}>
                                {editingHoliday ? 'Update holiday information.' : 'Add a new holiday to the calendar.'}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                                        Holiday Name <span style={{color: '#ef4444'}}>*</span>
                                    </label>
                                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Diwali, World Mothers Day" style={{
                                        width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#f3f3f5', boxSizing: 'border-box'
                                    }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                                        Date <span style={{color: '#ef4444'}}>*</span>
                                    </label>
                                    <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} style={{
                                        width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#f3f3f5', boxSizing: 'border-box'
                                    }} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                                        Holiday Type <span style={{color: '#ef4444'}}>*</span>
                                    </label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{
                                        width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#f3f3f5', boxSizing: 'border-box'
                                    }}>
                                        <option value="Public">Public Holiday</option>
                                        <option value="Institute">Institute Holiday</option>
                                        <option value="Festival">Festival</option>
                                        <option value="Regional">Regional Holiday</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1f2937', marginBottom: '8px' }}>
                                        Description
                                    </label>
                                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Brief description of the holiday" rows={3} style={{
                                        width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', backgroundColor: '#f3f3f5', resize: 'vertical', boxSizing: 'border-box'
                                    }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                                <button onClick={closeDialog} style={{
                                    padding: '10px 16px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white', color: '#1f2937', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background-color 0.1s'
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                                    Cancel
                                </button>
                                <button onClick={editingHoliday ? handleEditHoliday : handleAddHoliday} disabled={!formData.name || !formData.date} style={{
                                    padding: '10px 16px', borderRadius: '8px', border: 'none', backgroundColor: '#3B82F6', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'background-color 0.1s', opacity: (!formData.name || !formData.date) ? 0.6 : 1
                                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = (!formData.name || !formData.date) ? '#3B82F6' : '#2563eb'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}>
                                    {editingHoliday ? 'Save Changes' : 'Add Holiday'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                /* General button hover effects for Calendar View */
                .calendar-main-panel button:hover {
                    background-color: #f3f4f6 !important;
                }
            `}</style>
        </div>
    );
};

export default HolidayCalendar;