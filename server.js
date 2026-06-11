require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
// 1. Import SQLite
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this'; 
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// 2. Initialize Database (Creates 'school.db' file automatically)
const db = new Database('school.db');

// 3. Create Tables (Schema)
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        passwordHash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        gender TEXT,
        dob TEXT,
        idNumber TEXT,
        phone TEXT,
        grade TEXT,
        stream TEXT,
        reg TEXT,
        photo TEXT,
        guardianName TEXT,
        guardianPhone TEXT,
        guardianRel TEXT,
        upiNumber TEXT,
        prevSchool TEXT,
        entryLevel TEXT,
        yearCompleted TEXT,
        nemisNumber TEXT,
        disability TEXT
    );

    CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        role TEXT,
        department TEXT,
        phone TEXT,
        tscNumber TEXT,
        photo TEXT,
        subjects TEXT
    );

    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        schoolName TEXT,
        motto TEXT,
        email TEXT,
        phone TEXT,
        schoolCode TEXT,
        academicYear TEXT,
        currentTerm TEXT,
        level TEXT,
        category TEXT,
        address TEXT,
        hoiName TEXT,
        hoiTitle TEXT,
        hoiTsc TEXT,
        hoiPhone TEXT,
        hoiEmail TEXT,
        logo TEXT,
        stamp TEXT,
        hoiSignature TEXT,
        ctSignature TEXT
    );

    CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        subjectId TEXT,
        score INTEGER,
        term TEXT,
        year INTEGER,
        comments TEXT
    );

    CREATE TABLE IF NOT EXISTS learningAreas (
        id TEXT PRIMARY KEY,
        name TEXT,
        code TEXT,
        applicableLevels TEXT
    );
