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

// 2. Initialize Database (Creates 'school.db' file)
// Check if running on Render (Linux) or Local
const dbPath = process.env.RENDER ? '/opt/render/project/data/school.db' : 'school.db';
const db = new Database(dbPath);

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

    CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY,
        studentId TEXT,
        subjectId TEXT,
        score INTEGER,
        term TEXT,
        year INTEGER,
        comments TEXT
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

    CREATE TABLE IF NOT EXISTS learningAreas (
        id TEXT PRIMARY KEY,
        name TEXT,
        code TEXT,
        applicableLevels TEXT -- Stored as JSON string
    );
`);

// 4. Initialize Default Data (Seeding)
const DEFAULT_LEARNING_AREAS = [
    { id: 'pp_lang', name: 'Language Activities', code: 'PP-LA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_math', name: 'Mathematics Activities', code: 'PP-MA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_creative', name: 'Creative Activities', code: 'PP-CA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_env', name: 'Environmental Activities', code: 'PP-EA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'lp_lit', name: 'Literacy Activities', code: 'LP-LIT', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_math', name: 'Mathematics', code: 'LP-MATH', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_env', name: 'Environmental Activities', code: 'LP-EA', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'ms_eng', name: 'English', code: 'MS-ENG', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_kis', name: 'Kiswahili', code: 'MS-KIS', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_math', name: 'Mathematics', code: 'MS-MATH', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_sci', name: 'Science & Technology', code: 'MS-SCI', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_ss', name: 'Social Studies', code: 'MS-SS', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'js_eng', name: 'English', code: 'JS-ENG', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_kis', name: 'Kiswahili', code: 'JS-KIS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_math', name: 'Mathematics', code: 'JS-MATH', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_sci', name: 'Integrated Science', code: 'JS-SCI', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_ss', name: 'Social Studies', code: 'JS-SS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_pretech', name: 'Pre-Technical Studies', code: 'JS-PT', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] }
];

const seedDatabase = () => {
    // Seed Admin
    const admin = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@school.com');
    if (!admin) {
        const hashedPass = bcrypt.hashSync('admin123', 10);
        const insert = db.prepare('INSERT INTO users (id, email, name, role, passwordHash) VALUES (?, ?, ?, ?, ?)');
        insert.run('u1', 'admin@school.com', 'Admin User', 'admin', hashedPass);
        console.log('[DB] Default Admin created.');
    }

    // Seed Learning Areas
    const laCount = db.prepare('SELECT COUNT(*) as c FROM learningAreas').get().c;
    if (laCount === 0) {
        const insert = db.prepare('INSERT INTO learningAreas (id, name, code, applicableLevels) VALUES (?, ?, ?, ?)');
        const insertMany = db.transaction((items) => {
            for(const item of items) {
                insert.run(item.id, item.name, item.code, JSON.stringify(item.applicableLevels));
            }
        });
        insertMany(DEFAULT_LEARNING_AREAS);
        console.log('[DB] Default Learning Areas seeded.');
    }

    // Seed Settings
    const settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    if (!settings) {
        const insert = db.prepare(`INSERT INTO settings (id, schoolName, motto, email, phone, schoolCode, academicYear, currentTerm, level, category, address) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
        insert.run(
            "Tande Primary & JSS", 
            "Excellence in Learning",
            "info@tande.ac.ke",
            "0712345678",
            "123456",
            "2024",
            "Term 1",
            "Primary & JSS",
            "Public",
            "P.O. Box 123, Nairobi"
        );
        console.log('[DB] Default Settings seeded.');
    }
};

seedDatabase();

// --- SECURITY CONFIGURATION ---
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
const loginLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 10 });

app.use(helmet({
    contentSecurityPolicy: false // Disabled for easier dev with json-server-like behavior
}));

app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
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
//   AUTHENTICATION ROUTES
// ==========================================================================

app.post('/api/login', loginLimiter, (req, res) => {
    try {
        const { email, password } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
        if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/signup', (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existing) return res.status(400).json({ success: false, message: 'User already exists.' });
        const hashedPassword = bcrypt.hashSync(password, 10);
        const insert = db.prepare('INSERT INTO users (id, email, name, role, passwordHash) VALUES (?, ?, ?, ?, ?)');
        insert.run(Date.now().toString(), email, name, 'teacher', hashedPassword);
        res.status(201).json({ success: true, message: 'Account created!' });
    } catch (err) {
        res.status(500).json({ error: 'Signup failed' });
    }
});

// ==========================================================================
//   RESTful RESOURCE ROUTES (SQLite Version)
// ==========================================================================

