const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const session = require('express-session');

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use((req, res, next) => {
  console.log('Session ID:', req.sessionID);
  console.log('Session data:', req.session);
  next();
});

// Session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

// Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Set your MySQL password if needed
  database: "staff",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

// Utility function for promise-based queries
function queryAsync(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Handle Signup Form Submission
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Basic input validation
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Username, email, and password are required" });
  }

  const sql = "INSERT INTO a_signup (user_name, email_id, password) VALUES (?, ?, ?)";
  db.query(sql, [username, email, password], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ message: "Error storing user data", error: err.message });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
});

// Handle Admin Login
app.post("/login", (req, res) => {
  const { email_id, password } = req.body;

  // Basic input validation
  if (!email_id || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM a_signup WHERE email_id = ?";
  db.query(sql, [email_id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const user = result[0];
    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // If login is successful, send a redirect URL in the response
    res.status(200).json({ message: "Login successful", redirect: "/dashboard" });
  });
});


// Fetch all departments
app.get("/api/departments", (req, res) => {
  const sql = "SELECT * FROM department_info";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res.status(500).json({ message: "Error fetching departments", error: err.message });
    }
    res.status(200).json(result);
  });
});


// Add a new department
app.post("/api/departments", (req, res) => {
  const { dept_code, dept_name } = req.body;

  // Basic input validation
  if (!dept_code || !dept_name) {
    return res.status(400).json({ message: "Department code and name are required" });
  }

  const sql = "INSERT INTO department_info (dept_code, dept_name) VALUES (?, ?)";
  db.query(sql, [dept_code, dept_name], (err, result) => {
    if (err) {
      console.error("Error adding department:", err);
      return res.status(500).json({ message: "Error adding department", error: err.message });
    }
    const formattedDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    res.status(201).json({ id: result.insertId, dept_code, dept_name, date: formattedDate });
  });
});