`);

// 4. Initialize Default Data (Admin User)
const initAdmin = () => {
    const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@school.com');
    if (!admin) {
        const hashedPass = bcrypt.hashSync('admin123', 10);
        const insert = db.prepare('INSERT INTO users (id, email, name, role, passwordHash) VALUES (?, ?, ?, ?, ?)');
        insert.run('u1', 'admin@school.com', 'Admin User', 'admin', hashedPass);
        console.log('[DB] Default Admin created.');
    }
};
initAdmin();

// --- SECURITY CONFIGURATION ---
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const loginLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });

app.use(helmet({ contentSecurityPolicy: false })); // Disabled for easier dev
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied.' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

const requireRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden.' });
        next();
    };
};

// ==========================================================================
//   PAGE ROUTES
// ==========================================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));

// ==========================================================================
//   AUTHENTICATION ROUTES
// ==========================================================================
app.post('/api/login', loginLimiter, (req, res) => {
    try {
        const { email, password } = req.body;
        // Fast SQL Lookup
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, name: user.name }, 
            JWT_SECRET, 
            { expiresIn: '8h' }
        );
        
        res.json({ 
            success: true, 
            token, 
            user: { id: user.id, email: user.email, role: user.role, name: user.name } 
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/signup', (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check existence
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(400).json({ success: false, message: 'User already exists.' });

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = {
            id: Date.now().toString(36),
            email, name,
            passwordHash: hashedPassword,
            role: 'teacher'
        };

        const insert = db.prepare('INSERT INTO users (id, email, name, role, passwordHash) VALUES (?, ?, ?, ?, ?)');
        insert.run(newUser.id, newUser.email, newUser.name, newUser.role, newUser.passwordHash);
        
        res.status(201).json({ success: true, message: 'Account created!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// ==========================================================================
//   DATA ROUTES (Using SQL Transactions for Safety)
// ==========================================================================

// Helper for Bulk Replacing (Delete All -> Insert All)
const bulkReplace = (tableName, dataArray, insertStmt) => {
    const deleteMany = db.prepare(`DELETE FROM ${tableName}`);
    const insertMany = db.transaction((items) => {
        deleteMany.run();
        for (const item of items) {
            // Using ? placeholders prevents SQL Injection
            insertStmt.run(...Object.values(item));
        }
    });
    insertMany(dataArray);
};

// --- STUDENTS ---
app.get('/students', authenticateToken, (req, res) => {
    const students = db.prepare('SELECT * FROM students').all();
    res.json(students);
});

app.post('/students', authenticateToken, (req, res) => {
    // Bulk Replace Strategy to match script.js logic
    const insert = db.prepare(`INSERT INTO students (id, name, gender, dob, idNumber, phone, grade, stream, reg, photo, guardianName, guardianPhone, guardianRel, upiNumber, prevSchool, entryLevel, yearCompleted, nemisNumber, disability) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    try {
        bulkReplace('students', req.body, insert);
        res.json(req.body); // Echo back the saved data
    } catch (err) {
        console.error("Save Students Error:", err);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- STAFF ---
app.get('/staff', authenticateToken, (req, res) => {
    const staff = db.prepare('SELECT * FROM staff').all();
    res.json(staff);
});

app.post('/staff', authenticateToken, (req, res) => {
    const insert = db.prepare(`INSERT INTO staff (id, name, email, role, department, phone, tscNumber, photo, subjects) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    try {
        bulkReplace('staff', req.body, insert);
        res.json(req.body);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- EXAMS ---
app.get('/exams', authenticateToken, (req, res) => {
    const exams = db.prepare('SELECT * FROM exams').all();
    res.json(exams);
});

app.post('/exams', authenticateToken, (req, res) => {
    const insert = db.prepare(`INSERT INTO exams (id, studentId, subjectId, score, term, year, comments) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    
    try {
        bulkReplace('exams', req.body, insert);
        res.json(req.body);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// --- SETTINGS (Singular Object) ---
app.get('/settings', authenticateToken, (req, res) => {
    // Settings is a single row table (id = 1)
    let settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    if (!settings) {
        // Return default structure if empty
        settings = { id: 1, schoolName: "My School" }; 
    }
    res.json(settings);
});

app.post('/settings', authenticateToken, requireRole('admin'), (req, res) => {
    const data = req.body;
    data.id = 1; // Force ID to 1
    
    // Upsert (Update if exists, Insert if not)
    const upsert = db.prepare(`
        INSERT INTO settings (id, schoolName, motto, email, phone, schoolCode, academicYear, currentTerm, level, category, address, hoiName, hoiTitle, hoiTsc, hoiPhone, hoiEmail, logo, stamp, hoiSignature, ctSignature) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            schoolName=excluded.schoolName, motto=excluded.motto, email=excluded.email, phone=excluded.phone,
            schoolCode=excluded.schoolCode, academicYear=excluded.academicYear, currentTerm=excluded.currentTerm,
            level=excluded.level, category=excluded.category, address=excluded.address,
            hoiName=excluded.hoiName, hoiTitle=excluded.hoiTitle, hoiTsc=excluded.hoiTsc,
            hoiPhone=excluded.hoiPhone, hoiEmail=excluded.hoiEmail, logo=excluded.logo,
            stamp=excluded.stamp, hoiSignature=excluded.hoiSignature, ctSignature=excluded.ctSignature
    `);

    try {
        upsert.run(data.id, data.schoolName, data.motto, data.email, data.phone, data.schoolCode, data.academicYear, data.currentTerm, data.level, data.category, data.address, data.hoiName, data.hoiTitle, data.hoiTsc, data.hoiPhone, data.hoiEmail, data.logo, data.stamp, data.hoiSignature, data.ctSignature);
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save settings' });
    }
});

// --- LEARNING AREAS ---
app.get('/learningAreas', authenticateToken, (req, res) => {
    const areas = db.prepare('SELECT * FROM learningAreas').all();
    res.json(areas);
});

app.post('/learningAreas', authenticateToken, (req, res) => {
    const insert = db.prepare(`INSERT INTO learningAreas (id, name, code, applicableLevels) VALUES (?, ?, ?, ?)`);
    
    try {
        bulkReplace('learningAreas', req.body, insert);
        res.json(req.body);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// ==========================================================================
//   LEGACY / AI ROUTES
// ==========================================================================

app.get('/api/db', authenticateToken, (req, res) => {
    // To support the legacy endpoint, we have to assemble the DB manually
    try {
        const data = {
            students: db.prepare('SELECT * FROM students').all(),
            staff: db.prepare('SELECT * FROM staff').all(),
            exams: db.prepare('SELECT * FROM exams').all(),
            settings: db.prepare('SELECT * FROM settings WHERE id=1').get() || {},
            learningAreas: db.prepare('SELECT * FROM learningAreas').all(),
            users: db.prepare('SELECT id, email, role, name FROM users').all()
        };
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to load database' });
    }
});

app.post('/api/ai/chat', authenticateToken, async (req, res) => {
    const { query, context } = req.body;
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'AI Service Unconfigured' });
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({ 
                model: 'gpt-3.5-turbo', 
                messages: [
                    { role: 'system', content: `You are an assistant for ${context?.schoolName || 'the school'}.` }, 
                    { role: 'user', content: query }
                ] 
            })
        });
        if (!response.ok) throw new Error('AI API Error');
        const data = await response.json();
        res.json({ reply: data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process AI request' });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`[OK] SQLite Server running at http://localhost:${PORT}`);
    console.log(`[INFO] Database File: school.db`);
    console.log(`[INFO] Default Admin: admin@school.com / admin123`);
});
