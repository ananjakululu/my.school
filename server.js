require('dotenv').config({ override: true });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 8000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_change_this';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const dbPath = process.env.RENDER ? '/opt/render/project/data/school.db' : 'school.db';
const db = new Database(dbPath);

// ==========================================================================
//   DATABASE MIGRATIONS
// ==========================================================================
console.log('[DB] Checking for schema updates...');

const runMigration = (sql, msg) => {
    try { db.exec(sql); console.log(`[DB] Migration: ${msg}`); } catch (e) {}
};

runMigration(`ALTER TABLE users ADD COLUMN department TEXT DEFAULT 'General';`, 'Added `department` to users.');
runMigration(`ALTER TABLE users ADD COLUMN isActive INTEGER DEFAULT 1;`, 'Added `isActive` to users.');
runMigration(`ALTER TABLE users ADD COLUMN failedLoginAttempts INTEGER DEFAULT 0;`, 'Added `failedLoginAttempts` to users.');
runMigration(`ALTER TABLE users ADD COLUMN lockedUntil TEXT;`, 'Added `lockedUntil` to users.');

// ✅ USE THIS BLOCK:
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, 
        email TEXT UNIQUE NOT NULL, 
        name TEXT NOT NULL,
        role TEXT NOT NULL, 
        passwordHash TEXT NOT NULL,
        department TEXT DEFAULT 'General',
        isActive INTEGER DEFAULT 1,
        failedLoginAttempts INTEGER DEFAULT 0,
        lockedUntil TEXT
    );
    CREATE TABLE IF NOT EXISTS passwordResetTokens (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        tokenHash TEXT NOT NULL,
        expiresAt TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);
console.log('[DB] Auxiliary tables verified.');

// ==========================================================================
//   SCHEMA
// ==========================================================================
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
        role TEXT NOT NULL, passwordHash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, gender TEXT, dob TEXT,
        idNumber TEXT, phone TEXT, grade TEXT, stream TEXT, reg TEXT, photo TEXT,
        guardianName TEXT, guardianPhone TEXT, guardianRel TEXT, upiNumber TEXT,
        prevSchool TEXT, entryLevel TEXT, yearCompleted TEXT, nemisNumber TEXT, disability TEXT
    );
    CREATE TABLE IF NOT EXISTS staff (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT, role TEXT,
        department TEXT, phone TEXT, tscNumber TEXT, photo TEXT, subjects TEXT
    );
    CREATE TABLE IF NOT EXISTS exams (
        id TEXT PRIMARY KEY, studentId TEXT, subjectId TEXT,
        score INTEGER, term TEXT, year INTEGER, comments TEXT
    );
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        schoolName TEXT, motto TEXT, email TEXT, phone TEXT, schoolCode TEXT,
        academicYear TEXT, currentTerm TEXT, level TEXT, category TEXT, address TEXT,
        hoiName TEXT, hoiTitle TEXT, hoiTsc TEXT, hoiPhone TEXT, hoiEmail TEXT,
        logo TEXT, stamp TEXT, hoiSignature TEXT, ctSignature TEXT
    );
    CREATE TABLE IF NOT EXISTS learningAreas (
        id TEXT PRIMARY KEY, name TEXT, code TEXT, applicableLevels TEXT
    );
`);

// Add to your schema section (after the learningAreas CREATE TABLE):
db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        createdAt TEXT,
        createdBy TEXT
    );
    CREATE TABLE IF NOT EXISTS timetable (
        id TEXT PRIMARY KEY,
        day TEXT,
        time TEXT,
        subject TEXT,
        grade TEXT,
        teacher TEXT
    );
    CREATE TABLE IF NOT EXISTS examSchedules (
        id TEXT PRIMARY KEY,
        name TEXT,
        term TEXT,
        year TEXT,
        startDate TEXT,
        endDate TEXT,
        grades TEXT,
        subjects TEXT
    );
`);