// Helper to handle Bulk Replace (Delete All -> Insert All)
const bulkReplace = (tableName, dataArray, insertStmt) => {
    const deleteMany = db.prepare(`DELETE FROM ${tableName}`);
    const insertMany = db.transaction((items) => {
        deleteMany.run();
        for (const item of items) {
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
    // 1. Define the exact column order from your SQL Schema
    const studentColumns = [
        'id', 'name', 'gender', 'dob', 'idNumber', 'phone', 
        'grade', 'stream', 'reg', 'photo', 
        'guardianName', 'guardianPhone', 'guardianRel', 
        'upiNumber', 'prevSchool', 'entryLevel', 'yearCompleted', 'nemisNumber', 'disability'
    ];

    // 2. Helper to map the array of objects to an array of arrays in the correct order
    const mapStudentData = (dataArray) => {
        return dataArray.map(item => studentColumns.map(col => item[col]));
    };

    // 3. Create the prepared statement
    const insert = db.prepare(`
        INSERT INTO students (${studentColumns.join(', ')}) 
        VALUES (${studentColumns.map(() => '?').join(', ')})
    `);

    try {
        const deleteMany = db.prepare(`DELETE FROM students`);
        
        const insertMany = db.transaction((items) => {
            deleteMany.run();
            // Use the mapped data instead of Object.values
            const rowsToInsert = mapStudentData(items);
            for (const row of rowsToInsert) {
                insert.run(...row);
            }
        });
        
        insertMany(req.body);
        res.json(req.body);
    } catch (err) {
        console.error("Student Save Error:", err);
        res.status(500).json({ error: 'DB Error', details: err.message });
    }
});

// --- STAFF ---
app.get('/staff', authenticateToken, (req, res) => {
    const staff = db.prepare('SELECT * FROM staff').all();
    res.json(staff);
});

app.post('/staff', authenticateToken, (req, res) => {
    // 1. Define the exact column order from your SQL Schema
    const staffColumns = [
        'id', 'name', 'email', 'role', 'department', 'phone', 
        'tscNumber', 'photo', 'subjects'
    ];

    // 2. Helper to map the array of objects
    const mapStaffData = (dataArray) => {
        return dataArray.map(item => staffColumns.map(col => item[col]));
    };

    // 3. Create the prepared statement
    const insert = db.prepare(`
        INSERT INTO staff (${staffColumns.join(', ')}) 
        VALUES (${staffColumns.map(() => '?').join(', ')})
    `);

    try {
        const deleteMany = db.prepare(`DELETE FROM staff`);
        
        const insertMany = db.transaction((items) => {
            deleteMany.run();
            // Use the mapped data
            const rowsToInsert = mapStaffData(items);
            for (const row of rowsToInsert) {
                insert.run(...row);
            }
        });
        
        insertMany(req.body);
        res.json(req.body);
    } catch (err) {
        console.error("Staff Save Error:", err);
        res.status(500).json({ error: 'DB Error', details: err.message });
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
        res.status(500).json({ error: 'DB Error' });
    }
});

// --- SETTINGS ---
app.get('/settings', authenticateToken, (req, res) => {
    let settings = db.prepare('SELECT * FROM settings WHERE id = 1').get();
    if (!settings) settings = { id: 1 }; // Fallback
    res.json(settings);
});

app.post('/settings', authenticateToken, requireRole('admin'), (req, res) => {
    const data = req.body;
    data.id = 1;
    const upsert = db.prepare(`
        INSERT INTO settings (id, schoolName, motto, email, phone, schoolCode, academicYear, currentTerm, level, category, address, hoiName, hoiTitle, hoiTsc, hoiPhone, hoiEmail, logo, stamp, hoiSignature, ctSignature) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        res.status(500).json({ error: 'Settings failed' });
    }
});

// --- LEARNING AREAS ---
app.get('/learningAreas', authenticateToken, (req, res) => {
    const areas = db.prepare('SELECT * FROM learningAreas').all();
    // Convert JSON string back to Array
    res.json(areas.map(a => ({ ...a, applicableLevels: JSON.parse(a.applicableLevels) })));
});

app.post('/learningAreas', authenticateToken, (req, res) => {
    const insert = db.prepare(`INSERT INTO learningAreas (id, name, code, applicableLevels) VALUES (?, ?, ?, ?)`);
    try {
        // Convert Array back to String for storage
        const dataToStore = req.body.map(item => ({ ...item, applicableLevels: JSON.stringify(item.applicableLevels) }));
        bulkReplace('learningAreas', dataToStore, insert);
        res.json(dataToStore);
    } catch (err) {
        res.status(500).json({ error: 'DB Error' });
    }
});

// ==========================================================================
//   LEGACY / BACKUP ROUTES
// ==========================================================================

// API: Get Full DB (Legacy - for reference if needed)
app.get('/api/db', authenticateToken, (req, res) => {
    try {
        const data = {
            students: db.prepare('SELECT * FROM students').all(),
            staff: db.prepare('SELECT * FROM staff').all(),
            exams: db.prepare('SELECT * FROM exams').all(),
            settings: db.prepare('SELECT * FROM settings WHERE id=1').get() || {},
            learningAreas: db.prepare('SELECT * FROM learningAreas').all().map(a => ({ ...a, applicableLevels: JSON.parse(a.applicableLevels) })),
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
        res.status(500).json({ error: 'Failed to process AI request' });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`[OK] SQLite Server running at http://localhost:${PORT}`);
    console.log(`[INFO] Database File: school.db`);
    console.log(`[INFO] Default Admin: admin@school.com / admin123`);

});
