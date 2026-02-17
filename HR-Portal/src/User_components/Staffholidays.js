import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Staffholidays.css';

const HolidayCalendar = () => {
  const [formData, setFormData] = useState({
    month: '',
    year: ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [holidayData, setHolidayData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setHolidayData(null);
    
    try {
      const params = new URLSearchParams();
      params.append('month', formData.month);
      params.append('year', formData.year);

      const response = await axios.get(`http://localhost:5000/api/holidays?${params.toString()}`);
      
      if (response.data.success) {
        setHolidayData(response.data.data);
        setMessage('Holiday calendar found!');
        setIsError(false);
      } else {
        setMessage(response.data.message || 'No holiday calendar found');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error searching holiday calendar:', error);
      setMessage(error.response?.data?.message || 'Failed to search holiday calendar. Please try again.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="holiday-container">
      <header className="app-header">
        <h1>Staff Leave Hub</h1>
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
      </header>
      
      <main className="calendar-main">
        <div className="calendar-card">
          <h2 className="calendar-title">Search Holiday Calendar</h2>
          
          {message && (
            <div className={`message ${isError ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSearch} className="calendar-form">
            <div className="form-group">
              <label htmlFor="month">Month</label>
              <select
                id="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Month</option>
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="Enter year (e.g. 2023)"
                min="2000"
                max="2100"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-button"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>

          {holidayData && (
            <div className="holiday-result">
              <h3>Holiday Calendar for {holidayData.month} {holidayData.year}</h3>
              
              <div className="holiday-meta">
                <div className="holiday-meta-item">
                  <strong>Month:</strong> {holidayData.month}
                </div>
                <div className="holiday-meta-item">
                  <strong>Year:</strong> {holidayData.year}
                </div>
              </div>
              
              {holidayData.imageUrl ? (
                <div className="holiday-image-container">
                  <img 
                    src={`http://localhost:5000${holidayData.imageUrl}`}
                    alt={`Holiday calendar for ${holidayData.month} ${holidayData.year}`}
                    className="holiday-image"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = '/placeholder-image.jpg';
                      setMessage('Image failed to load');
                    }}
                  />
                </div>
              ) : (
                <p className="no-image">No image available for this calendar</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HolidayCalendar;