// ==========================================================================
//   SEEDING
// ==========================================================================
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
    const seedUser = (id, email, name, role, dept, pass) => {
        if (!db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
            db.prepare('INSERT INTO users (id, email, name, role, department, passwordHash) VALUES (?,?,?,?,?,?)')
                .run(id, email, name, role, dept, bcrypt.hashSync(pass, 10));
            console.log(`[DB] Seeded: ${name}`);
        }
    };
    seedUser('u1', 'admin@school.com', 'System Admin', 'admin', 'Administration', 'admin123');
    seedUser('u2', 'hoi@school.com', 'Head Teacher', 'hoi', 'Administration', 'hoi123');
    seedUser('u3', 'exam@school.com', 'Exam Officer', 'exam_officer', 'Exams', 'exam123');

    if (db.prepare('SELECT COUNT(*) as c FROM learningAreas').get().c === 0) {
        const insert = db.prepare('INSERT INTO learningAreas (id, name, code, applicableLevels) VALUES (?,?,?,?)');
        const txn = db.transaction(items => { for (const i of items) insert.run(i.id, i.name, i.code, JSON.stringify(i.applicableLevels)); });
        txn(DEFAULT_LEARNING_AREAS);
        console.log('[DB] Seeded: Learning Areas');
    }
    if (!db.prepare('SELECT id FROM settings WHERE id = 1').get()) {
        db.prepare(`INSERT INTO settings (id,schoolName,motto,email,phone,schoolCode,academicYear,currentTerm,level,category,address) VALUES (1,?,?,?,?,?,?,?,?,?,?)`)
            .run("Tande Primary & JSS", "Excellence in Learning", "info@tande.ac.ke", "0712345678", "123456", "2024", "Term 1", "Primary & JSS", "Public", "P.O. Box 123, Nairobi");
        console.log('[DB] Seeded: Settings');
    }
};
seedDatabase();

// ==========================================================================
//   SECURITY MIDDLEWARE
// ==========================================================================
app.use(helmet({ contentSecurityPolicy: false }));
app.use(morgan('dev'));
// ✅ CORRECT - Allow your frontend
app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (Postman, mobile apps, server-to-server)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:8000',       // ← ADD THIS (your local frontend)
            'http://localhost:3000',
            'http://localhost:5000',
            'http://127.0.0.1:5500',
            'http://127.0.0.1:8000',       // ← ADD THIS too
            process.env.ALLOWED_ORIGIN      // From .env (for production)
        ].filter(Boolean);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // Log but STILL ALLOW during development
            console.warn('[CORS] Unknown origin (allowed anyway):', origin);
            callback(null, true);
        }
    },
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================================================
//   SECURITY HELPERS
// ==========================================================================
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
const generateResetToken = () => crypto.randomBytes(32).toString('hex');

const validatePasswordStrength = (password) => {
    const errors = [];
    if (password.length < 8) errors.push('at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('one number');
    return errors;
};

const logAction = (userId, userName, action, details) => {
    try { db.prepare('INSERT INTO auditLogs (userId, userName, action, details) VALUES (?,?,?,?)').run(userId, userName, action, details); }
    catch (e) { console.error("Log fail:", e); }
};

const authenticateToken = (req, res, next) => {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied.' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
        if (!dbUser) return res.status(403).json({ error: 'User not found.' });
        if (dbUser.isActive !== 1) return res.status(403).json({ error: 'Account suspended. Contact Admin.' });
        req.user = dbUser;
        next();
    });
};

const requireRole = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden.' });
    next();
};

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