// API to insert service information
app.post("/api/experience", (req, res) => {
  const { employee_id, name_of_organization, s_from, s_to } = req.body;

  const query = `
    INSERT INTO experience_details (employee_id, name_of_organization, s_from, s_to)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [employee_id, name_of_organization, s_from, s_to], (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      res.status(500).send("Error inserting data");
    } else {
      res.status(200).send("Data inserted successfully");
    }
  });
});
// API to handle form submission staff signup
app.post('/api/employee', (req, res) => {
  const { employee_id, name, password } = req.body;

  // SQL query to insert data into the s_signup table
  const query = 'INSERT INTO s_signup (employee_id, emp_name, password) VALUES (?, ?, ?)';
  db.query(query, [employee_id, name, password], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error saving data');
      return;
    }
    res.status(200).send('Data saved successfully');
  });
});

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
  next();
};

// API to handle validate staff login

app.post('/api/login', (req, res) => {
  const { employee_id, password } = req.body;

  const query = 'SELECT * FROM s_signup WHERE employee_id = ? AND password = ?';
  db.query(query, [employee_id, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      // Store user ID in session
      req.session.userId = employee_id;
      return res.json({ 
        success: true,
        employee_id: employee_id
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
  });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});


// API to record Loggedin users
app.post('/api/record-login', async (req, res) => {
  try {
    const { employee_id, login_date, login_time } = req.body;
    
    // Add validation
    if (!employee_id || !login_date || !login_time) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
      });
    }

    // Insert login record
    const result = await queryAsync(
      `INSERT INTO logged_employee (employee_id, login_date, login_time) 
       VALUES (?, ?, ?)`,
      [employee_id, login_date, login_time]
    );
    
    // Get the inserted record (simplified without ORDER BY)
    const [insertedRecord] = await queryAsync(
      `SELECT * FROM logged_employee 
       WHERE employee_id = ? AND login_date = ? AND login_time = ? 
       LIMIT 1`,
      [employee_id, login_date, login_time]
    );
    
    res.json({ 
      success: true, 
      record: insertedRecord 
    });
  } catch (error) {
    console.error("Error recording login:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to record login",
      details: error.code || null,
      sqlError: error.sqlMessage || null  // Added more detailed SQL error info
    });
  }
});


// Get user profile data
app.get('/api/profile', requireAuth, (req, res) => {
  const employeeId = req.session.userId;
  
  if (!employeeId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const query = `
    SELECT * FROM personal_information 
    WHERE employee_id = ?
  `;
  
  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Error fetching profile:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(results[0]);
  });
});

// API to handle leave request submission
app.post("/api/leave-request", upload.single("leave_letter"), (req, res) => {
  const {
    employee_id,
    name,
    department,
    designation,
    leave_type,
    start_date,
    end_date,
    reason
  } = req.body;

  const leave_letter = req.file ? req.file.path : null;

  // Basic validation
  if (!employee_id || !name || !department || !designation || 
      !leave_type || !start_date || !end_date || !reason) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  // First check if user has available leaves
  const checkLeavesQuery = `
    SELECT 
      (SELECT COUNT(*) FROM leave_request WHERE employee_id = ? AND status = 'Approved') as approvedLeaves,
      (SELECT doj FROM personal_information WHERE employee_id = ?) as doj
  `;

  db.query(checkLeavesQuery, [employee_id, employee_id], (err, result) => {
    if (err) {
      console.error("Error checking leave balance:", err);
      return res.status(500).json({ message: "Error checking leave balance" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const approvedLeaves = result[0].approvedLeaves || 0;
    const dateOfJoining = new Date(result[0].doj);
    const today = new Date();
    const monthsDiff = (today.getFullYear() - dateOfJoining.getFullYear()) * 12 + 
                      (today.getMonth() - dateOfJoining.getMonth());
    const totalLeaves = monthsDiff >= 6 ? 20 : 10;
    
    if (approvedLeaves >= totalLeaves) {
      return res.status(400).json({ message: "You have no remaining leaves available" });
    }

    // Proceed with leave request submission
    const insertQuery = `
      INSERT INTO leave_request (
        employee_id, name, department, designation, leave_type,
        start_date, end_date, leave_letter, reason, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW())
    `;

    db.query(
      insertQuery,
      [
        employee_id,
        name,
        department,
        designation,
        leave_type,
        start_date,
        end_date,
        leave_letter,
        reason
      ],
      (err, insertResult) => {
        if (err) {
          console.error("Error inserting leave request:", err);
          return res.status(500).json({ message: "Failed to submit leave request", error: err.message });
        }
        res.status(201).json({ message: "Leave request submitted successfully", id: insertResult.insertId });
      }
    );
  });
});


// Add this new API endpoint to your backend
app.get("/api/user-leave-data", (req, res) => {
  // In a real application, you would get the logged-in user's ID from the session
 
  const userId = req.session.userId; // Or however you store the logged-in user's ID
  
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // First, get the user's date of joining
  const dojQuery = "SELECT doj FROM personal_information WHERE employee_id = ?";
  
  db.query(dojQuery, [userId], (err, dojResult) => {
    if (err) {
      console.error("Error fetching user's DOJ:", err);
      return res.status(500).json({ message: "Error fetching user data" });
    }
    
    if (dojResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const dateOfJoining = new Date(dojResult[0].doj);
    const today = new Date();
    
    // Calculate months difference
    const monthsDiff = (today.getFullYear() - dateOfJoining.getFullYear()) * 12 + 
                      (today.getMonth() - dateOfJoining.getMonth());
    
    // Determine total leaves based on months of service
    const totalLeaves = monthsDiff >= 6 ? 20 : 10;
    
    // Now get the leave counts for this user
    const leaveCountQuery = `
      SELECT 
        COUNT(*) as leavesApplied,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as leavesApproved
      FROM leave_request 
      WHERE employee_id = ?
    `;
    
    db.query(leaveCountQuery, [userId], (err, leaveResult) => {
      if (err) {
        console.error("Error fetching leave counts:", err);
        return res.status(500).json({ message: "Error fetching leave data" });
      }
      
      const leavesApplied = leaveResult[0].leavesApplied || 0;
      const leavesApproved = leaveResult[0].leavesApproved || 0;
      const leavesRemaining = totalLeaves - leavesApproved;
      
      // Get username (assuming you have this in your database)
      const userQuery = "SELECT name FROM personal_information WHERE employee_id = ?";
      
      db.query(userQuery, [userId], (err, userResult) => {
        if (err) {
          console.error("Error fetching username:", err);
          return res.status(500).json({ message: "Error fetching user data" });
        }
        
        const username = userResult[0]?.name || "User";
        
        res.json({
          username,
          totalLeaves,
          leavesApplied,
          leavesApproved,
          leavesRemaining
        });
      });
    });
  });
});



/**
* @route GET /api/attendance/departments
* @description Get all distinct departments with employee counts
* @returns {Array} List of departments with counts
*/
app.get('/api/attendance/departments', async (req, res) => {
  try {
    const sql = `
      SELECT 
        department, 
        COUNT(*) as employee_count
      FROM personal_information
      WHERE department IS NOT NULL
      GROUP BY department
      ORDER BY department
    `;
    
    const results = await queryAsync(sql);
    
    res.status(200).json({
      success: true,
      data: results,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error("Error fetching departments:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch departments",
      error: err.message,
      code: "ATT_DEPS_001"
    });
  }
});

/**
 * @route GET /api/attendance/employees/:department
 */
app.get('/api/attendance/employees/:department', async (req, res) => {
  const { department } = req.params;
  
  console.log(`Fetching employees for department: ${department}`);

  try {
    // First verify the department exists
    const deptCheck = await queryAsync(
      `SELECT 1 FROM personal_information WHERE department = ? LIMIT 1`,
      [department]
    );

    if (deptCheck.length === 0) {
      console.log(`Department ${department} not found`);
      return res.status(404).json({ 
        success: false,
        message: `Department ${department} not found`
      });
    }

    // Then get employees
    const employees = await queryAsync(
      `SELECT employee_id, name 
       FROM personal_information 
       WHERE department = ? 
       ORDER BY name`,
      [department]
    );

    console.log(`Found ${employees.length} employees for ${department}`);

    res.json({
      success: true,
      data: employees,
      count: employees.length
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({
      success: false,
      message: "Database query failed",
      error: err.message,
      query: `SELECT employee_id, name FROM personal_information WHERE department = '${department}'`
    });
  }
});
/**
* @route GET /api/attendance/daily/:date
* @description Get attendance for a specific date
* @param {string} date - Date in YYYY-MM-DD format
* @returns {Array} Attendance records for the date
*/
app.get('/api/attendance/daily/:date', async (req, res) => {
try {
  const { date } = req.params;
  
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "Valid date in YYYY-MM-DD format is required",
      code: "ATT_DAY_001"
    });
  }

  const sql = `
    SELECT 
      a.employee_id,
      p.name,
      p.designation,
      a.department,
      a.status,
      a.remarks,
      DATE_FORMAT(a.recorded_at, '%Y-%m-%d %H:%i:%s') as recorded_at,
      a.recorded_by
    FROM attendance a
    JOIN personal_information p ON a.employee_id = p.employee_id
    WHERE a.date = ?
    ORDER BY a.department, p.name
  `;

  const [results] = await db.promise().query(sql, [date]);
  
  res.status(200).json({
    success: true,
    data: results,
    date,
    count: results.length,
    timestamp: new Date().toISOString()
  });
  
} catch (err) {
  console.error("Error fetching daily attendance:", err);
  res.status(500).json({
    success: false,
    message: "Failed to fetch attendance data",
    error: err.message,
    code: "ATT_DAY_002"
  });
}
});

/**
* @route POST /api/attendance
* @description Submit attendance records
* @param {Object} body - { date, department, records[], recorded_by }
* @returns {Object} Operation result
*/
app.post('/api/attendance', async (req, res) => {
const { date, department, records, recorded_by } = req.body;

// Validate input
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  return res.status(400).json({
    success: false,
    message: "Valid date in YYYY-MM-DD format is required",
    code: "ATT_SUB_001"
  });
}

if (!department || typeof department !== 'string') {
  return res.status(400).json({
    success: false,
    message: "Department name is required",
    code: "ATT_SUB_002"
  });
}

if (!Array.isArray(records) || records.length === 0) {
  return res.status(400).json({
    success: false,
    message: "Attendance records array is required",
    code: "ATT_SUB_003"
  });
}

// Validate each record
for (const record of records) {
  if (!record.employee_id || !record.name || !['P', 'A', 'L', 'H'].includes(record.status)) {
    return res.status(400).json({
      success: false,
      message: "Each record must have valid employee_id, name, and status (P/A/L/H)",
      code: "ATT_SUB_004"
    });
  }
}

const connection = await db.promise().getConnection();

try {
  await connection.beginTransaction();

  // 1. Delete existing attendance for this date/department
  await connection.query(
    `DELETE FROM attendance WHERE date = ? AND department = ?`,
    [date, department]
  );

  // 2. Insert new records
  const values = records.map(record => [
    record.employee_id,
    record.name,
    department,
    date,
    record.status,
    recorded_by || 'system',
    record.remarks || null
  ]);

  const [result] = await connection.query(
    `INSERT INTO attendance 
     (employee_id, name, department, date, status, recorded_by, remarks) 
     VALUES ?`,
    [values]
  );

  await connection.commit();

  res.status(201).json({
    success: true,
    message: "Attendance submitted successfully",
    records_processed: result.affectedRows,
    date,
    department
  });
  
} catch (err) {
  await connection.rollback();
  console.error("Attendance submission error:", err);
  res.status(500).json({
    success: false,
    message: "Failed to submit attendance",
    error: err.message,
    code: "ATT_SUB_005"
  });
} finally {
  connection.release();
}
});

/**
* @route GET /api/attendance/report
* @description Generate custom attendance report
* @param {string} startDate - Start date (YYYY-MM-DD)
* @param {string} endDate - End date (YYYY-MM-DD)
* @param {string} [department] - Optional department filter
* @param {string} [employee_id] - Optional employee filter
* @returns {Array} Attendance report data
*/
app.get('/api/attendance/report', async (req, res) => {
try {
  const { startDate, endDate, department, employee_id, status } = req.query;

  // Validate dates
  if (!startDate || !endDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return res.status(400).json({
      success: false,
      message: "Valid startDate and endDate in YYYY-MM-DD format are required",
      code: "ATT_REP_001"
    });
  }

  let sql = `
    SELECT 
      a.employee_id,
      p.name,
      p.designation,
      a.department,
      a.date,
      a.status,
      a.remarks,
      DATE_FORMAT(a.recorded_at, '%Y-%m-%d %H:%i:%s') as recorded_at,
      a.recorded_by
    FROM attendance a
    JOIN personal_information p ON a.employee_id = p.employee_id
    WHERE a.date BETWEEN ? AND ?
  `;

  const params = [startDate, endDate];

  // Add filters
  if (department) {
    sql += " AND a.department = ?";
    params.push(department);
  }
  if (employee_id) {
    sql += " AND a.employee_id = ?";
    params.push(employee_id);
  }
  if (status && ['P', 'A', 'L', 'H'].includes(status)) {
    sql += " AND a.status = ?";
    params.push(status);
  }

  sql += " ORDER BY a.date, a.department, p.name";

  const [results] = await db.promise().query(sql, params);
  
  res.status(200).json({
    success: true,
    data: results,
    startDate,
    endDate,
    recordCount: results.length,
    generatedAt: new Date().toISOString()
  });
  
} catch (err) {
  console.error("Report generation error:", err);
  res.status(500).json({
    success: false,
    message: "Failed to generate attendance report",
    error: err.message,
    code: "ATT_REP_002"
  });
}
});

/**
* @route GET /api/attendance/employee/:employeeId
* @description Get attendance history for an employee
* @param {string} employeeId - Employee ID
* @param {string} [startDate] - Optional start date filter
* @param {string} [endDate] - Optional end date filter
* @returns {Array} Employee's attendance records
*/
app.get('/api/attendance/employee/:employeeId', async (req, res) => {
try {
  const { employeeId } = req.params;
  const { startDate, endDate } = req.query;

  if (!employeeId) {
    return res.status(400).json({
      success: false,
      message: "Employee ID is required",
      code: "ATT_EMP_004"
    });
  }

  let sql = `
    SELECT 
      a.date,
      a.status,
      a.department,
      a.remarks,
      DATE_FORMAT(a.recorded_at, '%Y-%m-%d %H:%i:%s') as recorded_at
    FROM attendance a
    WHERE a.employee_id = ?
  `;

  const params = [employeeId];

  // Add date range if provided
  if (startDate && endDate) {
    sql += " AND a.date BETWEEN ? AND ?";
    params.push(startDate, endDate);
  }

  sql += " ORDER BY a.date DESC LIMIT 90"; // Last 90 days by default

  const [results] = await db.promise().query(sql, params);
  
  res.status(200).json({
    success: true,
    data: results,
    employeeId,
    recordCount: results.length
  });
  
} catch (err) {
  console.error("Employee attendance error:", err);
  res.status(500).json({
    success: false,
    message: "Failed to fetch employee attendance",
    error: err.message,
    code: "ATT_EMP_005"
  });
}
});

/**
* @route GET /api/attendance/stats
* @description Get attendance statistics
* @param {string} date - Date for stats (YYYY-MM-DD)
* @param {string} [department] - Optional department filter
* @returns {Object} Attendance statistics
*/
app.get('/api/attendance/stats', async (req, res) => {
try {
  const { date, department } = req.query;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({
      success: false,
      message: "Valid date in YYYY-MM-DD format is required",
      code: "ATT_STAT_001"
    });
  }

  let sql = `
    SELECT 
      status,
      COUNT(*) as count
    FROM attendance
    WHERE date = ?
  `;

  const params = [date];

  if (department) {
    sql += " AND department = ?";
    params.push(department);
  }

  sql += " GROUP BY status";

  const [results] = await db.promise().query(sql, params);
  
  // Convert to more usable format
  const stats = {
    present: 0,
    absent: 0,
    leave: 0,
    holiday: 0,
    total: 0
  };

  results.forEach(row => {
    const key = 
      row.status === 'P' ? 'present' :
      row.status === 'A' ? 'absent' :
      row.status === 'L' ? 'leave' : 'holiday';
    stats[key] = row.count;
    stats.total += row.count;
  });

  res.status(200).json({
    success: true,
    data: stats,
    date,
    department: department || 'all'
  });
  
} catch (err) {
  console.error("Stats error:", err);
  res.status(500).json({
    success: false,
    message: "Failed to calculate attendance stats",
    error: err.message,
    code: "ATT_STAT_002"
  });
}
});

// Leave Application Endpoints (add to your existing server.js)

// Get all leave requests
app.get('/api/leave-requests', (req, res) => {
  // First set content-type header
  res.setHeader('Content-Type', 'application/json');
  
  const sql = `
    SELECT 
      id,
      employee_id, 
      name, 
      department, 
      designation, 
      leave_type, 
      DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
      DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
      reason, 
      leave_letter,
      status
    FROM leave_request
    ORDER BY start_date DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching leave requests:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: err.message
      });
    }
    
    // Ensure we're sending proper JSON
    try {
      res.json({
        success: true,
        data: results
      });
    } catch (jsonError) {
      console.error('JSON serialization error:', jsonError);
      res.status(500).json({
        success: false,
        error: 'Response serialization failed'
      });
    }
  });
});

