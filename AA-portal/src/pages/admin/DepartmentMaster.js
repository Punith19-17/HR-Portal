import React, { useState, useMemo, useCallback } from "react";
// Removed unnecessary imports for a single-file component

// Mock Today's date to match the screenshot context (Thursday, November 6, 2025)
const today = new Date("2025-11-06T00:00:00"); 

// --- Data Interfaces ---
const initialEvents = [
    {
        id: "EV001",
        name: "Annual Company Picnic",
        date: "2025-11-15",
        time: "10:00 AM - 4:00 PM",
        location: "Central Park",
        attendees: 180,
        type: "Social",
        description: "Join us for a fun-filled day with games, food, and team bonding activities.",
    },
    {
        id: "EV002",
        name: "Tech Talk: AI Innovations",
        date: "2025-11-02",
        time: "2:00 PM - 4:00 PM",
        location: "Conference Room A",
        attendees: 45,
        type: "Professional",
        description: "Explore the latest advancements in artificial intelligence.",
    },
    {
        id: "EV003",
        name: "Diwali Celebration",
        date: "2025-11-01",
        time: "6:00 PM - 9:00 PM",
        location: "Company Cafeteria",
        attendees: 200,
        type: "Cultural",
        description: "Celebrate the festival of lights with traditional performances.",
    },
    {
        id: "EV004",
        name: "Quarterly Town Hall",
        date: "2025-10-31",
        time: "11:00 AM - 12:30 PM",
        location: "Main Auditorium",
        attendees: 248,
        type: "Corporate",
        description: "Company-wide meeting to discuss quarterly results.",
    },
];

const initialClubs = [
    { id: "CL001", name: "Photography Club", description: "Explore photography skills and share creative work", members: 28, category: "Creative", meetingDay: "Every Friday" },
    { id: "CL002", name: "Sports Club", description: "Weekly sports activities and tournaments", members: 45, category: "Fitness", meetingDay: "Every Wednesday" },
    { id: "CL003", name: "Book Club", description: "Monthly book discussions and literary events", members: 32, category: "Literature", meetingDay: "First Monday" },
    { id: "CL004", name: "Coding Club", description: "Collaborative coding sessions and hackathons", members: 56, category: "Technology", meetingDay: "Every Thursday" },
];

// --- Custom Color/Style Mapping based on Figma CSS Variables ---
const colors = {
    primary: "#030213",
    mutedForeground: "#717182",
    background: "#ffffff", // Inner card background
    appBackground: "#f8f9fa", // Outer page background
    border: "rgba(0, 0, 0, 0.1)",
};

const eventColors = {
    Social:      { gradient: "linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)", light: "#FEF3C7", dark: "#F59E0B" },
    Professional: { gradient: "linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)", light: "#DBEAFE", dark: "#3B82F6" },
    Cultural:    { gradient: "linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)", light: "#FCE7F3", dark: "#EC4899" },
    Corporate:   { gradient: "linear-gradient(135deg, #86EFAC 0%, #10B981 100%)", light: "#D1FAE5", dark: "#10B981" },
};

const clubColors = {
    Creative:    { gradient: "linear-gradient(135deg, #FCA5A5 0%, #EF4444 100%)", light: "#FEE2E2", dark: "#EF4444" },
    Fitness:     { gradient: "linear-gradient(135deg, #86EFAC 0%, #10B981 100%)", light: "#D1FAE5", dark: "#10B981" },
    Literature:  { gradient: "linear-gradient(135deg, #93C5FD 0%, #3B82F6 100%)", light: "#DBEAFE", dark: "#3B82F6" },
    Technology:  { gradient: "linear-gradient(135deg, #C4B5FD 0%, #8B5CF6 100%)", light: "#EDE9FE", dark: "#8B5CF6" },
    Health:      { gradient: "linear-gradient(135deg, #FDBA74 0%, #F97316 100%)", light: "#FFEDD5", dark: "#F97316" },
};