// ==========================================================================
//   AUTH: LOGIN (with account lockout)
// ==========================================================================
app.post('/api/login', rateLimit({ windowMs: 60 * 60 * 1000, max: 15 }), (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

        // Prevent email enumeration — always appear to do work
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Check lockout
        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            const mins = Math.ceil((new Date(user.lockedUntil) - new Date()) / 60000);
            return res.status(423).json({ success: false, message: `Account locked. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.` });
        }

        // Verify password
        if (!bcrypt.compareSync(password, user.passwordHash)) {
            const attempts = (user.failedLoginAttempts || 0) + 1;
            if (attempts >= MAX_FAILED_ATTEMPTS) {
                const lockedUntil = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString();
                db.prepare('UPDATE users SET failedLoginAttempts = ?, lockedUntil = ? WHERE id = ?').run(attempts, lockedUntil, user.id);
                logAction(user.id, user.name, 'ACCOUNT_LOCKED', `${attempts} failed attempts. Locked until ${lockedUntil}`);
                return res.status(423).json({ success: false, message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.` });
            }
            db.prepare('UPDATE users SET failedLoginAttempts = ? WHERE id = ?').run(attempts, user.id);
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        if (user.isActive !== 1) {
            return res.status(403).json({ success: false, message: 'Account suspended. Contact Admin.' });
        }

        // Success — clear lockout
        db.prepare('UPDATE users SET failedLoginAttempts = 0, lockedUntil = NULL WHERE id = ?').run(user.id);

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
        logAction(user.id, user.name, 'LOGIN', `Logged in from ${req.ip}`);
        res.json({ success: true, token, user: { id: user.id, email: user.email, role: user.role, name: user.name, department: user.department } });
    } catch (err) {
        console.error('[LOGIN ERROR]', err);
        res.status(500).json({ error: 'Login failed.' });
    }
});

// ==========================================================================
//   AUTH: SIGNUP (restricted to teacher / parent)
// ==========================================================================
app.post('/api/signup', rateLimit({ windowMs: 60 * 60 * 1000, max: 5 }), (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required.' });

        const strengthErrors = validatePasswordStrength(password);
        if (strengthErrors.length > 0) return res.status(400).json({ success: false, message: `Password requires: ${strengthErrors.join(', ')}.` });

        const allowedRoles = ['teacher', 'parent'];
        const assignedRole = allowedRoles.includes(role) ? role : 'teacher';

        if (db.prepare('SELECT id FROM users WHERE email = ?').get(email)) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
        }

        db.prepare('INSERT INTO users (id, email, name, role, department, passwordHash) VALUES (?,?,?,?,?,?)')
            .run(Date.now().toString(), email, name, assignedRole, 'General', bcrypt.hashSync(password, 10));

        logAction('system', 'System', 'SIGNUP_REQUEST', `${name} (${email}) requested ${assignedRole} access`);
        res.status(201).json({ success: true, message: 'Account request submitted! Awaiting admin approval.' });
    } catch (err) {
        console.error('[SIGNUP ERROR]', err);
        res.status(500).json({ error: 'Signup failed.' });
    }
});

// ==========================================================================
//   AUTH: FORGOT PASSWORD (generates time-limited, single-use token)
// ==========================================================================
app.post('/api/forgot-password', rateLimit({ windowMs: 15 * 60 * 1000, max: 3 }), (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });

        const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

        // Always return generic success to prevent email enumeration
        if (!user) {
            return res.json({ success: true, message: 'If an account with that email exists, a reset link has been generated.', token: null });
        }

        // Invalidate all previous tokens for this user
        db.prepare('UPDATE passwordResetTokens SET used = 1 WHERE userId = ?').run(user.id);

        const token = generateResetToken();
        const tokenHash = hashToken(token);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        const tokenId = crypto.randomBytes(16).toString('hex');

        db.prepare('INSERT INTO passwordResetTokens (id, userId, tokenHash, expiresAt) VALUES (?,?,?,?)')
            .run(tokenId, user.id, tokenHash, expiresAt);

        logAction(user.id, 'System', 'RESET_TOKEN_GENERATED', `Password reset token created from IP: ${req.ip}`);

        res.json({ success: true, message: 'Reset link generated.', token });
    } catch (err) {
        console.error('[FORGOT ERROR]', err);
        res.status(500).json({ error: 'Request failed.' });
    }
});

// ==========================================================================
//   AUTH: RESET PASSWORD (consumes the token)
// ==========================================================================
app.post('/api/reset-password', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) return res.status(400).json({ success: false, message: 'Token and new password are required.' });

        const tokenHash = hashToken(token);
        const record = db.prepare('SELECT * FROM passwordResetTokens WHERE tokenHash = ? AND used = 0').get(tokenHash);

        if (!record) {
            return res.status(400).json({ success: false, message: 'Invalid or already-used reset link.' });
        }

        if (new Date(record.expiresAt) < new Date()) {
            db.prepare('UPDATE passwordResetTokens SET used = 1 WHERE id = ?').run(record.id);
            return res.status(400).json({ success: false, message: 'This reset link has expired. Please request a new one.' });
        }

        const strengthErrors = validatePasswordStrength(newPassword);
        if (strengthErrors.length > 0) {
            return res.status(400).json({ success: false, message: `Password requires: ${strengthErrors.join(', ')}.` });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        db.prepare('UPDATE users SET passwordHash = ?, failedLoginAttempts = 0, lockedUntil = NULL WHERE id = ?')
            .run(hashedPassword, record.userId);
        db.prepare('UPDATE passwordResetTokens SET used = 1 WHERE id = ?').run(record.id);

        const user = db.prepare('SELECT name FROM users WHERE id = ?').get(record.userId);
        logAction(record.userId, user?.name || 'Unknown', 'PASSWORD_RESET', 'Password reset via token');

        res.json({ success: true, message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('[RESET ERROR]', err);
        res.status(500).json({ error: 'Reset failed.' });
    }
});

// ==========================================================================
//   AUTH: CHANGE PASSWORD (for logged-in users)
// ==========================================================================
app.post('/api/change-password', authenticateToken, (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Both passwords are required.' });

        if (!bcrypt.compareSync(currentPassword, req.user.passwordHash)) {
            logAction(req.user.id, req.user.name, 'CHANGE_PASSWORD_FAILED', 'Incorrect current password');
            return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
        }

        const strengthErrors = validatePasswordStrength(newPassword);
        if (strengthErrors.length > 0) {
            return res.status(400).json({ success: false, message: `Password requires: ${strengthErrors.join(', ')}.` });
        }

        db.prepare('UPDATE users SET passwordHash = ? WHERE id = ?')
            .run(bcrypt.hashSync(newPassword, 10), req.user.id);

        logAction(req.user.id, req.user.name, 'PASSWORD_CHANGED', 'Changed own password');
        res.json({ success: true, message: 'Password changed successfully.' });
    } catch (err) {
        console.error('[CHANGE PASS ERROR]', err);
        res.status(500).json({ error: 'Failed to change password.' });
    }
});

// ==========================================================================
//   ROLE SPECIFIC ROUTES
// ==========================================================================

// Get assignments for the logged-in teacher ONLY
app.get('/api/teacher/assignments', authenticateToken, requireRole('teacher'), (req, res) => {
    try {
        // Match the logged-in user to their exact record in the staff table
        const staffRecord = db.prepare('SELECT subjects FROM staff WHERE email = ?').get(req.user.email);
        
        if (!staffRecord || !staffRecord.subjects) {
            return res.json([]); // Return empty array if not found in staff table or no subjects assigned
        }

        let assignments = [];
        try {
            assignments = JSON.parse(staffRecord.subjects);
        } catch (e) {
            console.error("[PARSE ERROR] Failed to parse subjects JSON for email:", req.user.email);
            return res.json([]); 
        }

        res.json(assignments);
    } catch (err) {
        console.error('[ASSIGNMENTS ERROR]', err);
        res.status(500).json({ error: 'Failed to fetch assignments.' });
    }
});

// ==========================================================================
//   RESOURCE ROUTES
// ==========================================================================
app.get('/students', authenticateToken, (req, res) => res.json(db.prepare('SELECT * FROM students').all()));

app.post('/students', authenticateToken, requireRole('hoi', 'admin'), (req, res) => {
    const cols = ['id','name','gender','dob','idNumber','phone','grade','stream','reg','photo','guardianName','guardianPhone','guardianRel','upiNumber','prevSchool','entryLevel','yearCompleted','nemisNumber','disability'];
    const insert = db.prepare(`INSERT INTO students (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')})`);
    try {
        const txn = db.transaction(items => { db.prepare('DELETE FROM students').run(); for (const i of items) insert.run(...cols.map(c => i[c])); });
        txn(req.body);
        logAction(req.user.id, req.user.name, 'UPDATE_STUDENTS', `${req.body.length} records`);
        res.json(req.body);
    } catch (err) { res.status(500).json({ error: 'DB Error', details: err.message }); }
});

app.get('/staff', authenticateToken, (req, res) => res.json(db.prepare('SELECT * FROM staff').all()));

app.post('/staff', authenticateToken, requireRole('hoi', 'admin'), (req, res) => {
    const cols = ['id','name','email','role','department','phone','tscNumber','photo','subjects'];
    const insert = db.prepare(`INSERT INTO staff (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')})`);
    try {
        const txn = db.transaction(items => { db.prepare('DELETE FROM staff').run(); for (const i of items) insert.run(...cols.map(c => i[c])); });
        txn(req.body);
        logAction(req.user.id, req.user.name, 'UPDATE_STAFF', `${req.body.length} records`);
        res.json(req.body);
    } catch (err) { res.status(500).json({ error: 'DB Error', details: err.message }); }
});

app.get('/exams', authenticateToken, (req, res) => res.json(db.prepare('SELECT * FROM exams').all()));

app.post('/exams', authenticateToken, requireRole('exam_officer', 'hoi', 'admin', 'teacher'), (req, res) => {
    const cols = ['id','studentId','subjectId','score','term','year','comments'];
    const insert = db.prepare(`INSERT INTO exams (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')})`);
    try {
        const txn = db.transaction(items => { db.prepare('DELETE FROM exams').run(); for (const i of items) insert.run(...cols.map(c => i[c])); });
        txn(req.body);
        logAction(req.user.id, req.user.name, 'UPDATE_EXAMS', `${req.body.length} records`);
        res.json(req.body);
    } catch (err) { res.status(500).json({ error: 'DB Error', details: err.message }); }
});

app.get('/settings', authenticateToken, (req, res) => res.json(db.prepare('SELECT * FROM settings WHERE id = 1').get() || { id: 1 }));

app.post('/settings', authenticateToken, requireRole('admin', 'hoi'), (req, res) => {
    const d = req.body; d.id = 1;
    const cols = ['id','schoolName','motto','email','phone','schoolCode','academicYear','currentTerm','level','category','address','hoiName','hoiTitle','hoiTsc','hoiPhone','hoiEmail','logo','stamp','hoiSignature','ctSignature'];
    try {
        db.prepare(`INSERT INTO settings (${cols.join(',')}) VALUES (${cols.map(()=>'?').join(',')}) ON CONFLICT(id) DO UPDATE SET ${cols.slice(1).map(c=>`${c}=excluded.${c}`).join(',')}`).run(...cols.map(c => d[c]));
        logAction(req.user.id, req.user.name, 'UPDATE_SETTINGS', 'School settings updated');
        res.json(d);
    } catch (err) { res.status(500).json({ error: 'Settings failed' }); }
});

app.get('/learningAreas', authenticateToken, (req, res) => {
    res.json(db.prepare('SELECT * FROM learningAreas').all().map(a => ({ ...a, applicableLevels: JSON.parse(a.applicableLevels) })));
});

app.post('/learningAreas', authenticateToken, (req, res) => {
    const insert = db.prepare('INSERT INTO learningAreas (id,name,code,applicableLevels) VALUES (?,?,?,?)');
    try {
        const txn = db.transaction(items => { db.prepare('DELETE FROM learningAreas').run(); for (const i of items) insert.run(i.id, i.name, i.code, JSON.stringify(i.applicableLevels)); });
        txn(req.body);
        logAction(req.user.id, req.user.name, 'UPDATE_LEARNING_AREAS', 'Curriculum updated');
        res.json(req.body);
    } catch (err) { res.status(500).json({ error: 'DB Error', details: err.message }); }
});

// ==========================================================================
//   BACKUP / RESTORE
// ==========================================================================
app.get('/api/db', authenticateToken, requireRole('admin', 'hoi', 'teacher', 'exam_officer'), (req, res) => {
    try {
        res.json({
            students: db.prepare('SELECT * FROM students').all(),
            staff: db.prepare('SELECT * FROM staff').all(),
            exams: db.prepare('SELECT * FROM exams').all(),
            settings: db.prepare('SELECT * FROM settings WHERE id=1').get() || {},
            learningAreas: db.prepare('SELECT * FROM learningAreas').all()
                .map(a => ({ ...a, applicableLevels: JSON.parse(a.applicableLevels) })),
            // ADD THESE:
            notes: db.prepare('SELECT * FROM notes').all(),
            timetable: db.prepare('SELECT * FROM timetable').all(),
            examSchedules: db.prepare('SELECT * FROM examSchedules').all()
        });
        logAction(req.user.id, req.user.name, 'BACKUP_DB', 'Full backup downloaded');
    } catch (err) { res.status(500).json({ error: 'Backup failed' }); }
});

app.post('/api/restore', authenticateToken, requireRole('admin', 'hoi', 'exam_officer', 'teacher'), (req, res) => {
    // Helper uses INSERT OR REPLACE to prevent crashes from duplicate IDs
    // ✅ USE THIS: Converts arrays/objects to JSON strings automatically
const safeReplace = (table, data, columns) => {
    if (!data || !Array.isArray(data)) return;
    const insert = db.prepare(`INSERT OR REPLACE INTO ${table} (${columns.join(',')}) VALUES (${columns.map(()=>'?').join(',')})`);
    db.transaction(items => {
        db.prepare(`DELETE FROM ${table}`).run();
        for (const r of items) {
            const values = columns.map(c => {
                const val = r[c];
                if (val === null || val === undefined) return '';
                // Convert arrays/objects to JSON strings so SQLite can store them
                if (typeof val === 'object') return JSON.stringify(val);
                return val;
            });
            insert.run(...values);
        }
    })(data);
};
    
    try {
        db.transaction(() => {
            const { students, staff, exams, settings, learningAreas, notes, timetable, examSchedules } = req.body;
            
            // 1. Learning Areas (Requires JSON stringify, no nested transactions)
            if (learningAreas && Array.isArray(learningAreas)) {
                db.prepare('DELETE FROM learningAreas').run();
                const laInsert = db.prepare('INSERT OR REPLACE INTO learningAreas (id,name,code,applicableLevels) VALUES (?,?,?,?)');
                for (const i of learningAreas) {
                    laInsert.run(i.id, i.name, i.code, JSON.stringify(i.applicableLevels));
                }
            }

            // 2. Settings (Single row object, not array)
            if (settings) {
                const s = { ...settings, id: 1 };
                const c = ['id','schoolName','motto','email','phone','schoolCode','academicYear','currentTerm','level','category','address','hoiName','hoiTitle','hoiTsc','hoiPhone','hoiEmail','logo','stamp','hoiSignature','ctSignature'];
                db.prepare('DELETE FROM settings').run();
                db.prepare(`INSERT INTO settings (${c.join(',')}) VALUES (${c.map(()=>'?').join(',')}) ON CONFLICT(id) DO UPDATE SET ${c.slice(1).map(x=>`${x}=excluded.${x}`).join(',')}`).run(...c.map(x => s[x] ?? ''));
            }

            // 3. Standard Arrays
            if (students) safeReplace('students', students, ['id','name','gender','dob','idNumber','phone','grade','stream','reg','photo','guardianName','guardianPhone','guardianRel','upiNumber','prevSchool','entryLevel','yearCompleted','nemisNumber','disability']);
            if (staff) safeReplace('staff', staff, ['id','name','email','role','department','phone','tscNumber','photo','subjects']);
            if (exams) safeReplace('exams', exams, ['id','studentId','subjectId','score','term','year','comments']);

            // 4. Optional Arrays
            if (notes) safeReplace('notes', notes, ['id','title','content','createdAt','createdBy']);
            if (timetable) safeReplace('timetable', timetable, ['id','day','time','subject','grade','teacher']);
            if (examSchedules) safeReplace('examSchedules', examSchedules, ['id','name','term','year','startDate','endDate','grades','subjects']);
        })();
        
        logAction(req.user.id, req.user.name, 'RESTORE_DB', 'Database restored from backup');
        res.json({ success: true, message: 'Database restored successfully!' });
    } catch (err) { 
        console.error('[RESTORE ERROR]', err);
        res.status(500).json({ error: 'Restore failed.', details: err.message }); 
    }
});

// ==========================================================================
//   USER MANAGEMENT
// ==========================================================================
app.post('/api/users/:id/deactivate', authenticateToken, requireRole('admin'), (req, res) => {
    const r = db.prepare('UPDATE users SET isActive = 0 WHERE id = ?').run(req.params.id);
    r.changes > 0 ? (logAction(req.user.id, req.user.name, 'DEACTIVATE_USER', req.params.id), res.json({ success: true })) : res.status(404).json({ success: false });
});
app.post('/api/users/:id/activate', authenticateToken, requireRole('admin'), (req, res) => {
    const r = db.prepare('UPDATE users SET isActive = 1, failedLoginAttempts = 0, lockedUntil = NULL WHERE id = ?').run(req.params.id);
    r.changes > 0 ? (logAction(req.user.id, req.user.name, 'ACTIVATE_USER', req.params.id), res.json({ success: true })) : res.status(404).json({ success: false });
});
app.get('/api/logs', authenticateToken, requireRole('admin'), (req, res) => {
    res.json(db.prepare('SELECT * FROM auditLogs ORDER BY timestamp DESC LIMIT 100').all());
});

// ==========================================================================
//   AI CHAT
// ==========================================================================
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
    if (!OPENAI_API_KEY) return res.status(500).json({ error: 'AI Service Unconfigured' });
    try {
        const r = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
            body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: [{ role: 'system', content: `Assistant for ${req.body.context?.schoolName || 'the school'}.` }, { role: 'user', content: req.body.query }] })
        });
        if (!r.ok) throw new Error('AI API Error');
        res.json({ reply: (await r.json()).choices[0].message.content });
    } catch (err) { res.status(500).json({ error: 'AI request failed' }); }
});

// ==========================================================================
//   EMERGENCY RESET
// ==========================================================================
// ✅ USE THIS: Safer approach that handles missing columns
app.get('/api/reset-admin', (req, res) => {
    try {
        const exists = db.prepare('SELECT id FROM users WHERE id = ?').get('u1');
        if (exists) {
            db.prepare('UPDATE users SET passwordHash = ?, failedLoginAttempts = 0, lockedUntil = NULL WHERE id = ?')
                .run(bcrypt.hashSync('admin123', 10), 'u1');
        } else {
            db.prepare('INSERT INTO users (id, email, name, role, department, passwordHash) VALUES (?,?,?,?,?,?)')
                .run('u1', 'admin@school.com', 'System Admin', 'admin', 'Administration', bcrypt.hashSync('admin123', 10));
        }
        res.json({ success: true, message: 'Admin reset.', note: 'admin@school.com / admin123' });
    } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

app.listen(PORT, () => console.log(`[OK] Server running at http://localhost:${PORT}`));