// Get single leave request by ID
app.get('/api/leave-requests/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.params;
  const sql = `
    SELECT 
      id,
      employee_id, 
      name, 
      department, 
      designation, 
      leave_type, 
      DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
      DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
      reason, 
      leave_letter,
      status
    FROM leave_request 
    WHERE id = ?
  `;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching leave request:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: err.message
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Not found',
        message: 'Leave request not found'
      });
    }
    
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// Update leave request status
app.put('/api/leave-requests/:id', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const { id } = req.params;
  const { status, leave_letter } = req.body;

  // Validate status
  if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ 
      success: false,
      error: 'Validation error',
      message: 'Invalid status value'
    });
  }

  const sql = `
    UPDATE leave_request 
    SET 
      status = ?,
      leave_letter = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.query(sql, [status, leave_letter || null, id], (err, result) => {
    if (err) {
      console.error('Error updating leave request:', err);
      return res.status(500).json({ 
        success: false,
        error: 'Database error',
        message: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Not found',
        message: 'Leave request not found'
      });
    }

    // Return the updated record
    db.query(
      `SELECT * FROM leave_request WHERE id = ?`,
      [id],
      (err, updatedResults) => {
        if (err) {
          console.error('Error fetching updated leave request:', err);
          return res.status(500).json({ 
            success: false,
            error: 'Database error',
            message: err.message
          });
        }
        
        res.json({
          success: true,
          data: updatedResults[0],
          message: 'Leave status updated successfully'
        });
      }
    );
  });
});

// Submit new leave request (with file upload)
app.post('/api/leave-requests', upload.single('leave_letter'), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
  const {
    employee_id,
    name,
    department,
    designation,
    leave_type,
    start_date,
    end_date,
    reason
  } = req.body;

  const leave_letter = req.file ? req.file.path : null;

  // Basic validation
  const requiredFields = {
    employee_id: 'Employee ID',
    name: 'Name',
    department: 'Department',
    leave_type: 'Leave Type',
    start_date: 'Start Date',
    end_date: 'End Date',
    reason: 'Reason'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`
    });
  }

  const sql = `
    INSERT INTO leave_request (
      employee_id, name, department, designation, leave_type,
      start_date, end_date, leave_letter, reason, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(
    sql,
    [
      employee_id,
      name,
      department,
      designation || null,
      leave_type,
      start_date,
      end_date,
      leave_letter,
      reason
    ],
    (err, result) => {
      if (err) {
        console.error("Error submitting leave request:", err);
        return res.status(500).json({ 
          success: false,
          error: 'Database error',
          message: err.message
        });
      }
      
      res.status(201).json({ 
        success: true,
        message: "Leave request submitted successfully", 
        id: result.insertId,
        data: {
          id: result.insertId,
          status: 'Pending'
        }
      });
    }
  );
});

// API endpoint to get leaves by employee_id

app.get('/api/employee/leaves', (req, res) => {
  // Check session
  if (!req.session.userId) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized - Please login first' 
    });
  }

  const employeeId = req.session.userId;

  const query = `
    SELECT 
      id,
      employee_id, 
      name, 
      department, 
      designation, 
      leave_type, 
      DATE_FORMAT(start_date, '%Y-%m-%d') as start_date,
      DATE_FORMAT(end_date, '%Y-%m-%d') as end_date, 
      reason, 
      leave_letter,
      status
    FROM leave_request 
    WHERE employee_id = ?
    ORDER BY start_date DESC
  `;

  db.query(query, [employeeId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Failed to fetch leave records',
        error: err.message 
      });
    }

    // Calculate duration for each leave
    const leavesWithDuration = results.map(leave => {
      const start = new Date(leave.start_date);
      const end = new Date(leave.end_date);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      
      return {
        ...leave,
        duration: `${duration} day${duration > 1 ? 's' : ''}`
      };
    });

    res.json({
      success: true,
      data: leavesWithDuration,
      count: leavesWithDuration.length
    });
  });
});

// API for ADashboard 
app.get("/api/Adashboard", (req, res) => {
  // First query: Get total employees count
  db.query(
    "SELECT COUNT(*) as count FROM personal_information", 
    (err, employeeResults) => {
      if (err) {
        console.error("Error fetching employee count:", err);
        return res.status(500).json({ 
          error: "Database error",
          message: "Failed to get employee count" 
        });
      }

      const totalEmployees = employeeResults[0] ? employeeResults[0].count : 0;

      // Second query: Get leave counts
      db.query(
        `SELECT 
          SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
          SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
         FROM leave_request`,
        (err, leaveResults) => {
          if (err) {
            console.error("Error fetching leave counts:", err);
            return res.status(500).json({ 
              error: "Database error",
              message: "Failed to get leave counts" 
            });
          }

          const leaveData = leaveResults[0] || {
            pending: 0,
            approved: 0,
            rejected: 0
          };

          // Send response
          res.json({
            totalEmployees: totalEmployees,
            requestedLeaves: leaveData.pending || 0,
            approvedLeaves: leaveData.approved || 0,
            rejectedLeaves: leaveData.rejected || 0
          });
        }
      );
    }
  );
});


// API endpoint to get all logged employees
app.get('/api/logged-employees', async (req, res) => {
  try {
    console.log('Fetching logged employees...'); // Debug log
    
    const results = await queryAsync(
      `SELECT id, employee_id, 
       DATE(login_date) as login_date, 
       TIME(login_time) as login_time 
       FROM logged_employee 
       ORDER BY login_date DESC, login_time DESC`
    );
    
    console.log('Found records:', results.length); // Debug log
    
    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
    
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database operation failed",
      error: error.message,
      sqlError: error.sqlMessage || null
    });
  }
});



// Update your /api/holidays endpoint
app.post('/api/holidays', upload.single('image'), async (req, res) => {
  console.log('Request received:', {
    body: req.body,
    file: req.file ? req.file : 'No file uploaded'
  });

  try {
    const { month, year } = req.body;
    const image = req.file ? req.file.filename : null;

    // Enhanced validation
    if (!month || !year) {
      console.log('Validation failed: Missing month or year');
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
        code: "HOL_001"
      });
    }

    // Validate month format
    const validMonths = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    if (!validMonths.includes(month)) {
      return res.status(400).json({
        success: false,
        message: "Invalid month. Please use full month name (e.g. 'January')",
        code: "HOL_004"
      });
    }

    // Validate year format
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({
        success: false,
        message: "Year must be 4 digits (e.g. 2023)",
        code: "HOL_005"
      });
    }

    // Check for existing entry (modified to work without id column)
    let existing;
    try {
      existing = await queryAsync(
        'SELECT month, year FROM holidays WHERE month = ? AND year = ?', 
        [month, year]
      );
    } catch (queryErr) {
      console.error('Database error:', queryErr);
      return res.status(500).json({
        success: false,
        message: "Database operation failed",
        code: "HOL_007",
        error: queryErr.message
      });
    }

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Holiday calendar already exists for this month/year",
        code: "HOL_002"
      });
    }

    // Insert new record
    try {
      await queryAsync(
        'INSERT INTO holidays (month, year, image) VALUES (?, ?, ?)',
        [month, year, image]
      );
    } catch (insertErr) {
      console.error('Insert error:', insertErr);
      // Clean up uploaded file if insert failed
      if (req.file) {
        try {
          const filePath = path.join(uploadsDir, req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanupErr) {
          console.error('File cleanup error:', cleanupErr);
        }
      }
      
      return res.status(500).json({
        success: false,
        message: "Database insert failed",
        code: "HOL_008",
        error: insertErr.message
      });
    }

    // Success response (modified since we don't have an id)
    return res.status(201).json({
      success: true,
      message: "Holiday calendar saved successfully",
      month,
      year,
      imageUrl: image ? `/uploads/${image}` : null
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({
      success: false,
      message: "Unexpected server error",
      code: "HOL_009",
      error: err.message
    });
  }
});


// GET endpoint to search holidays

app.get('/api/holidays', async (req, res) => {
  const { month, year } = req.query;
  console.log('Search request received for:', month, year); // Debug log

  try {
    // Validate inputs
    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and year are required",
        code: "HOL_SEARCH_001"
      });
    }

    // Search for holiday calendar
    const results = await queryAsync(
      'SELECT month, year, image FROM holidays WHERE month = ? AND year = ?',
      [month, year]
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No holiday calendar found for the specified month and year",
        code: "HOL_SEARCH_002"
      });
    }

    const holiday = results[0];
    return res.json({
      success: true,
      data: {
        month: holiday.month,
        year: holiday.year,
        imageUrl: holiday.image ? `/uploads/${holiday.image}` : null
      }
    });

  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({
      success: false,
      message: "Error searching holiday calendar",
      code: "HOL_SEARCH_003",
      error: err.message
    });
  }
});








//NEW BACK END CODES FOR HR PORTAL 









// API to fetch employee data for dashboard table
app.get("/api/employees", async (req, res) => {
  try {
    const sql = `
      SELECT 
        employee_id,
        name,
        email_id,
        mobile_no as contact,
        department,
        designation as position,
        DATE_FORMAT(doj, '%m/%d/%Y') as join_date,
        'Active' as status
      FROM personal_information 
      ORDER BY name
    `;

    const results = await queryAsync(sql);
    
    res.status(200).json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch employee data",
      error: err.message
    });
  }
});



// ✅ API to insert data into personal_information for user


app.post("/api/personal-information1", upload.single("profile_picture"), (req, res) => {
  console.log("✅ Personal info route HIT!");
  console.log("Received personal information submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    employee_type,
    name,
    department,
    designation,
    doj,
    email_id,
    mobile_no,
    postal_address,
    permanent_address,
    dob,
    gender,
    aadhaar_number,
    marital_status,
    category,
    blood_group,
    caste,
    pan_no,
    account_no,
    ifsc_code,
  } = req.body;

  // ✅ Validate all required fields with detailed error messages
  const requiredFields = {
    employee_id: 'Employee ID',
    employee_type: 'Employee Type', 
    name: 'Name',
    department: 'Department',
    designation: 'Designation',
    doj: 'Date of Joining',
    email_id: 'Email ID',
    mobile_no: 'Mobile Number',
    postal_address: 'Postal Address',
    permanent_address: 'Permanent Address',
    dob: 'Date of Birth',
    gender: 'Gender',
    aadhaar_number: 'Aadhaar Number'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const profile_picture = req.file ? req.file.path : null;

  // ✅ SQL query with all columns
  const query = `
    INSERT INTO personal_information (
      employee_id,
      employee_type,
      name,
      department,
      designation,
      doj,
      email_id,
      mobile_no,
      postal_address,
      permanent_address,
      dob,
      gender,
      aadhaar_number,
      marital_status,
      category,
      blood_group,
      caste,
      pan_no,
      account_no,
      ifsc_code,
      profile_picture
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      employee_type,
      name,
      department,
      designation,
      doj,
      email_id,
      mobile_no,
      postal_address,
      permanent_address,
      dob,
      gender,
      aadhaar_number,
      marital_status || null,
      category || null,
      blood_group || null,
      caste || null,
      pan_no || null,
      account_no || null,
      ifsc_code || null,
      profile_picture,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Employee ID already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert data", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Data inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Data inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});



// ✅ API to insert data into qualification-details for user


app.post("/api/qualification-details", upload.single("qualification_documents"), (req, res) => {
  console.log("✅ Qualification details route HIT!");
  console.log("Received qualification details submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    qualification,
    specialization,
    board_university,
    result_percentage,
    year_of_pass,
    class: class_name // Using class_name to avoid reserved keyword conflict
  } = req.body;

  // ✅ Validate all required fields with detailed error messages
  const requiredFields = {
    employee_id: 'Employee ID',
    qualification: 'Qualification',
    board_university: 'Board/University',
    year_of_pass: 'Year of Passing'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const qualification_documents = req.file ? req.file.path : null;

  // ✅ SQL query with only the fields from your image
  const query = `
    INSERT INTO qualification_details (
      employee_id,
      qualification,
      specialization,
      board_university,
      result_percentage,
      year_of_pass,
      class,
      qualification_documents
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      qualification,
      specialization || null,
      board_university,
      result_percentage || null,
      year_of_pass,
      class_name || null,
      qualification_documents,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error (if employee_id doesn't exist in personal_information)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error (if you have unique constraints)
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Qualification entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert qualification data", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Qualification data inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Qualification data inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});


//API TO INSERT SERVICE DATA 


// API to insert service data (without file upload)
app.post("/api/service-data", (req, res) => {  // Remove upload.single() middleware
  console.log("✅ Service data route HIT!");
  console.log("Received service data submission:", req.body);

  const {
    employee_id,
    name_of_organization,
    from_date,
    to_date
  } = req.body;

  // ✅ Validate all required fields
  const requiredFields = {
    employee_id: 'Employee ID',
    name_of_organization: 'Name of Organization', 
    from_date: 'From Date'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  // ✅ SQL query - remove service_documents field or set to NULL
  const query = `
    INSERT INTO service (
      employee_id,
      name_of_organization,
      from_date,
      to_date
      -- Remove service_documents from insert if not needed
    ) VALUES (?, ?, ?, ?)
  `;

  // ✅ Execute query without file
  db.query(
    query,
    [
      employee_id,
      name_of_organization,
      from_date,
      to_date || null,
      // Remove the file parameter
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Service entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert service data", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Service data inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Service data inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});



//API TO INSER Short Term Course / Workshop / Training / FD Conference / Seminar


app.post("/api/training", upload.single("certificate_path"), (req, res) => {
  console.log("✅ Training data route HIT!");
  console.log("Received training data submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    course_type,
    course_name,
    course_date
  } = req.body;

  // ✅ Validate all required fields based on database schema
  const requiredFields = {
    employee_id: 'Employee ID',
    course_type: 'Course Type',
    course_name: 'Course Name',
    course_date: 'Course Date'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const certificate_path = req.file ? req.file.path : null;

  // ✅ SQL query with correct table fields from database schema (timestamps removed)
  const query = `
    INSERT INTO training_courses (
      employee_id,
      course_type,
      course_name,
      course_date,
      certificate_path
    ) VALUES (?, ?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      course_type,
      course_name,
      course_date,
      certificate_path
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Training entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert training data", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Training data inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Training data inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});




//API TO INSERT Paper Details 



app.post("/api/paper-details", upload.single("certificate_path"), (req, res) => {
  console.log("✅ Paper details route HIT!");
  console.log("Received paper details submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    paper_type,
    paper_level,
    journal_conference_name,
    paper_date,
    paper_title
  } = req.body;

  // ✅ Validate all required fields for paper_details table
  const requiredFields = {
    employee_id: 'Employee ID',
    paper_type: 'Paper Type',
    paper_level: 'Paper Level',
    journal_conference_name: 'Journal/Conference Name',
    paper_date: 'Paper Date',
    paper_title: 'Paper Title'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const certificate_path = req.file ? req.file.path : null;

  // ✅ SQL query for paper_details table with correct fields
  const query = `
    INSERT INTO paper_details (
      employee_id,
      paper_type,
      paper_level,
      journal_conference_name,
      paper_date,
      paper_title,
      certificate_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      paper_type,
      paper_level,
      journal_conference_name,
      paper_date,
      paper_title,
      certificate_path
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Paper details entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert paper details", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Paper details inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Paper details inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});



//API to INSERT BOOK_PUBLISHED 



app.post("/api/book-published", upload.single("document_path"), (req, res) => {
  console.log("✅ Book published route HIT!");
  console.log("Received book published submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    book_name,
    number_of_chapters,
    publication_year,
    pages_from,
    pages_to
  } = req.body;

  // ✅ Validate all required fields for BookPublished table
  const requiredFields = {
    employee_id: 'Employee ID',
    book_name: 'Book Name',
    number_of_chapters: 'Number of Chapters',
    publication_year: 'Publication Year',
    pages_from: 'Pages From',
    pages_to: 'Pages To'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const document_path = req.file ? req.file.path : null;

  // ✅ SQL query for BookPublished table with correct fields
  const query = `
    INSERT INTO BookPublished (
      employee_id,
      book_name,
      number_of_chapters,
      publication_year,
      pages_from,
      pages_to,
      document_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      book_name,
      number_of_chapters,
      publication_year,
      pages_from,
      pages_to,
      document_path
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Book published entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert book published details", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Book published details inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Book published details inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});



//API TO INSERT PROJRCT DETAILS 



app.post("/api/project-major", upload.single("certificate_path"), (req, res) => {
  console.log("✅ Project major route HIT!");
  console.log("Received project major submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    project_type,
    project_name,
    sponsorer,
    amount,
    sanction_year
  } = req.body;

  // ✅ Validate all required fields for Project table
  const requiredFields = {
    employee_id: 'Employee ID',
    project_type: 'Project Type',
    project_name: 'Project Name',
    sanction_year: 'Year of Sanction'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const certificate_path = req.file ? req.file.path : null;

  // ✅ SQL query for Project table with correct fields
  const query = `
    INSERT INTO Project (
      employee_id,
      project_type,
      project_name,
      sponsorer,
      amount,
      sanction_year,
      certificate_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      project_type,
      project_name,
      sponsorer || null,
      amount || null,
      sanction_year,
      certificate_path
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Project major entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert project major details", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Project major details inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Project major details inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});



// API TO INSER AWARD DETAILS 


app.post("/api/awards", upload.single("certificate_path"), (req, res) => {
  console.log("✅ Awards route HIT!");
  console.log("Received awards submission:", {
    body: req.body,
    file: req.file ? req.file.filename : 'No file'
  });

  const {
    employee_id,
    award_name,
    award_organization
  } = req.body;

  // ✅ Validate all required fields for Awards table
  const requiredFields = {
    employee_id: 'Employee ID',
    award_name: 'Award Name'
  };

  const missingFields = Object.keys(requiredFields).filter(field => !req.body[field]);
  
  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({ 
      message: `Missing required fields: ${missingFields.map(f => requiredFields[f]).join(', ')}`,
      missingFields: missingFields
    });
  }

  const certificate_path = req.file ? req.file.path : null;

  // ✅ SQL query for Awards table with correct fields
  const query = `
    INSERT INTO Awards (
      employee_id,
      award_name,
      award_organization,
      certificate_path
    ) VALUES (?, ?, ?, ?)
  `;

  // ✅ Execute query
  db.query(
    query,
    [
      employee_id,
      award_name,
      award_organization || null,
      certificate_path
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Database error:", err);
        
        // Handle foreign key constraint error
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
          return res.status(400).json({ 
            message: "Employee ID does not exist in personal information",
            error: "INVALID_EMPLOYEE_ID"
          });
        }
        
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ 
            message: "Award entry already exists",
            error: "DUPLICATE_ENTRY"
          });
        }
        
        return res.status(500).json({ 
          message: "Failed to insert award details", 
          error: err.message,
          code: err.code 
        });
      }
      
      console.log("✅ Award details inserted successfully for employee:", employee_id);
      res.status(201).json({ 
        message: "Award details inserted successfully",
        employeeId: employee_id,
        insertedId: result.insertId
      });
    }
  );
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});