// Utility function to format date
const formatEventDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00"); // Ensure date is treated as UTC day start
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// --- Icon SVG Definitions (Replacing Lucide Imports for portability) ---
const CalendarDaysIcon = ({ color = colors.primary }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>;
const ClockIcon = ({ color = colors.primary }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const MapPinIcon = ({ color = colors.primary }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const UsersIcon = ({ color = colors.primary }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const SearchIcon = ({ color = colors.mutedForeground }) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;


// --- EventCard Component ---
const EventCard = ({ event, onEdit, onDelete }) => {
    const typeColor = eventColors[event.type] || eventColors.Social;
    
    // Icon Item helper component (maintains dynamic color for card view)
    const IconItem = ({ Icon, text }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: colors.mutedForeground }}>
            <div style={{ padding: '0.375rem', borderRadius: '0.25rem', backgroundColor: typeColor.light }}>
                <Icon color={typeColor.dark} />
            </div>
            <span>{text}</span>
        </div>
    );
    
    // Use onEdit to trigger the dialog opening in View Mode
    const handleView = () => {
        onEdit(event, 'view');
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.625rem', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            transition: 'box-shadow 0.3s',
        }}>
            {/* Gradient Top Bar */}
            <div
                style={{ height: '8px', background: typeColor.gradient }}
            ></div>
            
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Title and Badge */}
                <div style={{ minHeight: '4rem' }}> 
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '500',
                            color: colors.primary, 
                            flex: '1',
                            paddingRight: '0.5rem',
                            margin: 0,
                        }}>
                            {event.name}
                        </h3>
                        {/* Type Badge */}
                        <span style={{
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px', 
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: typeColor.light,
                            color: typeColor.dark,
                            border: 'none',
                        }}>
                            {event.type}
                        </span>
                    </div>

                    {/* Description */}
                    <p style={{
                        fontSize: '0.875rem',
                        color: colors.mutedForeground,
                        minHeight: '2.5rem', 
                        margin: 0,
                    }}>
                        {event.description}
                    </p>
                </div>

                {/* Details Section */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    
                    {/* Explicit IconItem usage to maintain specific colors for card view */}
                    <IconItem Icon={() => <CalendarDaysIcon color={typeColor.dark} />} text={formatEventDate(event.date)} />
                    {event.time && <IconItem Icon={() => <ClockIcon color={typeColor.dark} />} text={event.time} />}
                    {event.location && <IconItem Icon={() => <MapPinIcon color={typeColor.dark} />} text={event.location} />}
                    <IconItem Icon={() => <UsersIcon color={typeColor.dark} />} text={`${event.attendees} attendees`} />
                </div>

                {/* Action Buttons (View, Edit, Delete) */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    {/* View Button */}
                    <button
                        // Simulate View button style
                        style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '500', color: colors.primary, transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = typeColor.light}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={handleView}
                    >
                        <EyeIcon style={{ marginRight: '0.25rem' }} />
                        View
                    </button>
                    {/* Edit Button */}
                    <button
                        // Simulate Edit button style
                        style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '500', color: colors.primary, transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = typeColor.light}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={() => onEdit(event, 'edit')} // Pass 'edit' mode explicitly
                    >
                        <EditIcon style={{ marginRight: '0.25rem' }} />
                        Edit
                    </button>
                    {/* Delete Button */}
                    <button
                        // Simulate Delete button style (Red hover/color)
                        style={{
                            padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', color: '#dc2626',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => onDelete(event.id, event.name)}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- ClubCard Component (Minimalist version of Event Card) ---
const ClubCard = ({ club, onEdit, onDelete }) => {
    const categoryColor = clubColors[club.category] || clubColors.Creative;
    
    const IconItem = ({ Icon, text }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: colors.mutedForeground }}>
            <div style={{ padding: '0.375rem', borderRadius: '0.25rem', backgroundColor: categoryColor.light }}>
                <Icon color={categoryColor.dark} />
            </div>
            <span>{text}</span>
        </div>
    );

    // Use onEdit to trigger the dialog opening in View Mode
    const handleView = () => {
        onEdit(club, 'view');
    };

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '0.625rem', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            transition: 'box-shadow 0.3s',
        }}>
            {/* Gradient Top Bar */}
            <div
                style={{ height: '8px', background: categoryColor.gradient }}
            ></div>
            
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Title and Badge */}
                <div style={{ minHeight: '4rem' }}> 
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: '500',
                            color: colors.primary, 
                            flex: '1',
                            paddingRight: '0.5rem',
                            margin: 0,
                        }}>
                            {club.name}
                        </h3>
                        {/* Category Badge */}
                        <span style={{
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px', 
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: categoryColor.light,
                            color: categoryColor.dark,
                            border: 'none',
                        }}>
                            {club.category}
                        </span>
                    </div>

                    {/* Description */}
                    <p style={{
                        fontSize: '0.875rem',
                        color: colors.mutedForeground,
                        minHeight: '2.5rem', 
                        margin: 0,
                    }}>
                        {club.description}
                    </p>
                </div>

                {/* Details Section */}
                <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    <IconItem Icon={() => <UsersIcon color={categoryColor.dark} />} text={`${club.members} members`} />
                    <IconItem Icon={() => <CalendarDaysIcon color={categoryColor.dark} />} text={club.meetingDay} />
                </div>

                {/* Action Buttons (View, Edit, and Delete) */}
                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                    {/* View Button */}
                    <button
                        // Simulate View button style
                        style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '500', color: colors.primary, transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = categoryColor.light}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={handleView}
                    >
                        <EyeIcon style={{ marginRight: '0.25rem' }} />
                        View
                    </button>
                    {/* Edit Button */}
                    <button
                        // Simulate Edit button style
                        style={{
                            flex: 1, padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb', backgroundColor: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '500', color: colors.primary, transition: 'all 0.15s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = categoryColor.light}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        onClick={() => onEdit(club, 'edit')} // Pass 'edit' mode explicitly
                    >
                        <EditIcon style={{ marginRight: '0.25rem' }} />
                        Edit
                    </button>
                    {/* Delete Button */}
                    <button
                        // Simulate Delete button style (Red hover/color)
                        style={{
                            padding: '0.5rem', borderRadius: '0.375rem', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s', color: '#dc2626',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => onDelete(club.id, club.name)}
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- Event View Panel (Read-Only Content for Dialog) ---
const EventViewPanel = ({ event, onStartEdit, onClose }) => {
    const typeColor = eventColors[event.type] || eventColors.Social;
    // NOTE: Icon color is explicitly set to colors.primary (black) to hide type color in view mode

    const ViewDetail = ({ label, value, Icon }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.mutedForeground, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {/* Icon color is black (primary) as requested */}
                <Icon color={colors.primary} /> {label}
            </span>
            <span style={{ fontSize: '1rem', color: colors.primary, marginLeft: '1.5rem' }}>{value}</span>
        </div>
    );

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.primary, margin: 0 }}>
                    {event.name}
                </h3>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: typeColor.light,
                    color: typeColor.dark,
                }}>
                    {event.type}
                </span>
            </div>

            <p style={{ color: colors.mutedForeground, fontSize: '0.9rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {event.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <ViewDetail label="Date" value={formatEventDate(event.date)} Icon={CalendarDaysIcon} />
                {event.time && <ViewDetail label="Time" value={event.time} Icon={ClockIcon} />}
                {event.location && <ViewDetail label="Location" value={event.location} Icon={MapPinIcon} />}
                <ViewDetail label="Attendees" value={`${event.attendees} people`} Icon={UsersIcon} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={onClose} style={{
                    padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white', color: colors.primary, cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.1s'
                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.appBackground} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    Close
                </button>
                <button type="button" onClick={onStartEdit} style={{
                    padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', background: typeColor.gradient, color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.1s'
                }}>
                    <EditIcon style={{ marginRight: '0.25rem' }} /> Start Editing
                </button>
            </div>
        </div>
    );
};


// --- Club View Panel (Read-Only Content for Dialog) ---
const ClubViewPanel = ({ club, onStartEdit, onClose }) => {
    const categoryColor = clubColors[club.category] || clubColors.Creative;
    
    // NOTE: Icon color is explicitly set to colors.primary (black) to hide type color in view mode
    const ViewDetail = ({ label, value, Icon }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem 0' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: colors.mutedForeground, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 {/* Icon color is black (primary) as requested */}
                <Icon color={colors.primary} /> {label}
            </span>
            <span style={{ fontSize: '1rem', color: colors.primary, marginLeft: '1.5rem' }}>{value}</span>
        </div>
    );

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: colors.primary, margin: 0 }}>
                    {club.name}
                </h3>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    backgroundColor: categoryColor.light,
                    color: categoryColor.dark,
                }}>
                    {club.category}
                </span>
            </div>

            <p style={{ color: colors.mutedForeground, fontSize: '0.9rem', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                {club.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem', padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <ViewDetail label="Members" value={`${club.members} people`} Icon={UsersIcon} />
                <ViewDetail label="Meeting Day" value={club.meetingDay} Icon={CalendarDaysIcon} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={onClose} style={{
                    padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white', color: colors.primary, cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.1s'
                }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.appBackground} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                    Close
                </button>
                <button type="button" onClick={onStartEdit} style={{
                    padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', background: categoryColor.gradient, color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.1s'
                }}>
                    <EditIcon style={{ marginRight: '0.25rem' }} /> Start Editing
                </button>
            </div>
        </div>
    );
};


// --- Add/Edit Event Dialog Component ---
const EventDialog = ({ isOpen, onClose, onSubmit, isEditing: initialIsEditing, initialData }) => {
    // Determine the initial mode: 'add', 'edit', or 'view'
    const [mode, setMode] = useState('add');
    const [formData, setFormData] = useState(initialData || { name: "", date: "", time: "", location: "", attendees: "", type: "Social", description: "" });
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        // Reset state when dialog opens/data changes
        setFormData(initialData || { name: "", date: "", time: "", location: "", attendees: "", type: "Social", description: "" });
        
        if (!isOpen) {
            // Reset mode on close
            setMode('add');
        } else if (initialData && initialData.name) {
            // If data exists (View/Edit action), use the initialIsEditing flag to determine start mode
            setMode(initialIsEditing ? 'edit' : 'view'); 
        } else {
            // If no data (Add action), start in edit mode (as 'add')
            setMode('add');
        }
    }, [initialData, isOpen, initialIsEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.date || !formData.type) return;

        setIsSaving(true);
        setTimeout(() => {
            // Pass true if mode is 'edit'
            onSubmit(formData, mode === 'edit');
            setIsSaving(false);
            onClose(); // <-- FIXED: Was handleCloseDialog
        }, 500);
    };

    if (!isOpen) return null;

    const eventTypes = ["Social", "Professional", "Cultural", "Corporate"];
    const isAddingMode = mode === 'add';
    const isViewingMode = mode === 'view';


    // --- RENDER LOGIC ---

    if (isViewingMode && initialData) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.625rem', width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <EventViewPanel 
                        event={initialData} 
                        onClose={onClose} 
                        onStartEdit={() => setMode('edit')}
                    />
                </div>
            </div>
        );
    }
    
    // Default to Add/Edit Form View
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.625rem', width: '550px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: colors.primary, margin: '0 0 0.5rem 0' }}>
                        {isAddingMode ? 'Add New Event' : 'Edit Event'}
                    </h3>
                    <p style={{ color: colors.mutedForeground, fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                        {isAddingMode ? 'Create a new company event.' : 'Update the event information.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Event Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Annual Picnic" required style={{
                                padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                            }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Date *</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required style={{
                                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                                }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Time</label>
                                <input type="text" name="time" value={formData.time} onChange={handleChange} placeholder="e.g., 10:00 AM - 4:00 PM" style={{
                                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g., Central Park" style={{
                                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                                }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Expected Attendees</label>
                                <input type="number" name="attendees" value={formData.attendees} onChange={handleChange} placeholder="e.g., 150" style={{
                                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                                }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Event Type *</label>
                            {/* Simple Select implementation */}
                            <select name="type" value={formData.type} onChange={e => handleSelectChange("type", e.target.value)} required style={{
                                padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                            }}>
                                {eventTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the event" rows={3} style={{
                                padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, resize: 'vertical', boxSizing: 'border-box', color: colors.primary
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white', color: colors.primary, cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.1s'
                        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.appBackground} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving || !formData.name || !formData.date || !formData.type} style={{
                            padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', background: colors.primary, color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.1s', opacity: (isSaving || !formData.name || !formData.date || !formData.type) ? 0.6 : 1
                        }}>
                            {isSaving ? (isAddingMode ? 'Adding...' : 'Saving...') : (isAddingMode ? 'Add Event' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Add/Edit Club Dialog Component (Using a simpler structure than the event dialog for brevity) ---
const ClubDialog = ({ isOpen, onClose, onSubmit, isEditing: initialIsEditing, initialData }) => {
    // Determine the initial mode: 'add', 'edit', or 'view'
    const [mode, setMode] = useState('add');
    const [formData, setFormData] = useState(initialData || { name: "", description: "", members: "", category: "Creative", meetingDay: "" });
    const [isSaving, setIsSaving] = useState(false);

    React.useEffect(() => {
        setFormData(initialData || { name: "", description: "", members: "", category: "Creative", meetingDay: "" });
        if (!isOpen) {
            setMode('add');
        } else if (initialData && initialData.name) {
            setMode(initialIsEditing ? 'edit' : 'view');
        } else {
            setMode('add');
        }
    }, [initialData, isOpen, initialIsEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.category) return;

        setIsSaving(true);
        setTimeout(() => {
            onSubmit(formData, mode === 'edit');
            setIsSaving(false);
            onClose(); // <-- FIXED: Was handleCloseDialog
        }, 500);
    };

    if (!isOpen) return null;
    const clubCategories = ["Creative", "Fitness", "Literature", "Technology", "Health"];
    const isAddingMode = mode === 'add';
    const isViewingMode = mode === 'view';

    // --- RENDER LOGIC ---

    if (isViewingMode && initialData) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ backgroundColor: 'white', borderRadius: '0.625rem', width: '550px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <ClubViewPanel 
                        club={initialData} 
                        onClose={onClose} 
                        onStartEdit={() => setMode('edit')}
                    />
                </div>
            </div>
        );
    }


    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '0.625rem', width: '450px', maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: colors.primary, margin: '0 0 0.5rem 0' }}>
                        {isAddingMode ? 'Add New Club' : 'Edit Club'}
                    </h3>
                    <p style={{ color: colors.mutedForeground, fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                        {isAddingMode ? 'Create a new employee club.' : 'Update the club information.'}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Club Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Book Club" required style={{
                                padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                            }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Category *</label>
                            <select name="category" value={formData.category} onChange={e => handleSelectChange("category", e.target.value)} required style={{
                                padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                            }}>
                                {clubCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Total Members</label>
                                <input type="number" name="members" value={formData.members} onChange={handleChange} placeholder="e.g., 30" style={{
                                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                                }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Meeting Day</label>
                                <input type="text" name="meetingDay" value={formData.meetingDay} onChange={handleChange} placeholder="e.g., Every Friday" style={{
                                    padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, boxSizing: 'border-box', color: colors.primary
                                }} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ fontSize: '0.875rem', fontWeight: '500', color: colors.primary }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Brief description of the club" rows={2} style={{
                                padding: '0.625rem 0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '1rem', backgroundColor: colors.appBackground, resize: 'vertical', boxSizing: 'border-box', color: colors.primary
                            }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0.625rem 1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', backgroundColor: 'white', color: colors.primary, cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'background-color 0.1s'
                        }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.appBackground} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving || !formData.name || !formData.category} style={{
                            padding: '0.625rem 1rem', borderRadius: '0.5rem', border: 'none', background: colors.primary, color: 'white', cursor: 'pointer', fontSize: '0.875rem', fontWeight: '500', transition: 'opacity 0.1s', opacity: (isSaving || !formData.name || !formData.category) ? 0.6 : 1
                        }}>
                            {isSaving ? (isAddingMode ? 'Adding...' : 'Saving...') : (isAddingMode ? 'Add Club' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


function EventsClubsPage() {
    const [events, setEvents] = useState(initialEvents);
    const [clubs, setClubs] = useState(initialClubs);
    const [activeTab, setActiveTab] = useState("events");
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null); // Stores Event or Club object being edited
    const [editMode, setEditMode] = useState('add'); // 'add', 'edit', or 'view'
    const [message, setMessage] = useState(null); // Success/Error message

    // --- CRUD Handlers ---

    const handleItemSubmit = (formData, isEditing) => {
        let newItem;
        let type;
        
        if (activeTab === 'events') {
            type = 'Event';
            newItem = {
                ...formData,
                id: isEditing ? editingItem.id : `EV${String(events.length + 1).padStart(3, "0")}`,
                attendees: parseInt(formData.attendees) || 0,
            };
            setEvents(prev => isEditing ? prev.map(e => (e.id === newItem.id ? newItem : e)) : [...prev, newItem]);
        } else { // Clubs
            type = 'Club';
            newItem = {
                ...formData,
                id: isEditing ? editingItem.id : `CL${String(clubs.length + 1).padStart(3, "0")}`,
                members: parseInt(formData.members) || 0,
            };
            setClubs(prev => isEditing ? prev.map(c => (c.id === newItem.id ? newItem : c)) : [...prev, newItem]);
        }

        setMessage({ type: 'success', text: `${type} "${newItem.name}" ${isEditing ? 'updated' : 'added'} successfully!` });
        setEditingItem(null);
    };

    const handleItemDelete = (id, name) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

        if (activeTab === 'events') {
            setEvents(prev => prev.filter(e => e.id !== id));
            setMessage({ type: 'error', text: `Event "${name}" deleted.` });
        } else {
            setClubs(prev => prev.filter(c => c.id !== id));
            setMessage({ type: 'error', text: `Club "${name}" deleted.` });
        }
    };

    const handleOpenDialog = (item = null, mode = 'add') => {
        setEditingItem(item);
        setEditMode(mode); // Set the mode: 'add', 'edit', or 'view'
        setMessage(null);
        setIsDialogOpen(true);
    };
    
    const handleCloseDialog = () => {
        setEditingItem(null);
        setEditMode('add'); // Reset mode on close
        setIsDialogOpen(false);
    };

    // --- Filtering Logic ---
    const filteredEvents = useMemo(() => {
        if (!searchQuery) return events;
        const query = searchQuery.toLowerCase();
        return events.filter(
            (event) =>
                event.name.toLowerCase().includes(query) ||
                event.type.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query)
        ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [events, searchQuery]);

    const filteredClubs = useMemo(() => {
        if (!searchQuery) return clubs;
        const query = searchQuery.toLowerCase();
        return clubs.filter(
            (club) =>
                club.name.toLowerCase().includes(query) ||
                club.category.toLowerCase().includes(query)
        );
    }, [clubs, searchQuery]);

    // Determine which list to show
    const displayedItems = activeTab === "events" ? filteredEvents : filteredClubs;
    
    // Determine placeholder text for search bar
    const searchPlaceholder = activeTab === "events" ? "Search events..." : "Search clubs...";


    return (
        <div style={{ 
            padding: '1.5rem', 
            backgroundColor: colors.appBackground, 
            minHeight: '100vh',
            fontFamily: 'Inter, Arial, sans-serif',
            color: colors.primary
        }}>
            
            {/* Top Header and Date (Matching Figma Style) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.primary, margin: 0 }}>
                    Events & Clubs
                </h1>
                <p style={{ fontSize: '0.875rem', color: colors.mutedForeground, margin: 0 }}>
                    {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </p>
            </div>
            
            {/* Main Content Card Wrapper */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '0.625rem',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid var(--border)'
            }}>

                {/* Section Title */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: colors.mutedForeground, margin: 0 }}>
                        Events & Clubs
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: colors.mutedForeground, marginTop: '0.25rem' }}>
                        Manage company events and employee clubs
                    </p>
                </div>

                {/* Tabs, Search, and Add Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Tabs List (Events / Clubs) */}
                    <div style={{ display: 'flex', background: colors.appBackground, padding: '0.25rem', borderRadius: '0.5rem', width: 'fit-content', border: '1px solid var(--border)' }}>
                        <button 
                            onClick={() => setActiveTab('events')}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                borderRadius: '0.375rem', 
                                background: activeTab === 'events' ? colors.primary : 'transparent',
                                color: activeTab === 'events' ? 'white' : colors.primary, 
                                border: 'none', 
                                fontSize: '0.875rem', 
                                fontWeight: '500', 
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            Events
                        </button>
                        <button 
                            onClick={() => setActiveTab('clubs')}
                            style={{ 
                                padding: '0.5rem 1rem', 
                                borderRadius: '0.375rem', 
                                background: activeTab === 'clubs' ? colors.primary : 'transparent',
                                color: activeTab === 'clubs' ? 'white' : colors.primary, 
                                border: 'none', 
                                fontSize: '0.875rem', 
                                fontWeight: '500', 
                                cursor: 'pointer',
                                transition: 'all 0.15s'
                            }}
                        >
                            Clubs
                        </button>
                    </div>

                    {/* Search and Add Button Row */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        {/* Search Bar */}
                        <div style={{ position: 'relative', flexGrow: 1, minWidth: '200px' }}>
                            <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    padding: '0.625rem 0.75rem 0.625rem 2.5rem', 
                                    width: '100%', 
                                    borderRadius: '0.5rem', 
                                    border: '1px solid var(--border)', 
                                    backgroundColor: colors.appBackground, 
                                    fontSize: '1rem',
                                    color: colors.primary
                                }}
                            />
                        </div>
                        {/* Add Item Button */}
                        <button
                            style={{
                                padding: '0.625rem 1rem', 
                                borderRadius: '0.5rem', 
                                border: 'none',
                                background: colors.primary,
                                color: 'white', 
                                cursor: 'pointer', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '0.5rem',
                                fontSize: '0.875rem', 
                                fontWeight: '500',
                                transition: 'opacity 0.1s'
                            }}
                            onClick={() => handleOpenDialog(null, 'add')}
                        >
                            <PlusIcon />
                            {`Add ${activeTab === 'events' ? 'Event' : 'Club'}`}
                        </button>
                    </div>
                </div>

                {/* Message Area */}
                {message && (
                    <p style={{ 
                        color: message.type === 'success' ? '#10B981' : '#EF4444', 
                        marginTop: '1rem', 
                        textAlign: 'center',
                        fontSize: '0.875rem'
                    }}>
                        {message.text}
                    </p>
                )}

                {/* Cards Grid */}
                <div style={{ 
                    display: 'grid', 
                    gap: '1rem', 
                    // Ensures max 3 columns on large screens
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    marginTop: '1.5rem' 
                }}>
                    {displayedItems.length === 0 ? (
                         <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem 0', color: colors.mutedForeground }}>
                            {`No ${activeTab} found matching your criteria.`}
                        </div>
                    ) : (
                        displayedItems.map((item) => (
                            activeTab === 'events' ? (
                                <EventCard 
                                    key={item.id} 
                                    event={item} 
                                    onEdit={handleOpenDialog} // Passes item and intended mode ('view' or 'edit')
                                    onDelete={handleItemDelete}
                                />
                            ) : (
                                <ClubCard 
                                    key={item.id} 
                                    club={item} 
                                    onEdit={handleOpenDialog} // Passes item and intended mode ('view' or 'edit')
                                    onDelete={handleItemDelete}
                                />
                            )
                        ))
                    )}
                </div>
            </div>

            {/* Modals for Add/Edit/View */}
            {activeTab === 'events' ? (
                 <EventDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSubmit={handleItemSubmit}
                    // isEditing flag is implicitly passed via initialData and internal mode logic
                    initialData={editingItem}
                    initialIsEditing={editMode === 'edit'} // Pass explicit edit intent
                />
            ) : (
                <ClubDialog
                    isOpen={isDialogOpen}
                    onClose={handleCloseDialog}
                    onSubmit={handleItemSubmit}
                    // isEditing flag is implicitly passed via initialData and internal mode logic
                    initialData={editingItem}
                    initialIsEditing={editMode === 'edit'} // Pass explicit edit intent
                />
            )}


            {/* Custom CSS Variables from Figma (applied globally) */}
            <style jsx>{`
                :root {
                    --background: #ffffff;
                    --foreground: #030213;
                    --primary: #030213;
                    --muted-foreground: #717182;
                    --input-background: #f3f3f5;
                    --border: rgba(0, 0, 0, 0.1);
                    --radius: 0.625rem;
                }
                * {
                    box-sizing: border-box;
                }
                body {
                    margin: 0;
                    background-color: ${colors.appBackground};
                }
            `}</style>
        </div>
    );
}

export default EventsClubsPage;