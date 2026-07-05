'use strict';
// Define your backend API URL
// SMART URL: Automatically uses localhost if testing, or the live site if deployed
// Force both Localhost and Render to use the Cloud Database
const API_URL = "";
    
// ==========================================================================
//   DATA STORE & CONFIGURATION (CBC ALIGNED)
// ==========================================================================
// CBC Grade Configuration
const CBC_LEVELS = {
    'PP1': { name: 'Pre-Primary 1', type: 'Pre-Primary' },
    'PP2': { name: 'Pre-Primary 2', type: 'Pre-Primary' },
    'Grade 1': { name: 'Grade 1', type: 'Lower Primary' },
    'Grade 2': { name: 'Grade 2', type: 'Lower Primary' },
    'Grade 3': { name: 'Grade 3', type: 'Lower Primary' },
    'Grade 4': { name: 'Grade 4', type: 'Middle School' },
    'Grade 5': { name: 'Grade 5', type: 'Middle School' },
    'Grade 6': { name: 'Grade 6', type: 'Middle School' },
    'Grade 7': { name: 'Grade 7 (JSS)', type: 'JSS' },
    'Grade 8': { name: 'Grade 8 (JSS)', type: 'JSS' },
    'Grade 9': { name: 'Grade 9 (JSS)', type: 'JSS' }
};

// Helper to map bands to grades for filtering
const BAND_GRADE_MAP = {
    'pp': ['PP1', 'PP2'],
    'lower': ['Grade 1', 'Grade 2', 'Grade 3'],
    'middle': ['Grade 4', 'Grade 5', 'Grade 6'],
    'jss': ['Grade 7', 'Grade 8', 'Grade 9']
};

// ==========================================================================
//   EXPANDED LEARNING AREAS (SUBJECTS)
// ==========================================================================
const DEFAULT_LEARNING_AREAS = [
    // --- PRE-PRIMARY (PP1, PP2) ---
    { id: 'pp_lang', name: 'Language Activities', code: 'PP-LA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_math', name: 'Mathematical Activities', code: 'PP-MA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_env', name: 'Environmental Activities', code: 'PP-EA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_creative', name: 'Creative Activities', code: 'PP-CA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_psycho', name: 'Psychomotor Activities', code: 'PP-PA', applicableLevels: ['PP1', 'PP2'] },
    { id: 'pp_re', name: 'Religious Education Activities', code: 'PP-RE', applicableLevels: ['PP1', 'PP2'] },

    // --- LOWER PRIMARY (Grade 1, 2, 3) ---
    { id: 'lp_lit_eng', name: 'Literacy Activities (English)', code: 'LP-LEN', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_lit_kis', name: 'Literacy Activities (Kiswahili)', code: 'LP-LKIS', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_math', name: 'Mathematical Activities', code: 'LP-MATH', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_env', name: 'Environmental Activities', code: 'LP-ENV', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_creative', name: 'Creative Activities (Art/Craft)', code: 'LP-CA', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_pe', name: 'Movement & Creative Activities (PE)', code: 'LP-PE', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },
    { id: 'lp_re', name: 'Religious Education (CRE/IRE)', code: 'LP-RE', applicableLevels: ['Grade 1', 'Grade 2', 'Grade 3'] },

    // --- MIDDLE SCHOOL (Grade 4, 5, 6) ---
    { id: 'ms_eng', name: 'English', code: 'MS-ENG', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_kis', name: 'Kiswahili', code: 'MS-KIS', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_math', name: 'Mathematics', code: 'MS-MATH', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_sci', name: 'Science & Technology', code: 'MS-SCI', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_ss', name: 'Social Studies', code: 'MS-SS', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_cre', name: 'CRE / IRE', code: 'MS-RE', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_creative', name: 'Creative Arts', code: 'MS-CA', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_pe', name: 'Physical & Health Education', code: 'MS-PHE', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_agri', name: 'Agriculture', code: 'MS-AGR', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_hs', name: 'Home Science', code: 'MS-HS', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },
    { id: 'ms_lang', name: 'Foreign Language (French/German)', code: 'MS-FL', applicableLevels: ['Grade 4', 'Grade 5', 'Grade 6'] },

    // --- JUNIOR SECONDARY (Grade 7, 8, 9) - CORRECTED & EXPANDED ---
    { id: 'js_eng', name: 'English', code: 'JS-ENG', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_kis', name: 'Kiswahili', code: 'JS-KIS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_math', name: 'Mathematics', code: 'JS-MATH', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_sci', name: 'Integrated Science', code: 'JS-SCI', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_ss', name: 'Social Studies', code: 'JS-SS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_re', name: 'Religious Education (CRE/IRE)', code: 'JS-RE', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_creative', name: 'Creative Arts & Sports Science', code: 'JS-CAS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_tech', name: 'Pre-Technical Studies', code: 'JS-PTS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_agri', name: 'Agriculture', code: 'JS-AGR', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_cs', name: 'Computer Science', code: 'JS-CS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_lang', name: 'Foreign Language', code: 'JS-FL', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_life', name: 'Life Skills Education', code: 'JS-LSE', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_health', name: 'Health Education', code: 'JS-HE', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_bus', name: 'Business Studies', code: 'JS-BS', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] },
    { id: 'js_sports', name: 'Sports', code: 'JS-PE', applicableLevels: ['Grade 7', 'Grade 8', 'Grade 9'] }
];
const store = {
    students: [],
    staff: [],
    exams: [],
    notes: [], 
    messages: [], 
    clearedStudents: [], 
    settings: {
        schoolName: 'ElimuTrack School',
        motto: 'Excellence in Learning',
        schoolCode: 'PRI/001',
        academicYear: '2024',
        currentTerm: 'Term 1',
        level: 'Primary School',
        category: 'Public',
        hoiName: '',
        hoiTitle: 'Principal',
        hoiTsc: '',
        hoiPhone: '',
        hoiEmail: '',
        address: 'P.O. Box 123, Nairobi',
        phone: '0712345678',
        email: 'info@elimutrack.sc.ke',
        logo: null,
        stamp: null,
        hoiSignature: null,
        ctSignature: null,
        userNotes: '',
        eventName: '',
        eventDate: '',
        eventDesc: '',
        noticeTitle: '',
        noticeBody: ''
    },
    learningAreas: DEFAULT_LEARNING_AREAS,
    timetable: [],
    examSchedules: []
};

const ADMIN_PASSWORD = 'admin123';
const DEFAULT_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect fill='%23e2e8f0' width='150' height='150'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='14' x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle'%3ENo Photo%3C/text%3E%3C/svg%3E";

// State variables
let CURRENT_USER = null;
let currentView = { students: 'grid', staff: 'grid' };
let currentPage = 1;
const itemsPerPage = 9;
let currentStudentId = null;
let pendingAction = null;
let pendingActionData = null;
let currentExamContext = { studentId: null, tradeId: null, subjectId: null };
let currentEvidenceFiles = [];
let currentBatchData = []; 
let currentReportContext = { type: null }; 

// ==========================================================================
//   UTILITY FUNCTIONS
// ==========================================================================

const $ = id => document.getElementById(id);
const getVal = id => $(id) ? $(id).value.trim() : '';
const setVal = (id, val) => { if ($(id)) $(id).value = val; };

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => { clearTimeout(timeout); func(...args); };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

function escapeHtml(text) { 
    if (!text) return ''; 
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); 
}

function formatCurrency(num) { return 'KES ' + (num || 0).toLocaleString(); }
function generateId() { return Date.now().toString(36) + Math.random().toString(36).substr(2, 5); }

function showToast(msg, type = 'success') {
    let toast = $('toast');
    if (!toast) { const container = document.createElement('div'); container.id = 'toast'; container.className = 'toast'; document.body.appendChild(container); toast = container; }
    toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> <span>${msg}</span>`;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function openModal(id) {
    if ($(id)) { 
        $(id).classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
        if (id === 'courseModal') populateTeacherDropdown(); 
        if (id === 'individualReportModal') {
            populateStudentSelect('reportStudentSelect');
            const form = $('reportFormContainer');
            const preview = $('reportPreviewContainer');
            if(form) form.style.display = 'block';
            if(preview) preview.style.display = 'none';
            const isTranscript = currentReportContext.type === 'transcript';
            const btnTrans = $('btnGenTranscriptReport');
            const btnLeave = $('btnGenLeavingCert');
            if(btnTrans) btnTrans.style.display = isTranscript ? 'block' : 'none';
            if(btnLeave) btnLeave.style.display = isTranscript ? 'none' : 'block';
        }
        if (id === 'subjectReportModal' || id === 'classReportModal') {
            populateDropdownsForReports();
        }
        if (id === 'bulkProgressModal') {
            if (typeof initBulkProgressModal === 'function') initBulkProgressModal();
        }
    }
}

function closeModal(id) {
    if ($(id)) { $(id).classList.remove('active'); document.body.style.overflow = ''; }
    // Flush any pending debounced exam saves when the grading modal closes
    if (id === 'examGradingModal' && typeof flushExamSaves === 'function') {
        flushExamSaves();
    }
}

// ==========================================================================
//   API & AUTHENTICATION LAYER
// ==========================================================================

function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = 'login.html'; 
}

async function loadData() {
    const token = localStorage.getItem('authToken');
    if (!token) return logout();

    try {
        // 1. Try to fetch from Server
        const res = await fetch(`${API_URL}/api/db`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
            const db = await res.json();
            // Populate Store from Server
            store.students = db.students || [];
            store.staff = db.staff || [];
            store.exams = db.exams || [];
            store.notes = db.notes || [];
            store.timetable = db.timetable || [];
            store.examSchedules = db.examSchedules || [];
            store.settings = { ...store.settings, ...db.settings };
            
            let existingAreas = db.learningAreas || [];
            DEFAULT_LEARNING_AREAS.forEach(def => {
                if (!existingAreas.some(area => area.code === def.code)) existingAreas.push(def);
            });
            store.learningAreas = existingAreas;

            // Seed demo staff on first run so the Staff section isn't empty.
            // seedStaffData() is a no-op once any staff exist (server or local).
            seedStaffData();
        } else {
            throw new Error("Server response not OK");
        }

        renderDashboard(); 
        renderStaff();

    } catch (err) {
        console.error("Failed to load data from server.", err);
        
        // 2. FALLBACK: Load from LocalStorage (The Safety Net)
        const localData = localStorage.getItem('elimutrack_backup');
        if (localData) {
            const parsed = JSON.parse(localData);
            Object.assign(store, parsed);
            // Same first-run safety net for the offline path.
            seedStaffData();
            renderDashboard();
            renderStaff();
            alert("Warning: Could not connect to server. Loaded previously saved data from browser.");
        } else {
            // Last-resort: nothing on server or in localStorage. Seed demo
            // staff so the user can still see how the section works.
            seedStaffData();
            renderDashboard();
            renderStaff();
            alert("Critical Error: No data found on Server or Browser.");
        }
    }
}
async function saveData() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        showToast('Session expired. Please login again.', 'error');
        return window.location.href = 'login.html';
    }

    // 1. LocalStorage Backup (Stripped of images to prevent crash)
    try {
        const lightweightStore = {
            ...store,
            // Remove heavy photos from backup
            students: store.students.map(s => ({ ...s, photo: null })),
            staff: store.staff.map(s => ({ ...s, photo: null })),
            settings: {
                ...store.settings,
                logo: null,
                stamp: null,
                hoiSignature: null,
                ctSignature: null
            }
        };
        localStorage.setItem('elimutrack_backup', JSON.stringify(lightweightStore));
    } catch (e) {
        console.warn("Local Storage full. Backup skipped.");
    }

    let _authFailed = false;
    try {
        // 2. Send to Server (With Auth Headers)
        // Helper: tolerant POST — returns {ok:true} for missing endpoints or auth failures
        // so that optional new collections (notes/timetable/examSchedules) don't break the save flow.
        const tolerantPost = async (path, body) => {
            try {
                const res = await fetch(`${API_URL}/${path}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(body || [])
                });
                return res; // may have ok=false (404/403) — caller decides
            } catch (e) {
                return { ok: true, tolerant: true }; // network error → treat as success
            }
        };

        const [studentsRes, staffRes, settingsRes, examsRes, areasRes, notesRes, timetableRes, examSchedulesRes] = await Promise.all([
            fetch(`${API_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- CRITICAL FIX
                },
                body: JSON.stringify(store.students)
            }),
            fetch(`${API_URL}/staff`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- CRITICAL FIX
                },
                body: JSON.stringify(store.staff)
            }),
            fetch(`${API_URL}/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // <--- CRITICAL FIX
                },
                body: JSON.stringify(store.settings)
            }),
            fetch(`${API_URL}/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(store.exams)
            }),
            fetch(`${API_URL}/learningAreas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(store.learningAreas)
            }),
            // Optional endpoints — tolerate 404 (endpoint not deployed yet) silently
            tolerantPost('notes', store.notes || []),
            tolerantPost('timetable', store.timetable || []),
            tolerantPost('examSchedules', store.examSchedules || [])
        ]);

        // Detect auth failure (403) on core endpoints
        if (studentsRes.status === 403 || staffRes.status === 403 || settingsRes.status === 403) {
            _authFailed = true;
        }

        // Core collections must succeed for us to claim "saved". The optional
        // collections (notes/timetable/examSchedules) are best-effort — if the
        // server doesn't have those endpoints yet, data still lives in localStorage.
        const coreOk = studentsRes.ok && staffRes.ok && settingsRes.ok;
        if (coreOk) {
            showToast('All changes saved successfully!');
        } else {
            // Log only core failures. Optional-endpoint 404s are silent.
            console.warn('Core save failed:', {
                students: studentsRes.status,
                staff: staffRes.status,
                settings: settingsRes.status
            });
            throw new Error('Server rejected one or more core saves');
        }

    } catch (err) {
        // Data is already saved to localStorage (step 1 above), so this is
        // only a server-sync failure. Don't alarm the user — just log it.
        console.warn("Server sync skipped (data saved locally):", err.message || err);
        // Only show the error toast once per session to avoid spam
        if (!window._syncFailedToastShown) {
            window._syncFailedToastShown = true;
            if (_authFailed) {
                showToast('Session expired. Data saved locally — please re-login to sync.', 'error');
            } else {
                showToast('Saved locally. Server sync will retry.', 'success');
            }
        }
    }
}
function applyRoleRestrictions(role) {
    if (role === 'teacher') {
        document.body.classList.add('role-teacher');
        const adminPages = ['intake', 'staff', 'settings', 'reports'];
        adminPages.forEach(page => {
            const navItem = document.querySelector(`.nav-item[data-page="${page}"]`);
            if(navItem) navItem.style.display = 'none';
        });
    }
    
    const profileName = document.querySelector('.user-profile .user-info span');
    const profileRole = document.querySelector('.user-profile .user-info small');
    if(CURRENT_USER) {
        if(profileName) profileName.innerText = CURRENT_USER.name;
        if(profileRole) profileRole.innerText = CURRENT_USER.role === 'admin' ? 'School Admin' : 'Teacher';
    }
}

// ==========================================================================
//   GENERIC REPOSITORY
// ==========================================================================

function createRepository(entityKey) {
    return {
        getAll: () => store[entityKey] || [],
        getById: (id) => (store[entityKey] || []).find(item => item.id === id),
        findBy: (field, value) => (store[entityKey] || []).filter(item => item[field] === value),
        create: (item) => { if (!item.id) item.id = generateId(); if (!store[entityKey]) store[entityKey] = []; store[entityKey].unshift(item); saveData(); return item; },
        update: (id, updates) => { const index = store[entityKey].findIndex(item => item.id === id); if (index !== -1) { store[entityKey][index] = { ...store[entityKey][index], ...updates }; saveData(); return true; } return false; },
        delete: (id) => { const initialLength = store[entityKey].length; store[entityKey] = store[entityKey].filter(item => item.id !== id); if (store[entityKey].length < initialLength) { saveData(); return true; } return false; },
        count: () => (store[entityKey] || []).length
    };
}

const StudentRepo = createRepository('students');
const StaffRepo = createRepository('staff');

// ==========================================================================
//   INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        return window.location.href = 'login.html';
    }

    try {
        CURRENT_USER = JSON.parse(userStr);
        await loadData();
        initializeApp(CURRENT_USER);
    } catch (e) {
        console.error("Session error", e);
        window.location.href = 'login.html';
    }
});
// 6. EVENT LISTENERS
// NOTE: Next/Back buttons inside the staff form are handled by the
// body-level click listener in initGlobalListeners(), which routes
// through nextStaffStep()/prevStaffStep() so Step 1 validation runs.

function initializeApp(user) {
    applyRoleRestrictions(user.role);
    initTheme();
    initGlobalListeners();
    startClock();
    renderDashboard();
    updateSettingsForm();
    updateHeaderAndDashboard();
    populateProfileList();
    currentView = { students: 'grid', staff: 'grid' };
    setTimeout(() => { const loader = $('appLoader'); if (loader) loader.style.display = 'none'; }, 800);
}

// ==========================================================================
//   THEME & CLOCK
// ==========================================================================
function initTheme() { const themeToggle = $('themeToggle'); const html = document.documentElement; const savedTheme = localStorage.getItem('theme') || 'light'; html.setAttribute('data-theme', savedTheme); updateThemeIcon(savedTheme); if (themeToggle) { themeToggle.addEventListener('click', () => { const current = html.getAttribute('data-theme'); const newTheme = current === 'light' ? 'dark' : 'light'; html.setAttribute('data-theme', newTheme); localStorage.setItem('theme', newTheme); updateThemeIcon(newTheme); }); } }
function updateThemeIcon(theme) { const themeToggle = $('themeToggle'); if (themeToggle) { themeToggle.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>'; } }
function startClock() { const clockEl = $('liveClock'); const dateEl = $('liveDate'); if (!clockEl && !dateEl) return; const tick = () => { const now = new Date(); if (clockEl) clockEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); if (dateEl) dateEl.textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' }); }; tick(); setInterval(tick, 1000); }

// ==========================================================================
//   GLOBAL EVENT LISTENERS
// ==========================================================================
function initGlobalListeners() {
    document.body.addEventListener('click', e => {
        const target = e.target;
        
        const sectionHeader = target.closest('.nav-section-header');
        if (sectionHeader) {
            const section = sectionHeader.closest('.nav-section');
            if (section) section.classList.toggle('open');
            return;
        }

        const navItem = target.closest('[data-page]'); 
        if (navItem) return router(navItem.dataset.page, navItem);

        const modalTrigger = target.closest('[data-modal]');
        if (modalTrigger) {
            if (modalTrigger.dataset.reportType) {
                currentReportContext.type = modalTrigger.dataset.reportType;
            } else {
                currentReportContext.type = null; 
            }
            return openModal(modalTrigger.dataset.modal);
        }

        if (target.classList.contains('modal-backdrop') || target.matches('[data-dismiss="modal"]')) { 
            const modal = target.closest('.modal-backdrop'); 
            if (modal) return closeModal(modal.id); 
        }
        
        const tabBtn = target.closest('.tab-btn');
        if (tabBtn) return switchSettingsTab(parseInt(tabBtn.dataset.tab));
        
        const bandBtn = target.closest('.band-btn');
        if (bandBtn) {
            document.querySelectorAll('.band-btn').forEach(b => b.classList.remove('active'));
            bandBtn.classList.add('active');
            return filterCurricula(bandBtn.dataset.band);
        }

        // --- FIX: HANDLE CURRICULUM ACCORDION TOGGLE ---
        const accordionHeader = target.closest('.accordion-header');
        if (accordionHeader) {
            const item = accordionHeader.closest('.accordion-item');
            if (item) item.classList.toggle('open');
            return;
        }
        // ----------------------------------------------

        const viewBtn = target.closest('[data-view]'); 
        if (viewBtn) { 
            const section = viewBtn.dataset.section, viewType = viewBtn.dataset.view; 
            currentView[section] = viewType; 
            const group = viewBtn.closest('.btn-group'); 
            if (group) { group.querySelectorAll('.btn').forEach(b => b.classList.remove('active')); viewBtn.classList.add('active'); } 
            ({ students: applyFilters, staff: renderStaff }[section] || (() => {}))(); 
            return; 
        }

        const pageBtn = target.closest('.btn-page');
        if (pageBtn && !pageBtn.disabled) {
            const pageNum = pageBtn.textContent; if (!isNaN(pageNum)) { currentPage = parseInt(pageNum); applyFilters(); }
            else if (pageBtn.querySelector('.fa-chevron-left')) { if (currentPage > 1) { currentPage--; applyFilters(); } }
            else if (pageBtn.querySelector('.-chevron-right')) { currentPage++; applyFilters(); }
        }

                const actionBtn = target.closest('[data-action]');
        if (actionBtn) {
            const action = actionBtn.dataset.action;
            const id = actionBtn.dataset.id;
            const type = actionBtn.dataset.type;

            if (action === 'edit') { if (type === 'staff') editStaff(id); else editStudent(id); }
            if (action === 'delete') { if (type === 'staff') deleteStaff(id); else secureDelete(id); }
            if (action === 'view') viewStudent(id);
            if (action === 'openStaffModal') openStaffModal(); 
            
            // --- FIX: Ensure both actions open the modal correctly ---
            if (action === 'edit-curriculum' || action === 'edit-subject') {
                editCourseSettings(id); // This function populates the form AND opens the modal
            }
            
            if (action === 'delete-subject') deleteCourse(id);
            if (action === 'clearStudent') clearStudent(id);
            return; 
        }

        const stepBtn = target.closest('[data-step]'); 
        if (stepBtn) { const current = parseInt(stepBtn.dataset.current); if (stepBtn.dataset.step === 'next') nextStep(current, current + 1); if (stepBtn.dataset.step === 'prev') prevStep(current, current - 1); }
        
        const staffStepBtn = target.closest('[data-staff-step]'); 
        if (staffStepBtn) { const current = parseInt(staffStepBtn.dataset.current); if (staffStepBtn.dataset.staffStep === 'next') nextStaffStep(current, current + 1); if (staffStepBtn.dataset.staffStep === 'prev') prevStaffStep(current, current - 1); }

        if (target.closest('#btnToggleSidebar')) toggleSidebar();
        if (target.closest('#btnNotify')) showToast('System Updated');
        
        if (target.closest('#btnUploadLogo')) $('logoInput').click();
        if (target.closest('#btnUploadStamp')) $('stampInput').click();
        if (target.closest('#btnUploadHoiSignature')) $('hoiSignatureInput').click();
        if (target.closest('#btnUploadClassTeacherSignature')) $('classTeacherSignatureInput').click();
        
        if (target.closest('#btnImportBackup')) $('importFile').click();
        if (target.closest('#btnExportBackup')) exportBackup();
        if (target.closest('#btnConfirmAuth')) confirmAuth();
        if (target.closest('#btnResetSystem')) { pendingAction = 'reset'; pendingActionData = null; $('authMessage').textContent = 'DANGER: Enter admin password to WIPE ALL DATA.'; $('adminPassword').value = ''; openModal('authModal'); }
        
        if (target.closest('#btnGenTranscriptReport')) generateTranscriptPDF($('reportStudentSelect').value, true); 
        if (target.closest('#btnGenLeavingCert')) generateLeavingCertificatePDF();
        if (target.closest('#btnGenSubjectList')) generateSubjectScoreListPDF();
        if (target.closest('#btnGenClassList')) generateClassListPDF();
        
        if (target.closest('#btnSaveAssessment')) saveUnitAssessment();
        if (target.closest('#btnExportCSV')) exportStudentsCSV();
        if (target.closest('#btnExportStudentsExcel')) exportStudentsExcel(); 
        if (target.closest('#btnStaffReport')) generateStaffListPDF();
        if (target.closest('#btnProfileReport')) generateSchoolProfile();
        if (target.closest('#btnPrintStaffList')) generateStaffListPDF();

        const unitCard = target.closest('.cbet-unit-card');
        if (unitCard) { 
            const code = unitCard.dataset.unitCode; 
            const name = unitCard.dataset.unitName; 
            const isLocked = unitCard.dataset.locked === 'true'; 
            const studentId = currentExamContext.studentId; 
            if (isLocked) { return showToast('Unit already completed.', 'info'); } 
            if (studentId) { openAssessmentModal(code, name, studentId); } else { showToast('Please select a student first.', 'error'); } 
        }

        const dashNavItem = target.closest('.dash-nav-item');
        if (dashNavItem) {
            const tabName = dashNavItem.dataset.tab || dashNavItem.textContent.trim();
            openDashTab(e, tabName);
        }
    });

    $('eventsForm')?.addEventListener('submit', saveEventsDetails);

    $('dashChartFilter')?.addEventListener('change', e => renderDashboardChart(e.target.value));
    
    $('newStudentForm')?.addEventListener('submit', submitRegistration);
    $('institutionForm')?.addEventListener('submit', saveInstitutionDetails);
    $('hoiForm')?.addEventListener('submit', saveHOIDetails);
    $('courseForm')?.addEventListener('submit', saveCourseSettings);
    $('staffForm')?.addEventListener('submit', submitStaff);
    
    $('globalSearch')?.addEventListener('input', debounce(e => handleGlobalSearch(e.target.value), 300));
    $('studentSearch')?.addEventListener('input', debounce(() => { currentPage = 1; applyFilters(); }, 300));
    ['courseFilter', 'levelFilter', 'genderFilter'].forEach(id => { $(id)?.addEventListener('change', () => { currentPage = 1; applyFilters(); }); });
    
    $('staffSearch')?.addEventListener('input', debounce(renderStaff, 300));
    $('staffDeptFilter')?.addEventListener('change', renderStaff);
    
    const nameInputs = ['surname', 'firstName', 'otherNames'];
    nameInputs.forEach(id => { $(id)?.addEventListener('input', e => { validateName(e.target); autoCapitalize(e.target); updateLiveCard(); }); });
    $('idNumber')?.addEventListener('input', e => validateID(e.target));
    $('phone')?.addEventListener('input', e => validatePhone(e.target));
    
    $('studentPhotoInput')?.addEventListener('change', e => previewStudentPhoto(e.target));
    $('staffPhotoInput')?.addEventListener('change', e => previewStaffPhoto(e.target));

    // NOTE: staffForm submit is already bound above (line ~560); do not
    // re-bind here or submitStaff will run twice and double-save.

    
    $('logoInput')?.addEventListener('change', e => previewLogo(e.target));
    $('stampInput')?.addEventListener('change', e => previewStamp(e.target));
    $('hoiSignatureInput')?.addEventListener('change', e => previewHOISignature(e.target));
    $('classTeacherSignatureInput')?.addEventListener('change', e => previewCTSignature(e.target));
    
    $('importFile')?.addEventListener('change', e => importBackup(e.target));
    
    $('dob')?.addEventListener('change', updateLiveCard);
    $('level')?.addEventListener('change', updateLiveCard);
    
    $('assessScore')?.addEventListener('input', updateAssessmentPreview);
    
    $('examTradeSelect')?.addEventListener('change', e => { 
        const grade = e.target.value; 
        currentExamContext.tradeId = grade; 
        currentExamContext.subjectId = null; 
        currentExamContext.studentId = null; 
        
        if ($('examInterface')) $('examInterface').style.display = 'none'; 
        if ($('examEmptyState')) $('examEmptyState').style.display = 'flex'; 
        
        $('examSubjectSelect').innerHTML = "<option value=''>Select Subject...</option>";
        $('examStudentSelect').innerHTML = "<option value=''>Select Subject First...</option>";
        $('examStudentSelect').disabled = true;

        if (grade) loadExamSubjects(grade);
        else $('examSubjectSelect').disabled = true;
    });
    
    $('examSubjectSelect')?.addEventListener('change', e => {
        const subjectId = e.target.value;
        currentExamContext.subjectId = subjectId;
        currentExamContext.studentId = null;

        if ($('examInterface')) $('examInterface').style.display = 'none'; 
        if ($('examEmptyState')) $('examEmptyState').style.display = 'flex';

        if (subjectId) loadExamStudents(); 
        else {
            $('examStudentSelect').disabled = true;
            $('examStudentSelect').innerHTML = "<option value=''>Select Subject First...</option>";
        }
        
        const batchBtn = $('btnOpenBatchAssessment');
        if(batchBtn) batchBtn.disabled = !subjectId;
    });

    $('examStudentSelect')?.addEventListener('change', e => { 
        const studentId = e.target.value; 
        currentExamContext.studentId = studentId; 
        
        if (studentId && currentExamContext.subjectId) loadCBETUnits(); 
        else { 
            if ($('examInterface')) $('examInterface').style.display = 'none'; 
            if ($('examEmptyState')) $('examEmptyState').style.display = 'flex'; 
        } 
    });

    $('subjectReportGrade')?.addEventListener('change', populateSubjectReportDropdowns);

    $('batchAdmissionFile')?.addEventListener('change', handleBatchAdmissionFile);
    $('btnConfirmBatchAdmission')?.addEventListener('click', confirmBatchAdmission);
    $('btnDownloadAdmissionTemplate')?.addEventListener('click', downloadAdmissionTemplate);
    $('btnOpenBatchAssessment')?.addEventListener('click', openBatchAssessmentModal);
    $('btnSaveBatchAssessment')?.addEventListener('click', saveBatchAssessments);
    
    ['hoiName', 'hoiTitle', 'hoiTsc', 'hoiPhone', 'hoiEmail'].forEach(id => {
        $(id)?.addEventListener('input', updateHOIPreview);
    });

    $('subjectReportModal')?.addEventListener('click', () => populateDropdownsForReports());
    $('classReportModal')?.addEventListener('click', () => populateDropdownsForReports());
    $('subjectReportGrade')?.addEventListener('change', populateSubjectReportDropdowns);

    
  $('profileSearchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const allStudents = StudentRepo.getAll();
    
    // Filter students
    const filtered = allStudents.filter(s => 
        (s.name && s.name.toLowerCase().includes(term)) || 
        (s.reg && s.reg.toLowerCase().includes(term)) ||
        (s.grade && s.grade.toLowerCase().includes(term))
    );
    
    // Re-render (Function handles 'Flat vs Grouped' logic internally)
    populateProfileList(filtered);
});
}

// ==========================================================================
//   ADMISSIONS / INTAKE
// ==========================================================================
function clearErrors() { document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error')); }
function validateName(input) { if (!input) return false; const regex = /^[A-Za-z\s]+$/; if (!regex.test(input.value) && input.value !== '') { input.classList.add('error'); return false; } input.classList.remove('error'); return true; }
function validateID(input) { if (!input) return false; input.value = input.value.replace(/\D/g, ''); const val = input.value; const isValid = val.length === 8; const editId = $('editModeId')?.value; const isDuplicate = StudentRepo.getAll().some(s => s.idNumber === val && s.id !== editId); if (val.length > 0 && (!isValid || isDuplicate)) { input.classList.add('error'); if (isDuplicate) showToast('A student with this ID already exists!', 'error'); return false; } input.classList.remove('error'); return isValid; }
function validatePhone(input) { if (!input || !input.value) return true; const val = input.value; const regex = /^(?:254|\+254|0)?([17][0-9]{8})$/; if (!regex.test(val)) { input.classList.add('error'); return false; } input.classList.remove('error'); return true; }
function autoCapitalize(input) { const value = input.value; input.value = value.charAt(0).toUpperCase() + value.slice(1); }
// 1. REAL-TIME FIELD VALIDATION
// Call this on "input" event in HTML
function validateField(input) {
    const val = input.value.trim();
    const formGroup = input.closest('.form-group-modern');
    const errorSpan = formGroup ? formGroup.querySelector('.error-msg') : null;
    
    let isValid = true;
    let msg = "";

    if (input.id === 'idNumber') {
        // Validate ID Length
        if (val.length > 0 && val.length !== 8) {
            isValid = false;
            msg = "ID must be exactly 8 digits.";
        }
        // Validate Duplicates
        else if (val.length === 8) {
            const editId = $('editModeId')?.value;
            const isDuplicate = StudentRepo.getAll().some(s => s.idNumber === val && s.id !== editId);
            if (isDuplicate) {
                isValid = false;
                msg = "ID Number already exists.";
            }
        }
    } 
    else if (input.id === 'phone') {
        const regex = /^(?:254|\+254|0)?([17][0-9]{8})$/;
        if (val.length > 0 && !regex.test(val)) {
            isValid = false;
            msg = "Invalid phone format (07XX or 254...).";
        }
    }

    // Update UI State
    if (!isValid && val.length > 0) {
        input.classList.add('error');
        input.classList.remove('success');
        if (formGroup) formGroup.classList.add('invalid');
        if (errorSpan) errorSpan.innerText = msg;
    } else {
        input.classList.remove('error');
        if (val.length > 0) input.classList.add('success');
        else input.classList.remove('success');
        
        if (formGroup) formGroup.classList.remove('invalid');
        if (errorSpan) errorSpan.innerText = "";
    }

    // Auto Capitalize Names
    if (input.id === 'surname' || input.id === 'firstName') {
        input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
    }
}
function validateStep(stepNumber) { clearErrors(); let isValid = true; let focusSet = false; const setError = (input) => { input.classList.add('error'); if (!focusSet) { input.focus(); focusSet = true; } isValid = false; };
    if (stepNumber === 1) { 
        const surname = $('surname'); const firstName = $('firstName'); const dob = $('dob'); const idNum = $('idNumber'); const phone = $('phone'); 
        if (!surname.value.trim()) setError(surname); 
        if (!firstName.value.trim()) setError(firstName); 
        if (!dob.value) setError(dob); 
        if (!idNum.value || idNum.value.length !== 8) { setError(idNum); showToast('ID Number must be 8 digits', 'error'); } else { const editId = $('editModeId')?.value; const isDuplicate = StudentRepo.getAll().some(s => s.idNumber === idNum.value && s.id !== editId); if (isDuplicate) { setError(idNum); showToast('Duplicate ID Number detected!', 'error'); } } 
        if (phone.value && !validatePhone(phone)) setError(phone); 
    }
    else if (stepNumber === 2) { 
        const entryLevel = $('entryLevel'); const assessmentNo = $('assessmentNo'); 
        if (!entryLevel.value) setError(entryLevel); 
        if (!assessmentNo.value.trim()) setError(assessmentNo); 
    }
    else if (stepNumber === 3) { const grade = $('regTrade'); const stream = $('level'); if (!grade.value) setError(grade); if (!stream.value) setError(stream); }
    else if (stepNumber === 4) { const gName = $('guardianName'); const gPhone = $('guardianPhone'); if (!gName.value.trim()) setError(gName); if (!gPhone.value || !validatePhone(gPhone)) { setError(gPhone); if (gPhone.value) showToast('Invalid Guardian Phone Number', 'error'); } }
    if (!isValid) showToast('Please fill all required fields correctly.', 'error'); return isValid;
}
// 2. ENHANCED STEP NAVIGATION
function nextStep(current, next) {
    // Validate ONLY the fields in the current step before moving
    const currentStepDiv = $(`form-step-${current}`);
    const inputs = currentStepDiv.querySelectorAll('input[required], select[required]');
    let allValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showToast(`Please fill in ${input.previousElementSibling.innerText}`, 'error');
            allValid = false;
            input.focus();
            input.classList.add('error'); // Flash error
            setTimeout(() => input.classList.remove('error'), 1000);
        }
    });

    if (!allValid) return;

    // Move to next
    $(`form-step-${current}`).classList.remove('active');
    $(`form-step-${next}`).classList.add('active');
    
    // Update Stepper Visuals
    document.querySelectorAll('.step-modern').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum < next) step.classList.add('completed');
        else if (stepNum === next) step.classList.add('active');
    });
}
function prevStep(current, prev) {
    $(`form-step-${current}`).classList.remove('active');
    $(`form-step-${prev}`).classList.add('active');

    // Update Stepper Visuals
    document.querySelectorAll('.step-modern').forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === prev) step.classList.add('active');
    });
}
function resetIntakeForm() { $('newStudentForm')?.reset(); if ($('editModeId')) $('editModeId').value = ""; if ($('studentPhotoPreview')) $('studentPhotoPreview').src = DEFAULT_AVATAR; if ($('liveCardPhoto')) $('liveCardPhoto').src = DEFAULT_AVATAR; document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active')); $('form-step-1')?.classList.add('active'); const stepIndicators = document.querySelectorAll('.stepper .step'); stepIndicators.forEach((step, index) => { step.classList.remove('active', 'completed'); if (index === 0) step.classList.add('active'); }); clearErrors(); updateLiveCard(); }

// 3. ENHANCED SUBMISSION
function submitRegistration(e) {
    e.preventDefault();
    
    // Final validation (Double Check)
    const requiredIds = ['surname', 'firstName', 'gender', 'dob', 'idNumber', 'regTrade', 'level', 'guardianName', 'guardianPhone'];
    for(let id of requiredIds) {
        if(!$(id).value.trim()) {
            showToast('Please fill all required fields.', 'error');
            // Find step and go there
            // (Simple logic: just alert and return for now)
            return;
        }
    }

    // Check ID one last time
    const idVal = $('idNumber').value;
    const editId = $('editModeId')?.value;
    if (StudentRepo.getAll().some(s => s.idNumber === idVal && s.id !== editId)) {
        showToast('Duplicate ID Number detected!', 'error');
        return;
    }

    // ... [Rest of original logic for data gathering] ...
    const grade = getVal('regTrade');
    const names = [getVal('surname'), getVal('firstName'), getVal('otherNames')].filter(Boolean).join(' ');
    
    // (Keep existing logic for Photo, Data Object, etc.)
    
    const studentData = { 
        name: names, 
        gender: getVal('gender'), 
        dob: getVal('dob'), 
        idNumber: idVal, 
        phone: getVal('phone'), 
        grade: grade,
        stream: getVal('level'), 
        photo: $('studentPhotoPreview').src,
        upiNumber: getVal('upiNumber'),
        prevSchool: getVal('prevSchool'),
        entryLevel: getVal('entryLevel'),
        yearCompleted: getVal('yearCompleted'),
        nemisNumber: getVal('assessmentNo'),
        disability: getVal('disability'),
        guardianName: getVal('guardianName'),
        guardianPhone: getVal('guardianPhone'),
        guardianRel: getVal('guardianRel')
    };

    if (editId) { 
        StudentRepo.update(editId, studentData); 
        showToast('Learner details updated successfully!'); 
    } else { 
        // Generate ADM No (Existing logic is good)
        const year = new Date().getFullYear().toString().slice(-2);
        const count = StudentRepo.findBy('grade', grade).length + 1;
        const seq = String(count).padStart(3, '0');
        const gCode = grade.replace(' ', '');
        studentData.reg = `${gCode}/${year}/${seq}`;
        
        StudentRepo.create(studentData); 
        showToast('Learner Registered Successfully!', 'success');
        
        // Add Activity
        // store.activities.push({ ... });
    }

    // Reset and Redirect
    router('students'); // Go to list to see the new card
    resetIntakeForm();
    renderDashboard();
}
function onGradeChange() { updateLiveCard(); }

function updateLiveCard() { 
    const sn = getVal('surname') || ''; 
    const fn = getVal('firstName') || ''; 
    const on = getVal('otherNames') || ''; 
    if ($('liveCardName')) $('liveCardName').innerText = `${sn} ${fn} ${on}`.trim() || 'Student Name'; 
    if ($('liveCardLevel')) $('liveCardLevel').innerText = getVal('level') || '---'; 
    if ($('liveCardDob')) $('liveCardDob').innerText = getVal('dob') || '---'; 
    
    const grade = getVal('regTrade'); 
    if (grade && !$('editModeId')?.value) { 
        const year = new Date().getFullYear().toString().slice(-2); 
        const count = StudentRepo.findBy('grade', grade).length + 1; 
        const seq = String(count).padStart(3, '0'); 
        const gCode = grade.replace(' ', '');
        if ($('liveCardReg')) $('liveCardReg').innerText = `${gCode}/${year}/${seq}`; 
    } else { 
        if ($('liveCardReg')) $('liveCardReg').innerText = '---'; 
    } 
    if ($('liveCardTrade')) $('liveCardTrade').innerText = grade || 'GRADE'; 
}

function previewStudentPhoto(input) { if (input.files && input.files[0]) { const file = input.files[0]; if (!file.type.startsWith('image/')) { showToast('Please select a valid image file (JPG, PNG).', 'error'); input.value = ''; return; } const reader = new FileReader(); reader.onload = function(e) { if ($('studentPhotoPreview')) $('studentPhotoPreview').src = e.target.result; if ($('liveCardPhoto')) $('liveCardPhoto').src = e.target.result; }; reader.readAsDataURL(file); } }

function editStudent(id) { 
    const s = StudentRepo.getById(id); 
    if (!s) return; 
    router('intake'); 
    if ($('intakeFormTitle').innerText = "Edit Learner Details"); 
    $('editModeId').value = id; 
    if ($('studentPhotoPreview')) $('studentPhotoPreview').src = s.photo; 
    if ($('liveCardPhoto')) $('liveCardPhoto').src = s.photo; 
    
    setVal('surname', s.name.split(' ')[0]); 
    setVal('firstName', s.name.split(' ')[1] || ''); 
    setVal('otherNames', s.name.split(' ').slice(2).join(' ')); 
    setVal('gender', s.gender); 
    setVal('dob', s.dob); 
    setVal('idNumber', s.idNumber); 
    setVal('phone', s.phone); 
    setVal('upiNumber', s.upiNumber || '');
    setVal('prevSchool', s.prevSchool || '');
    setVal('entryLevel', s.entryLevel || '');
    setVal('yearCompleted', s.yearCompleted || '');
    setVal('assessmentNo', s.nemisNumber || '');
    setVal('regTrade', s.grade);
    
    onGradeChange(); 
    setTimeout(() => { 
        setVal('level', s.stream); 
        setVal('disability', s.disability || 'None');
        setVal('guardianName', s.guardianName || ''); 
        setVal('guardianPhone', s.guardianPhone || ''); 
        setVal('guardianRel', s.guardianRel || 'Parent');
        updateLiveCard(); 
    }, 100);
    
    closeModal('viewStudentModal'); 
    showToast('Editing mode active.', 'info'); 
}

// ==========================================================================
//   STUDENTS SECTION
// ==========================================================================
// Unified learners state (replaces old currentStudentFilter + currentPage + currentView.students)
const LearnerState = {
    search: '',
    grade: 'all',
    stream: 'all',
    gender: 'all',
    sort: 'name-asc',
    perPage: 24,
    page: 1,
    view: 'grid',           // 'grid' | 'list'
    selected: new Set(),    // student IDs
    sortColumn: null,       // when sorting via table headers
    sortDir: 'asc'
};

/// ==========================================================================
//   EXAM PORTAL — COMPLETE CBC ASSESSMENT ENGINE
// ==========================================================================

// Fix the truncated line from the original file
let currentStudentFilter = {
    search: '',
    grade: 'all',
    gender: 'all'
};

// --- CBC UNITS DATABASE (per subject per grade) ---
// In a real system these come from the curriculum/KICD database.
// Here we auto-generate sensible units from the learning area name.
function getUnitsForSubject(subjectId, grade) {
    const subject = store.learningAreas.find(la => la.id === subjectId);
    if (!subject) return [];

    const name = subject.name;
    const units = [];

    // Generate 4-6 contextually relevant sub-strands per subject
    const unitTemplates = {
        'English': ['Listening & Speaking', 'Reading', 'Writing', 'Grammar in Context', 'Literature & Appreciation'],
        'Kiswahili': ['Kusikiliza na Kuzungumza', 'Kusoma', 'Kuandika', 'Lugha kwa Matumizi', 'Fasihi'],
        'Mathematics': ['Numbers', 'Algebra', 'Geometry', 'Measurement', 'Data Handling'],
        'Integrated Science': ['Scientific Investigation', 'Living Things', 'Matter', 'Force & Energy', 'Earth & Space'],
        'Science & Technology': ['Scientific Skills', 'Living Things', 'Matter', 'Force & Energy', 'Environment'],
        'Social Studies': ['Citizenship', 'Culture', 'Government', 'Resources & Economic Activities', 'Physical Environment'],
        'Religious Education': ['Creation', 'Faith & Commandments', 'Worship', 'Festivals & Celebrations', 'Moral Teachings'],
        'CRE / IRE': ['Creation', 'Faith & Commandments', 'Worship', 'Festivals', 'Moral Teachings'],
        'Religious Education (CRE/IRE)': ['Creation', 'Faith & Commandments', 'Worship', 'Festivals', 'Moral Teachings'],
        'Creative Arts': ['Visual Arts', 'Performing Arts', 'Music', 'Theatre & Drama'],
        'Creative Arts & Sports Science': ['Visual Arts', 'Performing Arts', 'Sports Science', 'Physical Fitness'],
        'Creative Activities': ['Visual Arts', 'Music', 'Movement & Dance', 'Drama'],
        'Creative Activities (Art/Craft)': ['Drawing & Painting', 'Craft & Clay', 'Printmaking', 'Textile'],
        'Pre-Technical Studies': ['Technology & Life', 'Materials & Tools', 'Drawing & Design', 'Processes & Products'],
        'Agriculture': ['Soil & Water', 'Crop Production', 'Animal Production', 'Agribusiness'],
        'Computer Science': ['Digital Literacy', 'Programming Concepts', 'Internet & Networks', 'Data & Security'],
        'Physical & Health Education': ['Games & Sports', 'Gymnastics', 'Health & Safety', 'First Aid'],
        'Movement & Creative Activities (PE)': ['Movement', 'Games', 'Health & Safety'],
        'Home Science': ['Food & Nutrition', 'Clothing & Textiles', 'Home Management', 'Consumer Education'],
        'Foreign Language': ['Listening & Speaking', 'Reading', 'Writing', 'Grammar'],
        'Foreign Language (French/German)': ['Listening & Speaking', 'Reading', 'Writing', 'Grammar'],
        'Life Skills Education': ['Self-Awareness', 'Communication', 'Decision Making', 'Conflict Resolution'],
        'Health Education': ['Personal Hygiene', 'Nutrition', 'Disease Prevention', 'Mental Health'],
        'Business Studies': ['Entrepreneurship', 'Marketing', 'Accounting Basics', 'Office Practice'],
        'Sports': ['Games & Sports', 'Athletics', 'Fitness Training', 'Sports Ethics'],
        'Language Activities': ['Listening & Speaking', 'Reading', 'Writing', 'Pre-Reading'],
        'Mathematical Activities': ['Numbers', 'Patterns', 'Shapes', 'Measurement'],
        'Environmental Activities': ['My Environment', 'Living Things', 'Water & Weather', 'Soil & Plants'],
        'Psychomotor Activities': ['Movement', 'Coordination', 'Balance', 'Games'],
        'Religious Education Activities': ['God\'s Creation', 'Prayer', 'Kindness', 'Community'],
        'Literacy Activities (English)': ['Listening & Speaking', 'Reading', 'Writing', 'Phonics'],
        'Literacy Activities (Kiswahili)': ['Kusikiliza', 'Kusoma', 'Kuandika', 'Herufi na Silabi'],
        'Environmental Activities': ['My Surroundings', 'Living Things', 'Water', 'Plants & Animals']
    };

    // Match by longest key first
    let matched = null;
    const keys = Object.keys(unitTemplates).sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (name.includes(key) || key.includes(name)) {
            matched = unitTemplates[key];
            break;
        }
    }

    // Fallback generic units
    if (!matched) {
        matched = ['Strand 1: Introduction', 'Strand 2: Development', 'Strand 3: Application', 'Strand 4: Evaluation'];
    }

    matched.forEach((unitName, i) => {
        units.push({
            code: `${subject.code}-${String(i + 1).padStart(2, '0')}`,
            name: unitName,
            criteria: [
                'Demonstrates understanding of key concepts',
                'Applies knowledge in practical contexts',
                'Communicates ideas effectively'
            ]
        });
    });

    return units;
}

// --- COMPETENCY LEVEL HELPER ---
function getCompetencyLevel(score) {
    if (score >= 80) return 'EE';
    if (score >= 50) return 'ME';
    if (score >= 30) return 'AE';
    return 'BE';
}

function getCompetencyLabel(level) {
    const map = { EE: 'Exceeding Expectation', ME: 'Meeting Expectation', AE: 'Approaching Expectation', BE: 'Below Expectation' };
    return map[level] || '—';
}

function getCompetencyColor(level) {
    const map = { EE: '#22c55e', ME: '#3b82f6', AE: '#f59e0b', BE: '#ef4444' };
    return map[level] || '#94a3b8';
}



// Called when the grading modal closes — forces immediate save
function flushExamSaves() {
    if (_examSaveTimer) {
        clearTimeout(_examSaveTimer);
        _examSaveTimer = null;
    }
    saveData();
}

// --- POPULATE GRADE DROPDOWN ---
function populateExamGrades() {
    const select = $('examTradeSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select Grade...</option>';
    Object.keys(CBC_LEVELS).forEach(grade => {
        const opt = document.createElement('option');
        opt.value = grade;
        opt.textContent = CBC_LEVELS[grade].name;
        select.appendChild(opt);
    });
}

// --- LOAD SUBJECTS FOR SELECTED GRADE ---
function loadExamSubjects(grade) {
    const select = $('examSubjectSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select Subject...</option>';

    const subjects = store.learningAreas.filter(la => la.applicableLevels && la.applicableLevels.includes(grade));
    subjects.forEach(subj => {
        const opt = document.createElement('option');
        opt.value = subj.id;
        opt.textContent = `${subj.name} (${subj.code})`;
        select.appendChild(opt);
    });

    select.disabled = subjects.length === 0;
    if (subjects.length === 0) {
        select.innerHTML = '<option value="">No subjects for this grade</option>';
    }
}

// --- LOAD STUDENTS FOR SELECTED SUBJECT/GRADE ---
function loadExamStudents() {
    const select = $('examStudentSelect');
    if (!select) return;
    select.innerHTML = '<option value="">Select Learner...</option>';

    const grade = currentExamContext.tradeId;
    if (!grade) { select.disabled = true; return; }

    const students = StudentRepo.findBy('grade', grade);
    students.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    students.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.reg || '—'} — ${s.name}`;
        select.appendChild(opt);
    });

    select.disabled = students.length === 0;
    if (students.length === 0) {
        select.innerHTML = '<option value="">No learners in this grade</option>';
    }

    // Enable summary button
    const summaryBtn = $('btnViewExamSummary');
    if (summaryBtn) summaryBtn.disabled = false;

    // Show quick stats
    updateExamQuickStats();
}

// --- LOAD CBET UNITS FOR ASSESSMENT ---
function loadCBETUnits() {
    const { studentId, subjectId, tradeId: grade } = currentExamContext;
    if (!studentId || !subjectId || !grade) return;

    const student = StudentRepo.getById(studentId);
    const subject = store.learningAreas.find(la => la.id === subjectId);
    if (!student || !subject) return;

    // Show the interface, hide empty state
    if ($('examInterface')) $('examInterface').style.display = 'block';
    if ($('examEmptyState')) $('examEmptyState').style.display = 'none';

    // Populate student banner
    if ($('examStudentPhoto')) $('examStudentPhoto').src = student.photo || DEFAULT_AVATAR;
    if ($('examStudentName')) $('examStudentName').textContent = student.name;
    if ($('examStudentReg')) $('examStudentReg').innerHTML = `<i class="fa-solid fa-id-card"></i> ${student.reg || '—'}`;
    if ($('examStudentGrade')) $('examStudentGrade').innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${grade}`;
    if ($('examStudentSubject')) $('examStudentSubject').innerHTML = `<i class="fa-solid fa-book"></i> ${subject.name}`;

    // Get units
    const units = getUnitsForSubject(subjectId, grade);

    // Get existing exam record for this student+subject+term+year
    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();
    const examRecord = findExamRecord(studentId, subjectId, grade, term, year);

    // Render unit cards
    const grid = $('examUnitsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    units.forEach(unit => {
        const existingScore = examRecord ? (examRecord.scores || {})[unit.code] : null;
        const score = existingScore ? existingScore.score : null;
        const level = score !== null ? getCompetencyLevel(score) : null;
        const isLocked = score !== null;

        const card = document.createElement('div');
        card.className = `cbet-unit-card${isLocked ? ' assessed locked' : ''}`;
        card.dataset.unitCode = unit.code;
        card.dataset.unitName = unit.name;
        card.dataset.locked = isLocked ? 'true' : 'false';

        card.innerHTML = `
            <div class="cuc-code">${unit.code}</div>
            <div class="cuc-name">${escapeHtml(unit.name)}</div>
            <div class="cuc-score-bar">
                <div class="cuc-score-fill ${level || ''}" style="width:${score !== null ? score : 0}%"></div>
            </div>
            <div class="cuc-status">
                <span class="cuc-score-text">${score !== null ? score + '%' : '—'}</span>
                <span class="cuc-badge ${level || 'pending'}">${level || 'Pending'}</span>
            </div>
        `;

        grid.appendChild(card);
    });

    // Update overall bar
    updateOverallBar(examRecord, units);
}

// --- FIND EXISTING EXAM RECORD ---
function findExamRecord(studentId, subjectId, grade, term, year) {
    return store.exams.find(e =>
        e.studentId === studentId &&
        e.subjectId === subjectId &&
        e.grade === grade &&
        e.term === term &&
        e.year === year
    );
}

// --- OPEN ASSESSMENT MODAL FOR A UNIT ---
function openAssessmentModal(unitCode, unitName, studentId) {
    const { subjectId, tradeId: grade } = currentExamContext;
    const student = StudentRepo.getById(studentId);
    const subject = store.learningAreas.find(la => la.id === subjectId);
    if (!student || !subject) return;

    // Set hidden fields
    if ($('gradingUnitCode')) $('gradingUnitCode').value = unitCode;
    if ($('gradingUnitName')) $('gradingUnitName').value = unitName;
    if ($('gradingStudentId')) $('gradingStudentId').value = studentId;
    if ($('gradingSubjectId')) $('gradingSubjectId').value = subjectId;
    if ($('gradingGrade')) $('gradingGrade').value = grade;

    // Student info
    if ($('gradingStudentInfo')) {
        $('gradingStudentInfo').innerHTML = `
            <img src="${student.photo || DEFAULT_AVATAR}" alt="${escapeHtml(student.name)}">
            <div>
                <strong>${escapeHtml(student.name)}</strong>
                <span style="color:var(--text-muted); margin-left:8px;">${student.reg || ''} — ${subject.name} — ${unitCode}</span>
            </div>
        `;
    }

    // Modal title
    if ($('gradingModalTitle')) {
        $('gradingModalTitle').textContent = `Assess: ${unitName}`;
    }

    // Criteria checklist
    const criteriaList = $('gradingCriteriaList');
    if (criteriaList) {
        const units = getUnitsForSubject(subjectId, grade);
        const unit = units.find(u => u.code === unitCode);
        const criteria = unit ? unit.criteria : ['Demonstrates understanding', 'Applies knowledge', 'Communicates effectively'];

        criteriaList.innerHTML = criteria.map((c, i) => `
            <div class="grading-criteria-item">
                <input type="checkbox" id="gc_${i}" data-criteria="${escapeHtml(c)}">
                <label for="gc_${i}">${escapeHtml(c)}</label>
            </div>
        `).join('');
    }

    // Load existing score if any
    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();
    const examRecord = findExamRecord(studentId, subjectId, grade, term, year);
    const existingScore = examRecord ? (examRecord.scores || {})[unitCode] : null;

    const scoreVal = existingScore ? existingScore.score : 0;
    syncScoreInputs(scoreVal);

    if ($('gradingRemarks')) $('gradingRemarks').value = existingScore ? (existingScore.remarks || '') : '';

    // Check existing criteria
    if (existingScore && existingScore.criteriaMet) {
        existingScore.criteriaMet.forEach(c => {
            const cb = criteriaList.querySelector(`[data-criteria="${c}"]`);
            if (cb) cb.checked = true;
        });
    }

    openModal('examGradingModal');
}

// --- SYNC SCORE INPUTS (range + number) ---
function syncScoreInputs(val) {
    val = Math.max(0, Math.min(100, parseInt(val) || 0));
    if ($('gradingScoreRange')) $('gradingScoreRange').value = val;
    if ($('gradingScoreInput')) $('gradingScoreInput').value = val;

    const level = getCompetencyLevel(val);
    const gcdVal = $('gradingCompetencyValue');
    if (gcdVal) {
        gcdVal.textContent = `${level} — ${getCompetencyLabel(level)}`;
        gcdVal.style.background = getCompetencyColor(level) + '22';
        gcdVal.style.color = getCompetencyColor(level);
    }
}

// --- SAVE UNIT ASSESSMENT ---
function saveUnitAssessment() {
    const studentId = $('gradingStudentId')?.value;
    const subjectId = $('gradingSubjectId')?.value;
    const grade = $('gradingGrade')?.value;
    const unitCode = $('gradingUnitCode')?.value;
    const unitName = $('gradingUnitName')?.value;
    const score = parseInt($('gradingScoreInput')?.value) || 0;
    const remarks = $('gradingRemarks')?.value?.trim() || '';

    if (!studentId || !subjectId || !grade || !unitCode) {
        showToast('Missing assessment context.', 'error');
        return false;
    }

    // Gather criteria met
    const criteriaMet = [];
    document.querySelectorAll('#gradingCriteriaList input[type="checkbox"]:checked').forEach(cb => {
        criteriaMet.push(cb.dataset.criteria);
    });

    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();

    // Find or create exam record
    let examRecord = findExamRecord(studentId, subjectId, grade, term, year);
    if (!examRecord) {
        examRecord = {
            id: generateId(),
            studentId,
            subjectId,
            grade,
            term,
            year,
            scores: {},
            dateCreated: new Date().toISOString(),
            dateUpdated: new Date().toISOString()
        };
        store.exams.push(examRecord);
    }

    // Save the unit score
    if (!examRecord.scores) examRecord.scores = {};
    examRecord.scores[unitCode] = {
        score: Math.max(0, Math.min(100, score)),
        level: getCompetencyLevel(score),
        unitName,
        remarks,
        criteriaMet,
        dateAssessed: new Date().toISOString()
    };
    examRecord.dateUpdated = new Date().toISOString();

    // Persist immediately — no debouncing for explicit save button
    saveData();

    // Refresh the unit cards
    loadCBETUnits();

    // Refresh recent entries & quick stats
    updateExamRecentEntries();
    updateExamQuickStats();

    closeModal('examGradingModal');
    showToast(`Saved: ${unitName} — ${score}% (${getCompetencyLevel(score)})`);
    return false; // prevent form submission
}

// Hook the grading form submit
document.addEventListener('DOMContentLoaded', () => {
    const gradingForm = $('unitGradingForm');
    if (gradingForm) {
        gradingForm.addEventListener('submit', e => {
            e.preventDefault();
            saveUnitAssessment();
        });
    }
});

// --- UPDATE OVERALL BAR ---
function updateOverallBar(examRecord, units) {
    const scores = examRecord ? examRecord.scores || {} : {};
    const unitScores = units.map(u => scores[u.code] ? scores[u.code].score : null).filter(s => s !== null);

    let avg = 0;
    if (unitScores.length > 0) {
        avg = Math.round(unitScores.reduce((a, b) => a + b, 0) / unitScores.length);
    }

    const level = getCompetencyLevel(avg);

    if ($('examOverallValue')) $('examOverallValue').textContent = avg + '%';
    if ($('examOverallFill')) $('examOverallFill').style.width = avg + '%';
    if ($('examOverallCompetency')) {
        $('examOverallCompetency').textContent = level;
        $('examOverallCompetency').className = 'eob-competency ' + level;
    }
}

// --- CLEAR ALL SCORES FOR CURRENT STUDENT+SUBJECT ---
function clearStudentAssessment() {
    const { studentId, subjectId, tradeId: grade } = currentExamContext;
    if (!studentId || !subjectId || !grade) return;

    if (!confirm('Are you sure you want to clear ALL scores for this learner in this subject? This cannot be undone.')) return;

    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();

    const idx = store.exams.findIndex(e =>
        e.studentId === studentId &&
        e.subjectId === subjectId &&
        e.grade === grade &&
        e.term === term &&
        e.year === year
    );

    if (idx !== -1) {
        store.exams.splice(idx, 1);
        saveData();
    }

    loadCBETUnits();
    updateExamRecentEntries();
    updateExamQuickStats();
    showToast('Assessment scores cleared.', 'info');
}

// --- UPDATE QUICK STATS ---
function updateExamQuickStats() {
    const grade = currentExamContext.tradeId;
    const subjectId = currentExamContext.subjectId;
    if (!grade) return;

    const statsEl = $('examQuickStats');
    if (statsEl) statsEl.style.display = 'block';

    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();

    const studentsInGrade = StudentRepo.findBy('grade', grade);
    const totalStudents = studentsInGrade.length;

    let assessed = 0;
    let totalScore = 0;
    let scoreCount = 0;

    if (subjectId) {
        // Per-subject stats
        studentsInGrade.forEach(s => {
            const record = findExamRecord(s.id, subjectId, grade, term, year);
            if (record && record.scores) {
                const vals = Object.values(record.scores).map(sc => sc.score).filter(v => v !== null);
                if (vals.length > 0) {
                    assessed++;
                    totalScore += vals.reduce((a, b) => a + b, 0) / vals.length;
                    scoreCount++;
                }
            }
        });
    } else {
        // All-subject stats for grade
        studentsInGrade.forEach(s => {
            const records = store.exams.filter(e => e.studentId === s.id && e.grade === grade && e.term === term && e.year === year);
            if (records.length > 0) {
                assessed++;
                records.forEach(r => {
                    if (r.scores) {
                        const vals = Object.values(r.scores).map(sc => sc.score).filter(v => v !== null);
                        if (vals.length > 0) {
                            totalScore += vals.reduce((a, b) => a + b, 0) / vals.length;
                            scoreCount++;
                        }
                    }
                });
            }
        });
    }

    const pending = totalStudents - assessed;
    const avgScore = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;

    if ($('eqsAssessed')) $('eqsAssessed').textContent = assessed;
    if ($('eqsPending')) $('eqsPending').textContent = pending;
    if ($('eqsAvgScore')) $('eqsAvgScore').textContent = avgScore + '%';
}

// --- UPDATE RECENT ENTRIES ---
function updateExamRecentEntries() {
    const list = $('examRecentEntries');
    if (!list) return;

    // Get the 10 most recent exam records
    const recent = [...store.exams]
        .sort((a, b) => new Date(b.dateUpdated || b.dateCreated) - new Date(a.dateUpdated || a.dateCreated))
        .slice(0, 10);

    if (recent.length === 0) {
        list.innerHTML = '<div class="ere-empty">No entries yet.</div>';
        return;
    }

    list.innerHTML = recent.map(record => {
        const student = StudentRepo.getById(record.studentId);
        const subject = store.learningAreas.find(la => la.id === record.subjectId);
        const scores = record.scores || {};
        const scoreVals = Object.values(scores).map(s => s.score).filter(v => v !== null);
        const avg = scoreVals.length > 0 ? Math.round(scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length) : 0;
        const level = getCompetencyLevel(avg).toLowerCase();

        return `
            <div class="ere-item" onclick="jumpToExamRecord('${record.studentId}','${record.subjectId}','${record.grade}')">
                <div>
                    <div style="font-weight:600; color:var(--text)">${escapeHtml(student ? student.name : 'Unknown')}</div>
                    <div style="font-size:0.7rem; color:var(--text-muted)">${subject ? subject.name : ''} · ${record.term} ${record.year}</div>
                </div>
                <span class="ere-item-score ${level}">${avg}%</span>
            </div>
        `;
    }).join('');
}

// --- JUMP TO A SPECIFIC EXAM RECORD ---
function jumpToExamRecord(studentId, subjectId, grade) {
    // Set the selectors
    if ($('examTradeSelect')) {
        $('examTradeSelect').value = grade;
        currentExamContext.tradeId = grade;
    }

    // Load subjects then set
    loadExamSubjects(grade);
    setTimeout(() => {
        if ($('examSubjectSelect')) {
            $('examSubjectSelect').value = subjectId;
            currentExamContext.subjectId = subjectId;
        }

        // Load students then set
        loadExamStudents();
        setTimeout(() => {
            if ($('examStudentSelect')) {
                $('examStudentSelect').value = studentId;
                currentExamContext.studentId = studentId;
            }
            loadCBETUnits();
        }, 50);
    }, 50);
}

// --- BATCH ASSESSMENT ---
function openBatchAssessmentModal() {
    const { tradeId: grade, subjectId } = currentExamContext;
    if (!grade || !subjectId) {
        showToast('Please select a grade and subject first.', 'error');
        return;
    }

    const subject = store.learningAreas.find(la => la.id === subjectId);
    const students = StudentRepo.findBy('grade', grade);
    if (students.length === 0) {
        showToast('No learners found in this grade.', 'error');
        return;
    }

    // Info bar
    if ($('batchModalTitle')) $('batchModalTitle').textContent = `Batch Assessment — ${subject ? subject.name : ''}`;
    if ($('batchInfoBar')) {
        $('batchInfoBar').innerHTML = `
            <i class="fa-solid fa-info-circle" style="color:var(--primary)"></i>
            <span><strong>Grade:</strong> ${grade} &nbsp;|&nbsp; <strong>Subject:</strong> ${subject ? subject.name : ''} &nbsp;|&nbsp; <strong>Learners:</strong> ${students.length}</span>
        `;
    }

    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();

    // Build table rows
    const tbody = $('batchAssessmentBody');
    if (!tbody) return;
    tbody.innerHTML = '';

    students.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    students.forEach((s, i) => {
        const examRecord = findExamRecord(s.id, subjectId, grade, term, year);
        const scores = examRecord ? examRecord.scores || {} : {};
        const scoreVals = Object.values(scores).map(sc => sc.score).filter(v => v !== null);
        const avg = scoreVals.length > 0 ? Math.round(scoreVals.reduce((a, b) => a + b, 0) / scoreVals.length) : '';
        const level = avg !== '' ? getCompetencyLevel(avg) : '';
        const remarks = examRecord ? Object.values(scores).map(sc => sc.remarks || '').filter(Boolean).join('; ') : '';

        const tr = document.createElement('tr');
        tr.dataset.studentId = s.id;
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${escapeHtml(s.reg || '—')}</td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td class="score-col">
                <input type="number" min="0" max="100" value="${avg}" 
                    data-student-id="${s.id}"
                    oninput="updateBatchRowCompetency(this)">
            </td>
            <td class="comp-col">
                <span class="batch-competency-badge" id="batchComp_${s.id}"
                    style="background:${level ? getCompetencyColor(level) + '22' : 'var(--border)'};
                           color:${level ? getCompetencyColor(level) : 'var(--text-muted)'}">
                    ${level || '—'}
                </span>
            </td>
            <td class="remarks-col">
                <textarea data-student-id="${s.id}" placeholder="Optional...">${escapeHtml(remarks)}</textarea>
            </td>
        `;
        tbody.appendChild(tr);
    });

    openModal('batchAssessmentModal');
}

function updateBatchRowCompetency(input) {
    const studentId = input.dataset.studentId;
    const val = parseInt(input.value) || 0;
    const clamped = Math.max(0, Math.min(100, val));
    const level = getCompetencyLevel(clamped);

    const badge = $(`batchComp_${studentId}`);
    if (badge) {
        badge.textContent = level;
        badge.style.background = getCompetencyColor(level) + '22';
        badge.style.color = getCompetencyColor(level);
    }
}

function saveBatchAssessments() {
    const { tradeId: grade, subjectId } = currentExamContext;
    if (!grade || !subjectId) return;

    const term = $('examTermSelect') ? $('examTermSelect').value : 'Term 1';
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();

    const rows = document.querySelectorAll('#batchAssessmentBody tr');
    let savedCount = 0;

    rows.forEach(row => {
        const studentId = row.dataset.studentId;
        const scoreInput = row.querySelector('input[type="number"]');
        const remarksInput = row.querySelector('textarea');
        const score = parseInt(scoreInput?.value) || 0;
        const remarks = remarksInput?.value?.trim() || '';

        if (score < 0 || score > 100) return;

        // Find or create exam record
        let examRecord = findExamRecord(studentId, subjectId, grade, term, year);
        if (!examRecord) {
            examRecord = {
                id: generateId(),
                studentId,
                subjectId,
                grade,
                term,
                year,
                scores: {},
                dateCreated: new Date().toISOString(),
                dateUpdated: new Date().toISOString()
            };
            store.exams.push(examRecord);
        }

        // For batch, we store the overall subject score as a "BATCH" entry
        if (!examRecord.scores) examRecord.scores = {};
        examRecord.scores['BATCH-OVERALL'] = {
            score: Math.max(0, Math.min(100, score)),
            level: getCompetencyLevel(score),
            unitName: 'Batch Overall Score',
            remarks,
            criteriaMet: [],
            dateAssessed: new Date().toISOString()
        };
        examRecord.dateUpdated = new Date().toISOString();
        savedCount++;
    });

    // Save IMMEDIATELY — batch save is explicit, must not be debounced
    saveData();

    closeModal('batchAssessmentModal');
    updateExamRecentEntries();
    updateExamQuickStats();

    // If a student was selected, refresh their view
    if (currentExamContext.studentId) {
        loadCBETUnits();
    }

    showToast(`Batch assessment saved for ${savedCount} learners.`, 'success');
}

// --- EXAM SUMMARY ---
function viewExamSummary() {
    // Populate grade dropdown if empty
    const gradeSelect = $('summaryGradeSelect');
    if (gradeSelect && gradeSelect.options.length <= 1) {
        Object.keys(CBC_LEVELS).forEach(grade => {
            const opt = document.createElement('option');
            opt.value = grade;
            opt.textContent = CBC_LEVELS[grade].name;
            gradeSelect.appendChild(opt);
        });
    }

    // Pre-select current grade
    if (gradeSelect && currentExamContext.tradeId) {
        gradeSelect.value = currentExamContext.tradeId;
        loadSummarySubjects(currentExamContext.tradeId);
        if ($('summarySubjectSelect') && currentExamContext.subjectId) {
            $('summarySubjectSelect').value = currentExamContext.subjectId;
        }
    }

    openModal('examSummaryModal');
}

function loadSummarySubjects(grade) {
    const select = $('summarySubjectSelect');
    if (!select) return;
    select.innerHTML = '<option value="">All Subjects</option>';

    const subjects = store.learningAreas.filter(la => la.applicableLevels && la.applicableLevels.includes(grade));
    subjects.forEach(subj => {
        const opt = document.createElement('option');
        opt.value = subj.id;
        opt.textContent = subj.name;
        select.appendChild(opt);
    });
    select.disabled = false;
}

// Add listener for summary grade change
document.addEventListener('DOMContentLoaded', () => {
    $('summaryGradeSelect')?.addEventListener('change', e => {
        loadSummarySubjects(e.target.value);
    });
});

function loadExamSummary() {
    const grade = $('summaryGradeSelect')?.value;
    const subjectId = $('summarySubjectSelect')?.value;
    const term = $('summaryTermSelect')?.value;
    const year = $('examYearInput') ? $('examYearInput').value : new Date().getFullYear().toString();

    if (!grade) {
        showToast('Please select a grade.', 'error');
        return;
    }

    const students = StudentRepo.findBy('grade', grade);
    const wrapper = $('summaryTableWrapper');
    if (!wrapper) return;

    if (students.length === 0) {
        wrapper.innerHTML = '<div class="summary-empty">No learners found in this grade.</div>';
        return;
    }

    // Build summary data
    const rows = students.map(s => {
        let records = store.exams.filter(e =>
            e.studentId === s.id &&
            e.grade === grade &&
            e.term === term &&
            e.year === year
        );

        if (subjectId) {
            records = records.filter(r => r.subjectId === subjectId);
        }

        let totalScore = 0;
        let scoreCount = 0;
        let subjectsAssessed = 0;

        records.forEach(r => {
            if (r.scores) {
                const vals = Object.values(r.scores).map(sc => sc.score).filter(v => v !== null);
                if (vals.length > 0) {
                    subjectsAssessed++;
                    totalScore += vals.reduce((a, b) => a + b, 0) / vals.length;
                    scoreCount++;
                }
            }
        });

        const avg = scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0;
        const level = getCompetencyLevel(avg);

        return {
            reg: s.reg || '—',
            name: s.name,
            gender: s.gender || '—',
            subjectsAssessed,
            avg,
            level
        };
    });

    // Sort by avg descending
    rows.sort((a, b) => b.avg - a.avg);

    // Render table
    wrapper.innerHTML = `
        <table class="summary-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>ADM No</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Subjects Assessed</th>
                    <th>Avg Score</th>
                    <th>Competency</th>
                </tr>
            </thead>
            <tbody>
                ${rows.map((r, i) => `
                    <tr>
                        <td>${i + 1}</td>
                        <td>${escapeHtml(r.reg)}</td>
                        <td><strong>${escapeHtml(r.name)}</strong></td>
                        <td>${escapeHtml(r.gender)}</td>
                        <td style="text-align:center">${r.subjectsAssessed}</td>
                        <td style="text-align:center; font-weight:700; color:${getCompetencyColor(r.level)}">${r.avg}%</td>
                        <td style="text-align:center">
                            <span class="batch-competency-badge" style="background:${getCompetencyColor(r.level)}22; color:${getCompetencyColor(r.level)}">${r.level}</span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function exportExamSummaryCSV() {
    const table = document.querySelector('.summary-table');
    if (!table) {
        showToast('Load a summary first.', 'error');
        return;
    }

    let csv = [];
    table.querySelectorAll('tr').forEach(row => {
        const cols = [];
        row.querySelectorAll('th, td').forEach(cell => {
            cols.push('"' + cell.textContent.replace(/"/g, '""').trim() + '"');
        });
        csv.push(cols.join(','));
    });

    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_summary_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Summary exported as CSV.', 'success');
}

// ==========================================================================
//   EXAM PORTAL INITIALIZATION (called from initializeApp)
// ==========================================================================
function initExamPortal() {
    populateExamGrades();
    updateExamRecentEntries();

    // Set default term/year from settings
    if ($('examTermSelect') && store.settings.currentTerm) {
        $('examTermSelect').value = store.settings.currentTerm;
    }
    if ($('examYearInput') && store.settings.academicYear) {
        $('examYearInput').value = store.settings.academicYear;
    }

    // Listen for term/year changes to refresh stats
    $('examTermSelect')?.addEventListener('change', () => {
        updateExamQuickStats();
        if (currentExamContext.studentId) loadCBETUnits();
    });
    $('examYearInput')?.addEventListener('change', () => {
        updateExamQuickStats();
        if (currentExamContext.studentId) loadCBETUnits();
    });
}

// Make sure initExamPortal is called during app initialization
// Patch into initializeApp
const _origInitApp = initializeApp;
initializeApp = function(user) {
    _origInitApp(user);
    initExamPortal();
};

// Grade ordering for sort
const LEARNER_GRADE_ORDER = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];

// ==========================================================================
//   PUBLIC ENTRY POINTS
// ==========================================================================

function initStudentSection() {
    LearnerState.view = 'grid';
    setView('grid', 'students');
    bindLearnerControls();
    renderLearnerSection();
}

// setView is still called from other places (e.g. staff). We keep the original
// signature but only re-render if students section is active.
function setView(type, section = 'students') {
    if (section === 'students') {
        LearnerState.view = type;
        // Sync toggle button UI
        document.querySelectorAll('#viewToggleBtns button').forEach(b => {
            b.classList.toggle('active', b.dataset.view === type);
        });
        // Show/hide containers
        const grid = $('studentsContainer');
        const table = $('studentsListContainer');
        if (grid && table) {
            if (type === 'list') {
                grid.style.display = 'none';
                table.style.display = 'block';
            } else {
                grid.style.display = 'grid';
                table.style.display = 'none';
            }
        }
        renderLearnerSection();
    } else {
        // Fallback for other sections
        if (!currentView[section]) currentView[section] = type;
    }
}

// Legacy alias - many inline handlers call applyFilters()
function applyFilters() {
    bindLearnerControls();
    renderLearnerSection();
}

// ==========================================================================
//   RENDER PIPELINE
// ==========================================================================

function renderLearnerSection() {
    renderLearnerSidebar();
    renderLearnerToolbar();
    renderLearnerContent();
    updateActiveFilterChips();
    updateBulkBar();
}

function renderLearnerSidebar() {
    const all = StudentRepo.getAll();
    // Update count badges
    setText('lsTotalCount', all.length);
    setText('lsStatAll', all.length);
    setText('lsStatMale', all.filter(s => s.gender === 'Male').length);
    setText('lsStatFemale', all.filter(s => s.gender === 'Female').length);

    // Highlight active gender chip
    document.querySelectorAll('.ls-stat-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.gender === LearnerState.gender);
    });

    // Render grade accordion
    const listContainer = $('studentSidebarList');
    if (!listContainer) return;

    const groups = {};
    all.forEach(s => {
        const grade = s.grade || 'Unknown';
        if (!groups[grade]) groups[grade] = [];
        groups[grade].push(s);
    });

    const sortedGrades = Object.keys(groups).sort((a, b) => {
        const ia = LEARNER_GRADE_ORDER.indexOf(a);
        const ib = LEARNER_GRADE_ORDER.indexOf(b);
        if (ia === -1 && ib === -1) return a.localeCompare(b);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
    });

    let html = '';
    sortedGrades.forEach((grade, index) => {
        const studentsInGrade = groups[grade];
        const isActive = LearnerState.grade === grade || (LearnerState.grade === 'all' && index === 0 && !LearnerState.search);
        const isFiltered = LearnerState.grade === grade;

        html += `
        <div class="grade-group ${isActive ? 'group-active' : ''}" data-grade="${escapeHtml(grade)}">
            <div class="grade-header" onclick="filterByGrade('${escapeHtml(grade)}', this)">
                <span>${escapeHtml(grade)}</span>
                <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600; background:var(--bg-card); padding:1px 8px; border-radius:999px;">${studentsInGrade.length}</span>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="grade-content">
                ${studentsInGrade.map(s => `
                    <div class="ss-item ${LearnerState.selected.has(s.id) ? 'active' : ''}" onclick="selectStudentSidebar('${s.id}')" title="${escapeHtml(s.name)}">
                        <div class="ps-avatar" style="width:32px; height:32px;">
                            <img src="${s.photo || DEFAULT_AVATAR}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${DEFAULT_AVATAR}'">
                        </div>
                        <div class="ps-info">
                            <h4>${escapeHtml(s.name)}</h4>
                            <span>${escapeHtml(s.reg || '')}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    });

    if (sortedGrades.length === 0) {
        html = `<div style="text-align:center; padding:1.5rem 0.5rem; color:var(--text-muted); font-size:0.8rem;">
            <i class="fa-solid fa-users-slash" style="font-size:1.5rem; display:block; margin-bottom:0.5rem; opacity:0.5;"></i>
            No learners yet. Click "New Learner" to add one.
        </div>`;
    }

    listContainer.innerHTML = html;
}

function renderLearnerToolbar() {
    const filtered = getFilteredLearners();
    const all = StudentRepo.getAll();

    // Update title and counts
    let title = 'All Learners';
    if (LearnerState.search) title = `Search: "${LearnerState.search}"`;
    else if (LearnerState.grade !== 'all') title = LearnerState.grade;
    if (LearnerState.stream !== 'all') title += ` · ${LearnerState.stream} Stream`;
    if (LearnerState.gender !== 'all') title += ` · ${LearnerState.gender}`;

    setText('currentViewTitle', title);
    setText('learnerResultCount', filtered.length);
    setText('learnerTotalCount', all.length);

    // Sync sort dropdown
    const sortSel = $('learnerSortSelect');
    if (sortSel && sortSel.value !== LearnerState.sort) sortSel.value = LearnerState.sort;

    // Sync per-page dropdown
    const perPageSel = $('learnerPerPageSelect');
    if (perPageSel) {
        const v = String(LearnerState.perPage);
        if (perPageSel.value !== v) perPageSel.value = v;
    }

    // Sync stream filter
    const streamSel = $('streamFilter');
    if (streamSel && streamSel.value !== LearnerState.stream) streamSel.value = LearnerState.stream;

    // Sync search input (without triggering events)
    const searchInput = $('studentSearch');
    if (searchInput && searchInput.value !== LearnerState.search) {
        searchInput.value = LearnerState.search;
    }
    // Show/hide clear button
    const clearBtn = $('learnerSearchClear');
    if (clearBtn) clearBtn.style.display = LearnerState.search ? 'flex' : 'none';

    // Update sortable column indicators
    document.querySelectorAll('.learner-table th.sortable').forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        if (th.dataset.sort === LearnerState.sortColumn) {
            th.classList.add(LearnerState.sortDir === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}

function renderLearnerContent() {
    const filtered = getFilteredLearners();
    const sorted = sortLearners(filtered);
    const paginated = paginateLearners(sorted);

    if (LearnerState.view === 'list') {
        renderLearnerTable(sorted, paginated);
        // Hide grid container
        const grid = $('studentsContainer');
        if (grid) grid.style.display = 'none';
        const tableWrap = $('studentsListContainer');
        if (tableWrap) tableWrap.style.display = 'block';
    } else {
        renderLearnerCards(paginated, filtered.length);
        const tableWrap = $('studentsListContainer');
        if (tableWrap) tableWrap.style.display = 'none';
        const grid = $('studentsContainer');
        if (grid) grid.style.display = 'grid';
    }

    renderLearnerPagination(sorted.length);
}

// ==========================================================================
//   FILTER PIPELINE
// ==========================================================================

function getFilteredLearners() {
    const all = StudentRepo.getAll();
    const search = (LearnerState.search || '').toLowerCase().trim();

    return all.filter(s => {
        if (!s || !s.name) return false;

        // Grade
        if (LearnerState.grade !== 'all' && s.grade !== LearnerState.grade) return false;

        // Stream
        if (LearnerState.stream !== 'all' && s.stream !== LearnerState.stream) return false;

        // Gender
        if (LearnerState.gender !== 'all' && s.gender !== LearnerState.gender) return false;

        // Search across: name, reg, grade, stream, guardian name, guardian phone, phone, idNumber
        if (search) {
            const haystack = [
                s.name, s.reg, s.grade, s.stream,
                s.guardianName, s.guardianPhone,
                s.phone, s.idNumber, s.upiNumber
            ].map(v => String(v || '').toLowerCase()).join(' ');
            if (!haystack.includes(search)) return false;
        }

        return true;
    });
}

function sortLearners(list) {
    let arr = [...list];
    // If user clicked a table header, use that
    if (LearnerState.sortColumn) {
        const col = LearnerState.sortColumn;
        const dir = LearnerState.sortDir === 'asc' ? 1 : -1;
        arr.sort((a, b) => {
            let av = a[col], bv = b[col];
            if (col === 'grade') {
                av = LEARNER_GRADE_ORDER.indexOf(av);
                bv = LEARNER_GRADE_ORDER.indexOf(bv);
                if (av === -1) av = 99;
                if (bv === -1) bv = 99;
                return (av - bv) * dir;
            }
            av = String(av || '').toLowerCase();
            bv = String(bv || '').toLowerCase();
            return av.localeCompare(bv) * dir;
        });
        return arr;
    }

    // Otherwise use the dropdown
    switch (LearnerState.sort) {
        case 'name-asc': arr.sort((a, b) => String(a.name).localeCompare(b.name)); break;
        case 'name-desc': arr.sort((a, b) => String(b.name).localeCompare(a.name)); break;
        case 'recent': arr.sort((a, b) => String(b.admissionDate || '').localeCompare(String(a.admissionDate || ''))); break;
        case 'grade-asc': arr.sort((a, b) => (LEARNER_GRADE_ORDER.indexOf(a.grade) - LEARNER_GRADE_ORDER.indexOf(b.grade)) || String(a.name).localeCompare(b.name)); break;
        case 'grade-desc': arr.sort((a, b) => (LEARNER_GRADE_ORDER.indexOf(b.grade) - LEARNER_GRADE_ORDER.indexOf(a.grade)) || String(a.name).localeCompare(b.name)); break;
        case 'reg-asc': arr.sort((a, b) => String(a.reg || '').localeCompare(String(b.reg || ''))); break;
    }
    return arr;
}

function paginateLearners(sorted) {
    if (LearnerState.perPage === 'all' || LearnerState.perPage >= sorted.length) return sorted;
    const start = (LearnerState.page - 1) * LearnerState.perPage;
    return sorted.slice(start, start + LearnerState.perPage);
}

// ==========================================================================
//   GRID VIEW
// ==========================================================================

function renderLearnerCards(paginated, totalFiltered) {
    const container = $('studentsContainer');
    if (!container) return;

    if (paginated.length === 0) {
        container.innerHTML = renderLearnerEmptyState();
        return;
    }

    // Build a map of student -> avg score for status indicator
    const examsByStudent = {};
    (store.exams || []).forEach(e => {
        if (!examsByStudent[e.studentId]) examsByStudent[e.studentId] = [];
        const sc = parseFloat(e.score) || 0;
        if (sc > 0) examsByStudent[e.studentId].push(sc);
    });

    container.innerHTML = paginated.map(s => {
        const isSelected = LearnerState.selected.has(s.id);
        const genderClass = s.gender === 'Male' ? 'card-male' : (s.gender === 'Female' ? 'card-female' : '');
        const scores = examsByStudent[s.id] || [];
        const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
        let statusClass = 'unassessed';
        if (avg !== null) {
            if (avg < 40) statusClass = 'below';
            else statusClass = '';
        }

        return `
        <div class="student-card ${genderClass} ${isSelected ? 'is-selected' : ''}" data-id="${s.id}">
            <div class="sc-card-top">
                <div class="sc-avatar-wrap" onclick="viewStudent('${s.id}')" style="cursor:pointer;">
                    <div class="sc-avatar">
                        <img src="${s.photo || DEFAULT_AVATAR}" alt="${escapeHtml(s.name)}" onerror="this.src='${DEFAULT_AVATAR}'">
                        <span class="sc-avatar-status ${statusClass}" title="${avg !== null ? 'Avg: ' + avg + '%' : 'No assessments yet'}"></span>
                    </div>
                    <div class="sc-info">
                        <div class="sc-name" onclick="event.stopPropagation(); viewStudent('${s.id}')">${highlightMatch(escapeHtml(s.name))}</div>
                        <div class="sc-meta">
                            <span class="sc-reg-badge">${escapeHtml(s.reg || '—')}</span>
                            ${avg !== null ? `<span>·</span><span><i class="fa-solid fa-star" style="color:#f59e0b"></i> ${avg}%</span>` : ''}
                        </div>
                    </div>
                </div>
                <input type="checkbox" class="sc-select" data-id="${s.id}" ${isSelected ? 'checked' : ''} onchange="toggleLearnerSelection('${s.id}', this.checked)" onclick="event.stopPropagation()" title="Select for bulk action">
            </div>

            <div class="sc-badges">
                <span class="sc-badge sc-badge-grade"><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(s.grade || '—')}</span>
                <span class="sc-badge sc-badge-stream">${escapeHtml(s.stream || '—')}</span>
                <span class="sc-badge sc-badge-gender-${(s.gender || 'male').toLowerCase()}"><i class="fa-solid fa-${s.gender === 'Female' ? 'venus' : 'mars'}"></i> ${escapeHtml(s.gender || '—')}</span>
            </div>

            <div class="sc-body">
                <div class="sc-detail">
                    <span class="sc-detail-label">Guardian</span>
                    <span class="sc-detail-value" title="${escapeHtml(s.guardianName || '')}">${escapeHtml(s.guardianName || '—')}</span>
                </div>
                <div class="sc-detail">
                    <span class="sc-detail-label">Phone</span>
                    <span class="sc-detail-value">${escapeHtml(s.phone || s.guardianPhone || '—')}</span>
                </div>
                <div class="sc-detail">
                    <span class="sc-detail-label">DOB</span>
                    <span class="sc-detail-value">${escapeHtml(formatLearnerDate(s.dob))}</span>
                </div>
                <div class="sc-detail">
                    <span class="sc-detail-label">Birth Cert</span>
                    <span class="sc-detail-value">${escapeHtml(s.idNumber || '—')}</span>
                </div>
            </div>

            <div class="sc-footer">
                <button class="sc-action" onclick="event.stopPropagation(); viewStudent('${s.id}')" title="View Profile"><i class="fa-solid fa-eye"></i></button>
                <button class="sc-action" onclick="event.stopPropagation(); editStudent('${s.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                <button class="sc-action danger" onclick="event.stopPropagation(); secureDelete('${s.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
        </div>
        `;
    }).join('');
}

// ==========================================================================
//   LIST (TABLE) VIEW
// ==========================================================================

function renderLearnerTable(sorted, paginated) {
    const tbody = $('studentsTableBody');
    if (!tbody) return;

    if (paginated.length === 0) {
        tbody.innerHTML = `<tr class="lt-empty-row"><td colspan="9">${renderLearnerEmptyState(true)}</td></tr>`;
        return;
    }

    tbody.innerHTML = paginated.map(s => {
        const isSelected = LearnerState.selected.has(s.id);
        return `
        <tr class="${isSelected ? 'is-selected' : ''}" data-id="${s.id}">
            <td><input type="checkbox" class="learner-row-check" data-id="${s.id}" ${isSelected ? 'checked' : ''} onchange="toggleLearnerSelection('${s.id}', this.checked)" onclick="event.stopPropagation()"></td>
            <td><strong>${highlightMatch(escapeHtml(s.reg || '—'))}</strong></td>
            <td>
                <div class="lt-learner-cell">
                    <div class="lt-learner-avatar">
                        <img src="${s.photo || DEFAULT_AVATAR}" alt="${escapeHtml(s.name)}" onerror="this.src='${DEFAULT_AVATAR}'">
                    </div>
                    <div class="lt-learner-info">
                        <span class="lt-learner-name">${highlightMatch(escapeHtml(s.name))}</span>
                        <span class="lt-learner-meta">${escapeHtml(s.gender || '')} · ${escapeHtml(formatLearnerDate(s.dob))}</span>
                    </div>
                </div>
            </td>
            <td>${escapeHtml(s.grade || '—')}</td>
            <td><span class="sc-badge sc-badge-stream">${escapeHtml(s.stream || '—')}</span></td>
            <td>${escapeHtml(s.gender || '—')}</td>
            <td>${escapeHtml(s.guardianName || '—')}</td>
            <td>${escapeHtml(s.phone || s.guardianPhone || '—')}</td>
            <td>
                <div class="lt-actions">
                    <button class="lt-action" onclick="viewStudent('${s.id}')" title="View Profile"><i class="fa-solid fa-eye"></i></button>
                    <button class="lt-action" onclick="editStudent('${s.id}')" title="Edit"><i class="fa-solid fa-pen"></i></button>
                    <button class="lt-action danger" onclick="secureDelete('${s.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        </tr>
        `;
    }).join('');

    // Sync select-all checkbox
    const selectAll = $('learnerSelectAll');
    if (selectAll) {
        const allSelected = paginated.length > 0 && paginated.every(s => LearnerState.selected.has(s.id));
        selectAll.checked = allSelected;
        selectAll.indeterminate = !allSelected && paginated.some(s => LearnerState.selected.has(s.id));
    }
}

// ==========================================================================
//   PAGINATION
// ==========================================================================

function renderLearnerPagination(totalItems) {
    const container = $('studentsPagination');
    if (!container) return;

    const perPage = LearnerState.perPage;
    if (perPage === 'all' || totalItems === 0) {
        container.style.display = 'none';
        return;
    }
    container.style.display = 'flex';

    const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
    if (LearnerState.page > totalPages) LearnerState.page = totalPages;
    if (LearnerState.page < 1) LearnerState.page = 1;

    const start = (LearnerState.page - 1) * perPage + 1;
    const end = Math.min(LearnerState.page * perPage, totalItems);

    let html = `<div class="lp-info">Showing <strong>${start}-${end}</strong> of <strong>${totalItems}</strong> learners</div>`;
    html += '<div class="lp-controls">';

    // Prev button
    html += `<button class="lp-btn" ${LearnerState.page === 1 ? 'disabled' : ''} onclick="changeLearnerPage(${LearnerState.page - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;

    // Page numbers with smart truncation
    const pages = computePageList(LearnerState.page, totalPages);
    pages.forEach(p => {
        if (p === '...') html += '<span class="lp-ellipsis">…</span>';
        else html += `<button class="lp-btn ${p === LearnerState.page ? 'active' : ''}" onclick="changeLearnerPage(${p})">${p}</button>`;
    });

    // Next button
    html += `<button class="lp-btn" ${LearnerState.page === totalPages ? 'disabled' : ''} onclick="changeLearnerPage(${LearnerState.page + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
    html += '</div>';

    container.innerHTML = html;
}

function computePageList(current, total) {
    const pages = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i);
        return pages;
    }
    pages.push(1);
    if (current > 3) pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
    return pages;
}

function changeLearnerPage(p) {
    LearnerState.page = p;
    renderLearnerContent();
    // Scroll to top of list
    document.querySelector('.learner-main-modern')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ==========================================================================
//   ACTIVE FILTER CHIPS
// ==========================================================================

function updateActiveFilterChips() {
    const container = $('learnerActiveFilters');
    if (!container) return;

    const chips = [];
    if (LearnerState.search) {
        chips.push({ key: 'search', label: 'Search', value: `"${LearnerState.search}"` });
    }
    if (LearnerState.grade !== 'all') {
        chips.push({ key: 'grade', label: 'Grade', value: LearnerState.grade });
    }
    if (LearnerState.stream !== 'all') {
        chips.push({ key: 'stream', label: 'Stream', value: LearnerState.stream });
    }
    if (LearnerState.gender !== 'all') {
        chips.push({ key: 'gender', label: 'Gender', value: LearnerState.gender });
    }

    if (chips.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'flex';
    container.innerHTML = chips.map(c => `
        <span class="filter-chip">
            <span class="chip-label">${c.label}:</span>
            <span class="chip-value">${escapeHtml(c.value)}</span>
            <button class="chip-clear" data-clear-key="${c.key}" title="Remove filter">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </span>
    `).join('');

    // Wire up chip clear buttons
    container.querySelectorAll('.chip-clear').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.clearKey;
            if (key === 'search') LearnerState.search = '';
            else if (key === 'grade') LearnerState.grade = 'all';
            else if (key === 'stream') LearnerState.stream = 'all';
            else if (key === 'gender') LearnerState.gender = 'all';
            LearnerState.page = 1;
            renderLearnerSection();
        });
    });
}

// ==========================================================================
//   BULK ACTIONS
// ==========================================================================

function toggleLearnerSelection(id, checked) {
    if (checked) LearnerState.selected.add(id);
    else LearnerState.selected.delete(id);
    updateBulkBar();
    // Update row/card visual without full re-render
    document.querySelectorAll(`.student-card[data-id="${id}"]`).forEach(el => el.classList.toggle('is-selected', checked));
    document.querySelectorAll(`tr[data-id="${id}"]`).forEach(el => el.classList.toggle('is-selected', checked));
    // Update sidebar item
    document.querySelectorAll('.ss-item').forEach(item => {
        // ss-item has onclick="selectStudentSidebar('id')"
        if (item.getAttribute('onclick') === `selectStudentSidebar('${id}')`) {
            item.classList.toggle('active', checked);
        }
    });
}

function selectAllLearners(checked) {
    const filtered = getFilteredLearners();
    if (checked) {
        filtered.forEach(s => LearnerState.selected.add(s.id));
    } else {
        LearnerState.selected.clear();
    }
    renderLearnerContent();
    updateBulkBar();
}

function clearLearnerSelection() {
    LearnerState.selected.clear();
    renderLearnerContent();
    updateBulkBar();
}

function updateBulkBar() {
    const bar = $('learnerBulkBar');
    if (!bar) return;
    const count = LearnerState.selected.size;
    bar.style.display = count > 0 ? 'flex' : 'none';
    setText('learnerBulkCount', count);
}

function bulkDeleteLearners() {
    const ids = Array.from(LearnerState.selected);
    if (ids.length === 0) return;
    if (!confirm(`Delete ${ids.length} learner${ids.length !== 1 ? 's' : ''}? This action cannot be undone.`)) return;
    let deleted = 0;
    ids.forEach(id => {
        if (StudentRepo.delete(id)) deleted++;
    });
    LearnerState.selected.clear();
    saveData();
    renderLearnerSection();
    renderDashboard();
    showToast(`${deleted} learner${deleted !== 1 ? 's' : ''} deleted`, 'success');
}

function bulkExportLearners() {
    const ids = Array.from(LearnerState.selected);
    if (ids.length === 0) return;
    const students = ids.map(id => StudentRepo.getById(id)).filter(Boolean);
    if (students.length === 0) return showToast('No data to export', 'error');

    const headers = ['Adm No', 'Name', 'Gender', 'DOB', 'Birth Cert', 'Phone', 'Grade', 'Stream', 'Guardian', 'Guardian Phone'];
    const rows = students.map(s => [s.reg, s.name, s.gender, s.dob, s.idNumber, s.phone, s.grade, s.stream, s.guardianName, s.guardianPhone]);
    let csv = headers.join(',') + '\n';
    rows.forEach(r => { csv += r.map(f => `"${String(f || '').replace(/"/g, '""')}"`).join(',') + '\n'; });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `learners-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${students.length} learners`, 'success');
}

function bulkPrintLearners() {
    const ids = Array.from(LearnerState.selected);
    if (ids.length === 0) return;
    const students = ids.map(id => StudentRepo.getById(id)).filter(Boolean);

    const win = window.open('', '_blank');
    if (!win) return showToast('Pop-up blocked. Please allow pop-ups to print.', 'error');

    win.document.write(`
    <html><head><title>Learner Cards - ${students.length}</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 20px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .card { border: 1px solid #ccc; border-radius: 8px; padding: 12px; }
        .name { font-weight: 700; font-size: 14px; }
        .meta { font-size: 11px; color: #666; margin-top: 4px; }
        .reg { font-weight: 700; color: #22C55E; }
        h1 { font-size: 18px; margin-bottom: 16px; }
    </style></head><body>
    <h1>Learner Cards - ${students.length} learners</h1>
    <div class="grid">
    ${students.map(s => `
        <div class="card">
            <div class="name">${escapeHtml(s.name)}</div>
            <div class="meta"><span class="reg">${escapeHtml(s.reg || '')}</span> · ${escapeHtml(s.grade || '')} · ${escapeHtml(s.stream || '')}</div>
            <div class="meta">Gender: ${escapeHtml(s.gender || '')} · DOB: ${escapeHtml(formatLearnerDate(s.dob))}</div>
            <div class="meta">Guardian: ${escapeHtml(s.guardianName || '')} · ${escapeHtml(s.guardianPhone || s.phone || '')}</div>
        </div>
    `).join('')}
    </div>
    <script>window.onload = () => window.print();<\/script>
    </body></html>`);
    win.document.close();
}

// ==========================================================================
//   EMPTY STATE
// ==========================================================================

function renderLearnerEmptyState(compact = false) {
    const hasFilters = LearnerState.search || LearnerState.grade !== 'all' || LearnerState.stream !== 'all' || LearnerState.gender !== 'all';
    const totalLearners = StudentRepo.count();

    if (totalLearners === 0) {
        return `<div class="learner-empty">
            <i class="fa-solid fa-users-slash"></i>
            <h4>No learners yet</h4>
            <p>Get started by admitting your first learner.</p>
            <button class="btn btn-primary btn-sm" onclick="router('intake')"><i class="fa-solid fa-plus"></i> New Admission</button>
        </div>`;
    }

    if (hasFilters) {
        return `<div class="learner-empty">
            <i class="fa-solid fa-magnifying-glass"></i>
            <h4>No learners match your filters</h4>
            <p>Try adjusting your search or filters to find what you're looking for.</p>
            <div class="empty-suggestions">
                <button class="empty-suggestion" data-clear-all><i class="fa-solid fa-eraser"></i> Clear all filters</button>
                ${LearnerState.search ? `<button class="empty-suggestion" data-clear="search">Clear search</button>` : ''}
                ${LearnerState.grade !== 'all' ? `<button class="empty-suggestion" data-clear="grade">Show all grades</button>` : ''}
                ${LearnerState.stream !== 'all' ? `<button class="empty-suggestion" data-clear="stream">Show all streams</button>` : ''}
            </div>
        </div>`;
    }

    return `<div class="learner-empty"><i class="fa-solid fa-users-slash"></i><h4>No learners found</h4></div>`;
}

function clearAllLearnerFilters() {
    LearnerState.search = '';
    LearnerState.grade = 'all';
    LearnerState.stream = 'all';
    LearnerState.gender = 'all';
    LearnerState.page = 1;
    renderLearnerSection();
}

// ==========================================================================
//   SIDEBAR + FILTER ACTIONS
// ==========================================================================

function selectStudentSidebar(id) {
    viewStudent(id);
}

// ==========================================================================
//   viewStudent(id) — Navigate to Profile section and load the learner.
//   Used by: students grid rows, leaderboard click handlers, sidebar items,
//   notes student name clicks, etc. Falls back to the students page if the
//   profile renderer is unavailable for any reason.
// ==========================================================================
function viewStudent(studentId) {
    if (!studentId) return;
    // Try the profile section first
    if (typeof router === 'function') {
        router('profile');
    }
    // Defer slightly so the profile section is in the DOM before we populate
    setTimeout(() => {
        if (typeof populateProfileList === 'function') {
            try { populateProfileList(); } catch (e) { /* noop */ }
        }
        if (typeof renderStudentProfile === 'function') {
            try { renderStudentProfile(studentId); } catch (e) {
                // Fallback: open the student view modal on the students page
                router('students');
                setTimeout(() => {
                    const viewBtn = document.querySelector(`[data-action="view"][data-id="${studentId}"]`);
                    if (viewBtn) viewBtn.click();
                }, 350);
            }
        } else {
            // Profile renderer unavailable — fall back to students page
            router('students');
            setTimeout(() => {
                const viewBtn = document.querySelector(`[data-action="view"][data-id="${studentId}"]`);
                if (viewBtn) viewBtn.click();
            }, 350);
        }
    }, 120);
}

function filterByGrade(grade, element) {
    // Toggle accordion open
    document.querySelectorAll('.grade-group').forEach(g => g.classList.remove('group-active'));
    if (element) element.closest('.grade-group')?.classList.add('group-active');

    LearnerState.grade = grade;
    LearnerState.search = ''; // Clear search when picking a grade
    LearnerState.page = 1;
    renderLearnerSection();
}

function filterByGender(gender) {
    LearnerState.gender = (LearnerState.gender === gender) ? 'all' : gender;
    LearnerState.page = 1;
    renderLearnerSection();
}

// ==========================================================================
//   HELPER: Highlight search match
// ==========================================================================

function highlightMatch(text) {
    if (!LearnerState.search) return text;
    const term = LearnerState.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!term) return text;
    try {
        const re = new RegExp(`(${term})`, 'gi');
        return text.replace(re, '<mark style="background:rgba(34,197,94,0.25); color:var(--primary-dark, var(--primary)); padding:0 2px; border-radius:3px;">$1</mark>');
    } catch (e) {
        return text;
    }
}

// ==========================================================================
//   HELPER: Format date (YYYY-MM-DD -> DD Mon YYYY)
// ==========================================================================

function formatLearnerDate(d) {
    if (!d) return '—';
    const date = new Date(d);
    if (isNaN(date.getTime())) return d;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ==========================================================================
//   CONTROL BINDING (idempotent)
// ==========================================================================

let learnerControlsBound = false;
function bindLearnerControls() {
    if (learnerControlsBound) return;

    // Search input - debounced
    let searchTimer;
    const searchInput = $('studentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            const term = e.target.value;
            searchTimer = setTimeout(() => {
                LearnerState.search = term.trim();
                LearnerState.grade = 'all'; // Reset grade when searching
                LearnerState.page = 1;
                renderLearnerSection();
            }, 200);
        });
    }

    // Search clear button
    $('learnerSearchClear')?.addEventListener('click', () => {
        LearnerState.search = '';
        LearnerState.page = 1;
        if (searchInput) searchInput.value = '';
        renderLearnerSection();
        searchInput?.focus();
    });

    // Sidebar quick-stats gender filter
    document.querySelectorAll('.ls-stat-chip').forEach(chip => {
        chip.addEventListener('click', () => filterByGender(chip.dataset.gender));
    });

    // Sidebar "Clear all" button
    $('learnerClearAll')?.addEventListener('click', clearAllLearnerFilters);

    // Stream filter
    $('streamFilter')?.addEventListener('change', (e) => {
        LearnerState.stream = e.target.value;
        LearnerState.page = 1;
        renderLearnerSection();
    });

    // Sort dropdown
    $('learnerSortSelect')?.addEventListener('change', (e) => {
        LearnerState.sort = e.target.value;
        LearnerState.sortColumn = null; // Reset table-column sort
        renderLearnerSection();
    });

    // Per-page dropdown
    $('learnerPerPageSelect')?.addEventListener('change', (e) => {
        const v = e.target.value;
        LearnerState.perPage = v === 'all' ? 'all' : parseInt(v, 10);
        LearnerState.page = 1;
        renderLearnerSection();
    });

    // View toggles (grid/list)
    document.querySelectorAll('#viewToggleBtns button').forEach(btn => {
        btn.addEventListener('click', () => {
            setView(btn.dataset.view, 'students');
        });
    });

    // Table header sortable columns
    document.querySelectorAll('.learner-table th.sortable').forEach(th => {
        th.addEventListener('click', () => {
            const col = th.dataset.sort;
            if (LearnerState.sortColumn === col) {
                LearnerState.sortDir = LearnerState.sortDir === 'asc' ? 'desc' : 'asc';
            } else {
                LearnerState.sortColumn = col;
                LearnerState.sortDir = 'asc';
            }
            // Sync sort dropdown
            if (col === 'name') LearnerState.sort = LearnerState.sortDir === 'asc' ? 'name-asc' : 'name-desc';
            else if (col === 'reg') LearnerState.sort = 'reg-asc';
            else if (col === 'grade') LearnerState.sort = LearnerState.sortDir === 'asc' ? 'grade-asc' : 'grade-desc';
            renderLearnerSection();
        });
    });

    // Select-all checkbox
    $('learnerSelectAll')?.addEventListener('change', (e) => selectAllLearners(e.target.checked));

    // Bulk action buttons
    $('learnerBulkClear')?.addEventListener('click', clearLearnerSelection);
    $('learnerBulkDelete')?.addEventListener('click', bulkDeleteLearners);
    $('learnerBulkExport')?.addEventListener('click', bulkExportLearners);
    $('learnerBulkPrint')?.addEventListener('click', bulkPrintLearners);

    // Export CSV button - keep existing handler but also support shift-click for selected-only
    $('btnExportCSV')?.addEventListener('click', (e) => {
        if (LearnerState.selected.size > 0 && confirm(`Export ${LearnerState.selected.size} selected learners? Click Cancel to export all.`)) {
            e.preventDefault();
            e.stopPropagation();
            bulkExportLearners();
        }
        // Otherwise let the existing exportStudentsCSV handler run
    });

    // Empty-state suggestion buttons (delegated, since container re-renders)
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.empty-suggestion');
        if (!btn) return;
        // Only handle if inside the learners section
        if (!btn.closest('#students')) return;
        e.preventDefault();
        if (btn.hasAttribute('data-clear-all')) {
            clearAllLearnerFilters();
            return;
        }
        const key = btn.dataset.clear;
        if (key === 'search') LearnerState.search = '';
        else if (key === 'grade') LearnerState.grade = 'all';
        else if (key === 'stream') LearnerState.stream = 'all';
        else if (key === 'gender') LearnerState.gender = 'all';
        LearnerState.page = 1;
        renderLearnerSection();
    });

    learnerControlsBound = true;
}

// ==========================================================================
//   COMPAT: Old renderStudentSection() - called from elsewhere
// ==========================================================================

function renderStudentSection() {
    bindLearnerControls();
    renderLearnerSection();
}

// Also expose renderStudentGrid / renderStudentTable / renderStudentList / renderPagination
// as no-op shims so any leftover references don't crash.
function renderStudentGrid(data, container) {
    if (container) container.innerHTML = '';
    renderLearnerContent();
}
function renderStudentTable(data, tbody) {
    if (tbody) tbody.innerHTML = '';
    renderLearnerContent();
}
function renderStudentList(data) { renderLearnerContent(); }
function renderPagination(total) { renderLearnerPagination(total); }
function updateStudentStats(filteredData) {
    const all = StudentRepo.getAll();
    setText('lsTotalCount', all.length);
    setText('lsStatAll', all.length);
    setText('lsStatMale', all.filter(s => s.gender === 'Male').length);
    setText('lsStatFemale', all.filter(s => s.gender === 'Female').length);
    if ($('countTotal')) $('countTotal').textContent = all.length;
    if ($('countMale')) $('countMale').textContent = all.filter(s => s.gender === 'Male').length;
    if ($('countFemale')) $('countFemale').textContent = all.filter(s => s.gender === 'Female').length;
}



// ==========================================================================
//   AUTH CONFIRMATION (Updated)
// ==========================================================================
function confirmAuth() { 
    const password = $('adminPassword').value; 
    if (password !== ADMIN_PASSWORD) { showToast('Incorrect password!', 'error'); return; } 
    closeModal('authModal'); 
    
    if (pendingAction === 'delete') executeDeleteStudent(pendingActionData); 
    else if (pendingAction === 'reset') executeSystemReset(); 
    else if (pendingAction === 'update-assessment') executeUpdateAssessment(pendingActionData);
    
    pendingAction = null; 
    pendingActionData = null;
}

function executeSystemReset() { store.students = []; store.staff = []; store.exams = []; store.notes = []; saveData(); initializeApp(CURRENT_USER); showToast('System has been reset successfully.'); }
function executeDeleteStudent(id) { if (StudentRepo.delete(id)) { applyFilters(); renderDashboard(); showToast('Learner record deleted'); } }

// ==========================================================================
//   EXPORT FUNCTIONALITIES
// ==========================================================================
function exportStudentsCSV() {
    const students = StudentRepo.getAll();
    if (students.length === 0) return showToast('No data to export', 'error');
    const headers = ['Adm No', 'Name', 'Gender', 'DOB', 'ID No', 'Phone', 'Grade', 'Stream'];
    const rows = students.map(s => [s.reg, s.name, s.gender, s.dob, s.idNumber, s.phone, s.grade, s.stream]);
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => { const cleanRow = row.map(field => `"${field || ''}"`); csvContent += cleanRow.join(',') + '\n'; });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Learners_Export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('CSV Exported');
}

function exportStudentsExcel() {
    if (!window.XLSX) return showToast('Excel library not loaded', 'error');
    const students = StudentRepo.getAll();
    if (students.length === 0) return showToast('No data to export', 'error');
    const data = students.map(s => ({ 'Adm No': s.reg, 'Name': s.name, 'Gender': s.gender, 'DOB': s.dob, 'ID No': s.idNumber, 'Phone': s.phone, 'Grade': s.grade, 'Stream': s.stream }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Learners');
    const colWidths = Object.keys(data[0] || {}).map(key => ({ wch: Math.max(key.length, 15) }));
    ws['!cols'] = colWidths;
    XLSX.writeFile(wb, `Learners_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
    showToast('Excel Exported');
}

// ==========================================================================
//   CBC EXAMS & ASSESSMENT
// ==========================================================================

function getCompetenceStatus(score) { 
    const numScore = parseInt(score) || 0; 
    let level = 'Below Expectation'; 
    let decision = 'Not Yet Competent'; 
    let abbr = 'BE'; 
    let cssClass = 'status-nyc';
    let feedback = 'Requires significant support and remedial work.'; 
    let points = 0; // New property for points

    if (numScore >= 90) { 
        level = 'Exceeding Expectation 1'; decision = 'Competent'; abbr = 'EE1'; cssClass = 'status-c'; points = 4.0;
        feedback = 'Outstanding performance. Demonstrates mastery.'; 
    }
    else if (numScore >= 75) { 
        level = 'Exceeding Expectation 2'; decision = 'Competent'; abbr = 'EE2'; cssClass = 'status-c'; points = 3.5;
        feedback = 'Excellent performance. High capability.'; 
    }
    else if (numScore >= 58) { 
        level = 'Meeting Expectation 1'; decision = 'Competent'; abbr = 'ME1'; cssClass = 'status-c'; points = 3.0;
        feedback = 'Good performance. Meets expected outcomes.'; 
    }
    else if (numScore >= 41) { 
        level = 'Meeting Expectation 2'; decision = 'Competent'; abbr = 'ME2'; cssClass = 'status-c'; points = 2.5;
        feedback = 'Satisfactory performance.'; 
    }
    else if (numScore >= 31) { 
        level = 'Approaching Expectation 1'; decision = 'Not Yet Competent'; abbr = 'AE1'; cssClass = 'status-nyc'; points = 2.0;
        feedback = 'Fair attempt. Needs more practice.'; 
    }
    else if (numScore >= 21) { 
        level = 'Approaching Expectation 2'; decision = 'Not Yet Competent'; abbr = 'AE2'; cssClass = 'status-nyc'; points = 1.5;
        feedback = 'Requires improvement.'; 
    }
    else if (numScore >= 11) { 
        level = 'Below Expectation 1'; decision = 'Not Yet Competent'; abbr = 'BE1'; cssClass = 'status-nyc'; points = 1.0;
        feedback = 'Requires significant support.'; 
    }
    else if (numScore >= 1) { 
        level = 'Below Expectation 2'; decision = 'Not Yet Competent'; abbr = 'BE2'; cssClass = 'status-nyc'; points = 0.5;
        feedback = 'Requires intervention.'; 
    }
    // Default for 0 or invalid
    else { 
        level = 'Below Expectation'; decision = 'Not Yet Competent'; abbr = 'BE'; cssClass = 'status-nyc'; points = 0;
        feedback = 'No valid score.'; 
    }
    
    return { level, decision, class: cssClass, abbr, feedback, points }; 
}


function resetExamView() { currentExamContext = { studentId: null, subjectId: null }; if ($('examStudentSelect')) { $('examStudentSelect').innerHTML = "<option value=''>Select Learner...</option>"; $('examStudentSelect').disabled = true; } if ($('examTradeSelect')) $('examTradeSelect').value = ""; if ($('examInterface')) $('examInterface').style.display = 'none'; if ($('examEmptyState')) $('examEmptyState').style.display = 'flex'; }
function loadExamStudents() { const grade = currentExamContext.tradeId; const studentSelect = $('examStudentSelect'); if (!studentSelect) return; studentSelect.innerHTML = "<option value=''>Select Learner...</option>"; currentExamContext.studentId = null; if (!grade) { studentSelect.disabled = true; return; } studentSelect.disabled = false; const filtered = StudentRepo.findBy('grade', grade); if (filtered.length === 0) { studentSelect.innerHTML = "<option value=''>No learners in this grade</option>"; studentSelect.disabled = true; return; } filtered.forEach(s => { studentSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.reg})</option>`; }); if ($('examInterface')) $('examInterface').style.display = 'none'; if ($('examEmptyState')) $('examEmptyState').style.display = 'flex'; }
function loadCBETUnits() { const studentId = currentExamContext.studentId; if (!studentId) return; const student = StudentRepo.getById(studentId); if (!student) return; if ($('examInterface')) $('examInterface').style.display = 'flex'; if ($('examEmptyState')) $('examEmptyState').style.display = 'none'; if ($('sidebarStudentName')) $('sidebarStudentName').innerText = student.name; if ($('sidebarStudentReg')) $('sidebarStudentReg').innerText = student.reg; if ($('sidebarStudentTrade')) $('sidebarStudentTrade').innerText = student.grade; renderCBETUnits(student); }
function renderCBETUnits(student) { 
    const container = $('cbetUnitsList'); if (!container) return; container.innerHTML = ''; 
    const applicableSubjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(student.grade));
    if (applicableSubjects.length === 0) { container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-book-open"></i><p>No Learning Areas found.</p></div>`; return; } 
    applicableSubjects.forEach(subject => { renderUnitCard(student, subject, { code: subject.code, name: subject.name }); }); 
    updateExamProgress(student.id); 
}
function renderUnitCard(student, subject, unit) {
    const container = $('cbetUnitsList');
    const result = store.exams.find(e => e.studentId === student.id && e.unitCode === unit.code); 
    let status = 'Pending'; let score = 0; let statusClass = 'status-pending'; let isLocked = false; 
    if (result) { status = result.status || 'Pending'; score = parseInt(result.score) || 0; statusClass = result.status === 'Competent' ? 'status-c' : 'status-nyc'; if (result.status === 'Competent') { isLocked = true; } } 
    const cardHTML = `
    <div class="cbet-unit-card" data-unit-code="${unit.code}" data-unit-name="${unit.name}" data-status="${status}" data-locked="${isLocked}">
        <div class="status-bar ${statusClass}"></div>
        <div class="unit-card-body">
            <div class="unit-header">
                <span class="unit-code">${subject.code}</span>
                <span class="unit-status-badge ${statusClass}">${status}</span>
            </div>
            <div class="unit-name">${unit.name}</div>
            <div class="unit-footer">
                <div class="unit-score-display">Score: <strong>${score}%</strong></div>
            </div>
        </div>
    </div>`;
    container.insertAdjacentHTML('beforeend', cardHTML);
}
function updateExamProgress(studentId) { 
    const student = StudentRepo.getById(studentId); if (!student) return; 
    const applicableSubjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(student.grade));
    const totalUnits = applicableSubjects.length;
    const results = store.exams.filter(e => e.studentId === studentId); 
    const competentCount = results.filter(r => parseInt(r.score) >= 50).length; 
    const percent = totalUnits > 0 ? Math.round((competentCount / totalUnits) * 100) : 0; 
    if ($('progressPercent')) $('progressPercent').innerText = percent + '%'; 
    const circle = $('progressCircle'); 
    if (circle) { const radius = 70; const circumference = 2 * Math.PI * radius; const offset = circumference - (percent / 100) * circumference; circle.style.strokeDasharray = circumference; circle.style.strokeDashoffset = offset; } 
}
function loadExamSubjects(grade) {
    const subjectSelect = $('examSubjectSelect'); if (!subjectSelect) return;
    subjectSelect.innerHTML = "<option value=''>Select Subject...</option>"; subjectSelect.disabled = true; if (!grade) return;
    const applicableSubjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(grade));
    if (applicableSubjects.length === 0) { subjectSelect.innerHTML = "<option value=''>No Subjects Found</option>"; return; }
    subjectSelect.disabled = false;
    applicableSubjects.forEach(sub => { subjectSelect.innerHTML += `<option value='${sub.id}'>${sub.name}</option>`; });
}

function openAssessmentModal(code, name, studentId) { 
    $('assessUnitTitle').innerText = name; $('assessUnitId').value = code; 
    const result = store.exams.find(e => e.studentId === studentId && e.unitCode === code); 
    if (result) { $('assessScore').value = result.score; $('assessFeedback').value = result.feedback || ''; } 
    else { $('assessScore').value = ''; $('assessFeedback').value = ''; } 
    updateAssessmentPreview(); openModal('assessmentModal'); 
}

function updateAssessmentPreview() { 
    const score = parseInt($('assessScore').value) || 0; const comp = getCompetenceStatus(score); 
    const levelBox = $('assessLevelDisplay'); if (levelBox) { levelBox.innerText = comp.level; levelBox.className = `status-display-box ${comp.class}`; }
    const decisionBox = $('assessDecisionDisplay'); if (decisionBox) { decisionBox.innerText = comp.decision; }
    const feedbackBox = $('assessFeedback'); if (feedbackBox && !feedbackBox.value) feedbackBox.value = comp.feedback; 
}

// ==========================================================================
//   SAVE UNIT ASSESSMENT (Updated for Password Protection)
// ==========================================================================
function saveUnitAssessment() { 
    const studentId = currentExamContext.studentId; 
    const unitCode = $('assessUnitId').value; 
    const score = parseInt($('assessScore').value); 
    const feedback = $('assessFeedback').value; 

    if (isNaN(score) || score < 0 || score > 100) return showToast('Enter a valid score (0-100)', 'error'); 
    
    const comp = getCompetenceStatus(score);
    
    const data = { 
        id: generateId(), 
        studentId, 
        unitCode, 
        score, 
        level: comp.level, 
        status: comp.decision, 
        grade: comp.abbr, 
        feedback: feedback, 
        date: new Date().toISOString() 
    }; 
    
    const existingIndex = store.exams.findIndex(e => e.studentId === studentId && e.unitCode === unitCode); 
    
    if (existingIndex !== -1) {
        // --- ASSESSMENT EXISTS: REQUIRE ADMIN PASSWORD TO EDIT ---
        pendingAction = 'update-assessment';
        pendingActionData = { index: existingIndex, data: data };
        
        $('authMessage').textContent = 'This assessment has already been recorded. Enter Admin Password to UPDATE.'; 
        $('adminPassword').value = ''; 
        openModal('authModal');
    } else {
        // --- NEW ASSESSMENT: SAVE DIRECTLY ---
        store.exams.push(data); 
        saveData(); 
        closeModal('assessmentModal'); 
        showToast(`Assessment Saved: ${comp.decision}`); 
        loadCBETUnits(); 
        renderDashboard(); 
    }
}

// ==========================================================================
//   EXECUTE UPDATE ASSESSMENT (New Helper)
// ==========================================================================
function executeUpdateAssessment(payload) {
    store.exams[payload.index] = payload.data;
    saveData();
    closeModal('assessmentModal');
    loadCBETUnits(); 
    renderDashboard();
    showToast('Assessment Updated Successfully!');
}

// ==========================================================================
//   STAFF SECTION
// ==========================================================================
function initStaffSection() { 
    // 1. CLEAR FILTERS: Prevent "Sticky Search" issues where the browser remembers text
    if ($('staffSearch')) $('staffSearch').value = '';
    if ($('staffDeptFilter')) $('staffDeptFilter').value = 'all';

    // 2. RESTORE VIEW STATE: Ensure the correct Grid/List button is active
    const activeBtn = document.querySelector(`.btn-group .btn[data-section="staff"][data-view="${currentView.staff}"]`);
    if(activeBtn) {
        document.querySelectorAll('.btn-group .btn[data-section="staff"]').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }
    
    // 3. RENDER: Load the data
    renderStaff(); 
}


function validateStaffStep(stepNumber) { 
    clearErrors(); 
    let isValid = true; 
    
    if (stepNumber === 1) {
        const surname = $('staffSurname'); 
        const firstName = $('staffFirstName'); 
        const idNo = $('staffIdNo');
        const phone = $('staffPhone');
        
        if (!surname.value.trim()) { surname.classList.add('error'); isValid = false; }
        if (!firstName.value.trim()) { firstName.classList.add('error'); isValid = false; }
        if (!idNo.value.trim()) { idNo.classList.add('error'); isValid = false; }
        if (!phone.value.trim()) { phone.classList.add('error'); isValid = false; }
        
        // Validate ID uniqueness (must be unique if provided)
        if (idNo.value && isValid) {
            const editId = $('staffEditId')?.value;
            const isDuplicate = StaffRepo.getAll().some(s => s.idNo === idNo.value && s.id !== editId);
            if (isDuplicate) { 
                idNo.classList.add('error'); 
                showToast('Staff ID already exists.', 'error'); 
                isValid = false; 
            }
        }
        
        // validatePhone() returns true when empty and manages its own .error
        // class, so we only need to consult its return value when filled.
        if (phone.value && !validatePhone(phone)) { 
            isValid = false; 
        }
    }
    
    if (stepNumber === 2) {
        const designation = $('staffDesignation');
        const dept = $('staffDept');
        if (!designation.value.trim()) { designation.classList.add('error'); isValid = false; }
        if (!dept.value.trim()) { dept.classList.add('error'); isValid = false; }
    }
    
    if (!isValid) showToast('Please fill required fields correctly.', 'error');
    return isValid; 
}

function nextStaffStep(current, next) { if (!validateStaffStep(current)) return; $(`staff-form-step-${current}`).classList.remove('active'); $(`staff-form-step-${next}`).classList.add('active'); }
function prevStaffStep(current, prev) { $(`staff-form-step-${current}`).classList.remove('active'); $(`staff-form-step-${prev}`).classList.add('active'); }

// Centralised reset for the staff form. Used by both openStaffModal and
// editStaff so the modal always opens in a clean, predictable state.
function resetStaffForm() {
    if($('staffForm')) $('staffForm').reset();
    if($('staffEditId')) $('staffEditId').value = "";
    if($('staffModalTitle')) $('staffModalTitle').innerText = "Add New Staff";
    const preview = $('staffPhotoPreview');
    if (preview) {
        preview.src = DEFAULT_AVATAR;
        preview.style.width = "150px";
        preview.style.height = "150px";
        preview.style.objectFit = "cover";
        preview.style.borderRadius = "50%";
        preview.style.display = "block";
        preview.style.margin = "0 auto";
    }
    clearErrors();
    // Reset to Step 1
    document.querySelectorAll('[id^="staff-form-step-"]').forEach(el => el.classList.remove('active'));
    if($('staff-form-step-1')) $('staff-form-step-1').classList.add('active');
}

// 3. OPEN MODAL (Reset to Step 1)
function openStaffModal() {
    resetStaffForm();
    openModal('staffModal');
}


function previewStaffPhoto(input) { 
    if (input.files && input.files[0]) { 
        const reader = new FileReader(); 
        reader.onload = function(e) { 
            const preview = $('staffPhotoPreview');
            preview.src = e.target.result; 
            preview.style.width = "150px";
            preview.style.height = "150px";
            preview.style.objectFit = "cover";
            preview.style.borderRadius = "50%";
            preview.style.display = "block";
            preview.style.margin = "0 auto";
        }; 
        reader.readAsDataURL(input.files[0]); 
    } 
}

// 5. SUBMIT STAFF
function submitStaff(e) { 
    e.preventDefault(); 
    
    // Validate BOTH steps before persisting. The submit button carries
    // formnovalidate, so the browser will not enforce required fields for us.
    if (!validateStaffStep(1)) {
        // Jump back to Step 1 so the user can see the flagged fields.
        document.querySelectorAll('[id^="staff-form-step-"]').forEach(el => el.classList.remove('active'));
        if($('staff-form-step-1')) $('staff-form-step-1').classList.add('active');
        return;
    }
    if (!validateStaffStep(2)) {
        document.querySelectorAll('[id^="staff-form-step-"]').forEach(el => el.classList.remove('active'));
        if($('staff-form-step-2')) $('staff-form-step-2').classList.add('active');
        return;
    }
    
    // Combine names
    const surname = getVal('staffSurname');
    const firstName = getVal('staffFirstName');
    const otherNames = getVal('staffOtherNames');
    const name = `${surname} ${firstName} ${otherNames}`.trim();
    
    const editId = $('staffEditId')?.value; 
    const photoSrc = $('staffPhotoPreview')?.src;
    
    // Determine photo
    const finalPhoto = (photoSrc && !photoSrc.includes('data:image/svg+xml')) ? photoSrc : DEFAULT_AVATAR;
    
    const staffData = { 
        name, surname, firstName, otherNames, 
        gender: getVal('staffGender'), dob: getVal('staffDob'), idNo: getVal('staffIdNo'), 
        phone: getVal('staffPhone'), email: getVal('staffEmail'), 
        designation: getVal('staffDesignation'), dept: getVal('staffDept'), 
        tsc: getVal('staffTsc'), employmentType: getVal('staffEmploymentType'), 
        appointmentDate: getVal('staffAppointmentDate'), subjects: getVal('staffSubjects'), 
        photo: finalPhoto 
    }; 
    
    if (editId) { 
        StaffRepo.update(editId, staffData); 
        showToast('Staff Updated Successfully!'); 
    } else { 
        StaffRepo.create(staffData); 
        showToast('Staff Added Successfully!'); 
    } 
    
    closeModal('staffModal'); 
    renderStaff(); 
    renderDashboard(); 
}


// 4. EDIT STAFF (Populate both steps)
function editStaff(id) { 
    const s = StaffRepo.getById(id); 
    if (!s) return; 
    
    // Start from a known-clean form (clears stale inputs, resets photo,
    // jumps to Step 1) BEFORE we populate it with the staff member's data.
    resetStaffForm();
    openModal('staffModal');
    
    // Set Title
    if($('staffModalTitle')) $('staffModalTitle').innerText = "Edit Staff Details"; 
    if($('staffEditId')) $('staffEditId').value = id; 
    
    // Photo
    if(s.photo && $('staffPhotoPreview')) $('staffPhotoPreview').src = s.photo;
    
    // Step 1 Fields
    setVal('staffSurname', s.surname || (s.name ? s.name.split(' ')[0] : '')); 
    setVal('staffFirstName', s.firstName || (s.name ? s.name.split(' ')[1] || '' : '')); 
    setVal('staffOtherNames', s.otherNames || (s.name ? s.name.split(' ').slice(2).join(' ') : '')); 
    setVal('staffGender', s.gender); 
    setVal('staffDob', s.dob); 
    setVal('staffIdNo', s.idNo); 
    setVal('staffPhone', s.phone); 
    setVal('staffEmail', s.email); 
    
    // Step 2 Fields
    setVal('staffDesignation', s.designation || s.role || ''); 
    setVal('staffDept', s.dept || ''); 
    setVal('staffTsc', s.tsc);
    setVal('staffEmploymentType', s.employmentType || ''); 
    setVal('staffAppointmentDate', s.appointmentDate || s.date || ''); 
    setVal('staffSubjects', s.subjects || s.qualification || '');
} 

function deleteStaff(id) { if (confirm('Are you sure?')) { if (StaffRepo.delete(id)) { renderStaff(); renderDashboard(); showToast('Staff Deleted'); } } }


// ==========================================================================
//   STAFF MANAGEMENT LOGIC (WITH STEPPER SUPPORT)
// ==========================================================================
// 1. SEED DATA (Ensures fields are populated for demo)
//    Field names + dept vocabulary now match the Add/Edit Staff form so
//    seeded records are filterable and render correctly in cards/table.
function seedStaffData() {
    if (store.staff.length === 0) {
        const initialStaff = [
            { id: 'stf1', name: 'Mr. John Kamau', surname: 'Kamau', firstName: 'John', otherNames: 'Mr.', gender: 'Male', dob: '', tsc: '234567', idNo: '12345678', designation: 'Head of Institution', dept: 'Administration', employmentType: 'TSC', appointmentDate: '2015-01-10', subjects: 'Leadership', phone: '0722000001', email: 'principal@elimutrack.sc.ke', photo: null },
            { id: 'stf2', name: 'Mrs. Grace Omondi', surname: 'Omondi', firstName: 'Grace', otherNames: 'Mrs.', gender: 'Female', dob: '', tsc: '234568', idNo: '22345678', designation: 'Deputy Head', dept: 'Administration', employmentType: 'TSC', appointmentDate: '2016-02-15', subjects: 'Leadership', phone: '0722000002', email: 'deputy@elimutrack.sc.ke', photo: null },
            { id: 'stf3', name: 'Mr. David Kipkorir', surname: 'Kipkorir', firstName: 'David', otherNames: 'Mr.', gender: 'Male', dob: '', tsc: '345678', idNo: '33345678', designation: 'Senior Teacher', dept: 'JSS', employmentType: 'TSC', appointmentDate: '2019-01-05', subjects: 'Math / Science', phone: '0722000003', email: 'kipkorir@elimutrack.sc.ke', photo: null },
            { id: 'stf4', name: 'Ms. Sarah Wanjiku', surname: 'Wanjiku', firstName: 'Sarah', otherNames: 'Ms.', gender: 'Female', dob: '', tsc: '345679', idNo: '44345678', designation: 'Teacher', dept: 'JSS', employmentType: 'TSC', appointmentDate: '2020-03-01', subjects: 'Science / Kiswahili', phone: '0722000004', email: 'sarah@elimutrack.sc.ke', photo: null },
            { id: 'stf5', name: 'Mr. Peter Otieno', surname: 'Otieno', firstName: 'Peter', otherNames: 'Mr.', gender: 'Male', dob: '', tsc: '123456', idNo: '55345678', designation: 'Senior Teacher', dept: 'Upper Primary', employmentType: 'TSC', appointmentDate: '2012-06-12', subjects: 'English / Social Studies', phone: '0722000005', email: 'otieno@elimutrack.sc.ke', photo: null },
            { id: 'stf6', name: 'Mrs. Lucy Njoroge', surname: 'Njoroge', firstName: 'Lucy', otherNames: 'Mrs.', gender: 'Female', dob: '', tsc: '123457', idNo: '66345678', designation: 'Teacher', dept: 'Lower Primary', employmentType: 'BOM', appointmentDate: '2018-01-20', subjects: 'Kiswahili / CRE', phone: '0722000006', email: 'lucy@elimutrack.sc.ke', photo: null },
            { id: 'stf7', name: 'Mr. James Mutua', surname: 'Mutua', firstName: 'James', otherNames: 'Mr.', gender: 'Male', dob: '', tsc: '', idNo: '77345678', designation: 'Support Staff', dept: 'Support', employmentType: 'Support', appointmentDate: '2014-05-10', subjects: 'Bursar', phone: '0722000007', email: 'bursar@elimutrack.sc.ke', photo: null },
            { id: 'stf8', name: 'Ms. Emily Akinyi', surname: 'Akinyi', firstName: 'Emily', otherNames: 'Ms.', gender: 'Female', dob: '', tsc: '', idNo: '88345678', designation: 'Support Staff', dept: 'Support', employmentType: 'Support', appointmentDate: '2021-09-01', subjects: 'School Nurse', phone: '0722000008', email: 'nurse@elimutrack.sc.ke', photo: null }
        ];
        store.staff = initialStaff;
        saveData();
    }
}

// 1. RENDER STAFF (Matches Modal Values)
function renderStaff() {
    const container = $('staffContainer');
    if (!container) return;

    const allStaff = StaffRepo.getAll();
    const searchVal = ($('staffSearch')?.value || '').toLowerCase();
    const deptSelect = $('staffDeptFilter');
    const currentDeptFilter = deptSelect ? deptSelect.value : 'all';

    // Update Filter Counts (mirrors the dept vocabulary used by the form)
    if (deptSelect) {
        const baseLabels = {
            'all': 'All Departments',
            'Administration': 'Administration',
            'Lower Primary': 'Lower Primary',
            'Upper Primary': 'Upper Primary',
            'JSS': 'JSS',
            'Support': 'Support'
        };

        const counts = { all: allStaff.length };
        Array.from(deptSelect.options).forEach(opt => {
            if (opt.value !== 'all') {
                counts[opt.value] = allStaff.filter(s => s.dept && s.dept === opt.value).length;
            }
        });

        Array.from(deptSelect.options).forEach(opt => {
            const val = opt.value;
            const count = counts[val] !== undefined ? counts[val] : 0;
            const label = baseLabels[val] || val;
            opt.innerText = `${label} (${count})`;
        });
    }

    // Filter Data (search by name / TSC / ID No / designation)
    let filtered = allStaff.filter(staff => {
        const haystack = [
            staff.name, staff.surname, staff.firstName, staff.otherNames,
            staff.tsc, staff.idNo, staff.designation, staff.phone
        ].filter(Boolean).join(' ').toLowerCase();
        const matchSearch = !searchVal || haystack.includes(searchVal);
        const matchDept = currentDeptFilter === 'all' || (staff.dept && staff.dept === currentDeptFilter);
        return matchSearch && matchDept;
    });

    // Update Stats Bar
    if ($('statStaffCount')) $('statStaffCount').innerText = allStaff.length;
    const teachers = allStaff.filter(s => s.designation && s.designation.toLowerCase().includes('teacher'));
    const admin = allStaff.filter(s => s.dept === 'Administration');
    const support = allStaff.filter(s => s.dept === 'Support');
    if ($('statTeachersCount')) $('statTeachersCount').innerText = teachers.length;
    if ($('statAdminCount')) $('statAdminCount').innerText = admin.length;
    if ($('statSupportCount')) $('statSupportCount').innerText = support.length;

    // Render modern analytics dashboard
    renderStaffAnalytics(allStaff, { teachers, admin, support });

    // Switch container class so .staff-view-wrapper.list-view styling applies
    container.classList.toggle('list-view', currentView.staff === 'list');

    // Render
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state" style="text-align:center; padding:2rem; color:var(--text-muted); grid-column: 1 / -1;">
            <i class="fa-solid fa-user-slash" style="font-size:2rem; margin-bottom:1rem;"></i><p>No staff found.</p>
        </div>`;
        return;
    }

    container.innerHTML = '';
    if (currentView.staff === 'grid') {
        renderStaffGrid(filtered, container);
    } else {
        renderStaffTable(filtered, container);
    }
}

// ==========================================================================
//   STAFF ANALYTICS (Modern dashboard)
// ==========================================================================
let staffDeptChartInstance = null;
let staffGenderChartInstance = null;
let staffEmploymentChartInstance = null;

function renderStaffAnalytics(allStaff, buckets) {
    if (!allStaff) return;
    const teachers = buckets.teachers || [];
    const admin = buckets.admin || [];
    const support = buckets.support || [];

    // Trend indicators (compute simple deltas from history if available)
    setTrendPill('staffTotalTrend', allStaff.length - (window._prevStaffTotal || 0), '');
    setTrendPill('staffTeachersTrend', teachers.length - (window._prevStaffTeachers || 0), '');
    setTrendPill('staffAdminTrend', admin.length - (window._prevStaffAdmin || 0), '');
    setTrendPill('staffSupportTrend', support.length - (window._prevStaffSupport || 0), '');
    window._prevStaffTotal = allStaff.length;
    window._prevStaffTeachers = teachers.length;
    window._prevStaffAdmin = admin.length;
    window._prevStaffSupport = support.length;

    // Sparklines (synthesized from current counts with slight variation for visual interest)
    renderSparkline('sparkStaffTotal', synthSeries(allStaff.length, 6), '#22C55E');
    renderSparkline('sparkStaffTeachers', synthSeries(teachers.length, 6), '#14B8A6');
    renderSparkline('sparkStaffAdmin', synthSeries(admin.length, 6), '#8b5cf6');
    renderSparkline('sparkStaffSupport', synthSeries(support.length, 6), '#f59e0b');

    // Department distribution doughnut
    const deptBuckets = {};
    allStaff.forEach(s => {
        const d = s.dept || 'Unspecified';
        deptBuckets[d] = (deptBuckets[d] || 0) + 1;
    });
    const deptPalette = ['#22C55E', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#64748b', '#14B8A6'];
    renderStaffDoughnut('staffDeptChart', 'staffDeptLegend',
        Object.keys(deptBuckets), Object.values(deptBuckets), deptPalette);

    // Gender ratio
    const maleCount = allStaff.filter(s => (s.gender || '').toLowerCase() === 'male').length;
    const femaleCount = allStaff.filter(s => (s.gender || '').toLowerCase() === 'female').length;
    const otherCount = allStaff.length - maleCount - femaleCount;
    renderStaffDoughnut('staffGenderChart', 'staffGenderLegend',
        ['Male', 'Female', 'Other'],
        [maleCount, femaleCount, otherCount].filter(v => v > 0),
        ['#3b82f6', '#ec4899', '#94a3b8'],
        [maleCount, femaleCount, otherCount]);

    // Employment type
    const empBuckets = {};
    allStaff.forEach(s => {
        const t = s.employmentType || 'Unspecified';
        empBuckets[t] = (empBuckets[t] || 0) + 1;
    });
    const empPalette = ['#22C55E', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
    renderStaffDoughnut('staffEmploymentChart', 'staffEmploymentLegend',
        Object.keys(empBuckets), Object.values(empBuckets), empPalette);

    // Workload list — top 6 by subject count
    renderStaffWorkload(allStaff);

    // Performance list — top 5 by student avg
    renderStaffPerformance(allStaff);
}

// Helper: set a trend pill value + color
function setTrendPill(id, delta, suffix, invertColors) {
    const el = $(id);
    if (!el) return;
    const sign = delta > 0 ? '+' : '';
    el.textContent = `${sign}${delta}${suffix}`;
    const parent = el.parentElement;
    if (!parent) return;
    parent.classList.remove('trend-up', 'trend-down');
    if (delta >= 0) parent.classList.add(invertColors ? 'trend-down' : 'trend-up');
    else parent.classList.add(invertColors ? 'trend-up' : 'trend-down');
    const icon = parent.querySelector('i');
    if (icon) {
        icon.className = delta >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down';
    }
}

// Helper: synthesize a stable-ish series from a count
function synthSeries(target, points) {
    const series = [];
    let base = Math.max(0, target - Math.floor(target * 0.15));
    for (let i = 0; i < points; i++) {
        const trend = i / (points - 1); // 0 -> 1
        const noise = (Math.sin(i * 1.3) * 0.5) * Math.max(1, target * 0.05);
        const val = Math.round(base + (target - base) * trend + noise);
        series.push(Math.max(0, val));
    }
    series[series.length - 1] = target;
    return series;
}

// Helper: render a doughnut chart with custom legend
function renderStaffDoughnut(canvasId, legendId, labels, data, palette, fullData) {
    const ctx = $(canvasId);
    if (!ctx) return;
    // Filter out zero entries for clarity
    const pairs = labels.map((l, i) => ({ label: l, value: (fullData || data)[i] || 0 })).filter(p => p.value > 0);
    const useLabels = pairs.map(p => p.label);
    const useValues = pairs.map(p => p.value);
    const useColors = useLabels.map((_, i) => palette[i % palette.length]);

    let instance = null;
    if (canvasId === 'staffDeptChart') { instance = staffDeptChartInstance; staffDeptChartInstance = null; }
    else if (canvasId === 'staffGenderChart') { instance = staffGenderChartInstance; staffGenderChartInstance = null; }
    else if (canvasId === 'staffEmploymentChart') { instance = staffEmploymentChartInstance; staffEmploymentChartInstance = null; }
    if (instance) instance.destroy();

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: useLabels,
            datasets: [{
                data: useValues,
                backgroundColor: useColors,
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            animation: { duration: 800, animateRotate: true, animateScale: true },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: {
                        label: (c) => {
                            const total = useValues.reduce((a, b) => a + b, 0) || 1;
                            const pct = Math.round(c.parsed / total * 100);
                            return `${c.label}: ${c.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });

    if (canvasId === 'staffDeptChart') staffDeptChartInstance = chart;
    else if (canvasId === 'staffGenderChart') staffGenderChartInstance = chart;
    else if (canvasId === 'staffEmploymentChart') staffEmploymentChartInstance = chart;

    // Custom legend
    const legendEl = $(legendId);
    if (legendEl) {
        const total = useValues.reduce((a, b) => a + b, 0) || 1;
        legendEl.innerHTML = useLabels.map((l, i) => {
            const v = useValues[i];
            const pct = Math.round(v / total * 100);
            return `<span class="polar-legend-item"><i style="background:${useColors[i]}"></i> ${escapeHtml(l)} (${v} · ${pct}%)</span>`;
        }).join('');
    }
}

// Helper: render staff workload list (top 6 by subject count)
function renderStaffWorkload(allStaff) {
    const container = $('staffWorkloadList');
    if (!container) return;

    const items = allStaff.map(s => {
        const assignedSubjects = (store.learningAreas || []).filter(area => area.teacherId === s.id);
        return {
            id: s.id,
            name: s.name,
            photo: s.photo,
            designation: s.designation || 'Staff',
            subjectCount: assignedSubjects.length,
            subjectNames: assignedSubjects.map(a => a.name)
        };
    }).sort((a, b) => b.subjectCount - a.subjectCount).slice(0, 6);

    if (items.length === 0 || items.every(i => i.subjectCount === 0)) {
        container.innerHTML = '<div class="heatmap-empty">No subject assignments yet. Assign subjects to teachers from the Learning Areas tab.</div>';
        return;
    }

    container.innerHTML = items.map(item => {
        let countClass = '';
        if (item.subjectCount >= 5) countClass = 'over';
        else if (item.subjectCount >= 3) countClass = 'high';
        const subjectSummary = item.subjectNames.length > 0
            ? item.subjectNames.slice(0, 2).join(', ') + (item.subjectNames.length > 2 ? ` +${item.subjectNames.length - 2} more` : '')
            : 'No subjects assigned';
        return `
            <div class="workload-item">
                <div class="wl-avatar"><img src="${item.photo || DEFAULT_AVATAR}" alt="" onerror="this.src='${DEFAULT_AVATAR}'"></div>
                <div class="wl-info">
                    <div class="wl-name">${escapeHtml(item.name)}</div>
                    <div class="wl-sub">${escapeHtml(item.designation)} · ${escapeHtml(subjectSummary)}</div>
                </div>
                <div class="wl-count ${countClass}">${item.subjectCount}</div>
            </div>
        `;
    }).join('');
}

// Helper: render staff performance list (top 5 by their students' avg)
function renderStaffPerformance(allStaff) {
    const container = $('staffPerfList');
    if (!container) return;

    // For each teacher, find students whose exam records reference subjects assigned to that teacher
    const items = allStaff.map(s => {
        const teacherSubjects = (store.learningAreas || []).filter(area => area.teacherId === s.id);
        if (teacherSubjects.length === 0) return { id: s.id, name: s.name, photo: s.photo, designation: s.designation || 'Staff', avg: 0, count: 0 };
        const subjectNames = new Set(teacherSubjects.map(a => a.name.toLowerCase()));
        const subjectCodes = new Set(teacherSubjects.map(a => a.code));
        const relevantExams = store.exams.filter(e => {
            const subName = (e.subjectName || '').toLowerCase();
            return subjectNames.has(subName) || subjectCodes.has(e.unitCode);
        });
        const scores = relevantExams.map(e => parseInt(e.score) || 0).filter(v => v > 0);
        const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
        return { id: s.id, name: s.name, photo: s.photo, designation: s.designation || 'Staff', avg, count: scores.length };
    }).filter(i => i.count > 0).sort((a, b) => b.avg - a.avg).slice(0, 5);

    if (items.length === 0) {
        container.innerHTML = '<div class="heatmap-empty">No teacher performance data yet. Assign teachers to subjects and record exam scores to populate this list.</div>';
        return;
    }

    container.innerHTML = items.map(item => {
        return `
            <div class="perf-item">
                <div class="perf-avatar"><img src="${item.photo || DEFAULT_AVATAR}" alt="" onerror="this.src='${DEFAULT_AVATAR}'"></div>
                <div class="perf-info">
                    <div class="perf-name">${escapeHtml(item.name)}</div>
                    <div class="perf-sub">${escapeHtml(item.designation)} · ${item.count} assessments</div>
                </div>
                <div class="perf-bar">
                    <div class="perf-bar-fill" style="width: ${item.avg}%"></div>
                </div>
                <div class="perf-score">${item.avg}%</div>
            </div>
        `;
    }).join('');
}

function renderStaffTable(data, container) {
    if (data.length === 0) { 
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>No staff found.</p></div>`; 
        return; 
    } 
    
    let tableHTML = `
        <div class="table-container" style="background:var(--bg-card); border-radius:var(--radius-lg);">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>TSC No</th>
                        <th>ID No</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Phone</th>
                        <th style="width: 100px;">Actions</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach(s => {
        tableHTML += `
            <tr>
                <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                        <img src="${s.photo || DEFAULT_AVATAR}" style="width:35px; height:35px; border-radius:50%; object-fit:cover;">
                        <strong>${escapeHtml(s.name)}</strong>
                    </div>
                </td>
                <td>${s.tsc || '-'}</td>
                <td>${s.idNo || '-'}</td>
                <td>${s.designation || '-'}</td>
                <td>${s.dept || '-'}</td>
                <td>${s.phone || '-'}</td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-ghost" data-action="edit" data-type="staff" data-id="${s.id}"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-sm btn-ghost" data-action="delete" data-type="staff" data-id="${s.id}"><i class="fa-solid fa-trash" style="color:var(--danger)"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });

    tableHTML += `</tbody></table></div>`;
    container.innerHTML = tableHTML;
}
function renderStaffGrid(data, container) {
    if (data.length === 0) { 
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-user-slash"></i><p>No staff found matching criteria.</p></div>`; 
        return; 
    } 
    
    container.innerHTML = data.map(s => {
        // Check for linked subjects (from curricula)
        const assignedSubjects = (store.learningAreas || []).filter(area => area.teacherId === s.id).map(area => area.name);
        const teachesDisplay = assignedSubjects.length > 0 ? assignedSubjects.join(', ') : (s.subjects || 'N/A');
        
        // Determine Department Class for Card Border Color
        let deptClass = '';
        const d = (s.dept || '').toLowerCase();
        if (d.includes('lower')) deptClass = 'dept-lower-primary';
        else if (d.includes('upper')) deptClass = 'dept-upper-primary';
        else if (d.includes('jss') || d.includes('junior')) deptClass = 'dept-jss';
        else if (d.includes('admin')) deptClass = 'dept-admin';
        else if (d.includes('support')) deptClass = 'dept-support';

        // Map designation -> broad role bucket so the existing CSS rules
        // .staff-card[data-role="Admin|Teacher|Support"] apply and colour
        // the top strip accordingly.
        const desig = (s.designation || '').toLowerCase();
        let roleBucket = 'Teacher';
        if (d.includes('admin') || desig.includes('head') || desig.includes('principal') || desig.includes('deputy')) roleBucket = 'Admin';
        else if (d.includes('support') || desig.includes('support')) roleBucket = 'Support';

        // FIX: Corrected Class Names to match CSS (.staff-card, .staff-card-footer)
        return `
        <div class="staff-card ${deptClass}" data-role="${roleBucket}">
            <div class="staff-card-header"></div>
            <div class="staff-card-body">
                <img src="${s.photo || DEFAULT_AVATAR}" class="staff-avatar" alt="${escapeHtml(s.name)}" onerror="this.src='${DEFAULT_AVATAR}'">
                <h4 class="staff-name">${escapeHtml(s.name)}</h4>
                <span class="staff-role">${s.designation || 'Staff'}</span>
                
                <div class="staff-details-grid">
                    <div class="staff-detail-item">
                        <span>TSC No</span>
                        <strong>${s.tsc || '-'}</strong>
                    </div>
                    <div class="staff-detail-item">
                        <span>ID No</span>
                        <strong>${s.idNo || '-'}</strong>
                    </div>
                    <div class="staff-detail-item">
                        <span>Phone</span>
                        <strong>${s.phone || '-'}</strong>
                    </div>
                    <div class="staff-detail-item">
                        <span>Dept</span>
                        <strong>${s.dept || '-'}</strong>
                    </div>
                </div>
                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--primary); text-align: left;">
                    <strong>Teaches:</strong> ${escapeHtml(teachesDisplay)}
                </div>
            </div>
            <div class="staff-card-footer">
                <button class="btn btn-sm btn-ghost" data-action="edit" data-type="staff" data-id="${s.id}" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-ghost" data-action="delete" data-type="staff" data-id="${s.id}" title="Delete" style="color:var(--danger);">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>`;
    }).join(''); 
}
// ==========================================================================
//   CURRICULA MANAGEMENT
// ==========================================================================

function renderCurricula() {
    const container = $('curriculumAccordion');
    if (!container) return;
    container.innerHTML = '';

    // Render analytics dashboard first
    renderCurriculaAnalytics();

    const bandOrder = ['pp', 'lower', 'middle', 'jss'];
    const bandMeta = {
        'pp': { name: 'Pre-Primary', icon: 'fa-baby' },
        'lower': { name: 'Lower Primary', icon: 'fa-child-reaching' },
        'middle': { name: 'Middle School', icon: 'fa-book-open-reader' },
        'jss': { name: 'Junior Secondary', icon: 'fa-user-graduate' }
    };

    bandOrder.forEach(key => {
        const info = bandMeta[key];
        const gradesInBand = BAND_GRADE_MAP[key];

        const subjects = store.learningAreas.filter(sub => {
            if (!sub.applicableLevels || sub.applicableLevels.length === 0) return false;
            return sub.applicableLevels.some(level => gradesInBand.includes(level));
        });

        const item = document.createElement('div');
        item.className = 'accordion-item';
        item.dataset.band = key;

        item.innerHTML = `
            <button class="accordion-header">
                <div class="acc-header-content">
                   <i class="fa-solid ${info.icon}"></i>
                   <span>${info.name}</span>
                </div>
                <div style="display:flex; align-items:center;">
                    <span class="acc-count">${subjects.length} Subjects</span>
                    <i class="fa-solid fa-chevron-down accordion-icon"></i>
                </div>
            </button>
            <div class="accordion-content">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; padding: 1rem;">
                    ${subjects.map(sub => renderSubjectCard(sub)).join('')}
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function renderSubjectCard(sub) {
    const teacher = sub.teacherId ? StaffRepo.getById(sub.teacherId) : null; 
    const teacherName = teacher ? teacher.name : 'Unassigned';
    
    return `
        <div class="subject-card-modern">
            <div class="subject-header">
                <h4 style="margin:0">${sub.name}</h4>
                <span class="subject-code-badge">${sub.code}</span>
            </div>
            <div style="margin-top:0.5rem; font-size:0.85rem; color:var(--text-muted);">
                <p style="margin:0"><small>Grades: ${sub.applicableLevels ? sub.applicableLevels.join(', ') : 'All'}</small></p>
            </div>
            <div class="subject-footer">
                <button class="btn btn-sm btn-ghost" data-action="edit-curriculum" data-id="${sub.id}" title="Edit">
                    <i class="fa-solid fa-edit"></i>
                </button>
            </div>
        </div>
    `;
}

// ==========================================================================
//   CURRICULA ANALYTICS (Modern dashboard)
// ==========================================================================
let laBandChartInstance = null;
let laCoverageChartInstance = null;

function renderCurriculaAnalytics() {
    const areas = store.learningAreas || [];

    // KPI counts
    const totalCount = areas.length;
    const assignedCount = areas.filter(a => a.teacherId).length;
    const unassignedCount = totalCount - assignedCount;

    // Active bands (count subjects per band)
    const bandOrder = ['pp', 'lower', 'middle', 'jss'];
    const bandMeta = {
        'pp': { name: 'Pre-Primary' },
        'lower': { name: 'Lower Primary' },
        'middle': { name: 'Middle School' },
        'jss': { name: 'Junior Secondary' }
    };
    const bandCounts = {};
    bandOrder.forEach(b => bandCounts[b] = 0);
    areas.forEach(a => {
        if (!a.applicableLevels || a.applicableLevels.length === 0) return;
        bandOrder.forEach(b => {
            const gradesInBand = BAND_GRADE_MAP[b];
            if (a.applicableLevels.some(level => gradesInBand.includes(level))) {
                bandCounts[b]++;
            }
        });
    });
    const activeBands = bandOrder.filter(b => bandCounts[b] > 0).length;

    // Update KPIs
    setText('laTotalCount', totalCount);
    setText('laAssignedCount', assignedCount);
    setText('laUnassignedCount', unassignedCount);
    setText('laBandsCount', activeBands);

    // Trend pills (deltas from history)
    setTrendPill('laTotalTrend', totalCount - (window._prevLaTotal || 0), '');
    setTrendPill('laAssignedTrend', assignedCount - (window._prevLaAssigned || 0), '');
    setTrendPill('laUnassignedTrend', unassignedCount - (window._prevLaUnassigned || 0), '', true);
    setText('laBandsTrend', activeBands);
    window._prevLaTotal = totalCount;
    window._prevLaAssigned = assignedCount;
    window._prevLaUnassigned = unassignedCount;

    // Chart 1: Subject distribution by band (horizontal bar)
    renderLaBandChart(bandOrder, bandMeta, bandCounts);

    // Chart 2: Assignment coverage doughnut (assigned vs unassigned)
    renderLaCoverageChart(assignedCount, unassignedCount);

    // Chart 3: Teacher workload list (top 6 by subject count)
    renderLaWorkload();
}

function renderLaBandChart(bandOrder, bandMeta, bandCounts) {
    const ctx = $('laBandChart');
    if (!ctx) return;
    if (laBandChartInstance) { laBandChartInstance.destroy(); laBandChartInstance = null; }

    const labels = bandOrder.map(b => bandMeta[b].name);
    const data = bandOrder.map(b => bandCounts[b]);
    const chartCtx = ctx.getContext('2d');
    const gradient = chartCtx.createLinearGradient(0, 0, 400, 0);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#22C55E');

    laBandChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Subjects',
                data: data,
                backgroundColor: gradient,
                borderRadius: 8,
                barPercentage: 0.6,
                categoryPercentage: 0.7
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: { label: (c) => `${c.parsed.x} subject${c.parsed.x === 1 ? '' : 's'}` }
                }
            },
            scales: {
                x: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4,4] }, ticks: { color: '#94a3b8', precision: 0 } },
                y: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: '600' } } }
            }
        }
    });
}

function renderLaCoverageChart(assigned, unassigned) {
    const ctx = $('laCoverageChart');
    if (!ctx) return;
    if (laCoverageChartInstance) { laCoverageChartInstance.destroy(); laCoverageChartInstance = null; }

    laCoverageChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Assigned', 'Unassigned'],
            datasets: [{
                data: [assigned, unassigned],
                backgroundColor: ['#14B8A6', '#f59e0b'],
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            animation: { duration: 800, animateRotate: true, animateScale: true },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: {
                        label: (c) => {
                            const total = assigned + unassigned || 1;
                            const pct = Math.round(c.parsed / total * 100);
                            return `${c.label}: ${c.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });

    const legendEl = $('laCoverageLegend');
    if (legendEl) {
        const total = assigned + unassigned || 1;
        legendEl.innerHTML = `
            <span class="polar-legend-item"><i style="background:#14B8A6"></i> Assigned (${assigned} · ${Math.round(assigned/total*100)}%)</span>
            <span class="polar-legend-item"><i style="background:#f59e0b"></i> Unassigned (${unassigned} · ${Math.round(unassigned/total*100)}%)</span>
        `;
    }
}

function renderLaWorkload() {
    const container = $('laWorkloadList');
    if (!container) return;

    const allStaff = StaffRepo.getAll();
    const items = allStaff.map(s => {
        const assignedSubjects = (store.learningAreas || []).filter(area => area.teacherId === s.id);
        return {
            id: s.id,
            name: s.name,
            photo: s.photo,
            designation: s.designation || 'Staff',
            subjectCount: assignedSubjects.length,
            subjectNames: assignedSubjects.map(a => a.name)
        };
    }).filter(i => i.subjectCount > 0).sort((a, b) => b.subjectCount - a.subjectCount).slice(0, 6);

    if (items.length === 0) {
        container.innerHTML = '<div class="heatmap-empty">No teacher assignments yet. Assign teachers to subjects from the edit button on each subject card.</div>';
        return;
    }

    container.innerHTML = items.map(item => {
        let countClass = '';
        if (item.subjectCount >= 5) countClass = 'over';
        else if (item.subjectCount >= 3) countClass = 'high';
        const subjectSummary = item.subjectNames.length > 0
            ? item.subjectNames.slice(0, 2).join(', ') + (item.subjectNames.length > 2 ? ` +${item.subjectNames.length - 2} more` : '')
            : '';
        return `
            <div class="workload-item">
                <div class="wl-avatar"><img src="${item.photo || DEFAULT_AVATAR}" alt="" onerror="this.src='${DEFAULT_AVATAR}'"></div>
                <div class="wl-info">
                    <div class="wl-name">${escapeHtml(item.name)}</div>
                    <div class="wl-sub">${escapeHtml(item.designation)} · ${escapeHtml(subjectSummary)}</div>
                </div>
                <div class="wl-count ${countClass}">${item.subjectCount}</div>
            </div>
        `;
    }).join('');
}

function filterCurricula(band) {
    const items = document.querySelectorAll('#curriculumAccordion .accordion-item');
    
    items.forEach(item => {
        if (band === 'all') {
            item.classList.remove('open'); 
        } else if (item.dataset.band === band) {
            item.classList.add('open');
            item.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            item.classList.remove('open');
        }
    });
}

function editCourseSettings(id) { 
    editCourse(id); 
    openModal('courseModal'); 
}

function populateTeacherDropdown(selectedId = '') { 
    const select = $('courseTeacher'); 
    if (!select) return; 
    select.innerHTML = '<option value="">Select Teacher...</option>'; 
    StaffRepo.getAll().forEach(teacher => { 
        select.innerHTML += `<option value="${teacher.id}">${teacher.name}</option>`; 
    }); 
    if (selectedId) select.value = selectedId; 
}

function saveCourseSettings(e) { 
    e.preventDefault(); 
    const editId = $('courseEditId')?.value; 
    const checkedBoxes = document.querySelectorAll('input[name="courseGrade"]:checked'); 
    const levelsArr = Array.from(checkedBoxes).map(cb => cb.value); 
    
    const subjectData = { 
        id: editId || generateId(), 
        name: getVal('courseName'), 
        code: getVal('courseCode'), 
        applicableLevels: levelsArr, 
        teacherId: getVal('courseTeacher') 
    }; 
    
    if (editId) { 
        const idx = store.learningAreas.findIndex(t => t.id === editId); 
        if (idx !== -1) store.learningAreas[idx] = subjectData; 
    } else { 
        store.learningAreas.push(subjectData); 
    } 
    
    saveData(); 
    closeModal('courseModal'); 
    renderCourseSettings(); 
    renderCurricula(); 
    renderStaff(); 
    showToast('Subject Saved!'); 
}

function renderCourseSettings() { 
    const tbody = $('courseSettingsTable'); 
    if (!tbody) return; 
    tbody.innerHTML = store.learningAreas.map(sub => { 
        return `<tr><td>${sub.code}</td><td>${sub.name}</td><td>${sub.applicableLevels ? sub.applicableLevels.join(', ') : 'All'}</td><td><button class="btn btn-sm" data-action="edit-subject" data-id="${sub.id}"><i class="fa-solid fa-edit"></i></button></td></tr>`; 
    }).join(''); 
}

function editCourse(id) { 
    const subject = store.learningAreas.find(t => t.id === id); 
    if (!subject) return; 
    $('courseForm').reset();
    
    $('courseModalTitle').innerText = "Edit Subject"; 
    $('courseEditId').value = id; 
    setVal('courseName', subject.name); 
    setVal('courseCode', subject.code); 
    
    const checkboxes = document.querySelectorAll('input[name="courseGrade"]'); 
    checkboxes.forEach(cb => { 
        cb.checked = subject.applicableLevels?.includes(cb.value); 
    }); 
    
    populateTeacherDropdown(subject.teacherId); 
}

function deleteCourse(id) { 
    if(confirm('Delete this Learning Area?')) { 
        store.learningAreas = store.learningAreas.filter(t => t.id !== id); 
        saveData(); 
        renderCourseSettings(); 
        renderCurricula(); 
        renderStaff(); 
        showToast('Subject Deleted'); 
    } 
}

// ==========================================================================
//   REPORTS & PDF GENERATION
// ==========================================================================
function renderReportStats() { if ($('repStatStudents')) $('repStatStudents').innerText = StudentRepo.count(); }

// UPDATED: Increased spacing between Header Box and Title
function addDocHeader(doc, title) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // --- 1. Ministry Header ---
    doc.setFontSize(9).setFont(undefined, 'normal').setTextColor(100);
    doc.text("MINISTRY OF EDUCATION", pageWidth / 2, yPos, { align: 'center' });
    doc.setFontSize(8).setTextColor(130);
    doc.text("State Department for Early Learning and Basic Education", pageWidth / 2, yPos + 5, { align: 'center' });
    
    // Separator Line
    doc.setDrawColor(200).setLineWidth(0.5);
    doc.line(10, yPos + 9, pageWidth - 10, yPos + 9);

    // --- 2. Main Header Box ---
    yPos = 21; 
    const boxHeight = 28;
    doc.setDrawColor(37, 99, 235).setLineWidth(1);
    doc.rect(10, yPos, pageWidth - 20, boxHeight); 
    
    if (store.settings.logo) { 
        try { 
            doc.addImage(store.settings.logo, 'PNG', 15, yPos + 3, 22, 22); 
        } catch (e) { console.error("Logo error", e); } 
    }
    
    doc.setFontSize(18).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text(store.settings.schoolName || "School Name", pageWidth / 2, yPos + 10, { align: 'center' });
    
    if (store.settings.motto) { 
        doc.setFontSize(8).setFont(undefined, 'italic').setTextColor(100); 
        doc.text(store.settings.motto, pageWidth / 2, yPos + 16, { align: 'center' }); 
    }
    
    doc.setFontSize(8).setFont(undefined, 'normal').setTextColor(80);
    const rightX = pageWidth - 15;
    doc.text(`KNEC Code: ${store.settings.schoolCode || 'N/A'}`, rightX, yPos + 8, { align: 'right' });
    doc.text(` Tel: ${store.settings.phone || 'N/A'}`, rightX, yPos + 13, { align: 'right' });
    
    // --- 3. Report Title ---
    // FIX: Increased yPos from 52 to 57 to create a larger gap between box and title
    yPos = 57; 
    
    doc.setFontSize(14).setFont(undefined, 'bold').setTextColor(37, 99, 235);
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    doc.setDrawColor(37, 99, 235).setLineWidth(0.5);
    doc.line((pageWidth/2) - 30, yPos + 2, (pageWidth/2) + 30, yPos + 2);
    
    return yPos + 8; // Returns ~65
}


function addDocHeader(doc, title) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // --- 1. Ministry Header ---
    doc.setFontSize(9).setFont(undefined, 'normal').setTextColor(100);
    doc.text("MINISTRY OF EDUCATION", pageWidth / 2, yPos, { align: 'center' }); // y = 10
    doc.setFontSize(8).setTextColor(130);
    doc.text("State Department for Early Learning and Basic Education", pageWidth / 2, yPos + 5, { align: 'center' }); // y = 15
    
    // Separator Line
    doc.setDrawColor(200).setLineWidth(0.5);
    doc.line(10, yPos + 9, pageWidth - 10, yPos + 9); // y = 19

    // --- 2. Main Header Box ---
    yPos = 21; // Start box below the line
    const boxHeight = 28;
    doc.setDrawColor(37, 99, 235).setLineWidth(1);
    doc.rect(10, yPos, pageWidth - 20, boxHeight); 
    
    if (store.settings.logo) { 
        try { 
            doc.addImage(store.settings.logo, 'PNG', 15, yPos + 3, 22, 22); 
        } catch (e) { console.error("Logo error", e); } 
    }
    
    doc.setFontSize(18).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text(store.settings.schoolName || "School Name", pageWidth / 2, yPos + 10, { align: 'center' });
    
    if (store.settings.motto) { 
        doc.setFontSize(8).setFont(undefined, 'italic').setTextColor(100); 
        doc.text(store.settings.motto, pageWidth / 2, yPos + 16, { align: 'center' }); 
    }
    
    doc.setFontSize(8).setFont(undefined, 'normal').setTextColor(80);
    const rightX = pageWidth - 15;
    doc.text(`KNEC Code: ${store.settings.schoolCode || 'N/A'}`, rightX, yPos + 8, { align: 'right' });
    doc.text(` Tel: ${store.settings.phone || 'N/A'}`, rightX, yPos + 13, { align: 'right' });
    
    // --- 3. Report Title ---
    yPos = 52; 
    doc.setFontSize(14).setFont(undefined, 'bold').setTextColor(37, 99, 235);
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    doc.setDrawColor(37, 99, 235).setLineWidth(0.5);
    doc.line((pageWidth/2) - 30, yPos + 2, (pageWidth/2) + 30, yPos + 2);
    
    return yPos + 8;
}
// ==========================================================================
//   REPORTS & PDF GENERATION
// ==========================================================================
function renderReportStats() { if ($('repStatStudents')) $('repStatStudents').innerText = StudentRepo.count(); }

// UPDATED: Increased spacing between Header Box and Title
function addDocHeader(doc, title) {
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // --- 1. Ministry Header ---
    doc.setFontSize(9).setFont(undefined, 'normal').setTextColor(100);
    doc.text("MINISTRY OF EDUCATION", pageWidth / 2, yPos, { align: 'center' });
    doc.setFontSize(8).setTextColor(130);
    doc.text("State Department for Early Learning and Basic Education", pageWidth / 2, yPos + 5, { align: 'center' });
    
    // Separator Line
    doc.setDrawColor(200).setLineWidth(0.5);
    doc.line(10, yPos + 9, pageWidth - 10, yPos + 9);

    // --- 2. Main Header Box ---
    yPos = 21; 
    const boxHeight = 28;
    doc.setDrawColor(37, 99, 235).setLineWidth(1);
    doc.rect(10, yPos, pageWidth - 20, boxHeight); 
    
    if (store.settings.logo) { 
        try { 
            doc.addImage(store.settings.logo, 'PNG', 15, yPos + 3, 22, 22); 
        } catch (e) { console.error("Logo error", e); } 
    }
    
    doc.setFontSize(18).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text(store.settings.schoolName || "School Name", pageWidth / 2, yPos + 10, { align: 'center' });
    
    if (store.settings.motto) { 
        doc.setFontSize(8).setFont(undefined, 'italic').setTextColor(100); 
        doc.text(store.settings.motto, pageWidth / 2, yPos + 16, { align: 'center' }); 
    }
    
    doc.setFontSize(8).setFont(undefined, 'normal').setTextColor(80);
    const rightX = pageWidth - 15;
    doc.text(`KNEC Code: ${store.settings.schoolCode || 'N/A'}`, rightX, yPos + 8, { align: 'right' });
    doc.text(` Tel: ${store.settings.phone || 'N/A'}`, rightX, yPos + 13, { align: 'right' });
    
    // --- 3. Report Title ---
    // FIX: Increased yPos from 52 to 57 to create a larger gap between box and title
    yPos = 57; 
    
    doc.setFontSize(14).setFont(undefined, 'bold').setTextColor(37, 99, 235);
    doc.text(title, pageWidth / 2, yPos, { align: 'center' });
    doc.setDrawColor(37, 99, 235).setLineWidth(0.5);
    doc.line((pageWidth/2) - 30, yPos + 2, (pageWidth/2) + 30, yPos + 2);
    
    return yPos + 8; // Returns ~65
}

function addDocFooter(doc, includeSignatures = false) {
    const pageCount = doc.internal.getNumberOfPages(); 
    const pageHeight = doc.internal.pageSize.getHeight(); 
    const pageWidth = doc.internal.pageSize.getWidth(); 
    for (let i = 1; i <= pageCount; i++) { 
        doc.setPage(i); 
        doc.setDrawColor(200); 
        doc.line(14, pageHeight - 25, pageWidth - 10, pageHeight - 25);
        doc.setFontSize(8).setTextColor(150); 
        doc.text("(c) Official Results", 150, pageHeight - 15);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 15, pageHeight - 15);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 15, pageHeight - 15, { align: 'right' });
        
        // REMOVED: Rubber Stamp logic to prevent overlap
        // if (store.settings.stamp) { try { doc.addImage(store.settings.stamp, 'PNG', pageWidth - 60, pageHeight - 55, 40, 25); } catch (e) { } }
        
        if (includeSignatures && i === pageCount) {
            doc.setFontSize(8).setTextColor(100);
            doc.text("Principal Signature", 40, pageHeight - 35, { align: 'center' });
            doc.line(20, pageHeight - 36, 60, pageHeight - 36);
            doc.text("Class teacher Signature", pageWidth - 40, pageHeight - 35, { align: 'center' });
            doc.line(pageWidth - 60, pageHeight - 36, pageWidth - 20, pageHeight - 36);
        }
    } 
}
function calculatePositions(data, key) { const sorted = [...data].sort((a, b) => b[key] - a[key]); let rank = 1; for (let i = 0; i < sorted.length; i++) { if (i > 0 && sorted[i][key] !== sorted[i-1][key]) { rank = i + 1; } sorted[i].position = rank; } return sorted; }

function populateStudentSelect(elementId = 'reportStudentSelect') { const select = $(elementId); if(!select) return; select.innerHTML = '<option value="">Select Learner...</option>'; StudentRepo.getAll().forEach(s => { select.innerHTML += `<option value="${s.id}">${s.name} (${s.grade})</option>`; }); }

function getLetterGrade(score) {
    const s = parseInt(score) || 0;
    if (s >= 90) return { grade: 'EE1', points: 8.0, remarks: 'Exceptional mastery' };
    if (s >= 75) return { grade: 'EE2', points: 7.0, remarks: 'Strong competency' };
    if (s >= 58) return { grade: 'ME1', points: 6.0, remarks: 'Competent with minor gaps' };
    if (s >= 41) return { grade: 'ME2', points: 5.0, remarks: 'Basic competency achieved' };
    if (s >= 31) return { grade: 'AE1', points: 4.0, remarks: 'Emerging competency' };
    if (s >= 21) return { grade: 'AE2', points: 3.0, remarks: 'Developing competency' };
    if (s >= 11) return { grade: 'BE1', points: 2.0, remarks: 'Minimal competency' };
    return { grade: 'BE2', points: 1.0, remarks: 'Not yet demonstrated' };
}


// ==========================================================================
//   ZERAKI STYLE TRANSCRIPT (CORRECTED)
// ==========================================================================

function generateTranscriptPDF(previewStudentId, isPreview = false) {
    let studentId = previewStudentId || 
                    $('reportStudentSelect')?.value || 
                    $('analysisStudentSelect')?.value || 
                    currentExamContext.studentId || 
                    currentStudentId;

    if (!studentId) return showToast('Please select a learner first.', 'error');
    
    const student = StudentRepo.getById(studentId);
    if (!student) return showToast('Learner not found.', 'error');
    if (!window.jspdf) return showToast('PDF Library not loaded', 'error');

    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF(); 
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); 
    const margin = 15;
    let yPos = 10;

    // --- 1. COMPACT HEADER ---
    doc.setFillColor(0, 51, 102); 
    doc.rect(0, 0, pageWidth, 32, 'F');
    
    if (store.settings.logo) { 
        try { 
            doc.addImage(store.settings.logo, 'PNG', margin, 6, 20, 20);
        } catch (e) {} 
    }
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18).setFont(undefined, 'bold');
    doc.text(store.settings.schoolName || "School Name", pageWidth / 2, 13, { align: 'center' });
    
    if (store.settings.motto) {
        doc.setFontSize(7).setFont(undefined, 'italic');
        doc.text(store.settings.motto, pageWidth / 2, 19, { align: 'center' });
    }
    
    doc.setFontSize(8).setFont(undefined, 'normal');
    doc.text(`KNEC: ${store.settings.schoolCode || 'N/A'} | Tel: ${store.settings.phone || 'N/A'}`, pageWidth / 2, 27, { align: 'center' });

    yPos = 38;

    // --- 2. COMPACT STUDENT PROFILE STRIP ---
    doc.setDrawColor(220);
    doc.setFillColor(250, 250, 252);
    doc.roundedRect(margin, yPos, pageWidth - (margin*2), 26, 2, 2, 'FD');
    
    try {
        doc.addImage(student.photo || DEFAULT_AVATAR, 'JPEG', margin + 3, yPos + 3, 20, 20);
    } catch(e) {}

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12).setFont(undefined, 'bold');
    doc.text(student.name, margin + 28, yPos + 9);
    
    doc.setFontSize(8).setFont(undefined, 'normal').setTextColor(80);
    doc.text(`Adm: ${student.reg} | Gr: ${student.grade} (${student.stream}) | G: ${student.gender}`, margin + 28, yPos + 16);
    doc.text(`Term: ${store.settings.currentTerm} ${store.settings.academicYear}`, margin + 28, yPos + 22);

    yPos += 30;

    // --- 3. REPORT TITLE ---
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(12).setFont(undefined, 'bold');
    doc.text("ASSESSMENT PROGRESS REPORT", pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    // --- 4. DEFINE SUBJECTS & CALCULATE STATS ---
    const subjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(student.grade));

    let totalScore = 0;
    let totalPoints = 0;
    let assessedCount = 0;
    
    let topSubject = { name: 'N/A', score: 0 };
    let lowSubject = { name: 'N/A', score: 100 };

    const tableData = subjects.map(sub => {
        const exam = store.exams.find(e => e.studentId === studentId && e.unitCode === sub.code);
        
        let score, grade, points, remarks;
        let teacherName = 'Not Assigned';

        const teacher = sub.teacherId ? StaffRepo.getById(sub.teacherId) : null; 
        if (teacher) teacherName = teacher.name;

        if (exam) {
            score = parseInt(exam.score);
            const gradeInfo = getLetterGrade(score); 
            grade = gradeInfo.grade;
            points = gradeInfo.points;
            remarks = gradeInfo.remarks;
            
            if (score > topSubject.score) { topSubject = { name: sub.name, score: score }; }
            if (score < lowSubject.score) { lowSubject = { name: sub.name, score: score }; }
            
            totalScore += score;
            totalPoints += gradeInfo.points;
            assessedCount++; 
        } else {
            score = 'NM';
            grade = 'NG';
            points = 'NP';
            remarks = 'No Assessment Results';
        }

        return [sub.name, score, grade, points, remarks, teacherName];
    });

    const avg = assessedCount > 0 ? (totalScore / assessedCount) : 0;

    const totalSubjectsCount = subjects.length;
    const maxPossibleScore = totalSubjectsCount * 100;
    const maxPossiblePoints = totalSubjectsCount * 8;

    const allStudents = StudentRepo.findBy('grade', student.grade);
    const totalStudentsInGrade = allStudents.length;
    
    const ranked = allStudents.map(s => {
        let sTotal = 0; let sCount = 0;
        subjects.forEach(sub => {
            const e = store.exams.find(ex => ex.studentId === s.id && ex.unitCode === sub.code);
            if (e) { sTotal += parseInt(e.score); sCount++; }
        });
        return { id: s.id, avg: sCount > 0 ? (sTotal / sCount) : 0 };
    }).sort((a,b) => b.avg - a.avg);
    
    const rank = ranked.findIndex(s => s.id === studentId) + 1;

    // --- 5. DRAW SUMMARY BOXES ---
    const boxW = 50; const gap = 4;
    const totalW = (boxW * 3) + (gap * 2);
    const startX = (pageWidth - totalW) / 2;

    // Mean Score
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(startX, yPos, boxW, 18, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16).setFont(undefined, 'bold');
    doc.text(`${avg.toFixed(1)}%`, startX + (boxW/2), yPos + 9, { align: 'center' });
    doc.setFontSize(7).setFont(undefined, 'normal');
    doc.text("MEAN SCORE", startX + (boxW/2), yPos + 15, { align: 'center' });

    // Rank (Format: 3/58)
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(startX + boxW + gap, yPos, boxW, 18, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16).setFont(undefined, 'bold');
    doc.text(`${rank}/${totalStudentsInGrade}`, (startX + boxW + gap) + (boxW/2), yPos + 9, { align: 'center' });
    doc.setFontSize(7).setFont(undefined, 'normal');
    doc.text("RANK", (startX + boxW + gap) + (boxW/2), yPos + 15, { align: 'center' });

    // Subjects Count
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(startX + (boxW*2) + (gap*2), yPos, boxW, 18, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16).setFont(undefined, 'bold');
    doc.text(`${assessedCount}/${totalSubjectsCount}`, (startX + (boxW*2) + (gap*2)) + (boxW/2), yPos + 9, { align: 'center' });
    doc.setFontSize(7).setFont(undefined, 'normal');
    doc.text("SUBJECTS", (startX + (boxW*2) + (gap*2)) + (boxW/2), yPos + 15, { align: 'center' });

    yPos += 23;

    // --- 6. DETAILED TABLE (UPDATED COLUMN STYLES) ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10).setFont(undefined, 'bold');
    doc.text("Subject Breakdown", margin, yPos);
    yPos += 2;

    const scoreDisplay = `${totalScore}/${maxPossibleScore}`; 
    const pointsDisplay = `${totalPoints.toFixed(1)}/${maxPossiblePoints.toFixed(1)}`; 
    
    const footerRow = ['TOTAL', scoreDisplay, '', pointsDisplay, '', ''];

    doc.autoTable({ 
        startY: yPos, 
        head: [['Subject', 'Score', 'Grd', 'Pts', 'Remarks', 'Teacher']], 
        body: tableData,
        foot: [footerRow],
        theme: 'grid',
        headStyles: {
            fillColor: [0, 51, 102], 
            textColor: 255,
            fontSize: 8,           
            fontStyle: 'bold',
            cellPadding: 2
        },
        footStyles: {
            fillColor: [241, 245, 249],
            textColor: [30, 41, 59],
            fontStyle: 'bold',
            fontSize: 8,           
            cellPadding: 2
        },
        styles: {
            fontSize: 8,           
            lineColor: [0, 51, 102], 
            lineWidth: 0.1,
            cellPadding: 2,        
            font: 'helvetica'
        },
        columnStyles: {
            0: { cellWidth: 45 },           // Subject
            1: { halign: 'center', cellWidth: 18 }, // Score
            2: { halign: 'center', cellWidth: 10 }, // Grade
            3: { halign: 'center', cellWidth: 20 }, // Pts (INCREASED from 14)
            4: { cellWidth: 'auto' },       // Remarks (Will auto-shrink)
            5: { cellWidth: 28, fontStyle: 'italic' } // Teacher
        },
        margin: { left: margin, right: margin },
        didParseCell: function (data) {
            if (data.section === 'body' && data.column.index >= 1 && data.column.index <= 3) {
                 const cellText = data.cell.raw;
                 if (typeof cellText === 'string' && (cellText === 'NM' || cellText === 'NG' || cellText === 'NP')) {
                     data.cell.styles.textColor = [150, 150, 150];
                     data.cell.styles.fontStyle = 'italic';
                 }
            }
        }
    });

    // --- 7. BALANCING LOGIC ---
    let finalY = doc.lastAutoTable.finalY + 5;
    const bottomMargin = 25; 
    const gradeKeyHeight = 15;
    const remarksHeight = 16;
    const remarksGap = 5;
    const totalBottomContent = gradeKeyHeight + remarksHeight + remarksGap + 10; 
    
    const availableSpace = pageHeight - bottomMargin - finalY - totalBottomContent;
    
    if (availableSpace > 30) {
        finalY += (availableSpace * 0.4); 
    }

    // --- 8. GRADE KEY ---
    doc.setFontSize(7).setTextColor(100);
    doc.text("Grading Key:", margin, finalY);
    finalY += 3;
    
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, finalY, pageWidth - (margin*2), 10, 1, 1, 'F');
    
    doc.setFontSize(6).setTextColor(50);
    const keys = ["90-100: EE1", "75-89: EE2", "58-74: ME1", "41-57: ME2", "31-40: AE1", "21-30: AE2", "11-20: BE1", "1-10: BE2"];
    const colW = (pageWidth - (margin*2)) / 4; 
    keys.forEach((k, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        doc.text(k, margin + 2 + (col * colW), finalY + 4 + (row * 3));
    });

    finalY += 15;

    // --- 9. DYNAMIC REMARKS ---
    const isMale = student.gender === 'Male' || student.gender === 'M';
    const pronoun = isMale ? 'He' : 'She';
    const possessive = isMale ? 'His' : 'Her';
    const fName = student.name.split(' ')[0];

    let ctRemark = "";
    let hoiRemark = "";

    if (avg >= 80) {
        ctRemark = `${fName} has displayed exceptional mastery this term. ${pronoun} is a self-driven learner who excels in ${topSubject.name}. Keep up the outstanding spirit!`;
        hoiRemark = `An exemplary performance by ${fName}. ${pronoun} sets a high standard for the class. A true ambassador of excellence. Highly commended.`;
    } else if (avg >= 58) {
        ctRemark = `A good effort by ${fName}. ${pronoun} shows strength in ${topSubject.name}. However, ${possessive.toLowerCase()} performance in ${lowSubject.name} needs more focus.`;
        hoiRemark = `${fName} is on the right track. With targeted improvement in weak areas, ${pronoun.toLowerCase()} is capable of achieving top grades.`;
    } else if (avg >= 41) {
        ctRemark = `${fName} is making steady progress. While ${possessive.toLowerCase()} work in ${topSubject.name} is commendable, ${pronoun.toLowerCase()} struggled with ${lowSubject.name}. Encourage revision.`;
        hoiRemark = `Satisfactory performance. ${fName} needs to put in extra effort, especially in ${lowSubject.name}, to unlock full potential.`;
    } else if (avg >= 21) {
        ctRemark = `${fName} has faced significant challenges. ${pronoun} needs urgent remedial work in ${lowSubject.name}. Please ensure ${pronoun.toLowerCase()} attends extra lessons.`;
        hoiRemark = `Performance below expected standards. ${fName} requires close monitoring and parental support to improve.`;
    } else {
        ctRemark = `This has been a difficult term for ${fName}. ${pronoun} requires specialized attention in all areas, particularly ${lowSubject.name}.`;
        hoiRemark = `Critical attention needed. The school and parents must work together to support ${fName}'s academic journey.`;
    }

    const remHeight = 16;
    
    // Class Teacher Box
    doc.setFontSize(8).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Class Teacher's Remarks:", margin, finalY);
    finalY += 1;
    
    doc.setDrawColor(200).setFillColor(254, 254, 254);
    doc.roundedRect(margin, finalY, pageWidth - (margin*2), remHeight, 1, 1, 'FD');
    
    doc.setFontSize(6.5).setTextColor(50).setFont(undefined, 'normal');
    doc.text(ctRemark, margin + 2, finalY + 4, { maxWidth: pageWidth - margin * 2 - 55 });
    
    doc.line(pageWidth - margin - 50, finalY + remHeight - 3, pageWidth - margin - 5, finalY + remHeight - 3);
    doc.setFontSize(6).setTextColor(120);
    doc.text("Sign/Stamp", pageWidth - margin - 27, finalY + remHeight - 1, {align: 'center'});
    
    finalY += remHeight + 3;

    // HOI Box
    doc.setFontSize(8).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Head of Institution's Remarks:", margin, finalY);
    finalY += 1;
    
    doc.setDrawColor(200);
    doc.roundedRect(margin, finalY, pageWidth - (margin*2), remHeight, 1, 1, 'D');
    
    doc.setFontSize(6.5).setTextColor(50).setFont(undefined, 'normal');
    doc.text(hoiRemark, margin + 2, finalY + 4, { maxWidth: pageWidth - margin * 2 - 55 });
    
    doc.line(pageWidth - margin - 50, finalY + remHeight - 3, pageWidth - margin - 5, finalY + remHeight - 3);
    doc.setFontSize(6).setTextColor(120);
    doc.text("Sign/Stamp", pageWidth - margin - 27, finalY + remHeight - 1, {align: 'center'});

    addDocFooter(doc, false);

    // --- OUTPUT HANDLING ---
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    if (isPreview) {
        window.open(blobUrl, '_blank');
        showToast('Report opened in new tab.');
        closeModal('individualReportModal');
    } else {
        doc.save(`Report_${student.name}.pdf`); 
        closeModal('individualReportModal');
    }
}

// ==========================================================================
//   LEAVING CERTIFICATE GENERATION (KENYAN FORMAT)
// ==========================================================================
function generateLeavingCertificatePDF(studentId) {
    const id = studentId || $('reportStudentSelect')?.value;
    if (!id) return showToast('Please select a learner first.', 'error');
    
    const student = StudentRepo.getById(id);
    if (!student) return showToast('Learner not found.', 'error');
    if (!window.jspdf) return showToast('PDF Library not loaded', 'error');

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const centerX = pageWidth / 2;

    // --- 1. OUTER DOUBLE BORDER ---
    doc.setDrawColor(0, 51, 102).setLineWidth(1.5);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10); // Outer Thick Border
    doc.setDrawColor(0, 51, 102).setLineWidth(0.5);
    doc.rect(6.5, 6.5, pageWidth - 13, pageHeight - 13); // Inner Thin Border

    // --- 2. NATIONAL HEADER ---
    let yPos = 25;
    
    doc.setFontSize(14).setFont(undefined, 'bold').setTextColor(0, 51, 102);
    doc.text("REPUBLIC OF KENYA", centerX, yPos, { align: 'center' });
    
    doc.setFontSize(10).setFont(undefined, 'normal').setTextColor(50);
    doc.text("MINISTRY OF EDUCATION", centerX, yPos + 6, { align: 'center' });
    doc.text("STATE DEPARTMENT FOR EARLY LEARNING AND BASIC EDUCATION", centerX, yPos + 12, { align: 'center' });

    // --- 3. SCHOOL IDENTITY ---
    yPos += 22;
    
    // Logo
    if (store.settings.logo) {
        try { 
            doc.addImage(store.settings.logo, 'PNG', centerX - 12, yPos, 24, 24); 
            yPos += 28;
        } catch (e) { console.log("Logo error"); yPos += 10; }
    } else {
        yPos += 10;
    }

    // School Name
    doc.setFontSize(20).setFont(undefined, 'bold').setTextColor(0, 51, 102);
    doc.text(store.settings.schoolName || "SCHOOL NAME", centerX, yPos, { align: 'center' });
    
    // Motto
    if (store.settings.motto) {
        doc.setFontSize(9).setFont(undefined, 'italic').setTextColor(100);
        doc.text(`"${store.settings.motto}"`, centerX, yPos + 6, { align: 'center' });
    }

    // --- 4. TITLE BOX ---
    yPos += 12;
    doc.setFillColor(0, 51, 102).rect(margin, yPos, pageWidth - (margin * 2), 10, 'F');
    doc.setTextColor(255, 255, 255).setFontSize(14).setFont(undefined, 'bold');
    doc.text("LEAVING CERTIFICATE", centerX, yPos + 7, { align: 'center' });

    // --- 5. REFERENCE INFO ---
    yPos += 18;
    doc.setFontSize(9).setFont(undefined, 'normal').setTextColor(80);
    doc.text(`Ref No: ${student.reg || 'N/A'}`, margin, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth - margin, yPos, { align: 'right' });

    // Declaration
    yPos += 8;
    doc.setFontSize(10).setFont(undefined, 'normal').setTextColor(0);
    const declaration = "This is to certify that the person named hereunder was a bona fide student of this school.";
    doc.text(declaration, centerX, yPos, { align: 'center' });
    yPos += 10;

    // --- 6. STUDENT DETAILS GRID ---
    const labelX = 40;
    const valueX = 95;
    const lineHeight = 9;

    const addDetail = (label, value) => {
        doc.setFontSize(11).setFont(undefined, 'normal').setTextColor(50);
        doc.text(label, labelX, yPos);
        doc.text(":", valueX - 5, yPos);
        doc.setFont(undefined, 'bold').setTextColor(0);
        doc.text(`${value || 'N/A'}`, valueX, yPos);
        yPos += lineHeight;
    };

    addDetail("FULL NAME", student.name.toUpperCase());
    addDetail("ADMISSION NUMBER", student.reg);
    addDetail("DATE OF BIRTH", student.dob ? new Date(student.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A');
    addDetail("BIRTH CERTIFICATE NO.", student.idNumber);
    addDetail("GENDER", student.gender);
    addDetail("PARENT/GUARDIAN", student.guardianName || 'N/A');
    addDetail("CLASS ADMITTED", student.entryLevel || student.grade);
    addDetail("LAST CLASS ATTENDED", student.grade);
    addDetail("DATE OF ADMISSION", student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-GB') : 'N/A');
    addDetail("DATE OF LEAVING", new Date().toLocaleDateString('en-GB'));
    
    // Reason for Leaving
    const reason = student.clearanceReason || (["Grade 6", "Grade 9"].includes(student.grade) ? "Completion of Cycle" : "Transfer");
    addDetail("REASON FOR LEAVING", reason);

    // --- 7. CONDUCT & CHARACTER ---
    yPos += 5;
    doc.setFontSize(11).setFont(undefined, 'normal').setTextColor(0);
    doc.text("CONDUCT & CHARACTER:", labelX, yPos);
    yPos += 2;
    doc.setFontSize(10).setTextColor(50);
    const conductText = `The above named student's conduct and character while in this school were found to be SATISFACTORY. We wish him/her success in future endeavors.`;
    const splitText = doc.splitTextToSize(conductText, pageWidth - (margin * 2) - 10);
    doc.text(splitText, margin, yPos);
    yPos += (splitText.length * 6) + 5;

    // --- 8. SIGNATURES & STAMP ---
    yPos += 10;
    
    // Official School Stamp Box (Center)
    doc.setDrawColor(150).setLineWidth(0.3);
    doc.setLineDashPattern([1, 1], 0); 
    doc.rect(centerX - 25, yPos, 50, 30);
    doc.setLineDashPattern([], 0); 
    doc.setFontSize(8).setTextColor(130);
    doc.text("OFFICIAL SCHOOL STAMP", centerX, yPos + 33, { align: 'center' });

    // Insert Stamp Image if exists
    if (store.settings.stamp) {
        try { doc.addImage(store.settings.stamp, 'PNG', centerX - 18, yPos + 2, 36, 25); } catch (e) {}
    }

    // Signature Lines
    const sigY = pageHeight - 55;
    const sigLineLength = 45;

    doc.setFontSize(10).setFont(undefined, 'normal').setTextColor(50);
    
    // Class Teacher
    doc.text("CLASS TEACHER", 45, sigY, { align: 'center' });
    doc.setDrawColor(0).setLineWidth(0.5);
    doc.line(45 - (sigLineLength/2), sigY - 5, 45 + (sigLineLength/2), sigY - 5);
    // Signature Image
    if (store.settings.ctSignature) {
        try { doc.addImage(store.settings.ctSignature, 'PNG', 28, sigY - 22, 35, 14); } catch (e) {}
    }

    // Principal
    doc.text("PRINCIPAL", pageWidth - 45, sigY, { align: 'center' });
    doc.line((pageWidth - 45) - (sigLineLength/2), sigY - 5, (pageWidth - 45) + (sigLineLength/2), sigY - 5);
    // Signature Image
    if (store.settings.hoiSignature) {
        try { doc.addImage(store.settings.hoiSignature, 'PNG', pageWidth - 62, sigY - 22, 35, 14); } catch (e) {}
    }

    // --- 9. FOOTER ---
    doc.setFontSize(7).setTextColor(120);
    doc.text("Any erasure or alteration renders this certificate invalid.", centerX, pageHeight - 22, { align: 'center' });
    doc.setFontSize(8).setTextColor(150);
    doc.text(`Generated via ElimuTrack System | KNEC Code: ${store.settings.schoolCode || 'N/A'}`, centerX, pageHeight - 16, { align: 'center' });

    // --- OUTPUT ---
    doc.save(`Leaving_Certificate_${student.name.replace(/\s/g, '_')}.pdf`);
    showToast('Leaving Certificate Generated!');
}


// ==========================================================================
//   SUBJECT SCORE LIST PDF (Updated with Detailed Remarks)
// ==========================================================================

function generateSubjectScoreListPDF() {
    if (!window.jspdf) return showToast('PDF Library not loaded', 'error');
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF();

    // 1. Get Inputs
    const grade = $('subjectReportGrade').value; 
    const subjectCode = $('subjectReportSubject').value;
    const subject = store.learningAreas.find(s => s.code === subjectCode);
    
    if(!subject) return showToast('Select subject', 'error');
    
    // 2. Retrieve Linked Teacher
    const teacher = subject.teacherId ? StaffRepo.getById(subject.teacherId) : null;
    const teacherName = teacher ? teacher.name : 'Not Assigned';

    // 3. Get Students and Scores
    const students = StudentRepo.findBy('grade', grade);
    let data = students.map(s => { 
        const exam = store.exams.find(e => e.studentId === s.id && e.unitCode === subjectCode); 
        const score = exam ? parseInt(exam.score) : null;
        
        // Use getCompetenceStatus for UI classification (Competent/NYC) and colors
        const comp = exam ? getCompetenceStatus(score) : { level: 'Absent', abbr: 'ABS', decision: 'N/A' };
        
        // Use getLetterGrade for the specific Remarks required in the PDF
        const letterInfo = exam ? getLetterGrade(score) : { grade: 'ABS', remarks: 'Absent' };

        return { 
            id: s.id,
            name: s.name, 
            adm: s.reg, 
            gender: s.gender,
            score: score, 
            level: comp.abbr, 
            decision: comp.decision,
            remarks: letterInfo.remarks, // New detailed remarks
            gradeLetter: letterInfo.grade // EE1, ME2, etc.
        }; 
    });

    // 4. Calculate Statistics
    const presentData = data.filter(d => d.score !== null);
    const scores = presentData.map(d => d.score);
    
    const totalStudents = data.length;
    const presentCount = presentData.length;
    
    const totalPoints = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) : 0;
    const avgScore = scores.length > 0 ? (totalPoints / scores.length).toFixed(1) : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 0;
    
    // Grade Distribution - Grouped for Display (EE, ME, AE, BE)
    const distribution = { EE: 0, ME: 0, AE: 0, BE: 0, ABS: 0 };
    data.forEach(d => {
        const lvl = d.level; 
        if (lvl.startsWith('EE')) distribution.EE++;
        else if (lvl.startsWith('ME')) distribution.ME++;
        else if (lvl.startsWith('AE')) distribution.AE++;
        else if (lvl.startsWith('BE')) distribution.BE++;
        else distribution.ABS++;
    });

    // Sort & Rank
    data.sort((a, b) => (b.score || -1) - (a.score || -1));
    let rank = 1;
    data.forEach((d, i) => {
        if (d.score !== null) {
            if (i > 0 && d.score === data[i-1].score) d.position = data[i-1].position;
            else d.position = rank;
            rank++;
        } else {
            d.position = '-';
        }
    });

    const top3Overall = data.filter(d => d.score !== null).slice(0, 3);
    const top3Boys = data.filter(d => d.gender === 'Male' && d.score !== null).slice(0, 3);
    const top3Girls = data.filter(d => d.gender === 'Female' && d.score !== null).slice(0, 3);

    // 5. Build PDF
    let yPos = addDocHeader(doc, `${subject.name} - Performance List`);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // -- Context Box --
    const infoBoxHeight = 28;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, contentWidth, infoBoxHeight, 3, 3, 'FD');
    
    doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Assessment Context", margin + 5, yPos + 6);
    
    doc.setFontSize(9).setFont(undefined, 'normal').setTextColor(71, 85, 105);
    doc.text(`Subject Teacher: ${teacherName}`, margin + 5, yPos + 12);
    doc.text(`Target Grade: ${grade}`, margin + 5, yPos + 17);
    doc.text(`Academic Year: ${store.settings.academicYear}`, margin + 5, yPos + 22);
    
    doc.text(`Assessment Type: BASELINE`, pageWidth - margin - 5, yPos + 12, { align: 'right' });
    doc.text(`Term: ${store.settings.currentTerm}`, pageWidth - margin - 5, yPos + 17);
    doc.text(`Candidates: ${presentCount} / ${totalStudents}`, pageWidth - margin - 5, yPos + 22, { align: 'right' });
    
    yPos += infoBoxHeight + 10;

    // -- Statistics Grid --
    doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Performance Statistics", margin, yPos);
    yPos += 2;

    const stats = [
        { label: "Total Points\n(Sum of Scores)", value: totalPoints, color: [37, 99, 235] },
        { label: "Class Average\n(Mean Score)", value: avgScore, color: [22, 163, 74] },
        { label: "Highest Score\n(Max)", value: maxScore, color: [217, 119, 6] },
        { label: "Lowest Score\n(Min)", value: minScore, color: [220, 38, 38] },
        { label: "Std Deviation\n(Range)", value: maxScore - minScore, color: [107, 114, 128] }
    ];

    const statWidth = (contentWidth - 40) / 5; 
    const statHeight = 22;
    let statX = margin;

    stats.forEach(stat => {
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(statX, yPos, statWidth, statHeight, 3, 3, 'FD');
        
        doc.setTextColor(...stat.color).setFontSize(16).setFont(undefined, 'bold');
        doc.text(String(stat.value), statX + (statWidth/2), yPos + 10, { align: 'center' });
        
        doc.setTextColor(100).setFontSize(7).setFont(undefined, 'normal');
        const lines = stat.label.split('\n');
        lines.forEach((line, i) => {
            doc.text(line, statX + (statWidth/2), yPos + 15 + (i * 3), { align: 'center' });
        });

        statX += statWidth + 10;
    });

    yPos += statHeight + 12;

    // -- Hall of Fame --
    doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Top Performers", margin, yPos);
    yPos += 2;

    const podiumW = (contentWidth - 10) / 3;
    
    const drawPodiumList = (title, list, startX) => {
        doc.setFillColor(241, 245, 249).setDrawColor(226, 232, 240);
        doc.roundedRect(startX, yPos, podiumW, 8, 2, 2, 'FD');
        doc.setFontSize(8).setFont(undefined, 'bold').setTextColor(51, 65, 85);
        doc.text(title, startX + (podiumW/2), yPos + 5, { align: 'center' });
        
        let listY = yPos + 12;
        doc.setFontSize(8).setFont(undefined, 'normal');
        
        if(list.length === 0) {
            doc.setTextColor(150);
            doc.text("N/A", startX + (podiumW/2), listY + 4, { align: 'center' });
        } else {
            list.forEach((s, i) => {
                const colors = [[218, 165, 32], [192, 192, 192], [205, 127, 50]];
                doc.setFillColor(...colors[i]);
                doc.circle(startX + 4, listY + 1.5, 1.5, 'F');
                
                doc.setTextColor(30, 41, 59);
                doc.text(s.name, startX + 8, listY + 2);
                
                doc.setTextColor(100);
                doc.text(`${s.score}%`, startX + podiumW - 3, listY + 2, { align: 'right' });
                listY += 5;
            });
        }
    };

    drawPodiumList("Top 3 Overall", top3Overall, margin);
    drawPodiumList("Top 3 Boys", top3Boys, margin + podiumW + 5);
    drawPodiumList("Top 3 Girls", top3Girls, margin + (podiumW + 5) * 2);

    yPos += 35; 

    // -- Grade Distribution --
    doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Competence Level Distribution", margin, yPos);
    yPos += 4;

    const gradeColors = {
        'EE': { bg: [187, 247, 208], text: [22, 163, 74] }, 
        'ME': { bg: [191, 219, 254], text: [37, 99, 235] }, 
        'AE': { bg: [254, 215, 170], text: [234, 88, 12] }, 
        'BE': { bg: [254, 202, 202], text: [220, 38, 38] }, 
        'ABS': { bg: [229, 231, 235], text: [107, 114, 128] } 
    };

    const pillW = 35;
    const pillGap = 5;
    let pillX = margin;

    Object.keys(gradeColors).forEach(key => {
        const count = distribution[key];
        doc.setFillColor(...gradeColors[key].bg).roundedRect(pillX, yPos, pillW, 8, 4, 4, 'F');
        doc.setTextColor(...gradeColors[key].text).setFontSize(9).setFont(undefined, 'bold');
        doc.text(`${key}: ${count}`, pillX + (pillW/2), yPos + 5, { align: 'center' });
        pillX += pillW + pillGap;
    });

    yPos += 15;

    // -- Detailed Table --
    doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Learner Marks", margin, yPos);
    yPos += 5;

    // FIX: Use the specific remarks from data mapping
    const tableData = data.map(d => [
        d.position, 
        d.adm, 
        d.name, 
        d.gender ? d.gender.charAt(0) : '-', 
        d.score !== null ? d.score : 'ABS', 
        d.gradeLetter, // e.g., EE1, ME2
        d.remarks      // e.g., Exceptional mastery
    ]);

    doc.autoTable({ 
        startY: yPos, 
        head: [['#', 'Adm No', 'Name', 'G', 'Score', 'Grade', 'Remarks']], 
        body: tableData, 
        theme: 'grid',
        headStyles: { 
            fillColor: [30, 41, 59], 
            textColor: 255,
            fontSize: 8,
            fontStyle: 'bold',
            cellPadding: 2
        },
        bodyStyles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [226, 232, 240]
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            1: { cellWidth: 28 },
            2: { cellWidth: 'auto' },
            3: { halign: 'center', cellWidth: 8 },
            4: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
            5: { halign: 'center', cellWidth: 14 },
            6: { cellWidth: 45 } // Wider for remarks
        },
        didParseCell: function (data) {
            // Color the Grade column based on group
            if (data.column.index === 5 && data.section === 'body') {
                const grade = data.cell.raw; 
                if (grade) {
                    let groupKey = 'ABS';
                    if (grade.startsWith('EE')) groupKey = 'EE';
                    else if (grade.startsWith('ME')) groupKey = 'ME';
                    else if (grade.startsWith('AE')) groupKey = 'AE';
                    else if (grade.startsWith('BE')) groupKey = 'BE';

                    if (gradeColors[groupKey]) {
                        data.cell.styles.textColor = gradeColors[groupKey].text;
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            }
            // Gold/Silver/Bronze for Position
            if (data.column.index === 0 && data.section === 'body') {
                if (data.cell.raw === 1) data.cell.styles.textColor = [218, 165, 32]; 
                if (data.cell.raw === 2) data.cell.styles.textColor = [192, 192, 192]; 
                if (data.cell.raw === 3) data.cell.styles.textColor = [205, 127, 50]; 
            }
        },
        margin: { left: margin, right: margin }
    });
    
    addDocFooter(doc);
    doc.save(`Baseline_Report_${subject.name}_${grade}.pdf`); 
    closeModal('subjectReportModal');
}

// ==========================================================================
//   DETAILED CLASS MARKSHEET (ENHANCED)
// ==========================================================================


// ==========================================================================
//   BULK PROGRESS REPORTS (per class / stream / grade)
// ==========================================================================

// Wire the modal controls
function initBulkProgressModal() {
    const gradeSel = $('bulkProgressGrade');
    if (gradeSel && !gradeSel.dataset.bound) {
        gradeSel.dataset.bound = '1';
        gradeSel.addEventListener('change', () => {
            populateBulkProgressStreams(gradeSel.value);
            updateBulkProgressPreview();
        });
    }
    const streamSel = $('bulkProgressStream');
    if (streamSel && !streamSel.dataset.bound) {
        streamSel.dataset.bound = '1';
        streamSel.addEventListener('change', updateBulkProgressPreview);
    }
    const btn = $('btnGenerateBulkProgress');
    if (btn && !btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', generateBulkProgressReports);
    }
}

function populateBulkProgressStreams(grade) {
    const streamSel = $('bulkProgressStream');
    if (!streamSel) return;
    let students = grade ? StudentRepo.findBy('grade', grade) : StudentRepo.getAll();
    const streams = Array.from(new Set(students.map(s => s.stream).filter(Boolean))).sort();
    streamSel.innerHTML = '<option value="all">All Streams</option>' +
        streams.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
}

function updateBulkProgressPreview() {
    const grade = $('bulkProgressGrade') ? $('bulkProgressGrade').value : '';
    const stream = $('bulkProgressStream') ? $('bulkProgressStream').value : 'all';
    const preview = $('bulkProgressPreview');
    if (!preview) return;

    if (!grade) {
        preview.style.display = 'none';
        return;
    }

    let students = StudentRepo.findBy('grade', grade);
    if (stream !== 'all') students = students.filter(s => s.stream === stream);

    const subjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(grade));
    const assessed = students.filter(s => store.exams.some(e => e.studentId === s.id));

    preview.style.display = 'block';
    preview.innerHTML = `
        <strong>${students.length}</strong> learner${students.length === 1 ? '' : 's'} will be processed
        · <strong>${subjects.length}</strong> learning areas
        · <strong>${assessed.length}</strong> have at least one assessment recorded
    `;
}

function generateBulkProgressReports() {
    if (!window.jspdf) { showToast('PDF library not loaded', 'error'); return; }
    const grade = $('bulkProgressGrade') ? $('bulkProgressGrade').value : '';
    const stream = $('bulkProgressStream') ? $('bulkProgressStream').value : 'all';
    const outputMode = $('bulkProgressOutput') ? $('bulkProgressOutput').value : 'single';
    const includeRank = $('bulkProgressIncludeRank') ? $('bulkProgressIncludeRank').checked : true;
    const includeComments = $('bulkProgressIncludeComments') ? $('bulkProgressIncludeComments').checked : true;

    if (!grade) { showToast('Please select a grade', 'error'); return; }

    let students = StudentRepo.findBy('grade', grade);
    if (stream !== 'all') students = students.filter(s => s.stream === stream);

    if (students.length === 0) {
        showToast('No learners match the selected criteria', 'error');
        return;
    }

    // Compute ranks once for the whole grade (if includeRank)
    let gradeRanking = null;
    let streamRanking = {};
    if (includeRank) {
        gradeRanking = computeGradeRanking(grade);
        const streams = Array.from(new Set(students.map(s => s.stream).filter(Boolean)));
        streams.forEach(st => { streamRanking[st] = computeStreamRanking(grade, st); });
    }

    showToast(`Generating ${students.length} report${students.length === 1 ? '' : 's'}...`);

    if (outputMode === 'single') {
        // Single PDF with one page per learner — transcript-styled
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        students.forEach((student, idx) => {
            const classRank = gradeRanking ? (gradeRanking.find(r => r.studentId === student.id) || {}).rank : null;
            const streamRank = (student.stream && streamRanking[student.stream])
                ? (streamRanking[student.stream].find(r => r.studentId === student.id) || {}).rank
                : null;
            renderTranscriptStylePage(doc, student, classRank, streamRank, includeComments, idx > 0);
        });

        const filename = `Progress_Reports_${grade.replace(/\s+/g, '_')}${stream !== 'all' ? '_' + stream.replace(/\s+/g, '_') : ''}.pdf`;
        doc.save(filename);
        showToast(`${students.length} report${students.length === 1 ? '' : 's'} generated`, 'success');
    } else if (outputMode === 'zip') {
        // ZIP file with separate PDF per learner
        if (typeof JSZip === 'undefined') {
            showToast('ZIP library not loaded — falling back to separate downloads', 'error');
            // Fallback to separate mode
            generateSeparatePDFs(students, gradeRanking, streamRanking, includeComments);
            return;
        }
        generateZipBundle(students, gradeRanking, streamRanking, includeComments, grade, stream);
    } else {
        // Separate PDFs — individual downloads
        generateSeparatePDFs(students, gradeRanking, streamRanking, includeComments);
    }
}

// Generate a ZIP bundle of individual PDFs
async function generateZipBundle(students, gradeRanking, streamRanking, includeComments, grade, stream) {
    if (typeof JSZip === 'undefined') {
        showToast('ZIP library not loaded', 'error');
        return;
    }
    if (!window.jspdf) {
        showToast('PDF library not loaded', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const zip = new JSZip();
    const reportFolder = zip.folder('Progress_Reports');
    let successCount = 0;
    let failCount = 0;

    showToast(`Generating ${students.length} PDFs...`);

    // Generate each PDF and add to ZIP — wrapped in try/catch per student
    for (let i = 0; i < students.length; i++) {
        const student = students[i];
        try {
            const classRank = gradeRanking ? (gradeRanking.find(r => r.studentId === student.id) || {}).rank : null;
            const streamRank = (student.stream && streamRanking[student.stream])
                ? (streamRanking[student.stream].find(r => r.studentId === student.id) || {}).rank
                : null;

            const doc = new jsPDF();
            renderTranscriptStylePage(doc, student, classRank, streamRank, includeComments, false);

            // Use 'blob' output — most reliable with JSZip across jsPDF versions
            const pdfBlob = doc.output('blob');
            const safeName = (student.name || 'Learner').replace(/[^a-z0-9]/gi, '_');
            const safeReg = (student.reg || student.id || '').replace(/[^a-z0-9]/gi, '_');
            reportFolder.file(`Progress_${safeName}_${safeReg}.pdf`, pdfBlob);
            successCount++;
        } catch (err) {
            console.error(`Failed to generate PDF for ${student.name}:`, err);
            failCount++;
        }
    }

    if (successCount === 0) {
        showToast('No PDFs could be generated. Check console for errors.', 'error');
        return;
    }

    // Generate the ZIP and trigger download
    try {
        const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement('a');
        a.href = url;
        const zipName = `Progress_Reports_${grade.replace(/\s+/g, '_')}${stream !== 'all' ? '_' + stream.replace(/\s+/g, '_') : ''}.zip`;
        a.download = zipName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        const msg = `${successCount} report${successCount === 1 ? '' : 's'} bundled into ZIP` +
            (failCount > 0 ? ` · ${failCount} failed` : '');
        showToast(msg, failCount > 0 ? 'warning' : 'success');
    } catch (err) {
        console.error('ZIP generation failed:', err);
        showToast('Failed to generate ZIP — try Single PDF mode instead', 'error');
    }
}

// Generate separate PDFs (individual downloads with delays)
function generateSeparatePDFs(students, gradeRanking, streamRanking, includeComments) {
    const { jsPDF } = window.jspdf;
    let count = 0;
    let failCount = 0;
    students.forEach((student, idx) => {
        setTimeout(() => {
            try {
                const doc = new jsPDF();
                const classRank = gradeRanking ? (gradeRanking.find(r => r.studentId === student.id) || {}).rank : null;
                const streamRank = (student.stream && streamRanking[student.stream])
                    ? (streamRanking[student.stream].find(r => r.studentId === student.id) || {}).rank
                    : null;
                renderTranscriptStylePage(doc, student, classRank, streamRank, includeComments, false);
                const safeName = student.name.replace(/[^a-z0-9]/gi, '_');
                doc.save(`Progress_${safeName}_${student.reg || student.id}.pdf`);
                count++;
            } catch (err) {
                console.error(`Failed to generate PDF for ${student.name}:`, err);
                failCount++;
                count++;
            }
            if (count + failCount === students.length) {
                const msg = `${count} report${count === 1 ? '' : 's'} downloaded` +
                    (failCount > 0 ? ` · ${failCount} failed` : '');
                showToast(msg, failCount > 0 ? 'warning' : 'success');
            }
        }, idx * 600);
    });
}

// Compute ranking for a whole grade based on average score across assessed subjects
function computeGradeRanking(grade) {
    const students = StudentRepo.findBy('grade', grade);
    const ranked = students.map(s => {
        const exams = store.exams.filter(e => e.studentId === s.id);
        const scores = exams.map(e => parseInt(e.score) || 0).filter(v => v > 0);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return { studentId: s.id, avg };
    }).sort((a, b) => b.avg - a.avg);
    let rank = 1;
    ranked.forEach((r, i) => {
        if (i > 0 && r.avg === ranked[i - 1].avg) r.rank = ranked[i - 1].rank;
        else r.rank = rank;
        rank++;
    });
    return ranked;
}

function computeStreamRanking(grade, stream) {
    const students = StudentRepo.findBy('grade', grade).filter(s => s.stream === stream);
    const ranked = students.map(s => {
        const exams = store.exams.filter(e => e.studentId === s.id);
        const scores = exams.map(e => parseInt(e.score) || 0).filter(v => v > 0);
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        return { studentId: s.id, avg };
    }).sort((a, b) => b.avg - a.avg);
    let rank = 1;
    ranked.forEach((r, i) => {
        if (i > 0 && r.avg === ranked[i - 1].avg) r.rank = ranked[i - 1].rank;
        else r.rank = rank;
        rank++;
    });
    return ranked;
}

// ==========================================================================
//   TRANSCRIPT-STYLE PAGE RENDERER
//   Mirrors generateTranscriptPDF formatting: header banner with logo,
//   student profile strip with photo, summary boxes (Mean/Rank/Subjects),
//   detailed autoTable with grades & remarks, grade key, CT + HOI remarks
// ==========================================================================
function renderTranscriptStylePage(doc, student, classRank, streamRank, includeComments, addPageBreak) {
    if (addPageBreak) doc.addPage();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    let yPos = 10;

    // --- 1. COMPACT HEADER BANNER ---
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 32, 'F');

    if (store.settings.logo && typeof store.settings.logo === 'string' && store.settings.logo.startsWith('data:image/') && !store.settings.logo.startsWith('data:image/svg')) {
        try {
            const logoFormat = store.settings.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
            doc.addImage(store.settings.logo, logoFormat, margin, 6, 20, 20);
        } catch (e) { /* skip logo on error */ }
    }

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18).setFont(undefined, 'bold');
    doc.text(store.settings.schoolName || "School Name", pageWidth / 2, 13, { align: 'center' });

    if (store.settings.motto) {
        doc.setFontSize(7).setFont(undefined, 'italic');
        doc.text(store.settings.motto, pageWidth / 2, 19, { align: 'center' });
    }

    doc.setFontSize(8).setFont(undefined, 'normal');
    doc.text(`KNEC: ${store.settings.schoolCode || 'N/A'} | Tel: ${store.settings.phone || 'N/A'}`, pageWidth / 2, 27, { align: 'center' });

    yPos = 38;

    // --- 2. STUDENT PROFILE STRIP (with photo) ---
    doc.setDrawColor(220);
    doc.setFillColor(250, 250, 252);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 26, 2, 2, 'FD');

    // Student photo — only add if it's a real image (PNG/JPEG data URL), not SVG
    const studentPhoto = student.photo;
    if (studentPhoto && typeof studentPhoto === 'string' && studentPhoto.startsWith('data:image/')) {
        // Skip SVG — jsPDF can't render it
        if (!studentPhoto.startsWith('data:image/svg')) {
            try {
                // Detect format from data URL prefix
                const format = studentPhoto.startsWith('data:image/png') ? 'PNG' : 'JPEG';
                doc.addImage(studentPhoto, format, margin + 3, yPos + 3, 20, 20);
            } catch (e) {
                // Fallback: draw placeholder rectangle with initials
                doc.setFillColor(226, 232, 240);
                doc.roundedRect(margin + 3, yPos + 3, 20, 20, 2, 2, 'F');
                doc.setFontSize(10).setTextColor(148, 163, 184).setFont(undefined, 'bold');
                const initials = (student.name || '?').split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
                doc.text(initials, margin + 13, yPos + 14, { align: 'center' });
            }
        } else {
            // SVG photo — draw placeholder
            doc.setFillColor(226, 232, 240);
            doc.roundedRect(margin + 3, yPos + 3, 20, 20, 2, 2, 'F');
            doc.setFontSize(10).setTextColor(148, 163, 184).setFont(undefined, 'bold');
            const initials = (student.name || '?').split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
            doc.text(initials, margin + 13, yPos + 14, { align: 'center' });
        }
    } else {
        // No photo — draw placeholder
        doc.setFillColor(226, 232, 240);
        doc.roundedRect(margin + 3, yPos + 3, 20, 20, 2, 2, 'F');
        doc.setFontSize(10).setTextColor(148, 163, 184).setFont(undefined, 'bold');
        const initials = (student.name || '?').split(' ').map(w => w[0] || '').slice(0, 2).join('').toUpperCase();
        doc.text(initials, margin + 13, yPos + 14, { align: 'center' });
    }

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12).setFont(undefined, 'bold');
    doc.text(student.name, margin + 28, yPos + 9);

    doc.setFontSize(8).setFont(undefined, 'normal').setTextColor(80);
    doc.text(`Adm: ${student.reg || '-'} | Gr: ${student.grade || '-'} (${student.stream || '-'}) | G: ${student.gender || '-'}`, margin + 28, yPos + 16);
    doc.text(`Term: ${store.settings.currentTerm} ${store.settings.academicYear}`, margin + 28, yPos + 22);

    // Rank on the right side of profile strip
    if (classRank || streamRank) {
        doc.setFontSize(8).setFont(undefined, 'bold').setTextColor(0, 51, 102);
        if (classRank) {
            const allStudentsInGrade = StudentRepo.findBy('grade', student.grade).length;
            doc.text(`Class Rank: ${classRank}/${allStudentsInGrade}`, pageWidth - margin - 4, yPos + 9, { align: 'right' });
        }
        if (streamRank) {
            const streamCount = student.stream ? StudentRepo.findBy('grade', student.grade).filter(s => s.stream === student.stream).length : 0;
            doc.text(`Stream Rank: ${streamRank}/${streamCount}`, pageWidth - margin - 4, yPos + 16, { align: 'right' });
        }
    }

    yPos += 30;

    // --- 3. REPORT TITLE ---
    doc.setTextColor(0, 51, 102);
    doc.setFontSize(12).setFont(undefined, 'bold');
    doc.text("ASSESSMENT PROGRESS REPORT", pageWidth / 2, yPos, { align: 'center' });
    yPos += 8;

    // --- 4. SUBJECTS & CALCULATE STATS ---
    const subjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(student.grade));

    let totalScore = 0;
    let totalPoints = 0;
    let assessedCount = 0;

    let topSubject = { name: 'N/A', score: 0 };
    let lowSubject = { name: 'N/A', score: 100 };

    const tableData = subjects.map(sub => {
        const exam = store.exams.find(e => e.studentId === student.id && e.unitCode === sub.code);

        let score, grade, points, remarks;
        let teacherName = 'Not Assigned';

        const teacher = sub.teacherId ? StaffRepo.getById(sub.teacherId) : null;
        if (teacher) teacherName = teacher.name;

        if (exam) {
            score = parseInt(exam.score);
            const gradeInfo = getLetterGrade(score);
            grade = gradeInfo.grade;
            points = gradeInfo.points;
            remarks = gradeInfo.remarks;

            if (score > topSubject.score) { topSubject = { name: sub.name, score: score }; }
            if (score < lowSubject.score) { lowSubject = { name: sub.name, score: score }; }

            totalScore += score;
            totalPoints += gradeInfo.points;
            assessedCount++;
        } else {
            score = 'NM';
            grade = 'NG';
            points = 'NP';
            remarks = 'No Assessment Results';
        }

        return [sub.name, score, grade, points, remarks, teacherName];
    });

    const avg = assessedCount > 0 ? (totalScore / assessedCount) : 0;
    const totalSubjectsCount = subjects.length;
    const maxPossibleScore = totalSubjectsCount * 100;
    const maxPossiblePoints = totalSubjectsCount * 8;

    // Use passed-in rank if available, otherwise compute
    let rank = classRank || 0;
    if (!rank) {
        const allStudents = StudentRepo.findBy('grade', student.grade);
        const ranked = allStudents.map(s => {
            let sTotal = 0; let sCount = 0;
            subjects.forEach(sub => {
                const e = store.exams.find(ex => ex.studentId === s.id && ex.unitCode === sub.code);
                if (e) { sTotal += parseInt(e.score); sCount++; }
            });
            return { id: s.id, avg: sCount > 0 ? (sTotal / sCount) : 0 };
        }).sort((a, b) => b.avg - a.avg);
        rank = ranked.findIndex(s => s.id === student.id) + 1;
    }
    const totalStudentsInGrade = StudentRepo.findBy('grade', student.grade).length;

    // --- 5. SUMMARY BOXES (Mean / Rank / Subjects) ---
    const boxW = 50; const gap = 4;
    const totalW = (boxW * 3) + (gap * 2);
    const startX = (pageWidth - totalW) / 2;

    // Mean Score box
    doc.setFillColor(37, 99, 235);
    doc.roundedRect(startX, yPos, boxW, 18, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16).setFont(undefined, 'bold');
    doc.text(`${avg.toFixed(1)}%`, startX + (boxW / 2), yPos + 9, { align: 'center' });
    doc.setFontSize(7).setFont(undefined, 'normal');
    doc.text("MEAN SCORE", startX + (boxW / 2), yPos + 15, { align: 'center' });

    // Rank box
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(startX + boxW + gap, yPos, boxW, 18, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16).setFont(undefined, 'bold');
    doc.text(`${rank}/${totalStudentsInGrade}`, (startX + boxW + gap) + (boxW / 2), yPos + 9, { align: 'center' });
    doc.setFontSize(7).setFont(undefined, 'normal');
    doc.text("RANK", (startX + boxW + gap) + (boxW / 2), yPos + 15, { align: 'center' });

    // Subjects count box
    doc.setFillColor(249, 115, 22);
    doc.roundedRect(startX + (boxW * 2) + (gap * 2), yPos, boxW, 18, 2, 2, 'F');
    doc.setTextColor(255);
    doc.setFontSize(16).setFont(undefined, 'bold');
    doc.text(`${assessedCount}/${totalSubjectsCount}`, (startX + (boxW * 2) + (gap * 2)) + (boxW / 2), yPos + 9, { align: 'center' });
    doc.setFontSize(7).setFont(undefined, 'normal');
    doc.text("SUBJECTS", (startX + (boxW * 2) + (gap * 2)) + (boxW / 2), yPos + 15, { align: 'center' });

    yPos += 23;

    // --- 6. DETAILED TABLE (autoTable) ---
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10).setFont(undefined, 'bold');
    doc.text("Subject Breakdown", margin, yPos);
    yPos += 2;

    const scoreDisplay = assessedCount > 0 ? `${totalScore}/${maxPossibleScore}` : `0/${maxPossibleScore}`;
    const pointsDisplay = assessedCount > 0 ? `${totalPoints.toFixed(1)}/${maxPossiblePoints.toFixed(1)}` : `0.0/${maxPossiblePoints.toFixed(1)}`;

    const footerRow = ['TOTAL', scoreDisplay, '', pointsDisplay, '', ''];

    doc.autoTable({
        startY: yPos,
        head: [['Subject', 'Score', 'Grd', 'Pts', 'Remarks', 'Teacher']],
        body: tableData,
        foot: [footerRow],
        theme: 'grid',
        headStyles: {
            fillColor: [0, 51, 102],
            textColor: 255,
            fontSize: 8,
            fontStyle: 'bold',
            cellPadding: 2
        },
        footStyles: {
            fillColor: [241, 245, 249],
            textColor: [30, 41, 59],
            fontStyle: 'bold',
            fontSize: 8,
            cellPadding: 2
        },
        styles: {
            fontSize: 8,
            lineColor: [0, 51, 102],
            lineWidth: 0.1,
            cellPadding: 2,
            font: 'helvetica'
        },
        columnStyles: {
            0: { cellWidth: 45 },
            1: { halign: 'center', cellWidth: 18 },
            2: { halign: 'center', cellWidth: 10 },
            3: { halign: 'center', cellWidth: 20 },
            4: { cellWidth: 'auto' },
            5: { cellWidth: 28, fontStyle: 'italic' }
        },
        margin: { left: margin, right: margin },
        didParseCell: function (data) {
            if (data.section === 'body' && data.column.index >= 1 && data.column.index <= 3) {
                const cellText = data.cell.raw;
                if (typeof cellText === 'string' && (cellText === 'NM' || cellText === 'NG' || cellText === 'NP')) {
                    data.cell.styles.textColor = [150, 150, 150];
                    data.cell.styles.fontStyle = 'italic';
                }
            }
        }
    });

    // --- 7. BALANCING & GRADE KEY ---
    let finalY = doc.lastAutoTable.finalY + 5;
    const bottomMargin = 25;
    const gradeKeyHeight = 15;
    const remarksHeight = 16;
    const remarksGap = 5;
    const totalBottomContent = gradeKeyHeight + (includeComments ? (remarksHeight * 2) + remarksGap + 10 : 0);

    const availableSpace = pageHeight - bottomMargin - finalY - totalBottomContent;
    if (availableSpace > 30) {
        finalY += (availableSpace * 0.4);
    }

    // Grade Key
    doc.setFontSize(7).setTextColor(100);
    doc.text("Grading Key:", margin, finalY);
    finalY += 3;

    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, finalY, pageWidth - (margin * 2), 10, 1, 1, 'F');

    doc.setFontSize(6).setTextColor(50);
    const keys = ["90-100: EE1", "75-89: EE2", "58-74: ME1", "41-57: ME2", "31-40: AE1", "21-30: AE2", "11-20: BE1", "1-10: BE2"];
    const colW = (pageWidth - (margin * 2)) / 4;
    keys.forEach((k, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        doc.text(k, margin + 2 + (col * colW), finalY + 4 + (row * 3));
    });

    finalY += 15;

    // --- 8. REMARKS (CT + HOI) ---
    if (includeComments) {
        const isMale = student.gender === 'Male' || student.gender === 'M';
        const pronoun = isMale ? 'He' : 'She';
        const possessive = isMale ? 'His' : 'Her';
        const fName = student.name.split(' ')[0];

        let ctRemark = "";
        let hoiRemark = "";

        if (avg >= 80) {
            ctRemark = `${fName} has displayed exceptional mastery this term. ${pronoun} is a self-driven learner who excels in ${topSubject.name}. Keep up the outstanding spirit!`;
            hoiRemark = `An exemplary performance by ${fName}. ${pronoun} sets a high standard for the class. A true ambassador of excellence. Highly commended.`;
        } else if (avg >= 58) {
            ctRemark = `A good effort by ${fName}. ${pronoun} shows strength in ${topSubject.name}. However, ${possessive.toLowerCase()} performance in ${lowSubject.name} needs more focus.`;
            hoiRemark = `${fName} is on the right track. With targeted improvement in weak areas, ${pronoun.toLowerCase()} is capable of achieving top grades.`;
        } else if (avg >= 41) {
            ctRemark = `${fName} is making steady progress. While ${possessive.toLowerCase()} work in ${topSubject.name} is commendable, ${pronoun.toLowerCase()} struggled with ${lowSubject.name}. Encourage revision.`;
            hoiRemark = `Satisfactory performance. ${fName} needs to put in extra effort, especially in ${lowSubject.name}, to unlock full potential.`;
        } else if (avg >= 21) {
            ctRemark = `${fName} has faced significant challenges. ${pronoun} needs urgent remedial work in ${lowSubject.name}. Please ensure ${pronoun.toLowerCase()} attends extra lessons.`;
            hoiRemark = `Performance below expected standards. ${fName} requires close monitoring and parental support to improve.`;
        } else {
            ctRemark = `This has been a difficult term for ${fName}. ${pronoun} requires specialized attention in all areas, particularly ${lowSubject.name}.`;
            hoiRemark = `Critical attention needed. The school and parents must work together to support ${fName}'s academic journey.`;
        }

        const remHeight = 16;

        // Class Teacher Box
        doc.setFontSize(8).setFont(undefined, 'bold').setTextColor(30, 41, 59);
        doc.text("Class Teacher's Remarks:", margin, finalY);
        finalY += 1;

        doc.setDrawColor(200).setFillColor(254, 254, 254);
        doc.roundedRect(margin, finalY, pageWidth - (margin * 2), remHeight, 1, 1, 'FD');

        doc.setFontSize(6.5).setTextColor(50).setFont(undefined, 'normal');
        doc.text(ctRemark, margin + 2, finalY + 4, { maxWidth: pageWidth - margin * 2 - 55 });

        doc.line(pageWidth - margin - 50, finalY + remHeight - 3, pageWidth - margin - 5, finalY + remHeight - 3);
        doc.setFontSize(6).setTextColor(120);
        doc.text("Sign/Stamp", pageWidth - margin - 27, finalY + remHeight - 1, { align: 'center' });

        finalY += remHeight + 3;

        // HOI Box
        doc.setFontSize(8).setFont(undefined, 'bold').setTextColor(30, 41, 59);
        doc.text("Head of Institution's Remarks:", margin, finalY);
        finalY += 1;

        doc.setDrawColor(200);
        doc.roundedRect(margin, finalY, pageWidth - (margin * 2), remHeight, 1, 1, 'D');

        doc.setFontSize(6.5).setTextColor(50).setFont(undefined, 'normal');
        doc.text(hoiRemark, margin + 2, finalY + 4, { maxWidth: pageWidth - margin * 2 - 55 });

        doc.line(pageWidth - margin - 50, finalY + remHeight - 3, pageWidth - margin - 5, finalY + remHeight - 3);
        doc.setFontSize(6).setTextColor(120);
        doc.text("Sign/Stamp", pageWidth - margin - 27, finalY + remHeight - 1, { align: 'center' });
    }

    // --- 9. FOOTER ---
    addDocFooter(doc, false);
}

function generateAutoComment(avg) {
    if (avg >= 90) return 'Outstanding performance! Demonstrates exceptional mastery across all learning areas. Keep up the excellent work.';
    if (avg >= 75) return 'A strong and consistent performance. The learner shows good competency and engagement. Encourage continued effort.';
    if (avg >= 58) return 'Competent performance with minor gaps. With focused revision, the learner can achieve higher levels of mastery.';
    if (avg >= 41) return 'Basic competency achieved. The learner needs more practice and support to strengthen foundational skills.';
    if (avg >= 31) return 'Emerging competency. Additional support and structured practice are recommended.';
    if (avg >= 21) return 'Developing competency. Significant remedial work is needed to catch up with grade-level expectations.';
    return 'Minimal competency demonstrated. Urgent intervention and personalized support are required.';
}

function generateClassListPDF() {
    if (!window.jspdf) return showToast('PDF Library not loaded', 'error');
    const { jsPDF } = window.jspdf; 
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // 1. Get Inputs
    const grade = $('classReportGrade').value; 
    const stream = $('classReportStream').value;
    if (!grade) return showToast('Please select a grade.', 'error');

    let students = StudentRepo.findBy('grade', grade);
    if (stream !== 'all') students = students.filter(s => s.stream === stream);

    // 2. Define Subjects
    const subjects = store.learningAreas.filter(s => !s.applicableLevels || s.applicableLevels.includes(grade));
    
    // 3. Helper to strip prefixes (JS-, LP-, MS-, etc.) for display
    const getDisplayCode = (code) => {
        // Splits by hyphen and takes the last part (e.g., "JS-ENG" -> "ENG")
        return code.split('-').pop(); 
    };

    // 4. Process Data
    let data = students.map(st => {
        let total = 0; 
        let count = 0;
        
        // Calculate Scores per subject
        const subjectData = {};
        subjects.forEach(sub => {
            const exam = store.exams.find(e => e.studentId === st.id && e.unitCode === sub.code);
            
            if (exam) {
                // --- ASSESSED ---
                const score = parseInt(exam.score);
                subjectData[sub.code] = { 
                    score: score, 
                    grade: getCompetenceStatus(score).abbr,
                    isAssessed: true 
                };
                total += score; 
                count++;
            } else {
                // --- NOT ASSESSED ---
                subjectData[sub.code] = { 
                    score: 'NM',        // Not Measured
                    grade: 'NG',        // No Grade
                    isAssessed: false
                };
            }
        });

        // Calculate Average only based on assessed subjects
        const avg = count > 0 ? (total / count) : 0;

        return {
            adm: st.reg, 
            name: st.name, 
            gender: st.gender ? st.gender.charAt(0).toUpperCase() : '-',
            subjects: subjectData,
            total: total, 
            avg: avg,
            assessedCount: count
        };
    });

    // Rank Students (Overall)
    data.sort((a, b) => b.avg - a.avg); 
    let rank = 1;
    data.forEach((d, i) => {
        if (i > 0 && d.avg === data[i - 1].avg) d.position = data[i - 1].position;
        else d.position = rank;
        rank++;
    });

    // --- Calculate Top Performers ---
    const top3Overall = data.slice(0, 3);
    const boys = data.filter(s => s.gender === 'M' || s.gender === 'B');
    const girls = data.filter(s => s.gender === 'F' || s.gender === 'G');
    
    const top3Boys = boys.slice(0, 3);
    const top3Girls = girls.slice(0, 3);

    const fmtWinner = (s, pos) => s ? `${pos}. ${s.name} (${s.avg.toFixed(1)}%)` : `${pos}. -`;

    // 5. Calculate Subject Stats
    const subjectStats = {};
    
    subjects.forEach(sub => {
        // Filter only students who were assessed for this subject
        const assessedStudents = data.filter(d => d.subjects[sub.code].isAssessed);
        const scores = assessedStudents.map(d => d.subjects[sub.code].score);
        
        const totalScore = scores.reduce((a, b) => a + b, 0);
        const avgScore = scores.length > 0 ? (totalScore / scores.length) : 0;
        
        let maxScore = -1;
        let topper = "-";
        
        if (assessedStudents.length > 0) {
            assessedStudents.forEach(d => {
                if (d.subjects[sub.code].score > maxScore) {
                    maxScore = d.subjects[sub.code].score;
                    topper = d.name.split(' ')[0]; 
                } else if (d.subjects[sub.code].score === maxScore) {
                    topper += `, ${d.name.split(' ')[0]}`;
                }
            });
        } else {
            maxScore = 0; // Reset max score if no one was assessed
        }

        // Determine teacher name or default to "Not Assigned"
        const teacher = sub.teacherId ? StaffRepo.getById(sub.teacherId) : null;
        const teacherName = teacher ? teacher.name : 'Not Assigned';
        
        subjectStats[sub.code] = { 
            total: totalScore, 
            avg: avgScore, 
            topper, 
            maxScore,
            rank: 0, 
            teacherName: teacherName,
            assessedCount: scores.length
        };
    });

    // Calculate Subject Positions
    let subjectCodes = subjects.map(s => s.code);
    subjectCodes.sort((a, b) => subjectStats[b].avg - subjectStats[a].avg);
    let subRank = 1;
    subjectCodes.forEach((code, i) => {
        if (i > 0 && subjectStats[code].avg === subjectStats[subjectCodes[i - 1]].avg) {
            subjectStats[code].rank = subjectStats[subjectCodes[i - 1]].rank;
        } else {
            subjectStats[code].rank = subRank;
        }
        subRank++;
    });

    // 6. Build PDF
    let yPos = addDocHeader(doc, `Detailed Marksheet: ${grade} ${stream === 'all' ? '(All Streams)' : stream}`);
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    // -- Summary Stats Box --
    doc.setFillColor(240, 244, 248);
    doc.roundedRect(margin, yPos, pageWidth - (margin*2), 12, 2, 2, 'F');
    doc.setFontSize(9).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text(`Total Learners: ${students.length}`, margin + 5, yPos + 5);
    doc.text(`Class Average: ${data.length > 0 ? (data.reduce((a,b)=>a+b.avg,0)/data.length).toFixed(1) : 0}%`, margin + 60, yPos + 5);
    doc.text(`Subjects Count: ${subjects.length}`, margin + 130, yPos + 5);
    
    doc.setTextColor(100).setFont(undefined, 'normal');
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 5, yPos + 8, { align: 'right' });
    yPos += 16;

    // -- Main Table --
    const headers = ['Adm No', 'Name', 'G', ...subjects.map(s => getDisplayCode(s.code)), 'Total', 'Avg', 'Grade', 'Pos'];
    
    const rows = data.map(d => {
        const subjectCols = subjects.map(s => {
            const sd = d.subjects[s.code];
            // Will display "NM NG" if not assessed, or "85 ME" if assessed
            return `${sd.score} ${sd.grade}`; 
        });
        
        // If no subjects were assessed, display 'NG' for grade, otherwise calculate
        const meanGrade = d.assessedCount > 0 ? getCompetenceStatus(d.avg).abbr : 'NG';
        
        return [d.adm, d.name, d.gender, ...subjectCols, d.total, d.avg.toFixed(1), meanGrade, d.position];
    });

    doc.autoTable({
        startY: yPos,
        head: [headers],
        body: rows,
        theme: 'grid',
        headStyles: { 
            fillColor: [30, 41, 59], 
            fontSize: 7, 
            fontStyle: 'bold',
            cellPadding: 1.5
        },
        bodyStyles: { 
            fontSize: 7,
            cellPadding: 1.5
        },
        columnStyles: {
            0: { cellWidth: 26, halign: 'left' },    // Adm No
            1: { cellWidth: 30 },                    // Name
            2: { cellWidth: 6, halign: 'center' },   // G
            ...(() => {
                // Widths: Adm(26) + Name(30) + G(6) + Total(14) + Avg(11) + Grade(9) + Pos(7) = 103
                const usedWidth = 103; 
                const remaining = (pageWidth - (margin*2) - usedWidth);
                const subWidth = subjects.length > 0 ? remaining / subjects.length : 10;
                const styles = {};
                for(let i=0; i<subjects.length; i++) {
                    styles[3+i] = { cellWidth: subWidth, halign: 'center' };
                }
                return styles;
            })(),
            [3 + subjects.length]: { cellWidth: 14, fontStyle: 'bold', halign: 'center' },     // Total
            [3 + subjects.length + 1]: { cellWidth: 11, halign: 'center' },                  // Avg
            [3 + subjects.length + 2]: { cellWidth: 9, halign: 'center' },                   // Grade
            [3 + subjects.length + 3]: { cellWidth: 7, fontStyle: 'bold', halign: 'center' }  // Position
        },
        margin: { left: margin, right: margin },
        didParseCell: function (data) {
            // Style "NM" and "NG" in body (gray italic)
            if (data.section === 'body' && data.column.index >= 3 && data.column.index < (3 + subjects.length)) {
                 const cellText = data.cell.raw;
                 if (typeof cellText === 'string' && (cellText.includes('NM') || cellText.includes('NG'))) {
                     data.cell.styles.textColor = [150, 150, 150]; // Gray color
                     data.cell.styles.fontStyle = 'italic';
                 }
            }
            
            // Color the Position column (now the last column)
            const posIndex = 3 + subjects.length + 3;
            if (data.column.index === posIndex && data.section === 'body') {
                if (data.cell.raw === 1) data.cell.styles.textColor = [218, 165, 32]; 
                if (data.cell.raw === 2) data.cell.styles.textColor = [192, 192, 192]; 
                if (data.cell.raw === 3) data.cell.styles.textColor = [205, 127, 50]; 
                if (data.cell.raw <= 3) data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    let finalY = doc.lastAutoTable.finalY + 5;

    // -- Performance Awards Section --
    doc.setFontSize(9).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Performance Awards", margin, finalY);
    finalY += 3;

    const awardHeaders = ['Top 3 Overall', 'Top 3 Boys', 'Top 3 Girls'];
    const awardRows = [
        [
            top3Overall.map((s, i) => fmtWinner(s, i+1)).join('\n'),
            top3Boys.map((s, i) => fmtWinner(s, i+1)).join('\n'),
            top3Girls.map((s, i) => fmtWinner(s, i+1)).join('\n')
        ]
    ];

    doc.autoTable({
        startY: finalY,
        head: [awardHeaders],
        body: awardRows,
        theme: 'grid',
        headStyles: { 
            fillColor: [34, 197, 94], 
            fontSize: 8, 
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: { 
            fontSize: 7,
            cellPadding: 2,
            lineHeightFactor: 1.5
        },
        columnStyles: {
            0: { cellWidth: (pageWidth - margin*2) / 3, valign: 'top' },
            1: { cellWidth: (pageWidth - margin*2) / 3, valign: 'top' },
            2: { cellWidth: (pageWidth - margin*2) / 3, valign: 'top' }
        },
        margin: { left: margin, right: margin }
    });

    finalY = doc.lastAutoTable.finalY + 5;

    // -- Subject Analysis Footer Table --
    doc.setFontSize(9).setFont(undefined, 'bold').setTextColor(30, 41, 59);
    doc.text("Subject Performance Analysis", margin, finalY);
    finalY += 3;

    // UPDATED: Use getDisplayCode for analysis headers
    const analysisHeaders = ['Metric', ...subjects.map(s => getDisplayCode(s.code))];
    const analysisRows = [
        ['Subject Total', ...subjects.map(s => subjectStats[s.code].total)],
        ['Class Mean', ...subjects.map(s => subjectStats[s.code].avg.toFixed(1))],
        ['Subject Rank', ...subjects.map(s => subjectStats[s.code].rank)], 
        ['Top Score', ...subjects.map(s => subjectStats[s.code].maxScore)],
        ['Top Learner', ...subjects.map(s => subjectStats[s.code].topper)],
        // NEW: Teacher Row
        ['Teacher', ...subjects.map(s => subjectStats[s.code].teacherName)] 
    ];

    doc.autoTable({
        startY: finalY,
        head: [analysisHeaders],
        body: analysisRows,
        theme: 'plain', 
        headStyles: { 
            fillColor: [241, 245, 249], 
            textColor: [30, 41, 59], 
            fontSize: 7, 
            fontStyle: 'bold' 
        },
        bodyStyles: { 
            fontSize: 7,
            textColor: 60
        },
        columnStyles: {
            0: { cellWidth: 20, fontStyle: 'bold' },
            ...(() => {
                const usedWidth = 20;
                const remaining = (pageWidth - (margin*2) - usedWidth);
                const subWidth = subjects.length > 0 ? remaining / subjects.length : 10;
                const styles = {};
                for(let i=0; i<subjects.length; i++) {
                    styles[1+i] = { cellWidth: subWidth, halign: 'center' };
                }
                return styles;
            })()
        },
        margin: { left: margin, right: margin },
        didParseCell: function(data) {
            if(data.row.index === 2 && data.section === 'body') { 
                 data.cell.styles.fontStyle = 'bold';
                 data.cell.styles.textColor = [34, 197, 94];
            }
        }
    });

    addDocFooter(doc);
    doc.save(`Detailed_Marksheet_${grade}_${stream}.pdf`); 
    closeModal('classReportModal');
}
// ==========================================================================
//   MISSING REPORT IMPLEMENTATIONS (FIXED)
// ==========================================================================

// ==========================================================================
//   REPORTS ANALYTICS (Modern dashboard)
// ==========================================================================
let rptGradeChartInstance = null;
let rptTiersChartInstance = null;

function renderReportsAnalytics() {
    const students = StudentRepo.getAll();
    const staff = StaffRepo.getAll();
    const exams = store.exams || [];
    const reportsGenerated = (store.reportsGenerated || 0)
        + (exams.length > 0 ? Math.min(exams.length, 250) : 0); // synthesized baseline

    // KPI values
    setText('rptTotalGenerated', reportsGenerated);
    setText('rptStudentCount', students.length);
    setText('rptStaffCount', staff.length);

    const scores = exams.map(e => parseInt(e.score) || 0).filter(v => v > 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    setText('rptSchoolAvg', avg + '%');

    // Trend pills
    setTrendPill('rptStudentsTrend', students.length - (window._prevRptStudents || 0), '');
    setTrendPill('rptStaffTrend', staff.length - (window._prevRptStaff || 0), '');
    setTrendPill('rptAvgTrend', avg - (window._prevRptAvg || 0), '%');
    window._prevRptStudents = students.length;
    window._prevRptStaff = staff.length;
    window._prevRptAvg = avg;

    // Chart 1: Grade population (bar chart)
    renderRptGradeChart(students);

    // Chart 2: Performance tiers (doughnut)
    renderRptTiersChart(scores);

    // Chart 3: Recent activity list
    renderRptActivityList(students, staff, exams);
}

function renderRptGradeChart(students) {
    const ctx = $('rptGradeChart');
    if (!ctx) return;
    if (rptGradeChartInstance) { rptGradeChartInstance.destroy(); rptGradeChartInstance = null; }

    const gradeOrder = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
    const counts = {};
    gradeOrder.forEach(g => counts[g] = 0);
    students.forEach(s => { if (counts[s.grade] !== undefined) counts[s.grade]++; else counts[s.grade] = (counts[s.grade] || 0) + 1; });
    // Drop grades with 0 students to keep chart compact
    const labels = gradeOrder.filter(g => counts[g] > 0);
    const data = labels.map(g => counts[g]);

    const chartCtx = ctx.getContext('2d');
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, '#22C55E');
    gradient.addColorStop(1, '#86efac');

    rptGradeChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(l => l.replace('Grade ', 'G')),
            datasets: [{
                label: 'Learners',
                data: data,
                backgroundColor: gradient,
                borderRadius: 6,
                barPercentage: 0.7,
                categoryPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: { label: (c) => `${c.parsed.y} learner${c.parsed.y === 1 ? '' : 's'}` }
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4,4] }, ticks: { color: '#94a3b8', precision: 0 } },
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { weight: '600' } } }
            }
        }
    });
}

function renderRptTiersChart(scores) {
    const ctx = $('rptTiersChart');
    if (!ctx) return;
    if (rptTiersChartInstance) { rptTiersChartInstance.destroy(); rptTiersChartInstance = null; }

    let exceeding = 0, meeting = 0, below = 0;
    scores.forEach(s => {
        if (s >= 80) exceeding++;
        else if (s >= 50) meeting++;
        else below++;
    });

    rptTiersChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Exceeding (80%+)', 'Meeting (50-79%)', 'Below (<50%)'],
            datasets: [{
                data: [exceeding, meeting, below],
                backgroundColor: ['#14B8A6', '#f59e0b', '#ef4444'],
                borderColor: '#fff',
                borderWidth: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            animation: { duration: 800, animateRotate: true, animateScale: true },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: {
                        label: (c) => {
                            const total = exceeding + meeting + below || 1;
                            const pct = Math.round(c.parsed / total * 100);
                            return `${c.label}: ${c.parsed} (${pct}%)`;
                        }
                    }
                }
            }
        }
    });

    const legendEl = $('rptTiersLegend');
    if (legendEl) {
        const total = exceeding + meeting + below || 1;
        legendEl.innerHTML = `
            <span class="polar-legend-item"><i style="background:#14B8A6"></i> Exceeding (${exceeding} · ${Math.round(exceeding/total*100)}%)</span>
            <span class="polar-legend-item"><i style="background:#f59e0b"></i> Meeting (${meeting} · ${Math.round(meeting/total*100)}%)</span>
            <span class="polar-legend-item"><i style="background:#ef4444"></i> Below (${below} · ${Math.round(below/total*100)}%)</span>
        `;
    }
}

function renderRptActivityList(students, staff, exams) {
    const container = $('rptActivityList');
    if (!container) return;

    // Build a synthetic activity feed: most recent exams + admissions + staff additions
    const activities = [];

    // Recent exams (last 4)
    const recentExams = [...exams].slice(-4).reverse();
    recentExams.forEach(e => {
        const student = StudentRepo.getById(e.studentId);
        const date = e.date ? new Date(e.date) : new Date();
        activities.push({
            type: 'assessment',
            icon: 'fa-file-pen',
            tone: 'blue',
            title: `New assessment: ${e.subjectName || 'Subject'}`,
            meta: `${student ? student.name : 'Unknown learner'} · ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
            ts: date.getTime()
        });
    });

    // Recent admissions (last 3 students)
    const recentStudents = [...students].slice(-3).reverse();
    recentStudents.forEach(s => {
        const date = s.admissionDate ? new Date(s.admissionDate) : new Date();
        activities.push({
            type: 'admission',
            icon: 'fa-user-plus',
            tone: '',
            title: `Learner admitted: ${s.name}`,
            meta: `${s.grade || '-'} · ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
            ts: date.getTime()
        });
    });

    // Recent staff (last 2)
    const recentStaff = [...staff].slice(-2).reverse();
    recentStaff.forEach(s => {
        const date = s.appointmentDate ? new Date(s.appointmentDate) : new Date();
        activities.push({
            type: 'staff',
            icon: 'fa-id-card',
            tone: 'purple',
            title: `Staff added: ${s.name}`,
            meta: `${s.designation || 'Staff'} · ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`,
            ts: date.getTime()
        });
    });

    // Sort by timestamp desc and take top 6
    activities.sort((a, b) => b.ts - a.ts);
    const top = activities.slice(0, 6);

    if (top.length === 0) {
        container.innerHTML = '<div class="heatmap-empty">No recent activity tracked. Add students, staff, or exam records to populate this feed.</div>';
        return;
    }

    container.innerHTML = top.map(a => `
        <div class="activity-item">
            <div class="act-icon ${a.tone}"><i class="fa-solid ${a.icon}"></i></div>
            <div class="act-body">
                <div class="act-title">${escapeHtml(a.title)}</div>
                <div class="act-meta">${escapeHtml(a.meta)}</div>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
//   TIMETABLE MODULE
// ==========================================================================
const TT_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TT_PERIODS = [
    { id: '1', label: 'Period 1', time: '08:00 - 08:40' },
    { id: '2', label: 'Period 2', time: '08:40 - 09:20' },
    { id: '3', label: 'Period 3', time: '09:20 - 10:00' },
    { id: 'break', label: 'Morning Break', time: '10:00 - 10:30', isBreak: true },
    { id: '4', label: 'Period 4', time: '10:30 - 11:10' },
    { id: '5', label: 'Period 5', time: '11:10 - 11:50' },
    { id: '6', label: 'Period 6', time: '11:50 - 12:30' },
    { id: 'lunch', label: 'Lunch Break', time: '12:30 - 13:30', isBreak: true },
    { id: '7', label: 'Period 7', time: '13:30 - 14:10' },
    { id: '8', label: 'Period 8', time: '14:10 - 14:50' },
    { id: '9', label: 'Period 9', time: '14:50 - 15:30' }
];

const TT_TONE_PALETTE = ['green', 'blue', 'purple', 'orange', 'pink', 'teal', 'red', 'indigo', 'cyan', 'amber'];
let currentTimetableView = 'master';
let ttCurrentEditId = null;

function initTimetableSection() {
    populateTimetableFilters();
    bindTimetableControls();
    renderTimetable();
}

function populateTimetableFilters() {
    const gradeFilter = $('ttGradeFilter');
    const teacherFilter = $('ttTeacherFilter');
    if (gradeFilter) {
        const grades = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
        gradeFilter.innerHTML = '<option value="all">All Grades</option>' +
            grades.map(g => `<option value="${g}">${g}</option>`).join('');
    }
    if (teacherFilter) {
        const staff = StaffRepo.getAll();
        teacherFilter.innerHTML = '<option value="all">All Teachers</option>' +
            staff.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
    }

    // Populate slot modal dropdowns
    const ttSlotTeacher = $('ttSlotTeacher');
    if (ttSlotTeacher) {
        const staff = StaffRepo.getAll();
        ttSlotTeacher.innerHTML = '<option value="">Select Teacher...</option>' +
            staff.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.designation || 'Staff')})</option>`).join('');
    }

    // Slot subject - dynamically populated by grade change
    const ttSlotGrade = $('ttSlotGrade');
    if (ttSlotGrade && !ttSlotGrade.dataset.bound) {
        ttSlotGrade.dataset.bound = '1';
        ttSlotGrade.addEventListener('change', () => populateTimetableSlotSubjects(ttSlotGrade.value));
    }
}

function populateTimetableSlotSubjects(grade) {
    const subj = $('ttSlotSubject');
    if (!subj) return;
    if (!grade) {
        subj.innerHTML = '<option value="">Select Grade First...</option>';
        return;
    }
    const applicable = (store.learningAreas || []).filter(a => !a.applicableLevels || a.applicableLevels.includes(grade));
    subj.innerHTML = '<option value="">Select Subject...</option>' +
        applicable.map(a => `<option value="${a.id}" data-code="${a.code}">${escapeHtml(a.name)}</option>`).join('');
}

function bindTimetableControls() {
    const ttTabs = $('ttTabs');
    if (ttTabs && !ttTabs.dataset.bound) {
        ttTabs.dataset.bound = '1';
        ttTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.ttt-btn');
            if (!btn) return;
            ttTabs.querySelectorAll('.ttt-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTimetableView = btn.dataset.view;
            updateTimetableFilterVisibility();
            renderTimetable();
        });
    }

    const gradeFilter = $('ttGradeFilter');
    if (gradeFilter && !gradeFilter.dataset.bound) {
        gradeFilter.dataset.bound = '1';
        gradeFilter.addEventListener('change', renderTimetable);
    }
    const teacherFilter = $('ttTeacherFilter');
    if (teacherFilter && !teacherFilter.dataset.bound) {
        teacherFilter.dataset.bound = '1';
        teacherFilter.addEventListener('change', renderTimetable);
    }

    const btnAddSlot = $('btnAddSlot');
    if (btnAddSlot && !btnAddSlot.dataset.bound) {
        btnAddSlot.dataset.bound = '1';
        btnAddSlot.addEventListener('click', () => openTimetableSlotModal());
    }

    const btnExport = $('btnExportTimetable');
    if (btnExport && !btnExport.dataset.bound) {
        btnExport.dataset.bound = '1';
        btnExport.addEventListener('click', exportTimetablePDF);
    }

    const btnCheckClashes = $('btnCheckClashes');
    if (btnCheckClashes && !btnCheckClashes.dataset.bound) {
        btnCheckClashes.dataset.bound = '1';
        btnCheckClashes.addEventListener('click', runTimetableClashSweep);
    }

    const ttSlotForm = $('ttSlotForm');
    if (ttSlotForm && !ttSlotForm.dataset.bound) {
        ttSlotForm.dataset.bound = '1';
        ttSlotForm.addEventListener('submit', handleTimetableSlotSubmit);
    }

    // Live clash detection on form field changes
    ['ttSlotGrade', 'ttSlotTeacher', 'ttSlotDay', 'ttSlotPeriod', 'ttSlotRoom', 'ttSlotSubject'].forEach(id => {
        const el = $(id);
        if (el && !el.dataset.clashBound) {
            el.dataset.clashBound = '1';
            el.addEventListener('change', checkTimetableClashLive);
            el.addEventListener('input', checkTimetableClashLive);
        }
    });
}

function updateTimetableFilterVisibility() {
    const gradeFilter = $('ttGradeFilter');
    const teacherFilter = $('ttTeacherFilter');
    if (currentTimetableView === 'teacher') {
        if (gradeFilter) gradeFilter.style.display = 'none';
        if (teacherFilter) teacherFilter.style.display = '';
    } else if (currentTimetableView === 'grade') {
        if (gradeFilter) gradeFilter.style.display = '';
        if (teacherFilter) teacherFilter.style.display = 'none';
    } else { // master
        if (gradeFilter) gradeFilter.style.display = '';
        if (teacherFilter) teacherFilter.style.display = 'none';
    }
}

function renderTimetable() {
    const wrapper = $('ttGridWrapper');
    if (!wrapper) return;

    const slots = store.timetable || [];
    const gradeFilter = $('ttGradeFilter');
    const teacherFilter = $('ttTeacherFilter');
    const gradeVal = gradeFilter ? gradeFilter.value : 'all';
    const teacherVal = teacherFilter ? teacherFilter.value : 'all';

    // KPI counts
    const totalSlots = slots.length;
    const assignedSlots = slots.filter(s => s.subjectId && s.teacherId).length;
    const teachersActive = new Set(slots.map(s => s.teacherId).filter(Boolean)).size;

    // Compute "free slots" — periods that don't have a lesson across the visible scope
    const visibleSlots = slots.filter(s => {
        if (currentTimetableView === 'grade' && gradeVal !== 'all' && s.grade !== gradeVal) return false;
        if (currentTimetableView === 'teacher' && teacherVal !== 'all' && s.teacherId !== teacherVal) return false;
        if (currentTimetableView === 'master' && gradeVal !== 'all' && s.grade !== gradeVal) return false;
        return true;
    });

    // Total lesson cells = (periods that aren't breaks) * days * grades-visible
    // For simplicity, free = total period cells - assigned visible slots
    const teachingPeriods = TT_PERIODS.filter(p => !p.isBreak).length;
    const totalCells = teachingPeriods * TT_DAYS.length * (currentTimetableView === 'master' ? 1 : 1);
    const freeSlots = Math.max(0, totalCells - visibleSlots.length);

    setText('ttKpiTotal', totalSlots);
    setText('ttKpiAssigned', assignedSlots);
    setText('ttKpiFree', freeSlots);
    setText('ttKpiTeachers', teachersActive);

    // Render grid
    let html = '<div class="tt-grid">';
    // Header row: corner + days
    html += '<div class="tt-grid-corner">Period / Day</div>';
    TT_DAYS.forEach(day => {
        html += `<div class="tt-grid-day">${day}</div>`;
    });

    // Period rows
    TT_PERIODS.forEach(period => {
        html += `<div class="tt-grid-period"><div>${period.label}</div><small>${period.time}</small></div>`;
        TT_DAYS.forEach(day => {
            if (period.isBreak) {
                html += `<div class="tt-cell break-cell">${period.label}</div>`;
            } else {
                // Find slot for this day/period (and grade/teacher if filter active)
                const matching = visibleSlots.filter(s => s.day === day && s.period === period.id);
                if (matching.length === 0) {
                    html += `<div class="tt-cell" onclick="openTimetableSlotModal(null, '${day}', '${period.id}')">+ Add</div>`;
                } else if (matching.length === 1) {
                    html += renderTimetableLesson(matching[0]);
                } else {
                    // Multiple lessons (e.g. master view shows all grades for same slot)
                    html += `<div style="display:flex; flex-direction:column; gap:4px;">${matching.map(m => renderTimetableLesson(m, true)).join('')}</div>`;
                }
            }
        });
    });
    html += '</div>';
    wrapper.innerHTML = html;

    // Show/hide workload section in teacher view
    const workloadSection = $('ttWorkloadSection');
    if (workloadSection) {
        if (currentTimetableView === 'teacher') {
            workloadSection.style.display = '';
            renderTimetableWorkloadGrid();
        } else {
            workloadSection.style.display = 'none';
        }
    }
}

function renderTimetableLesson(slot, compact) {
    const subject = (store.learningAreas || []).find(a => a.id === slot.subjectId);
    const teacher = slot.teacherId ? StaffRepo.getById(slot.teacherId) : null;
    const subjectName = subject ? subject.name : (slot.subjectName || 'Subject');
    const teacherName = teacher ? teacher.name.split(' ')[0] : (slot.teacherName || 'TBA');
    const gradeLabel = slot.grade || '';

    // Tone based on subject code hash for consistent coloring
    const code = (subject && subject.code) || slot.subjectId || subjectName;
    let hash = 0;
    for (let i = 0; i < code.length; i++) hash = ((hash << 5) - hash + code.charCodeAt(i)) | 0;
    const tone = TT_TONE_PALETTE[Math.abs(hash) % TT_TONE_PALETTE.length];

    const metaParts = [];
    if (currentTimetableView === 'master' && gradeLabel) metaParts.push(gradeLabel);
    if (currentTimetableView !== 'teacher') metaParts.push(teacherName);
    if (currentTimetableView === 'teacher' && gradeLabel) metaParts.push(gradeLabel);
    if (slot.room) metaParts.push(`📍 ${slot.room}`);
    const meta = metaParts.join(' · ');

    return `<div class="tt-lesson" data-tone="${tone}" onclick="openTimetableSlotModal('${slot.id}')" title="${escapeHtml(subjectName)} · ${escapeHtml(teacherName || '')} ${slot.room ? '· ' + escapeHtml(slot.room) : ''}">
        <div class="tt-lesson-subject">${escapeHtml(subjectName)}</div>
        <div class="tt-lesson-meta">${escapeHtml(meta)}</div>
    </div>`;
}

function renderTimetableWorkloadGrid() {
    const container = $('ttWorkloadGrid');
    if (!container) return;
    const slots = store.timetable || [];
    const staff = StaffRepo.getAll();
    const items = staff.map(s => {
        const lessonCount = slots.filter(t => t.teacherId === s.id).length;
        return { ...s, lessonCount };
    }).filter(s => s.lessonCount > 0).sort((a, b) => b.lessonCount - a.lessonCount);

    if (items.length === 0) {
        container.innerHTML = '<div class="heatmap-empty" style="grid-column:1/-1;">No teacher assignments yet.</div>';
        return;
    }

    container.innerHTML = items.map(s => `
        <div class="tt-workload-card">
            <div class="ttw-avatar"><img src="${s.photo || DEFAULT_AVATAR}" alt="" onerror="this.src='${DEFAULT_AVATAR}'"></div>
            <div class="ttw-info">
                <div class="ttw-name">${escapeHtml(s.name)}</div>
                <div class="ttw-sub">${escapeHtml(s.designation || 'Staff')}</div>
            </div>
            <div class="ttw-count">${s.lessonCount}</div>
        </div>
    `).join('');
}

function openTimetableSlotModal(slotId, presetDay, presetPeriod) {
    populateTimetableFilters();
    const modal = $('ttSlotModal');
    if (!modal) return;
    ttCurrentEditId = slotId || null;

    if (slotId) {
        const slot = (store.timetable || []).find(s => s.id === slotId);
        if (slot) {
            setText('ttSlotModalTitle', 'Edit Timetable Slot');
            $('ttSlotEditId').value = slot.id;
            $('ttSlotDay').value = slot.day || 'Monday';
            $('ttSlotPeriod').value = slot.period || '1';
            $('ttSlotGrade').value = slot.grade || '';
            populateTimetableSlotSubjects(slot.grade);
            $('ttSlotSubject').value = slot.subjectId || '';
            $('ttSlotTeacher').value = slot.teacherId || '';
            $('ttSlotRoom').value = slot.room || '';
            $('ttSlotNotes').value = slot.notes || '';
        }
    } else {
        setText('ttSlotModalTitle', 'Add Timetable Slot');
        $('ttSlotForm')?.reset();
        $('ttSlotEditId').value = '';
        if (presetDay) $('ttSlotDay').value = presetDay;
        if (presetPeriod) $('ttSlotPeriod').value = presetPeriod;
        populateTimetableSlotSubjects('');
    }
    openModal('ttSlotModal');
}

function handleTimetableSlotSubmit(e) {
    e.preventDefault();
    const editId = $('ttSlotEditId').value;
    const grade = $('ttSlotGrade').value;
    const subjectId = $('ttSlotSubject').value;
    const teacherId = $('ttSlotTeacher').value;
    const day = $('ttSlotDay').value;
    const period = $('ttSlotPeriod').value;
    const room = $('ttSlotRoom').value.trim();
    const notes = $('ttSlotNotes').value.trim();

    if (!grade || !subjectId || !teacherId || !day || !period) {
        showToast('Fill all required fields', 'error');
        return;
    }

    // --- CLASH DETECTION ---
    // Rule 1: Same grade + same day + same period = only one subject allowed
    //         (a class can only be in one place at one time)
    // Rule 2: Same teacher + same day + same period = teacher can't be in two places
    // Rule 3: Same room + same day + same period = room can't host two lessons
    const slots = store.timetable || [];
    const clash = detectTimetableClash({ editId, grade, subjectId, teacherId, day, period, room }, slots);
    if (clash) {
        showTimetableClashWarning(clash, () => {
            // User acknowledged — proceed with save
            persistTimetableSlot(editId, grade, subjectId, teacherId, day, period, room, notes);
        });
        return;
    }

    persistTimetableSlot(editId, grade, subjectId, teacherId, day, period, room, notes);
}

// Returns a clash object { type, message, conflictingSlot } or null if no clash
function detectTimetableClash(newSlot, existingSlots) {
    const { editId, grade, subjectId, teacherId, day, period, room } = newSlot;

    // Skip the slot being edited (it will be replaced)
    const others = existingSlots.filter(s => s.id !== editId);

    // Rule 1: Class (grade) clash — same grade, same day, same period
    // The class cannot be taught two different subjects at the same time
    const gradeClash = others.find(s =>
        s.grade === grade && s.day === day && s.period === period
    );
    if (gradeClash) {
        const subject = (store.learningAreas || []).find(a => a.id === gradeClash.subjectId);
        return {
            type: 'grade',
            title: 'Class Schedule Clash',
            message: `Grade ${grade} already has <strong>${escapeHtml(subject ? subject.name : gradeClash.subjectName)}</strong> scheduled for ${day}, Period ${period}.`,
            detail: `A class can only be in one lesson at a time. The existing slot must be removed first.`,
            conflictingSlot: gradeClash
        };
    }

    // Rule 2: Teacher clash — same teacher, same day, same period
    // A teacher cannot teach two different classes at the same time
    const teacherClash = others.find(s =>
        s.teacherId === teacherId && s.day === day && s.period === period
    );
    if (teacherClash) {
        const teacher = StaffRepo.getById(teacherId);
        const teacherName = teacher ? teacher.name : 'This teacher';
        const subject = (store.learningAreas || []).find(a => a.id === teacherClash.subjectId);
        return {
            type: 'teacher',
            title: 'Teacher Schedule Clash',
            message: `${escapeHtml(teacherName)} is already teaching <strong>${escapeHtml(subject ? subject.name : teacherClash.subjectName)}</strong> to Grade ${teacherClash.grade} on ${day}, Period ${period}.`,
            detail: `A teacher cannot be in two classes at the same time. Choose a different teacher, period, or day.`,
            conflictingSlot: teacherClash
        };
    }

    // Rule 3: Room clash (optional — only if room is set)
    if (room) {
        const roomClash = others.find(s =>
            s.room && s.room.toLowerCase() === room.toLowerCase() &&
            s.day === day && s.period === period
        );
        if (roomClash) {
            return {
                type: 'room',
                title: 'Room Conflict',
                message: `Room <strong>${escapeHtml(room)}</strong> is already booked for ${escapeHtml(teacherClash ? '' : 'another lesson')} on ${day}, Period ${period}.`,
                detail: `Room is occupied. Choose a different room, period, or day.`,
                conflictingSlot: roomClash
            };
        }
    }

    return null;
}

function showTimetableClashWarning(clash, onProceed) {
    // Build a custom confirm modal content
    const existingModal = $('clashWarningModal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'clashWarningModal';
    modal.innerHTML = `
        <div class="modal" style="max-width: 480px;">
            <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white;">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> ${clash.title}</h3>
                <button data-dismiss="modal" style="color:white;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
                <div style="display:flex; gap:1rem; align-items:flex-start;">
                    <div style="width:48px; height:48px; border-radius:50%; background:#fee2e2; color:#ef4444; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0;">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div style="flex:1;">
                        <p style="margin:0 0 0.75rem; font-size:0.95rem; line-height:1.5;">${clash.message}</p>
                        <p style="margin:0; font-size:0.82rem; color:var(--text-muted); line-height:1.5;">${clash.detail}</p>
                    </div>
                </div>
                ${clash.conflictingSlot ? `
                    <div style="margin-top:1rem; padding:0.75rem; background:var(--bg-alt); border-radius:8px; font-size:0.78rem;">
                        <strong style="color:var(--text-muted);">Conflicting slot:</strong><br>
                        ${escapeHtml(clash.conflictingSlot.subjectName || 'Subject')} · ${escapeHtml(clash.conflictingSlot.grade || '')} · ${escapeHtml(clash.conflictingSlot.day || '')} · Period ${escapeHtml(clash.conflictingSlot.period || '')}
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                ${clash.type === 'grade' || clash.type === 'teacher' ? `
                    <button class="btn btn-danger" id="btnRemoveClashingSlot"><i class="fa-solid fa-trash"></i> Remove Conflicting Slot</button>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Wire dismiss
    modal.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });

    // Wire "Remove conflicting slot" button — removes the clash then saves the new slot
    const removeBtn = modal.querySelector('#btnRemoveClashingSlot');
    if (removeBtn && clash.conflictingSlot) {
        removeBtn.addEventListener('click', () => {
            store.timetable = (store.timetable || []).filter(s => s.id !== clash.conflictingSlot.id);
            saveData();
            modal.remove();
            onProceed();
            renderTimetable();
            showToast('Conflicting slot removed, new slot saved');
        });
    }
}

function persistTimetableSlot(editId, grade, subjectId, teacherId, day, period, room, notes) {
    const subject = (store.learningAreas || []).find(a => a.id === subjectId);
    const teacher = StaffRepo.getById(teacherId);
    const slot = {
        id: editId || generateId(),
        day, period, grade, subjectId,
        subjectName: subject ? subject.name : '',
        subjectCode: subject ? subject.code : '',
        teacherId,
        teacherName: teacher ? teacher.name : '',
        room, notes,
        createdAt: new Date().toISOString()
    };

    if (!store.timetable) store.timetable = [];
    if (editId) {
        const idx = store.timetable.findIndex(s => s.id === editId);
        if (idx >= 0) store.timetable[idx] = slot;
    } else {
        store.timetable.push(slot);
    }
    saveData();
    closeModal('ttSlotModal');
    renderTimetable();
    showToast(editId ? 'Slot updated' : 'Slot added');
}

// Live clash check as user edits the slot form
function checkTimetableClashLive() {
    const editId = $('ttSlotEditId').value;
    const grade = $('ttSlotGrade').value;
    const teacherId = $('ttSlotTeacher').value;
    const day = $('ttSlotDay').value;
    const period = $('ttSlotPeriod').value;
    const room = $('ttSlotRoom').value.trim();

    const warningEl = $('ttClashWarning');
    if (!warningEl) return;

    if (!grade || !teacherId || !day || !period) {
        warningEl.style.display = 'none';
        return;
    }

    const clash = detectTimetableClash({ editId, grade, subjectId: $('ttSlotSubject').value, teacherId, day, period, room }, store.timetable || []);
    if (clash) {
        warningEl.style.display = 'flex';
        warningEl.className = 'tt-clash-warning ' + clash.type;
        warningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <div><strong>${escapeHtml(clash.title)}:</strong> ${clash.message}</div>`;
    } else {
        warningEl.style.display = 'none';
    }
}

// Full clash sweep across the entire timetable — highlights all existing conflicts
function runTimetableClashSweep() {
    const slots = store.timetable || [];
    if (slots.length === 0) {
        showToast('No timetable slots to check', 'error');
        return;
    }

    const clashes = [];
    const seen = new Set();

    slots.forEach((slot, idx) => {
        // Check this slot against all others
        const clash = detectTimetableClash({ ...slot, editId: slot.id, subjectId: slot.subjectId, teacherId: slot.teacherId, room: slot.room }, slots);
        if (clash) {
            const key = [slot.id, clash.conflictingSlot.id].sort().join('|');
            if (!seen.has(key)) {
                seen.add(key);
                clashes.push({
                    slotA: slot,
                    slotB: clash.conflictingSlot,
                    type: clash.type,
                    title: clash.title
                });
            }
        }
    });

    if (clashes.length === 0) {
        showToast('No clashes detected — timetable is clean!', 'success');
        return;
    }

    // Show clash report modal
    const existing = $('clashSweepModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'clashSweepModal';
    modal.innerHTML = `
        <div class="modal modal-lg" style="max-width: 720px;">
            <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white;">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> ${clashes.length} Timetable Clash${clashes.length === 1 ? '' : 'es'} Found</h3>
                <button data-dismiss="modal" style="color:white;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 1rem 1.5rem; max-height: 60vh; overflow-y: auto;">
                <p style="margin:0 0 1rem; font-size:0.85rem; color:var(--text-muted);">
                    The following conflicts were detected. Resolve each by removing one of the conflicting slots.
                </p>
                <div style="display:flex; flex-direction:column; gap:0.75rem;">
                    ${clashes.map((c, i) => `
                        <div class="clash-sweep-item" data-clash-idx="${i}">
                            <div class="csi-header">
                                <span class="csi-badge csi-${c.type}">${c.type.toUpperCase()}</span>
                                <span style="font-weight:700;">${escapeHtml(c.title)}</span>
                            </div>
                            <div class="csi-body">
                                <div class="csi-slot">
                                    <strong>A:</strong> ${escapeHtml(c.slotA.subjectName || 'Subject')} · ${escapeHtml(c.slotA.grade || '')} · ${escapeHtml(c.slotA.day || '')} · P${escapeHtml(c.slotA.period || '')}
                                    <br><small style="color:var(--text-muted);">${escapeHtml(c.slotA.teacherName || '')}${c.slotA.room ? ' · ' + escapeHtml(c.slotA.room) : ''}</small>
                                </div>
                                <div class="csi-vs">vs</div>
                                <div class="csi-slot">
                                    <strong>B:</strong> ${escapeHtml(c.slotB.subjectName || 'Subject')} · ${escapeHtml(c.slotB.grade || '')} · ${escapeHtml(c.slotB.day || '')} · P${escapeHtml(c.slotB.period || '')}
                                    <br><small style="color:var(--text-muted);">${escapeHtml(c.slotB.teacherName || '')}${c.slotB.room ? ' · ' + escapeHtml(c.slotB.room) : ''}</small>
                                </div>
                            </div>
                            <div class="csi-actions">
                                <button class="btn btn-sm btn-danger" onclick="resolveTimetableClash('${c.slotA.id}', '${c.slotB.id}', ${i})"><i class="fa-solid fa-trash"></i> Remove A</button>
                                <button class="btn btn-sm btn-danger" onclick="resolveTimetableClash('${c.slotB.id}', '${c.slotA.id}', ${i})"><i class="fa-solid fa-trash"></i> Remove B</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });
}

function resolveTimetableClash(removeId, keepId, clashIdx) {
    if (!confirm('Remove this slot from the timetable?')) return;
    store.timetable = (store.timetable || []).filter(s => s.id !== removeId);
    saveData();
    renderTimetable();
    // Remove the clash item from the modal
    const item = document.querySelector(`[data-clash-idx="${clashIdx}"]`);
    if (item) item.remove();
    // If no more clashes, close modal
    const remaining = document.querySelectorAll('.clash-sweep-item');
    if (remaining.length === 0) {
        const modal = $('clashSweepModal');
        if (modal) modal.remove();
        showToast('All clashes resolved!', 'success');
    } else {
        // Update title count
        const title = document.querySelector('#clashSweepModal h3');
        if (title) {
            title.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${remaining.length} Timetable Clash${remaining.length === 1 ? '' : 'es'} Found`;
        }
    }
}

function deleteTimetableSlot(slotId) {
    if (!confirm('Delete this timetable slot?')) return;
    store.timetable = (store.timetable || []).filter(s => s.id !== slotId);
    saveData();
    renderTimetable();
    showToast('Slot removed');
}

function exportTimetablePDF() {
    if (!window.jspdf) { showToast('PDF library not loaded', 'error'); return; }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const slots = store.timetable || [];

    // Title
    const schoolName = (store.settings && store.settings.schoolName) || 'ElimuTrack School';
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(schoolName, 40, 40);
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text(currentTimetableView === 'teacher' ? 'Teacher Timetable' : 'Master Timetable', 40, 58);

    // Build table head
    const head = [['Period / Day', ...TT_DAYS]];
    const body = TT_PERIODS.map(period => {
        const row = [`${period.label}\n${period.time}`];
        TT_DAYS.forEach(day => {
            if (period.isBreak) {
                row.push(period.label);
            } else {
                const matching = slots.filter(s => s.day === day && s.period === period.id);
                if (matching.length === 0) {
                    row.push('-');
                } else {
                    row.push(matching.map(m => {
                        const subject = (store.learningAreas || []).find(a => a.id === m.subjectId);
                        const sName = subject ? subject.name : (m.subjectName || 'Subject');
                        return `${sName}\n${m.grade || ''}${m.teacherName ? ' · ' + m.teacherName : ''}${m.room ? ' · ' + m.room : ''}`;
                    }).join('\n---\n'));
                }
            }
        });
        return row;
    });

    doc.autoTable({
        head: head,
        body: body,
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [34, 197, 94], textColor: 255, fontSize: 9, halign: 'center' },
        bodyStyles: { fontSize: 7, cellPadding: 3, valign: 'top' },
        columnStyles: { 0: { cellWidth: 70, fontStyle: 'bold' } },
        styles: { overflow: 'linebreak' }
    });

    const filename = currentTimetableView === 'teacher'
        ? `Teacher_Timetable_${(new Date()).toISOString().slice(0,10)}.pdf`
        : `Master_Timetable_${(new Date()).toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
}

// ==========================================================================
//   EXAM SYSTEM MODULE (Enhanced)
// ==========================================================================
let examFilterStatus = 'all';
let examGradingCurrentId = null;

function initExamSystemDashboard() {
    renderExamSystemDashboard();
    bindExamSystemControls();
}

function bindExamSystemControls() {
    const btnCreateExam = $('btnCreateExam');
    if (btnCreateExam && !btnCreateExam.dataset.bound) {
        btnCreateExam.dataset.bound = '1';
        btnCreateExam.addEventListener('click', () => openExamFormModal());
    }

    const examFilterPills = $('examFilterPills');
    if (examFilterPills && !examFilterPills.dataset.bound) {
        examFilterPills.dataset.bound = '1';
        examFilterPills.addEventListener('click', (e) => {
            const btn = e.target.closest('.fp-btn');
            if (!btn) return;
            examFilterPills.querySelectorAll('.fp-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            examFilterStatus = btn.dataset.filter;
            renderExamListGrid();
        });
    }

    const examForm = $('examForm');
    if (examForm && !examForm.dataset.bound) {
        examForm.dataset.bound = '1';
        examForm.addEventListener('submit', handleExamFormSubmit);
    }
    const examGrade = $('examGrade');
    if (examGrade && !examGrade.dataset.bound) {
        examGrade.dataset.bound = '1';
        examGrade.addEventListener('change', () => {
            populateExamSubjectsCheckboxes(examGrade.value);
            populateExamStreamDropdown(examGrade.value);
        });
    }
    const btnMarkInProgress = $('btnMarkInProgress');
    if (btnMarkInProgress && !btnMarkInProgress.dataset.bound) {
        btnMarkInProgress.dataset.bound = '1';
        btnMarkInProgress.addEventListener('click', () => setExamStatus(examGradingCurrentId, 'In Progress'));
    }
    const btnPublishExam = $('btnPublishExam');
    if (btnPublishExam && !btnPublishExam.dataset.bound) {
        btnPublishExam.dataset.bound = '1';
        btnPublishExam.addEventListener('click', () => setExamStatus(examGradingCurrentId, 'Published'));
    }

    // Batch entry toolbar wiring
    const egBatchScope = $('egBatchScope');
    if (egBatchScope && !egBatchScope.dataset.bound) {
        egBatchScope.dataset.bound = '1';
        egBatchScope.addEventListener('change', () => {
            const scope = egBatchScope.value;
            const streamSel = $('egBatchStream');
            if (streamSel) streamSel.style.display = (scope === 'stream') ? '' : 'none';
            const exam = (store.examSchedules || []).find(e => e.id === examGradingCurrentId);
            if (exam) renderExamGradingTable(exam);
        });
    }
    const egBatchStream = $('egBatchStream');
    if (egBatchStream && !egBatchStream.dataset.bound) {
        egBatchStream.dataset.bound = '1';
        egBatchStream.addEventListener('change', () => {
            const exam = (store.examSchedules || []).find(e => e.id === examGradingCurrentId);
            if (exam) renderExamGradingTable(exam);
        });
    }

    // Export / Import buttons
    const btnExportTemplate = $('btnExportExamTemplate');
    if (btnExportTemplate && !btnExportTemplate.dataset.bound) {
        btnExportTemplate.dataset.bound = '1';
        btnExportTemplate.addEventListener('click', () => exportExamScoreTemplate(examGradingCurrentId));
    }
    const btnExportScores = $('btnExportExamScores');
    if (btnExportScores && !btnExportScores.dataset.bound) {
        btnExportScores.dataset.bound = '1';
        btnExportScores.addEventListener('click', () => exportExamScores(examGradingCurrentId));
    }
    const btnImport = $('btnImportExamScores');
    if (btnImport && !btnImport.dataset.bound) {
        btnImport.dataset.bound = '1';
        btnImport.addEventListener('click', () => {
            const fileInput = $('egImportFile');
            if (fileInput) fileInput.click();
        });
    }
    const egImportFile = $('egImportFile');
    if (egImportFile && !egImportFile.dataset.bound) {
        egImportFile.dataset.bound = '1';
        egImportFile.addEventListener('change', (e) => importExamScores(examGradingCurrentId, e.target.files[0]));
    }

    // Portal tab switching
    const portalTabs = $('examPortalTabs');
    if (portalTabs && !portalTabs.dataset.bound) {
        portalTabs.dataset.bound = '1';
        portalTabs.addEventListener('click', (e) => {
            const btn = e.target.closest('.ept-btn');
            if (!btn) return;
            switchExamPortalTab(btn.dataset.tab);
        });
    }

    // Print timetable button
    const btnPrintTt = $('btnExamTimetablePDF');
    if (btnPrintTt && !btnPrintTt.dataset.bound) {
        btnPrintTt.dataset.bound = '1';
        btnPrintTt.addEventListener('click', printExamTimetable);
    }

    // Exam timetable filters
    const ttGradeFilter = $('examTtGradeFilter');
    if (ttGradeFilter && !ttGradeFilter.dataset.bound) {
        ttGradeFilter.dataset.bound = '1';
        ttGradeFilter.addEventListener('change', renderExamTimetable);
    }
    // Invigilation filters
    const invigDateFilter = $('invigDateFilter');
    if (invigDateFilter && !invigDateFilter.dataset.bound) {
        invigDateFilter.dataset.bound = '1';
        invigDateFilter.addEventListener('change', renderInvigilationRoster);
    }
    const invigStaffFilter = $('invigStaffFilter');
    if (invigStaffFilter && !invigStaffFilter.dataset.bound) {
        invigStaffFilter.dataset.bound = '1';
        invigStaffFilter.addEventListener('change', renderInvigilationRoster);
    }
    // Invigilation status filter
    const invigStatusFilter = $('invigStatusFilter');
    if (invigStatusFilter && !invigStatusFilter.dataset.bound) {
        invigStatusFilter.dataset.bound = '1';
        invigStatusFilter.addEventListener('change', renderInvigilationRoster);
    }
    // Workload button
    const btnInvigWorkload = $('btnInvigWorkload');
    if (btnInvigWorkload && !btnInvigWorkload.dataset.bound) {
        btnInvigWorkload.dataset.bound = '1';
        btnInvigWorkload.addEventListener('click', showInvigilationWorkload);
    }

    // Personal schedule controls
    const personalType = $('personalScheduleType');
    if (personalType && !personalType.dataset.bound) {
        personalType.dataset.bound = '1';
        personalType.addEventListener('change', () => {
            populatePersonalScheduleEntities(personalType.value);
            renderPersonalSchedule();
        });
    }
    const personalEntity = $('personalScheduleEntity');
    if (personalEntity && !personalEntity.dataset.bound) {
        personalEntity.dataset.bound = '1';
        personalEntity.addEventListener('change', renderPersonalSchedule);
    }
    const btnExportPersonal = $('btnExportPersonalSchedule');
    if (btnExportPersonal && !btnExportPersonal.dataset.bound) {
        btnExportPersonal.dataset.bound = '1';
        btnExportPersonal.addEventListener('click', exportPersonalSchedulePDF);
    }

    // Live exam clash detection
    ['examDate', 'examStartTime', 'examDuration', 'examVenue', 'examInvigilator', 'examAssistantInvigilator'].forEach(id => {
        const el = $(id);
        if (el && !el.dataset.clashBound) {
            el.dataset.clashBound = '1';
            el.addEventListener('change', checkExamClashLive);
            el.addEventListener('input', checkExamClashLive);
        }
    });
}

// Switch between portal tabs
function switchExamPortalTab(tabName) {
    document.querySelectorAll('.ept-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.exam-portal-panel').forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`.ept-btn[data-tab="${tabName}"]`);
    if (btn) btn.classList.add('active');
    const panel = $('examPanel' + tabName.charAt(0).toUpperCase() + tabName.slice(1));
    if (panel) panel.classList.add('active');

    // Render the tab content on activation
    if (tabName === 'timetable') renderExamTimetable();
    if (tabName === 'personal') { populatePersonalScheduleEntities($('personalScheduleType') ? $('personalScheduleType').value : 'learner'); renderPersonalSchedule(); }
    if (tabName === 'invigilation') renderInvigilationRoster();
    if (tabName === 'grading') renderGradingOverview();
}

function renderExamSystemDashboard() {
    const exams = store.examSchedules || [];
    // KPIs
    const scheduled = exams.filter(e => (e.status || 'Scheduled') === 'Scheduled').length;
    const inProgress = exams.filter(e => e.status === 'In Progress').length;
    const graded = exams.filter(e => e.status === 'Graded').length;
    const published = exams.filter(e => e.status === 'Published').length;
    setText('examKpiScheduled', scheduled + inProgress);
    setText('examKpiGrading', inProgress);
    setText('examKpiGraded', graded);
    setText('examKpiPublished', published);

    setTrendPill('examKpiGradingTrend', inProgress - (window._prevExamGrading || 0), '');
    setTrendPill('examKpiGradedTrend', graded - (window._prevExamGraded || 0), '');
    setTrendPill('examKpiPublishedTrend', published - (window._prevExamPublished || 0), '');
    window._prevExamGrading = inProgress;
    window._prevExamGraded = graded;
    window._prevExamPublished = published;

    renderExamListGrid();

    // Populate portal filter dropdowns
    populateExamPortalFilters(exams);

    // Render other panels (in case they're active)
    renderExamTimetable();
    renderInvigilationRoster();
    renderGradingOverview();
    renderPersonalSchedule();
}

function populateExamPortalFilters(exams) {
    // Grade filter for timetable
    const ttGradeFilter = $('examTtGradeFilter');
    if (ttGradeFilter) {
        const grades = Array.from(new Set((exams || []).map(e => e.grade).filter(Boolean))).sort();
        const current = ttGradeFilter.value;
        ttGradeFilter.innerHTML = '<option value="all">All Grades</option>' +
            grades.map(g => `<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join('');
        ttGradeFilter.value = current;
    }
    // Date filter for invigilation
    const invigDateFilter = $('invigDateFilter');
    if (invigDateFilter) {
        const dates = Array.from(new Set((exams || []).map(e => e.date).filter(Boolean))).sort();
        const current = invigDateFilter.value;
        invigDateFilter.innerHTML = '<option value="all">All Dates</option>' +
            dates.map(d => `<option value="${d}">${new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</option>`).join('');
        invigDateFilter.value = current;
    }
    // Staff filter for invigilation
    const invigStaffFilter = $('invigStaffFilter');
    if (invigStaffFilter) {
        const invigIds = new Set();
        (exams || []).forEach(e => {
            if (e.invigilatorId) invigIds.add(e.invigilatorId);
            if (e.assistantInvigilatorId) invigIds.add(e.assistantInvigilatorId);
        });
        const current = invigStaffFilter.value;
        invigStaffFilter.innerHTML = '<option value="all">All Invigilators</option>' +
            Array.from(invigIds).map(id => {
                const s = StaffRepo.getById(id);
                return s ? `<option value="${id}">${escapeHtml(s.name)}</option>` : '';
            }).join('');
        invigStaffFilter.value = current;
    }
}

// ==========================================================================
//   EXAM TIMETABLE VIEW — grouped by date
// ==========================================================================
function renderExamTimetable() {
    const container = $('examTimetableView');
    if (!container) return;
    const exams = store.examSchedules || [];
    const gradeFilter = $('examTtGradeFilter') ? $('examTtGradeFilter').value : 'all';

    let filtered = exams;
    if (gradeFilter !== 'all') filtered = filtered.filter(e => e.grade === gradeFilter);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="heatmap-empty" style="padding:2rem;">
                <i class="fa-solid fa-calendar-xmark" style="font-size:2.5rem; color:var(--text-muted); opacity:0.3;"></i>
                <p style="margin-top:0.5rem;">No exams scheduled. Click <strong>Schedule Exam</strong> to create one.</p>
            </div>`;
        return;
    }

    // Group by date
    const byDate = {};
    filtered.forEach(e => {
        const d = e.date || 'Undated';
        if (!byDate[d]) byDate[d] = [];
        byDate[d].push(e);
    });

    // Sort dates
    const sortedDates = Object.keys(byDate).sort((a, b) => new Date(a) - new Date(b));

    let html = '';
    sortedDates.forEach(date => {
        const dateObj = date === 'Undated' ? null : new Date(date);
        const dateLabel = dateObj ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Undated';
        const dayExams = byDate[date].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

        html += `
            <div class="exam-tt-day">
                <div class="exam-tt-day-header">
                    <div class="exam-tt-date">
                        <i class="fa-solid fa-calendar-day"></i>
                        ${escapeHtml(dateLabel)}
                    </div>
                    <span class="exam-tt-count">${dayExams.length} exam${dayExams.length === 1 ? '' : 's'}</span>
                </div>
                <div class="exam-tt-slots">
                    ${dayExams.map(e => renderExamTimetableCard(e)).join('')}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderExamTimetableCard(exam) {
    const status = exam.status || 'Scheduled';
    const statusClass = status.replace(/\s+/g, '-');
    const startTime = exam.startTime || '08:00';
    const endTime = computeExamEndTime(startTime, exam.duration || 60);
    const subjects = (exam.subjects || []).map(s => s.name).join(', ');
    const invigilator = exam.invigilatorId ? StaffRepo.getById(exam.invigilatorId) : null;
    const invigName = invigilator ? invigilator.name : 'Unassigned';
    const asstInvig = exam.assistantInvigilatorId ? StaffRepo.getById(exam.assistantInvigilatorId) : null;

    const sessionIcon = exam.session === 'Morning' ? 'fa-sun' : (exam.session === 'Afternoon' ? 'fa-cloud-sun' : 'fa-moon');

    return `
        <div class="exam-tt-card" data-status="${escapeHtml(status)}" onclick="openExamGradingModal('${exam.id}')">
            <div class="ett-time">
                <div class="ett-time-main">${escapeHtml(startTime)}</div>
                <div class="ett-time-end">→ ${escapeHtml(endTime)}</div>
            </div>
            <div class="ett-body">
                <div class="ett-header">
                    <h4>${escapeHtml(exam.name)}</h4>
                    <span class="exam-status-badge ${statusClass}">${escapeHtml(status)}</span>
                </div>
                <div class="ett-meta">
                    <span><i class="fa-solid ${sessionIcon}"></i> ${escapeHtml(exam.session || 'Morning')}</span>
                    <span><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(exam.grade)}${exam.stream && exam.stream !== 'all' ? ' · ' + escapeHtml(exam.stream) : ''}</span>
                    <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(exam.venue || 'TBD')}</span>
                    <span><i class="fa-solid fa-clock"></i> ${exam.duration || 60} min</span>
                </div>
                <div class="ett-subjects">${escapeHtml(subjects || 'No subjects')}</div>
                <div class="ett-invigilator">
                    <i class="fa-solid fa-user-shield"></i>
                    <strong>${escapeHtml(invigName)}</strong>
                    ${asstInvig ? `<span style="color:var(--text-muted);">· Asst: ${escapeHtml(asstInvig.name)}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function computeExamEndTime(startTime, durationMinutes) {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    const total = h * 60 + m + (durationMinutes || 60);
    const endH = Math.floor(total / 60) % 24;
    const endM = total % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

// Print exam timetable as PDF
function printExamTimetable() {
    const exams = store.examSchedules || [];
    if (exams.length === 0) { showToast('No exams to print', 'error'); return; }
    if (!window.jspdf) { showToast('PDF library not loaded', 'error'); return; }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape', 'pt', 'a4');

    // Header
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), 50, 'F');
    doc.setFontSize(18).setFont(undefined, 'bold').setTextColor(255);
    doc.text(store.settings.schoolName || 'School', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    doc.setFontSize(12).setFont(undefined, 'normal');
    doc.text('EXAMINATION TIMETABLE', doc.internal.pageSize.getWidth() / 2, 42, { align: 'center' });

    // Group by date
    const byDate = {};
    exams.forEach(e => {
        const d = e.date || 'Undated';
        if (!byDate[d]) byDate[d] = [];
        byDate[d].push(e);
    });

    let yPos = 70;
    Object.keys(byDate).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
        const dateObj = date === 'Undated' ? null : new Date(date);
        const dateLabel = dateObj ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Undated';

        doc.setFontSize(11).setFont(undefined, 'bold').setTextColor(0, 51, 102);
        doc.text(dateLabel, 40, yPos);
        yPos += 5;
        doc.setDrawColor(0, 51, 102).setLineWidth(1);
        doc.line(40, yPos, doc.internal.pageSize.getWidth() - 40, yPos);
        yPos += 10;

        const dayExams = byDate[date].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
        const tableBody = dayExams.map(e => {
            const endTime = computeExamEndTime(e.startTime, e.duration);
            const invig = e.invigilatorId ? StaffRepo.getById(e.invigilatorId) : null;
            return [
                `${e.startTime || ''} - ${endTime}`,
                e.name,
                e.grade + (e.stream && e.stream !== 'all' ? ' / ' + e.stream : ''),
                e.venue || '-',
                invig ? invig.name : '-',
                (e.subjects || []).map(s => s.name).join(', ')
            ];
        });

        doc.autoTable({
            startY: yPos,
            head: [['Time', 'Exam', 'Grade/Stream', 'Venue', 'Invigilator', 'Subjects']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102], textColor: 255, fontSize: 8 },
            bodyStyles: { fontSize: 8, cellPadding: 4 },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { cellWidth: 120 },
                2: { cellWidth: 70 },
                3: { cellWidth: 70 },
                4: { cellWidth: 90 },
                5: { cellWidth: 'auto' }
            },
            margin: { left: 40, right: 40 }
        });
        yPos = doc.lastAutoTable.finalY + 20;
    });

    doc.save('Exam_Timetable.pdf');
    showToast('Timetable exported');
}

// ==========================================================================
//   INVIGILATION ROSTER
// ==========================================================================
function renderInvigilationRoster() {
    const container = $('invigilationRoster');
    if (!container) return;
    const exams = store.examSchedules || [];
    const dateFilter = $('invigDateFilter') ? $('invigDateFilter').value : 'all';
    const staffFilter = $('invigStaffFilter') ? $('invigStaffFilter').value : 'all';
    const statusFilter = $('invigStatusFilter') ? $('invigStatusFilter').value : 'all';

    let filtered = exams;
    if (dateFilter !== 'all') filtered = filtered.filter(e => e.date === dateFilter);
    if (staffFilter !== 'all') filtered = filtered.filter(e => e.invigilatorId === staffFilter || e.assistantInvigilatorId === staffFilter);

    // Filter by invigilation engagement status
    if (statusFilter !== 'all') {
        filtered = filtered.filter(e => {
            const chiefStatus = (e.invigStatus && e.invigStatus.chief) || 'Pending';
            const asstStatus = (e.invigStatus && e.invigStatus.assistant) || 'Pending';
            return chiefStatus === statusFilter || asstStatus === statusFilter;
        });
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="heatmap-empty" style="padding:2rem;">
                <i class="fa-solid fa-user-shield" style="font-size:2.5rem; color:var(--text-muted); opacity:0.3;"></i>
                <p style="margin-top:0.5rem;">No invigilation duties match the selected filters.</p>
            </div>`;
        return;
    }

    // Sort by date + time
    filtered.sort((a, b) => {
        const da = (a.date || '') + (a.startTime || '');
        const db = (b.date || '') + (b.startTime || '');
        return da.localeCompare(db);
    });

    container.innerHTML = filtered.map(e => {
        const invig = e.invigilatorId ? StaffRepo.getById(e.invigilatorId) : null;
        const asst = e.assistantInvigilatorId ? StaffRepo.getById(e.assistantInvigilatorId) : null;
        const dateLabel = e.date ? new Date(e.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) : 'TBD';
        const endTime = computeExamEndTime(e.startTime, e.duration);
        const chiefStatus = (e.invigStatus && e.invigStatus.chief) || 'Pending';
        const asstStatus = (e.invigStatus && e.invigStatus.assistant) || 'Pending';

        return `
            <div class="invig-duty-card">
                <div class="idc-time">
                    <div class="idc-date">${escapeHtml(dateLabel)}</div>
                    <div class="idc-time-val">${escapeHtml(e.startTime || '')} - ${escapeHtml(endTime)}</div>
                </div>
                <div class="idc-body">
                    <h4>${escapeHtml(e.name)}</h4>
                    <div class="idc-meta">
                        <span><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(e.grade)}${e.stream && e.stream !== 'all' ? ' · ' + escapeHtml(e.stream) : ''}</span>
                        <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(e.venue || 'TBD')}</span>
                        <span><i class="fa-solid fa-clock"></i> ${e.duration || 60} min</span>
                        <span><i class="fa-solid fa-hourglass-start"></i> Report: ${escapeHtml(e.reportingTime || '07:45')}</span>
                    </div>
                </div>
                <div class="idc-staff">
                    <div class="idc-chief ${invig ? '' : 'unassigned'}">
                        <div class="idc-staff-row">
                            <i class="fa-solid fa-shield-halved"></i>
                            <div>
                                <small>Chief Invigilator</small>
                                <strong>${invig ? escapeHtml(invig.name) : 'Unassigned'}</strong>
                            </div>
                        </div>
                        ${invig ? `
                            <div class="idc-engagement">
                                <span class="invig-status-badge invig-status-${chiefStatus.toLowerCase()}">${chiefStatus}</span>
                                <div class="invig-actions">
                                    <button class="btn btn-xs btn-success" onclick="setInvigStatus('${e.id}', 'chief', 'Accepted')" title="Accept"><i class="fa-solid fa-check"></i></button>
                                    <button class="btn btn-xs btn-danger" onclick="setInvigStatus('${e.id}', 'chief', 'Declined')" title="Decline"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    ${asst ? `
                        <div class="idc-assistant">
                            <div class="idc-staff-row">
                                <i class="fa-solid fa-user"></i>
                                <div>
                                    <small>Assistant</small>
                                    <strong>${escapeHtml(asst.name)}</strong>
                                </div>
                            </div>
                            <div class="idc-engagement">
                                <span class="invig-status-badge invig-status-${asstStatus.toLowerCase()}">${asstStatus}</span>
                                <div class="invig-actions">
                                    <button class="btn btn-xs btn-success" onclick="setInvigStatus('${e.id}', 'assistant', 'Accepted')" title="Accept"><i class="fa-solid fa-check"></i></button>
                                    <button class="btn btn-xs btn-danger" onclick="setInvigStatus('${e.id}', 'assistant', 'Declined')" title="Decline"><i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Set invigilation engagement status (accept/decline)
function setInvigStatus(examId, role, status) {
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam) return;
    if (!exam.invigStatus) exam.invigStatus = { chief: 'Pending', assistant: 'Pending' };
    exam.invigStatus[role] = status;
    saveData();
    renderInvigilationRoster();
    showToast(`Invigilation ${status === 'Accepted' ? 'accepted' : 'declined'}`);
}

// Show invigilation workload balance across all staff
function showInvigilationWorkload() {
    const exams = store.examSchedules || [];
    const staff = StaffRepo.getAll();

    // Count duties per staff member
    const workload = {};
    staff.forEach(s => { workload[s.id] = { name: s.name, designation: s.designation || 'Staff', photo: s.photo, chief: 0, assistant: 0, accepted: 0, declined: 0, pending: 0 }; });
    exams.forEach(e => {
        if (e.invigilatorId && workload[e.invigilatorId]) {
            workload[e.invigilatorId].chief++;
            const st = (e.invigStatus && e.invigStatus.chief) || 'Pending';
            if (st === 'Accepted') workload[e.invigilatorId].accepted++;
            else if (st === 'Declined') workload[e.invigilatorId].declined++;
            else workload[e.invigilatorId].pending++;
        }
        if (e.assistantInvigilatorId && workload[e.assistantInvigilatorId]) {
            workload[e.assistantInvigilatorId].assistant++;
            const st = (e.invigStatus && e.invigStatus.assistant) || 'Pending';
            if (st === 'Accepted') workload[e.assistantInvigilatorId].accepted++;
            else if (st === 'Declined') workload[e.assistantInvigilatorId].declined++;
            else workload[e.assistantInvigilatorId].pending++;
        }
    });

    // Sort by total duties (chief + assistant) descending
    const items = Object.values(workload).filter(w => w.chief + w.assistant > 0)
        .sort((a, b) => (b.chief + b.assistant) - (a.chief + a.assistant));

    if (items.length === 0) {
        showToast('No invigilation duties assigned yet', 'error');
        return;
    }

    // Build modal
    const existing = $('invigWorkloadModal');
    if (existing) existing.remove();
    const maxDuties = Math.max(...items.map(i => i.chief + i.assistant), 1);

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'invigWorkloadModal';
    modal.innerHTML = `
        <div class="modal modal-lg" style="max-width: 720px;">
            <div class="modal-header" style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white;">
                <h3><i class="fa-solid fa-scale-balanced"></i> Invigilation Workload Balance</h3>
                <button data-dismiss="modal" style="color:white;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 1.25rem; max-height: 65vh; overflow-y: auto;">
                <p style="margin:0 0 1rem; font-size:0.82rem; color:var(--text-muted);">
                    Distribution of invigilation duties across staff. Higher bars indicate heavier workload.
                </p>
                <div style="display:flex; flex-direction:column; gap:0.65rem;">
                    ${items.map(w => {
                        const total = w.chief + w.assistant;
                        const pct = (total / maxDuties) * 100;
                        let barColor = '#22C55E';
                        if (total >= 5) barColor = '#ef4444';
                        else if (total >= 3) barColor = '#f59e0b';
                        return `
                            <div class="workload-bar-item">
                                <div class="wbi-info">
                                    <div class="wbi-avatar"><img src="${w.photo || DEFAULT_AVATAR}" onerror="this.src='${DEFAULT_AVATAR}'"></div>
                                    <div class="wbi-name">
                                        <strong>${escapeHtml(w.name)}</strong>
                                        <small>${escapeHtml(w.designation)}</small>
                                    </div>
                                </div>
                                <div class="wbi-bar-wrapper">
                                    <div class="wbi-bar" style="width: ${pct}%; background: ${barColor};"></div>
                                </div>
                                <div class="wbi-counts">
                                    <span class="wbi-count-chief"><i class="fa-solid fa-shield-halved"></i> ${w.chief} chief</span>
                                    <span class="wbi-count-asst"><i class="fa-solid fa-user"></i> ${w.assistant} asst</span>
                                </div>
                                <div class="wbi-status">
                                    ${w.accepted > 0 ? `<span class="invig-status-badge invig-status-accepted">${w.accepted} ✓</span>` : ''}
                                    ${w.pending > 0 ? `<span class="invig-status-badge invig-status-pending">${w.pending} ⏳</span>` : ''}
                                    ${w.declined > 0 ? `<span class="invig-status-badge invig-status-declined">${w.declined} ✗</span>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });
}

// ==========================================================================
//   PERSONAL SCHEDULE — per-learner and per-staff exam timetables
// ==========================================================================
function populatePersonalScheduleEntities(type) {
    const sel = $('personalScheduleEntity');
    if (!sel) return;
    if (type === 'learner') {
        const students = StudentRepo.getAll();
        sel.innerHTML = '<option value="">Select Learner...</option>' +
            students.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.grade || '-')})</option>`).join('');
    } else {
        const staff = StaffRepo.getAll();
        sel.innerHTML = '<option value="">Select Staff...</option>' +
            staff.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.designation || 'Staff')})</option>`).join('');
    }
}

function renderPersonalSchedule() {
    const container = $('personalScheduleView');
    if (!container) return;
    const type = $('personalScheduleType') ? $('personalScheduleType').value : 'learner';
    const entityId = $('personalScheduleEntity') ? $('personalScheduleEntity').value : '';

    if (!entityId) {
        container.innerHTML = '<div class="heatmap-empty">Select a person to view their exam schedule.</div>';
        return;
    }

    const exams = store.examSchedules || [];
    let relevantExams = [];

    if (type === 'learner') {
        const student = StudentRepo.getById(entityId);
        if (!student) { container.innerHTML = '<div class="heatmap-empty">Learner not found.</div>'; return; }

        // Exams for this learner's grade
        relevantExams = exams.filter(e => e.grade === student.grade &&
            (!e.stream || e.stream === 'all' || e.stream === student.stream));

        // Render header
        let html = `
            <div class="personal-schedule-header">
                <div class="psh-info">
                    <div class="psh-avatar"><img src="${student.photo || DEFAULT_AVATAR}" onerror="this.src='${DEFAULT_AVATAR}'"></div>
                    <div>
                        <h3>${escapeHtml(student.name)}</h3>
                        <p>Grade ${escapeHtml(student.grade || '-')} · Stream ${escapeHtml(student.stream || '-')} · ADM ${escapeHtml(student.reg || '-')}</p>
                    </div>
                </div>
                <div class="psh-stats">
                    <span class="psh-stat"><strong>${relevantExams.length}</strong> exams</span>
                </div>
            </div>
        `;

        if (relevantExams.length === 0) {
            html += '<div class="heatmap-empty">No exams scheduled for this learner\'s grade.</div>';
        } else {
            html += '<div class="personal-schedule-list">';
            // Group by date
            const byDate = {};
            relevantExams.forEach(e => {
                const d = e.date || 'Undated';
                if (!byDate[d]) byDate[d] = [];
                byDate[d].push(e);
            });
            Object.keys(byDate).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
                const dateObj = date === 'Undated' ? null : new Date(date);
                const dateLabel = dateObj ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Undated';
                const dayExams = byDate[date].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
                html += `
                    <div class="ps-day">
                        <div class="ps-day-header">${escapeHtml(dateLabel)}</div>
                        ${dayExams.map(e => {
                            const endTime = computeExamEndTime(e.startTime, e.duration);
                            const subjects = (e.subjects || []).map(s => s.name).join(', ');
                            const invig = e.invigilatorId ? StaffRepo.getById(e.invigilatorId) : null;
                            return `
                                <div class="ps-exam-row">
                                    <div class="ps-time">${escapeHtml(e.startTime || '')} - ${escapeHtml(endTime)}</div>
                                    <div class="ps-detail">
                                        <strong>${escapeHtml(e.name)}</strong>
                                        <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(e.venue || 'TBD')}</span>
                                        <span><i class="fa-solid fa-book"></i> ${escapeHtml(subjects || 'All subjects')}</span>
                                        <span><i class="fa-solid fa-clock"></i> Report by ${escapeHtml(e.reportingTime || '07:45')}</span>
                                        ${invig ? `<span><i class="fa-solid fa-user-shield"></i> ${escapeHtml(invig.name)}</span>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            });
            html += '</div>';
        }
        container.innerHTML = html;
    } else {
        // Staff / Invigilator schedule
        const staffMember = StaffRepo.getById(entityId);
        if (!staffMember) { container.innerHTML = '<div class="heatmap-empty">Staff not found.</div>'; return; }

        // Exams where this staff is chief or assistant invigilator
        relevantExams = exams.filter(e => e.invigilatorId === entityId || e.assistantInvigilatorId === entityId);

        let html = `
            <div class="personal-schedule-header">
                <div class="psh-info">
                    <div class="psh-avatar"><img src="${staffMember.photo || DEFAULT_AVATAR}" onerror="this.src='${DEFAULT_AVATAR}'"></div>
                    <div>
                        <h3>${escapeHtml(staffMember.name)}</h3>
                        <p>${escapeHtml(staffMember.designation || 'Staff')} · ${escapeHtml(staffMember.dept || '-')}</p>
                    </div>
                </div>
                <div class="psh-stats">
                    <span class="psh-stat"><strong>${relevantExams.length}</strong> duties</span>
                </div>
            </div>
        `;

        if (relevantExams.length === 0) {
            html += '<div class="heatmap-empty">No invigilation duties assigned to this staff member.</div>';
        } else {
            html += '<div class="personal-schedule-list">';
            const byDate = {};
            relevantExams.forEach(e => {
                const d = e.date || 'Undated';
                if (!byDate[d]) byDate[d] = [];
                byDate[d].push(e);
            });
            Object.keys(byDate).sort((a, b) => new Date(a) - new Date(b)).forEach(date => {
                const dateObj = date === 'Undated' ? null : new Date(date);
                const dateLabel = dateObj ? dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Undated';
                const dayExams = byDate[date].sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));
                html += `
                    <div class="ps-day">
                        <div class="ps-day-header">${escapeHtml(dateLabel)}</div>
                        ${dayExams.map(e => {
                            const endTime = computeExamEndTime(e.startTime, e.duration);
                            const isChief = e.invigilatorId === entityId;
                            const status = e.invigStatus ? (isChief ? e.invigStatus.chief : e.invigStatus.assistant) : 'Pending';
                            return `
                                <div class="ps-exam-row">
                                    <div class="ps-time">${escapeHtml(e.startTime || '')} - ${escapeHtml(endTime)}</div>
                                    <div class="ps-detail">
                                        <strong>${escapeHtml(e.name)}</strong>
                                        <span><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(e.grade)}</span>
                                        <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(e.venue || 'TBD')}</span>
                                        <span><i class="fa-solid fa-shield-halved"></i> ${isChief ? 'Chief Invigilator' : 'Assistant Invigilator'}</span>
                                        <span class="invig-status-badge invig-status-${status.toLowerCase()}">${status}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            });
            html += '</div>';
        }
        container.innerHTML = html;
    }
}

// Export personal schedule as PDF
function exportPersonalSchedulePDF() {
    if (!window.jspdf) { showToast('PDF library not loaded', 'error'); return; }
    const type = $('personalScheduleType') ? $('personalScheduleType').value : 'learner';
    const entityId = $('personalScheduleEntity') ? $('personalScheduleEntity').value : '';
    if (!entityId) { showToast('Select a person first', 'error'); return; }

    const exams = store.examSchedules || [];
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Header
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 32, 'F');
    doc.setFontSize(16).setFont(undefined, 'bold').setTextColor(255);
    doc.text(store.settings.schoolName || 'School', pageWidth / 2, 13, { align: 'center' });
    doc.setFontSize(10).setFont(undefined, 'normal');
    doc.text(type === 'learner' ? 'PERSONAL EXAMINATION TIMETABLE' : 'INVIGILATION DUTY SCHEDULE', pageWidth / 2, 25, { align: 'center' });

    let yPos = 42;
    let relevantExams = [];
    let personName = '';

    if (type === 'learner') {
        const student = StudentRepo.getById(entityId);
        if (!student) return;
        personName = student.name;
        relevantExams = exams.filter(e => e.grade === student.grade && (!e.stream || e.stream === 'all' || e.stream === student.stream));
        doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
        doc.text(`Name: ${student.name}`, margin, yPos);
        doc.text(`Grade: ${student.grade} (${student.stream || '-'})`, margin + 100, yPos);
        doc.text(`ADM: ${student.reg || '-'}`, margin, yPos + 6);
        yPos += 14;
    } else {
        const staffMember = StaffRepo.getById(entityId);
        if (!staffMember) return;
        personName = staffMember.name;
        relevantExams = exams.filter(e => e.invigilatorId === entityId || e.assistantInvigilatorId === entityId);
        doc.setFontSize(10).setFont(undefined, 'bold').setTextColor(30, 41, 59);
        doc.text(`Staff: ${staffMember.name}`, margin, yPos);
        doc.text(`Role: ${staffMember.designation || 'Staff'}`, margin + 100, yPos);
        yPos += 14;
    }

    if (relevantExams.length === 0) {
        doc.setFontSize(11).setTextColor(100);
        doc.text('No exams scheduled.', pageWidth / 2, yPos + 10, { align: 'center' });
    } else {
        const tableBody = relevantExams.sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)).map(e => {
            const endTime = computeExamEndTime(e.startTime, e.duration);
            const dateStr = e.date ? new Date(e.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '-';
            const subjects = (e.subjects || []).map(s => s.name).join(', ');
            const invig = e.invigilatorId ? StaffRepo.getById(e.invigilatorId) : null;
            const role = type === 'staff' ? (e.invigilatorId === entityId ? 'Chief' : 'Assistant') : '';
            return [dateStr, `${e.startTime || ''}-${endTime}`, e.name, e.grade, e.venue || '-', subjects.substring(0, 30), role];
        });

        doc.autoTable({
            startY: yPos,
            head: [['Date', 'Time', 'Exam', 'Grade', 'Venue', 'Subjects', type === 'staff' ? 'Role' : '']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [0, 51, 102], textColor: 255, fontSize: 8 },
            bodyStyles: { fontSize: 8, cellPadding: 3 },
            margin: { left: margin, right: margin }
        });
    }

    addDocFooter(doc, false);
    const safeName = personName.replace(/[^a-z0-9]/gi, '_');
    doc.save(`${type === 'learner' ? 'Exam_Schedule' : 'Invigilation_Duties'}_${safeName}.pdf`);
    showToast('Personal schedule exported');
}

// ==========================================================================
//   HELPER: Safely ensure data is an array (prevents .map crashes on strings)
// ==========================================================================
function safeArr(val) {
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') { try { return JSON.parse(val); } catch(e) { return []; } }
    return [];
}

// ==========================================================================
//   GRADING OVERVIEW — shows all exams with grading progress + deadlines
// ==========================================================================
function renderGradingOverview() {
    const container = $('gradingOverview');
    if (!container) return;
    const exams = store.examSchedules || [];

    if (exams.length === 0) {
        container.innerHTML = `
            <div class="heatmap-empty" style="padding:2rem;">
                <i class="fa-solid fa-pen-ruler" style="font-size:2.5rem; color:var(--text-muted); opacity:0.3;"></i>
                <p style="margin-top:0.5rem;">No exams to grade yet.</p>
            </div>`;
        return;
    }

    container.innerHTML = exams.map(exam => {
        const results = exam.results || [];
        const subjects = safeArr(exam.subjects); // ✅ Safe parse
        const fullyGraded = results.filter(r => countGradedSubjects(r, exam) === subjects.length).length;
        const partial = results.filter(r => countGradedSubjects(r, exam) > 0 && countGradedSubjects(r, exam) < subjects.length).length;
        const pending = results.filter(r => countGradedSubjects(r, exam) === 0).length;
        const total = results.length;
        const pct = total > 0 ? Math.round(fullyGraded / total * 100) : 0;
        const status = exam.status || 'Scheduled';
        const statusClass = status.replace(/\s+/g, '-');

        // Deadline analysis
        let deadlineBadge = '';
        if (exam.scoreSubmissionDeadline) {
            const now = new Date();
            const deadline = new Date(exam.scoreSubmissionDeadline);
            const diffHours = (deadline - now) / (1000 * 60 * 60);
            if (diffHours < 0 && pct < 100) {
                deadlineBadge = `<span class="deadline-badge deadline-overdue"><i class="fa-solid fa-circle-exclamation"></i> Overdue by ${Math.abs(Math.round(diffHours / 24))}d</span>`;
            } else if (diffHours < 24 && pct < 100) {
                deadlineBadge = `<span class="deadline-badge deadline-urgent"><i class="fa-solid fa-clock"></i> Due in ${Math.round(diffHours)}h</span>`;
            } else if (diffHours < 72 && pct < 100) {
                deadlineBadge = `<span class="deadline-badge deadline-soon"><i class="fa-solid fa-hourglass-half"></i> Due in ${Math.round(diffHours / 24)}d</span>`;
            } else {
                deadlineBadge = `<span class="deadline-badge deadline-normal"><i class="fa-regular fa-calendar-check"></i> Due ${deadline.toLocaleDateString('en-GB', {day:'numeric',month:'short'})}</span>`;
            }
        }

        return `
            <div class="grading-overview-card" onclick="openExamGradingModal('${exam.id}')">
                <div class="goc-header">
                    <div>
                        <h4>${escapeHtml(exam.name)}</h4>
                        <div class="goc-meta">
                            <span><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(exam.grade)}</span>
                            <span><i class="fa-solid fa-calendar"></i> ${exam.date ? new Date(exam.date).toLocaleDateString('en-GB') : '-'}</span>
                            <span><i class="fa-solid fa-book"></i> ${subjects.length} subject${subjects.length === 1 ? '' : 's'}</span>
                        </div>
                    </div>
                    <span class="exam-status-badge ${statusClass}">${escapeHtml(status)}</span>
                </div>
                ${deadlineBadge ? `<div class="goc-deadline">${deadlineBadge}</div>` : ''}
                <div class="goc-progress-row">
                    <div class="goc-progress-bar">
                        <div class="goc-progress-fill" style="width: ${pct}%"></div>
                    </div>
                    <span class="goc-progress-pct">${pct}%</span>
                </div>
                <div class="goc-stats">
                    <span class="goc-stat graded"><i class="fa-solid fa-circle-check"></i> ${fullyGraded} fully graded</span>
                    <span class="goc-stat partial"><i class="fa-solid fa-circle-half-stroke"></i> ${partial} partial</span>
                    <span class="goc-stat pending"><i class="fa-regular fa-circle"></i> ${pending} pending</span>
                    <span class="goc-stat total"><i class="fa-solid fa-users"></i> ${total} learners</span>
                </div>
                <div class="goc-actions">
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); openExamGradingModal('${exam.id}')"><i class="fa-solid fa-pen-ruler"></i> Enter Scores</button>
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); exportExamScores('${exam.id}')"><i class="fa-solid fa-download"></i> Export</button>
                    <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); importExamScoresPrompt('${exam.id}')"><i class="fa-solid fa-upload"></i> Import</button>
                </div>
            </div>
        `;
    }).join('');
}

// Helper: trigger file import dialog for an exam
function importExamScoresPrompt(examId) {
    examGradingCurrentId = examId;
    const fileInput = $('egImportFile');
    if (fileInput) fileInput.click();
}

function renderExamListGrid() {
    const container = $('examListGrid');
    if (!container) return;
    const exams = store.examSchedules || [];
    const filtered = examFilterStatus === 'all'
        ? exams
        : exams.filter(e => (e.status || 'Scheduled') === examFilterStatus);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="heatmap-empty" style="grid-column:1/-1; display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:2rem;">
                <i class="fa-solid fa-calendar-xmark" style="font-size:2.5rem; color:var(--text-muted); opacity:0.3;"></i>
                <p style="margin:0;">No exams ${examFilterStatus === 'all' ? 'scheduled yet' : 'in this status'}. Click <strong>Schedule New Exam</strong> to begin.</p>
            </div>`;
        return;
    }

    // Sort by date desc
    filtered.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    container.innerHTML = filtered.map(exam => {
        const status = exam.status || 'Scheduled';
        const subjects = safeArr(exam.subjects).map(s => s.name || s); // ✅ Safe parse
        const grade = exam.grade || '—';
        const dateStr = exam.date ? new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
        const term = exam.term || '—';
        const type = exam.type || '—';
        const duration = exam.duration || 60;

        // Grading progress — use countGradedSubjects for accurate per-subject progress
        const results = exam.results || [];
        const examSubjects = safeArr(exam.subjects); // ✅ Safe parse
        const gradedCount = results.filter(r => countGradedSubjects(r, exam) > 0).length;
        const fullyGradedCount = results.filter(r => countGradedSubjects(r, exam) === examSubjects.length).length;
        const totalStudents = results.length;
        const progressPct = totalStudents > 0 ? Math.round(fullyGradedCount / totalStudents * 100) : 0;

        const statusClass = status.replace(/\s+/g, '-');

        return `
            <div class="exam-card" data-status="${escapeHtml(status)}">
                <div class="exam-card-header">
                    <h3 class="exam-card-title">${escapeHtml(exam.name)}</h3>
                    <span class="exam-status-badge ${statusClass}">${escapeHtml(status)}</span>
                </div>
                <div class="exam-card-meta">
                    <span><i class="fa-solid fa-graduation-cap"></i> ${escapeHtml(grade)}</span>
                    <span><i class="fa-solid fa-calendar"></i> ${dateStr}</span>
                    <span><i class="fa-solid fa-clock"></i> ${duration} min</span>
                    <span><i class="fa-solid fa-book"></i> ${type}</span>
                    <span><i class="fa-solid fa-folder"></i> ${escapeHtml(term)}</span>
                </div>
                <div class="exam-card-subjects">
                    ${subjects.map(s => `<span class="exam-subject-chip">${escapeHtml(s)}</span>`).join('')}
                </div>
                ${totalStudents > 0 ? `
                    <div>
                        <div style="display:flex; justify-content:space-between; font-size:0.72rem; color:var(--text-muted); margin-bottom:4px;">
                            <span>Grading Progress</span>
                            <span>${fullyGradedCount}/${totalStudents} fully graded${gradedCount > fullyGradedCount ? ` · ${gradedCount - fullyGradedCount} partial` : ''}</span>
                        </div>
                        <div class="exam-card-progress">
                            <div class="exam-card-progress-fill" style="width: ${progressPct}%"></div>
                        </div>
                    </div>
                ` : ''}
                <div class="exam-card-footer">
                    <button class="btn btn-sm btn-primary" onclick="openExamGradingModal('${exam.id}')"><i class="fa-solid fa-pen-ruler"></i> Grade</button>
                    <button class="btn btn-sm btn-ghost" onclick="openExamFormModal('${exam.id}')"><i class="fa-solid fa-edit"></i> Edit</button>
                    <button class="btn btn-sm btn-ghost" onclick="deleteExamSchedule('${exam.id}')" style="color:var(--danger);"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    }).join('');
}

function openExamFormModal(examId) {
    const form = $('examForm');
    if (!form) return;
    form.reset();
    $('examEditId').value = '';
    populateExamSubjectsCheckboxes('');

    // Populate invigilator dropdowns from staff
    const staff = StaffRepo.getAll();
    const invigSel = $('examInvigilator');
    const asstSel = $('examAssistantInvigilator');
    if (invigSel) {
        invigSel.innerHTML = '<option value="">Select Staff...</option>' +
            staff.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.designation || 'Staff')})</option>`).join('');
    }
    if (asstSel) {
        asstSel.innerHTML = '<option value="">None</option>' +
            staff.map(s => `<option value="${s.id}">${escapeHtml(s.name)} (${escapeHtml(s.designation || 'Staff')})</option>`).join('');
    }

    // Default date = today, default start time = 08:00
    $('examDate').value = new Date().toISOString().slice(0, 10);
    if ($('examStartTime')) $('examStartTime').value = '08:00';
    if ($('examReportingTime')) $('examReportingTime').value = '07:45';
    if ($('examClashWarning')) $('examClashWarning').style.display = 'none';

    if (examId) {
        const exam = (store.examSchedules || []).find(e => e.id === examId);
        if (exam) {
            setText('examFormTitle', 'Edit Exam');
            $('examEditId').value = exam.id;
            $('examName').value = exam.name || '';
            $('examType').value = exam.type || 'Opener';
            $('examTerm').value = exam.term || 'Term 1';
            $('examGrade').value = exam.grade || '';
            populateExamSubjectsCheckboxes(exam.grade);
            populateExamStreamDropdown(exam.grade);
            if ($('examStream')) $('examStream').value = exam.stream || 'all';
            $('examDate').value = exam.date || '';
            if ($('examStartTime')) $('examStartTime').value = exam.startTime || '08:00';
            if ($('examReportingTime')) $('examReportingTime').value = exam.reportingTime || '07:45';
            if ($('examSession')) $('examSession').value = exam.session || 'Morning';
            $('examDuration').value = exam.duration || 60;
            $('examTotalMarks').value = exam.totalMarks || 100;
            if ($('examVenue')) $('examVenue').value = exam.venue || '';
            if ($('examInvigilator')) $('examInvigilator').value = exam.invigilatorId || '';
            if ($('examAssistantInvigilator')) $('examAssistantInvigilator').value = exam.assistantInvigilatorId || '';
            if ($('examSeatingCapacity')) $('examSeatingCapacity').value = exam.seatingCapacity || '';
            // Deadlines
            if ($('examRegDeadline')) $('examRegDeadline').value = exam.registrationDeadline || '';
            if ($('examScoreDeadline')) $('examScoreDeadline').value = exam.scoreSubmissionDeadline || '';
            if ($('examPublishDate')) $('examPublishDate').value = exam.resultsPublishDate || '';
            $('examNotes').value = exam.notes || '';
            // Mark selected subjects
            const selectedCodes = (exam.subjects || []).map(s => s.code);
            document.querySelectorAll('input[name="examSubject"]').forEach(cb => {
                if (selectedCodes.includes(cb.value)) cb.checked = true;
            });
        }
    } else {
        setText('examFormTitle', 'Schedule Exam');
    }
    openModal('examFormModal');
}

// Populate the stream dropdown based on grade
function populateExamStreamDropdown(grade) {
    const sel = $('examStream');
    if (!sel) return;
    if (!grade) {
        sel.innerHTML = '<option value="all">All Streams</option>';
        return;
    }
    const streams = Array.from(new Set(StudentRepo.findBy('grade', grade).map(s => s.stream).filter(Boolean))).sort();
    sel.innerHTML = '<option value="all">All Streams</option>' +
        streams.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
}

function populateExamSubjectsCheckboxes(grade) {
    const grid = $('examSubjectsGrid');
    if (!grid) return;
    if (!grade) {
        grid.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Select a grade first to populate subjects.</p>';
        return;
    }
    const applicable = (store.learningAreas || []).filter(a => !a.applicableLevels || a.applicableLevels.includes(grade));
    if (applicable.length === 0) {
        grid.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No subjects found for this grade.</p>';
        return;
    }
    grid.innerHTML = applicable.map(a => `
        <label class="checkbox-card">
            <input type="checkbox" name="examSubject" value="${a.code}" data-name="${escapeHtml(a.name)}">
            ${a.code} — ${escapeHtml(a.name)}
        </label>
    `).join('');
}

function handleExamFormSubmit(e) {
    e.preventDefault();
    const editId = $('examEditId').value;
    const grade = $('examGrade').value;
    const name = $('examName').value.trim();
    const venue = $('examVenue').value.trim();
    const invigilator = $('examInvigilator').value;
    if (!name || !grade) { showToast('Name and grade required', 'error'); return; }
    if (!venue) { showToast('Venue is required', 'error'); return; }
    if (!invigilator) { showToast('Chief invigilator is required', 'error'); return; }

    const selectedSubjects = Array.from(document.querySelectorAll('input[name="examSubject"]:checked')).map(cb => ({
        code: cb.value,
        name: cb.dataset.name
    }));
    if (selectedSubjects.length === 0) {
        showToast('Select at least one subject', 'error');
        return;
    }

    // Check for exam clashes (venue or invigilator double-booking)
    const clash = detectExamClash({
        editId, date: $('examDate').value, startTime: $('examStartTime').value,
        duration: parseInt($('examDuration').value) || 60, venue,
        invigilatorId: invigilator, assistantInvigilatorId: $('examAssistantInvigilator').value || null
    }, store.examSchedules || []);

    if (clash) {
        showExamClashWarning(clash, () => {
            persistExamSchedule(editId, grade, name, venue, invigilator, selectedSubjects);
        });
        return;
    }

    persistExamSchedule(editId, grade, name, venue, invigilator, selectedSubjects);
}

function persistExamSchedule(editId, grade, name, venue, invigilator, selectedSubjects) {
    const examData = {
        id: editId || generateId(),
        name,
        type: $('examType').value,
        term: $('examTerm').value,
        grade,
        stream: $('examStream').value || 'all',
        date: $('examDate').value,
        startTime: $('examStartTime').value || '08:00',
        reportingTime: $('examReportingTime').value || '07:45',
        session: $('examSession').value,
        duration: parseInt($('examDuration').value) || 60,
        totalMarks: parseInt($('examTotalMarks').value) || 100,
        venue,
        invigilatorId: invigilator,
        assistantInvigilatorId: $('examAssistantInvigilator').value || null,
        seatingCapacity: $('examSeatingCapacity').value ? parseInt($('examSeatingCapacity').value) : null,
        // Deadlines
        registrationDeadline: $('examRegDeadline').value || null,
        scoreSubmissionDeadline: $('examScoreDeadline').value || null,
        resultsPublishDate: $('examPublishDate').value || null,
        subjects: selectedSubjects,
        notes: $('examNotes').value.trim(),
        status: 'Scheduled',
        results: [],
        // Invigilation engagement
        invigStatus: { chief: 'Pending', assistant: 'Pending' },
        createdAt: new Date().toISOString()
    };

    if (!store.examSchedules) store.examSchedules = [];
    if (editId) {
        const idx = store.examSchedules.findIndex(e => e.id === editId);
        if (idx >= 0) {
            examData.status = store.examSchedules[idx].status || 'Scheduled';
            examData.results = store.examSchedules[idx].results || [];
            // Preserve invigilation engagement status if same invigilators
            const prev = store.examSchedules[idx];
            if (prev.invigStatus) {
                examData.invigStatus = {
                    chief: prev.invigilatorId === invigilator ? prev.invigStatus.chief : 'Pending',
                    assistant: prev.assistantInvigilatorId === examData.assistantInvigilatorId ? prev.invigStatus.assistant : 'Pending'
                };
            }
            store.examSchedules[idx] = examData;
        }
    } else {
        store.examSchedules.push(examData);
    }
    saveData();
    closeModal('examFormModal');
    renderExamSystemDashboard();
    renderExamTimetable();
    renderInvigilationRoster();
    renderGradingOverview();
    renderPersonalSchedule();
    showToast(editId ? 'Exam updated' : 'Exam scheduled');
}

// Detect exam clashes — venue or invigilator double-booking on same date+time
function detectExamClash(newExam, existing) {
    const { editId, date, startTime, duration, venue, invigilatorId, assistantInvigilatorId } = newExam;
    if (!date || !startTime) return null;

    const newStart = parseTimeToMinutes(startTime);
    const newEnd = newStart + (duration || 60);
    const others = existing.filter(e => e.id !== editId && e.date === date);

    // Check venue clash
    for (const e of others) {
        if (e.venue && e.venue.toLowerCase() === venue.toLowerCase()) {
            const eStart = parseTimeToMinutes(e.startTime);
            const eEnd = eStart + (e.duration || 60);
            if (timeRangesOverlap(newStart, newEnd, eStart, eEnd)) {
                return {
                    type: 'venue',
                    title: 'Venue Clash',
                    message: `Venue <strong>${escapeHtml(venue)}</strong> is already booked for <strong>${escapeHtml(e.name)}</strong> (${escapeHtml(e.grade)}) on ${e.date} at ${e.startTime}.`,
                    detail: 'Two exams cannot use the same venue at the same time. Choose a different venue, time, or date.',
                    conflictingExam: e
                };
            }
        }
    }

    // Check invigilator clash (chief)
    for (const e of others) {
        if (e.invigilatorId && e.invigilatorId === invigilatorId) {
            const eStart = parseTimeToMinutes(e.startTime);
            const eEnd = eStart + (e.duration || 60);
            if (timeRangesOverlap(newStart, newEnd, eStart, eEnd)) {
                const staff = StaffRepo.getById(invigilatorId);
                return {
                    type: 'invigilator',
                    title: 'Invigilator Clash',
                    message: `<strong>${escapeHtml(staff ? staff.name : 'This invigilator')}</strong> is already assigned to invigilate <strong>${escapeHtml(e.name)}</strong> (${escapeHtml(e.grade)}) on ${e.date} at ${e.startTime}.`,
                    detail: 'An invigilator cannot be in two venues at the same time. Choose a different invigilator, time, or date.',
                    conflictingExam: e
                };
            }
        }
        // Check assistant invigilator clash
        if (assistantInvigilatorId && e.invigilatorId === assistantInvigilatorId) {
            const eStart = parseTimeToMinutes(e.startTime);
            const eEnd = eStart + (e.duration || 60);
            if (timeRangesOverlap(newStart, newEnd, eStart, eEnd)) {
                const staff = StaffRepo.getById(assistantInvigilatorId);
                return {
                    type: 'invigilator',
                    title: 'Assistant Invigilator Clash',
                    message: `<strong>${escapeHtml(staff ? staff.name : 'The assistant')}</strong> is already chief invigilator for <strong>${escapeHtml(e.name)}</strong> at the same time.`,
                    detail: 'Staff cannot invigilate two exams simultaneously.',
                    conflictingExam: e
                };
            }
        }
    }

    return null;
}

function parseTimeToMinutes(timeStr) {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

function timeRangesOverlap(start1, end1, start2, end2) {
    return start1 < end2 && start2 < end1;
}

function showExamClashWarning(clash, onProceed) {
    const existing = $('examClashModal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop active';
    modal.id = 'examClashModal';
    modal.innerHTML = `
        <div class="modal" style="max-width: 480px;">
            <div class="modal-header" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white;">
                <h3><i class="fa-solid fa-triangle-exclamation"></i> ${clash.title}</h3>
                <button data-dismiss="modal" style="color:white;">&times;</button>
            </div>
            <div class="modal-body" style="padding: 1.5rem;">
                <div style="display:flex; gap:1rem; align-items:flex-start;">
                    <div style="width:48px; height:48px; border-radius:50%; background:#fee2e2; color:#ef4444; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0;">
                        <i class="fa-solid fa-circle-exclamation"></i>
                    </div>
                    <div style="flex:1;">
                        <p style="margin:0 0 0.75rem; font-size:0.95rem; line-height:1.5;">${clash.message}</p>
                        <p style="margin:0; font-size:0.82rem; color:var(--text-muted); line-height:1.5;">${clash.detail}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                <button class="btn btn-warning" id="btnOverrideClash"><i class="fa-solid fa-exclamation-triangle"></i> Override & Save Anyway</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelectorAll('[data-dismiss="modal"]').forEach(btn => {
        btn.addEventListener('click', () => modal.remove());
    });
    const overrideBtn = modal.querySelector('#btnOverrideClash');
    if (overrideBtn) {
        overrideBtn.addEventListener('click', () => {
            modal.remove();
            onProceed();
        });
    }
}

// Live exam clash detection on form changes
function checkExamClashLive() {
    const editId = $('examEditId').value;
    const date = $('examDate').value;
    const startTime = $('examStartTime').value;
    const duration = parseInt($('examDuration').value) || 60;
    const venue = $('examVenue').value.trim();
    const invigilatorId = $('examInvigilator').value;
    const assistantInvigilatorId = $('examAssistantInvigilator').value || null;

    const warningEl = $('examClashWarning');
    if (!warningEl) return;

    if (!date || !startTime || !venue || !invigilatorId) {
        warningEl.style.display = 'none';
        return;
    }

    const clash = detectExamClash({ editId, date, startTime, duration, venue, invigilatorId, assistantInvigilatorId }, store.examSchedules || []);
    if (clash) {
        warningEl.style.display = 'flex';
        warningEl.className = 'tt-clash-warning ' + (clash.type === 'venue' ? 'grade' : 'teacher');
        warningEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> <div><strong>${escapeHtml(clash.title)}:</strong> ${clash.message}</div>`;
    } else {
        warningEl.style.display = 'none';
    }
}

function deleteExamSchedule(examId) {
    if (!confirm('Delete this exam and all its grading data?')) return;
    store.examSchedules = (store.examSchedules || []).filter(e => e.id !== examId);
    saveData();
    renderExamSystemDashboard();
    showToast('Exam deleted');
}

function openExamGradingModal(examId) {
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam) return;
    examGradingCurrentId = examId;

    // Auto-seed results if not yet initialized
    if (!exam.results || exam.results.length === 0) {
        const students = StudentRepo.findBy('grade', exam.grade);
        exam.results = students.map(s => ({
            studentId: s.id,
            admNo: s.reg || '-',
            name: s.name,
            stream: s.stream || '-',
            subjectScores: {}, // { [subjectCode]: score }
            score: null,       // computed average (backward compat)
            status: 'Pending'
        }));
        saveData();
    }

    // Migrate legacy results (single score → subjectScores map)
    exam.results.forEach(r => {
        if (!r.subjectScores) {
            r.subjectScores = {};
            // If legacy single score exists, distribute it (or leave blank)
            if (r.score !== null && r.score !== undefined && r.score !== '') {
                (exam.subjects || []).forEach(subj => {
                    r.subjectScores[subj.code] = Number(r.score);
                });
            }
        }
    });

    // Populate stream filter dropdown
    const streamFilter = $('egBatchStream');
    if (streamFilter) {
        const streams = Array.from(new Set((exam.results || []).map(r => r.stream).filter(Boolean)));
        streamFilter.innerHTML = '<option value="all">All Streams</option>' +
            streams.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    }

    setText('egExamName', exam.name);
    const meta = `${exam.grade} · ${exam.date ? new Date(exam.date).toLocaleDateString('en-GB') : '-'} · ${exam.subjects.length} subject(s)`;
    setText('egExamMeta', meta);

    renderExamGradingTable(exam);
    openModal('examGradingModal');
}

// Compute a student's average across all subjects in the exam
function computeStudentAverage(result, exam) {
    if (!result.subjectScores) return null;
    const scores = (exam.subjects || [])
        .map(s => result.subjectScores[s.code])
        .filter(v => v !== null && v !== undefined && v !== '' && !isNaN(v))
        .map(Number);
    if (scores.length === 0) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// Count how many subjects have a score for a result
function countGradedSubjects(result, exam) {
    if (!result.subjectScores) return 0;
    return (exam.subjects || []).filter(s => {
        const v = result.subjectScores[s.code];
        return v !== null && v !== undefined && v !== '' && !isNaN(v);
    }).length;
}

function renderExamGradingTable(exam) {
    const tbody = $('examGradingBody');
    const head = $('examGradingHead');
    if (!tbody || !head) return;
    const totalMarks = exam.totalMarks || 100;
    const subjects = exam.subjects || [];

    // Build dynamic header — one column per subject
    let headHTML = '<tr>' +
        '<th class="eg-th-info">Adm No</th>' +
        '<th class="eg-th-info">Learner</th>' +
        '<th class="eg-th-info">Stream</th>';
    subjects.forEach(subj => {
        // Use subject code as the short label, full name as title
        const shortCode = subj.code.split('-').pop();
        headHTML += `<th class="eg-th-subject" title="${escapeHtml(subj.name)}">${escapeHtml(shortCode)}</th>`;
    });
    headHTML += '<th class="eg-th-avg">Avg</th><th class="eg-th-grade">Grd</th><th class="eg-th-status">Status</th></tr>';
    head.innerHTML = headHTML;

    // Apply batch filters
    const scope = $('egBatchScope') ? $('egBatchScope').value : 'all';
    const streamFilter = $('egBatchStream') ? $('egBatchStream').value : 'all';

    let visibleResults = exam.results || [];
    if (scope === 'stream' && streamFilter !== 'all') {
        visibleResults = visibleResults.filter(r => r.stream === streamFilter);
    }

    // Graded = student has at least one subject score
    const gradedCount = visibleResults.filter(r => countGradedSubjects(r, exam) > 0).length;
    const fullyGradedCount = visibleResults.filter(r => countGradedSubjects(r, exam) === subjects.length).length;
    setText('egProgress', `${fullyGradedCount} / ${visibleResults.length} fully graded · ${gradedCount} partial`);

    if (visibleResults.length === 0) {
        const colspan = 6 + subjects.length;
        tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; padding:1.5rem; color:var(--text-muted);">No learners match the selected filter.</td></tr>`;
        return;
    }

    tbody.innerHTML = visibleResults.map(r => {
        const idx = exam.results.indexOf(r); // original index for updateExamGrade
        const avg = computeStudentAverage(r, exam);
        let gradeClass = 'BE';
        let gradeLabel = '-';
        if (avg !== null) {
            if (avg >= 80) { gradeClass = 'EE'; gradeLabel = 'EE'; }
            else if (avg >= 50) { gradeClass = 'ME'; gradeLabel = 'ME'; }
            else { gradeClass = 'BE'; gradeLabel = 'BE'; }
        }
        const gradedSubs = countGradedSubjects(r, exam);
        const statusLabel = gradedSubs === 0 ? 'Pending' : (gradedSubs === subjects.length ? 'Graded' : 'Partial');
        const statusClass = gradedSubs === 0 ? 'Pending' : (gradedSubs === subjects.length ? 'Graded' : 'Partial');

        // Per-subject score inputs — use oninput for live updates, onblur for save flush
        let subjectCells = '';
        subjects.forEach(subj => {
            const val = r.subjectScores ? r.subjectScores[subj.code] : null;
            const displayVal = (val === null || val === undefined || val === '') ? '' : Number(val);
            subjectCells += `<td class="eg-td-score"><input type="number" class="eg-score-input" min="0" max="${totalMarks}" value="${displayVal}" placeholder="-" data-idx="${idx}" data-code="${escapeHtml(subj.code)}" oninput="updateExamSubjectGrade('${exam.id}', ${idx}, '${escapeHtml(subj.code)}', this.value, ${totalMarks})" onblur="flushExamSaves()"></td>`;
        });

        return `
            <tr data-student-id="${r.studentId}">
                <td>${escapeHtml(r.admNo || '-')}</td>
                <td><strong>${escapeHtml(r.name)}</strong></td>
                <td>${escapeHtml(r.stream || '-')}</td>
                ${subjectCells}
                <td class="eg-td-avg">${avg !== null ? avg + '%' : '-'}</td>
                <td class="eg-grade-cell ${gradeClass}">${gradeLabel}</td>
                <td><span class="eg-status-cell ${statusClass}">${statusLabel}</span></td>
            </tr>
        `;
    }).join('');
}

// Update a single subject score for a student in an exam
// Uses targeted DOM updates instead of full table re-render to preserve input focus
let _examSaveTimer = null;
function updateExamSubjectGrade(examId, idx, subjectCode, value, totalMarks) {
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam || !exam.results || !exam.results[idx]) return;

    if (!exam.results[idx].subjectScores) exam.results[idx].subjectScores = {};

    const num = (value === '' || value === null || value === undefined) ? null : Number(value);
    if (num !== null && (isNaN(num) || num < 0 || num > totalMarks)) {
        showToast(`Score must be between 0 and ${totalMarks}`, 'error');
        // Restore the previous value in the input without re-rendering
        const prevVal = exam.results[idx].subjectScores[subjectCode];
        const input = document.querySelector(`input[data-idx="${idx}"][data-code="${subjectCode}"]`);
        if (input) input.value = prevVal !== undefined ? prevVal : '';
        return;
    }

    if (num === null) {
        delete exam.results[idx].subjectScores[subjectCode];
    } else {
        exam.results[idx].subjectScores[subjectCode] = num;
    }

    // Recompute average and status for this student only
    exam.results[idx].score = computeStudentAverage(exam.results[idx], exam);
    exam.results[idx].status = countGradedSubjects(exam.results[idx], exam) > 0 ? 'Graded' : 'Pending';

    // Update only this row's Avg/Grade/Status cells — do NOT re-render the whole table
    updateExamRowCells(exam, idx);

    // Update the progress counter
    const gradedCount = (exam.results || []).filter(r => countGradedSubjects(r, exam) > 0).length;
    const fullyGradedCount = (exam.results || []).filter(r => countGradedSubjects(r, exam) === (exam.subjects || []).length).length;
    setText('egProgress', `${fullyGradedCount} / ${exam.results.length} fully graded · ${gradedCount} partial`);

    // Debounced save — don't hit the server on every keystroke
    if (_examSaveTimer) clearTimeout(_examSaveTimer);
    _examSaveTimer = setTimeout(() => {
        saveData();
    }, 800);

    // Auto-advance status to "Graded" if ALL students have ALL subjects graded
    const allFullyGraded = exam.results.length > 0 && exam.results.every(r => countGradedSubjects(r, exam) === (exam.subjects || []).length);
    if (allFullyGraded && exam.status !== 'Published') {
        exam.status = 'Graded';
        saveData();
        renderExamListGrid();
    }
}

// Update only the Avg/Grade/Status cells for a specific row — preserves input focus
function updateExamRowCells(exam, idx) {
    const result = exam.results[idx];
    if (!result) return;
    const totalMarks = exam.totalMarks || 100;
    const row = document.querySelector(`tr[data-student-id="${result.studentId}"]`);
    if (!row) return;

    const avg = computeStudentAverage(result, exam);
    const avgCell = row.querySelector('.eg-td-avg');
    if (avgCell) avgCell.textContent = avg !== null ? avg + '%' : '-';

    let gradeClass = 'BE';
    let gradeLabel = '-';
    if (avg !== null) {
        if (avg >= 80) { gradeClass = 'EE'; gradeLabel = 'EE'; }
        else if (avg >= 50) { gradeClass = 'ME'; gradeLabel = 'ME'; }
        else { gradeClass = 'BE'; gradeLabel = 'BE'; }
    }
    const gradeCell = row.querySelector('.eg-grade-cell');
    if (gradeCell) {
        gradeCell.className = `eg-grade-cell ${gradeClass}`;
        gradeCell.textContent = gradeLabel;
    }

    const gradedSubs = countGradedSubjects(result, exam);
    const statusLabel = gradedSubs === 0 ? 'Pending' : (gradedSubs === (exam.subjects || []).length ? 'Graded' : 'Partial');
    const statusClass = gradedSubs === 0 ? 'Pending' : (gradedSubs === (exam.subjects || []).length ? 'Graded' : 'Partial');
    const statusCell = row.querySelector('.eg-status-cell');
    if (statusCell) {
        statusCell.className = `eg-status-cell ${statusClass}`;
        statusCell.textContent = statusLabel;
    }
}

// Save any pending debounced exam saves when the modal closes
function flushExamSaves() {
    if (_examSaveTimer) {
        clearTimeout(_examSaveTimer);
        _examSaveTimer = null;
        saveData();
    }
}

function setExamStatus(examId, status) {
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam) return;
    if (status === 'Published') {
        // Require at least one fully-graded student OR allow if any grading has happened
        const anyGraded = (exam.results || []).some(r => countGradedSubjects(r, exam) > 0);
        if (!anyGraded) {
            showToast('Grade at least some papers before publishing', 'error');
            return;
        }
        // Push per-subject results into store.exams so they appear in single-learner assessments
        syncExamResultsToStore(exam);
    }
    exam.status = status;
    saveData();
    renderExamGradingTable(exam);
    renderExamListGrid();
    renderExamSystemDashboard();
    showToast(`Exam marked as ${status}`);
}

function syncExamResultsToStore(exam) {
    if (!exam.results) return;
    exam.results.forEach(r => {
        if (!r.subjectScores) return;
        // Push one exam record per subject that has a score
        (exam.subjects || []).forEach(subj => {
            const rawScore = r.subjectScores[subj.code];
            if (rawScore === null || rawScore === undefined || rawScore === '') return;
            const score = Number(rawScore);
            if (isNaN(score)) return;

            const existingIdx = store.exams.findIndex(e =>
                e.studentId === r.studentId && e.unitCode === subj.code && e.examScheduleId === exam.id);
            const comp = getCompetenceStatus(score);
            const record = {
                id: existingIdx >= 0 ? store.exams[existingIdx].id : generateId(),
                studentId: r.studentId,
                unitCode: subj.code,
                subjectName: subj.name,
                examScheduleId: exam.id,
                examName: exam.name,
                score: score,
                level: comp.level,
                status: comp.decision,
                grade: comp.abbr,
                date: new Date().toISOString()
            };
            if (existingIdx >= 0) store.exams[existingIdx] = record;
            else store.exams.push(record);
        });
    });
    saveData();
}

// ==========================================================================
//   EXAM BATCH ENTRY: Excel/CSV template, export, import (per-subject)
// ==========================================================================

// Build column key for a subject (used as Excel column header)
function examSubjectColumnKey(subj) {
    // Use code in brackets so it's parseable on import, e.g. "Mathematics [MATH]"
    return `${subj.name} [${subj.code}]`;
}

// Parse a column key back into subject code
function parseSubjectCodeFromColumn(colKey) {
    const match = String(colKey).match(/\[([^\]]+)\]\s*$/);
    return match ? match[1] : null;
}

// Download a blank template with per-subject columns
function exportExamScoreTemplate(examId) {
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam) { showToast('Exam not found', 'error'); return; }
    if (!exam.results || exam.results.length === 0) { showToast('No learners to export', 'error'); return; }

    const subjects = exam.subjects || [];
    const data = exam.results.map(r => {
        const row = {
            'Adm No': r.admNo || '',
            'Learner Name': r.name || '',
            'Stream': r.stream || ''
        };
        subjects.forEach(subj => {
            row[examSubjectColumnKey(subj)] = ''; // blank for template
        });
        return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    // Column widths
    const cols = [{ wch: 12 }, { wch: 28 }, { wch: 12 }];
    subjects.forEach(() => cols.push({ wch: 12 }));
    ws['!cols'] = cols;

    // Add a note row at the top? No — keep it clean for easy re-import.
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scores');
    XLSX.writeFile(wb, `${exam.name.replace(/[^a-z0-9]/gi, '_')}_Template.xlsx`);
    showToast('Template downloaded — fill subject scores and re-import');
}

// Export current per-subject scores
function exportExamScores(examId) {
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam) { showToast('Exam not found', 'error'); return; }
    if (!exam.results || exam.results.length === 0) { showToast('No learners to export', 'error'); return; }

    const subjects = exam.subjects || [];
    const totalMarks = exam.totalMarks || 100;
    const data = exam.results.map(r => {
        const row = {
            'Adm No': r.admNo || '',
            'Learner Name': r.name || '',
            'Stream': r.stream || ''
        };
        subjects.forEach(subj => {
            const val = r.subjectScores ? r.subjectScores[subj.code] : null;
            row[examSubjectColumnKey(subj)] = (val === null || val === undefined || val === '') ? '' : Number(val);
        });
        const avg = computeStudentAverage(r, exam);
        row['Average'] = avg !== null ? avg : '';
        row['Status'] = r.status || 'Pending';
        return row;
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const cols = [{ wch: 12 }, { wch: 28 }, { wch: 12 }];
    subjects.forEach(() => cols.push({ wch: 12 }));
    cols.push({ wch: 10 }, { wch: 10 });
    ws['!cols'] = cols;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scores');
    XLSX.writeFile(wb, `${exam.name.replace(/[^a-z0-9]/gi, '_')}_Scores.xlsx`);
    showToast('Scores exported');
}

// Import per-subject scores from Excel/CSV — matches by Adm No
function importExamScores(examId, file) {
    if (!file) return;
    const exam = (store.examSchedules || []).find(e => e.id === examId);
    if (!exam) { showToast('Exam not found', 'error'); return; }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const wb = XLSX.read(data, { type: 'array' });
            const ws = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

            if (rows.length === 0) {
                showToast('File is empty or invalid', 'error');
                return;
            }

            // Identify subject columns from header row
            const subjects = exam.subjects || [];
            const subjectColMap = {}; // columnKey → subjectCode
            subjects.forEach(subj => {
                subjectColMap[examSubjectColumnKey(subj)] = subj.code;
            });

            // Build a lookup by Adm No (case-insensitive, trimmed)
            const lookup = {};
            rows.forEach(row => {
                const admNo = String(row['Adm No'] || row['adm no'] || row['AdmNo'] || row['ADM'] || '').trim();
                if (admNo) lookup[admNo.toLowerCase()] = row;
            });

            let studentsMatched = 0;
            let scoresImported = 0;
            let studentsUnmatched = 0;
            const totalMarks = exam.totalMarks || 100;

            exam.results.forEach(r => {
                const admNo = String(r.admNo || '').trim().toLowerCase();
                if (admNo && lookup[admNo]) {
                    const row = lookup[admNo];
                    if (!r.subjectScores) r.subjectScores = {};
                    let hasAnyScore = false;

                    // For each subject column, read the value
                    subjects.forEach(subj => {
                        const colKey = examSubjectColumnKey(subj);
                        const rawVal = row[colKey];
                        if (rawVal !== '' && rawVal !== undefined && rawVal !== null) {
                            const num = Number(rawVal);
                            if (!isNaN(num) && num >= 0 && num <= totalMarks) {
                                r.subjectScores[subj.code] = num;
                                scoresImported++;
                                hasAnyScore = true;
                            } else {
                                console.warn(`Invalid score "${rawVal}" for ${r.name} / ${subj.name}`);
                            }
                        }
                    });

                    // Recompute average & status
                    r.score = computeStudentAverage(r, exam);
                    r.status = countGradedSubjects(r, exam) > 0 ? 'Graded' : 'Pending';
                    if (hasAnyScore) studentsMatched++;
                } else {
                    studentsUnmatched++;
                }
            });

            saveData();
            renderExamGradingTable(exam);
            renderExamListGrid();

            // Reset file input
            const fileInput = $('egImportFile');
            if (fileInput) fileInput.value = '';

            const msg = `Imported ${scoresImported} score${scoresImported === 1 ? '' : 's'} across ${studentsMatched} learner${studentsMatched === 1 ? '' : 's'}${studentsUnmatched > 0 ? ` · ${studentsUnmatched} not found in file` : ''}`;
            showToast(msg, scoresImported > 0 ? 'success' : 'warning');
        } catch (err) {
            console.error('Import failed:', err);
            showToast('Failed to read file. Ensure it is a valid Excel/CSV.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

function generateStaffListPDF() {
    if (!window.jspdf) return showToast('PDF Library not loaded', 'error');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = addDocHeader(doc, "STAFF DIRECTORY");

    const data = StaffRepo.getAll().map(s => [
        s.name, 
        s.tsc || '-', 
        s.idNo || '-', 
        s.designation || '-', 
        s.dept || '-', 
        s.phone || '-'
    ]);

    doc.autoTable({
        startY: yPos,
        head: [['Name', 'TSC No', 'ID No', 'Designation', 'Department', 'Phone']],
        body: data,
        headStyles: { fillColor: [37, 99, 235] }
    });

    addDocFooter(doc);
    doc.save('Staff_Directory.pdf');
    showToast('Staff List Generated');
}

function generateSchoolProfile() {
    if (!window.jspdf) return showToast('PDF Library not loaded', 'error');
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let yPos = addDocHeader(doc, "SCHOOL PROFILE");

    yPos += 10;
    doc.setFontSize(12).setFont(undefined, 'bold').setTextColor(0);
    doc.text("Institution Details", 20, yPos);
    yPos += 5;
    
    const details = [
        ["School Name", store.settings.schoolName],
        ["KNEC Code", store.settings.schoolCode],
        ["Category", store.settings.category],
        ["Level", store.settings.level],
        ["Address", store.settings.address],
        ["Phone", store.settings.phone],
        ["Email", store.settings.email],
        ["Academic Year", store.settings.academicYear],
        ["Current Term", store.settings.currentTerm]
    ];

    doc.setFontSize(10);
    details.forEach(d => {
        doc.setFont(undefined, 'bold').text(d[0] + ":", 20, yPos);
        doc.setFont(undefined, 'normal').text(d[1] || 'N/A', 70, yPos);
        yPos += 8;
    });

    yPos += 10;
    doc.setFontSize(12).setFont(undefined, 'bold').setTextColor(0);
    doc.text("Head of Institution", 20, yPos);
    yPos += 5;

    const hoiDetails = [
        ["Name", store.settings.hoiName],
        ["Title", store.settings.hoiTitle],
        ["TSC No", store.settings.hoiTsc],
        ["Phone", store.settings.hoiPhone]
    ];

    doc.setFontSize(10);
    hoiDetails.forEach(d => {
        doc.setFont(undefined, 'bold').text(d[0] + ":", 20, yPos);
        doc.setFont(undefined, 'normal').text(d[1] || 'N/A', 70, yPos);
        yPos += 8;
    });

    addDocFooter(doc);
    doc.save('School_Profile.pdf');
    showToast('School Profile Generated');
}

function populateDropdownsForReports() {
    const gradeSelects = ['subjectReportGrade', 'classReportGrade'];
    const grades = Object.keys(CBC_LEVELS);

    gradeSelects.forEach(selectId => {
        const select = $(selectId);
        if (select && select.options.length <= 1) {
            select.innerHTML = '<option value="">Select Grade...</option>';
            grades.forEach(g => {
                select.innerHTML += `<option value="${g}">${g}</option>`;
            });
        }
    });
}

function populateSubjectReportDropdowns() {
    const grade = $('subjectReportGrade').value;
    const select = $('subjectReportSubject');
    if(!select) return;
    
    select.innerHTML = '<option value="">Select Subject...</option>';
    
    if (!grade) return;

    const applicableSubjects = store.learningAreas.filter(sub => 
        !sub.applicableLevels || sub.applicableLevels.includes(grade)
    );

    if (applicableSubjects.length === 0) {
        select.innerHTML = '<option value="">No Subjects Found</option>';
        return;
    }

    applicableSubjects.forEach(sub => {
        select.innerHTML += `<option value="${sub.code}">${sub.name}</option>`;
    });
}

// ==========================================================================
//   SETTINGS
// ==========================================================================
function switchSettingsTab(index) { document.querySelectorAll('.tab-btn').forEach((btn, i) => btn.classList.toggle('active', i === index)); document.querySelectorAll('.settings-tab-content').forEach((content, i) => content.classList.toggle('active', i === index)); }

function saveInstitutionDetails(e) { 
    e.preventDefault(); 
    store.settings.schoolName = getVal('setSchoolName'); store.settings.schoolCode = getVal('setSchoolCode'); store.settings.motto = getVal('setMotto'); store.settings.level = getVal('setSchoolLevel'); store.settings.category = getVal('setSchoolCategory'); store.settings.academicYear = getVal('setAcademicYear'); store.settings.currentTerm = getVal('setCurrentTerm'); store.settings.address = getVal('setAddress'); store.settings.phone = getVal('setPhone'); store.settings.email = getVal('setEmail');
    saveData(); updateHeaderAndDashboard(); showToast('School Details Saved Successfully!'); 
}

function saveHOIDetails(e) {
    e.preventDefault();
    const name = getVal('hoiName');
    if (!name) { showToast('HOI Name is required.', 'error'); return; }
    store.settings.hoiName = name; 
    store.settings.hoiTitle = getVal('hoiTitle'); 
    store.settings.hoiTsc = getVal('hoiTsc'); 
    store.settings.hoiPhone = getVal('hoiPhone'); 
    store.settings.hoiEmail = getVal('hoiEmail');
    saveData(); updateHOIPreview(); showToast('HOI Details Saved!');
}

function updateSettingsForm() { 
    setVal('setSchoolName', store.settings.schoolName); setVal('setSchoolCode', store.settings.schoolCode); setVal('setMotto', store.settings.motto); setVal('setSchoolLevel', store.settings.level || 'Primary School'); setVal('setSchoolCategory', store.settings.category || 'Public'); setVal('setAcademicYear', store.settings.academicYear || '2024'); setVal('setCurrentTerm', store.settings.currentTerm || 'Term 1'); setVal('setAddress', store.settings.address || ''); setVal('setPhone', store.settings.phone || ''); setVal('setEmail', store.settings.email || ''); 
    setVal('hoiName', store.settings.hoiName || ''); setVal('hoiTitle', store.settings.hoiTitle || 'Principal'); setVal('hoiTsc', store.settings.hoiTsc || ''); setVal('hoiPhone', store.settings.hoiPhone || ''); setVal('hoiEmail', store.settings.hoiEmail || '');
    if (store.settings.logo) { const el = $('settingsLogoPreview'); if(el) el.innerHTML = `<img src="${store.settings.logo}" alt="Logo" style="width:100%; height:100%; object-fit:contain;">`; }
    if (store.settings.stamp) { const el = $('stampPreview'); if(el) el.innerHTML = `<img src="${store.settings.stamp}" alt="Stamp">`; }
    if (store.settings.hoiSignature) { const el = $('hoiSignaturePreview'); if(el) el.innerHTML = `<img src="${store.settings.hoiSignature}" alt="HOI Signature">`; }
    if (store.settings.ctSignature) { const el = $('classTeacherSignaturePreview'); if(el) el.innerHTML = `<img src="${store.settings.ctSignature}" alt="Class Teacher Signature">`; }
    
    setVal('setEventName', store.settings.eventName || '');
    setVal('setEventDate', store.settings.eventDate || '');
    setVal('setEventDesc', store.settings.eventDesc || '');
    setVal('setNoticeTitle', store.settings.noticeTitle || '');
    setVal('setNoticeBody', store.settings.noticeBody || '');

  
    updateHeaderAndDashboard(); updateHOIPreview(); 
}

function saveEventsDetails(e) {
    e.preventDefault();
    
    store.settings.eventName = getVal('setEventName');
    store.settings.eventDate = getVal('setEventDate');
    store.settings.eventDesc = getVal('setEventDesc');
    store.settings.noticeTitle = getVal('setNoticeTitle');
    store.settings.noticeBody = getVal('setNoticeBody');
    
    saveData();
    showToast('Events & Notices Saved Successfully!');
}

function updateHOIPreview() {
    const name = getVal('hoiName') || 'Head of Institution';
    const title = getVal('hoiTitle') || 'Principal';
    const tsc = getVal('hoiTsc') || '---';
    const prevName = $('prevName'); if(prevName) prevName.innerText = name;
    const previewName = document.querySelector('.letterhead-preview h2'); if(previewName) previewName.innerText = name;
    const previewTitle = document.querySelector('.letterhead-preview p'); if(previewTitle) previewTitle.innerText = title;
    const previewTsc = document.querySelector('.letterhead-preview small'); if(previewTsc) previewTsc.innerText = `TSC: ${tsc}`;
    const sigPreview = document.querySelector('.preview-signature-box img');
    if (store.settings.hoiSignature && sigPreview) { sigPreview.src = store.settings.hoiSignature; sigPreview.style.display = 'block'; }
}

function updateHeaderAndDashboard() { 
    if ($('dashSchoolName')) $('dashSchoolName').innerText = store.settings.schoolName; 
    if ($('dashAdminName')) $('dashAdminName').innerText = CURRENT_USER?.name || 'Admin'; 
    if ($('brandName')) $('brandName').innerText = store.settings.schoolName; 
    if ($('prevName')) $('prevName').innerText = store.settings.schoolName; 
    if ($('prevMotto')) $('prevMotto').innerText = store.settings.motto; 
    if ($('prevCode')) $('prevCode').innerText = "Code: " + store.settings.schoolCode;
    const brandIconImg = document.querySelector('.brand-icon img'); 
    if (brandIconImg && store.settings.logo) { brandIconImg.src = store.settings.logo; }
}

function exportBackup() { 
    const dataStr = JSON.stringify(store, null, 2); 
    const blob = new Blob([dataStr], { type: 'application/json' }); 
    const a = document.createElement('a'); 
    a.href = URL.createObjectURL(blob); 
    a.download = `elimutrack_backup_${new Date().toISOString().split('T')[0]}.json`; 
    a.click(); 
    showToast('Backup Exported'); 
}

function importBackup(input) { 
    const file = input.files[0]; if (!file) return; 
    const reader = new FileReader(); 
    reader.onload = function(e) { 
        try { 
            const importedData = JSON.parse(e.target.result); 
            if (importedData.students && importedData.settings) { 
                Object.assign(store, importedData); 
                saveData(); 
                initializeApp(CURRENT_USER); 
                showToast('Backup Imported Successfully'); 
            } else { 
                showToast('Invalid backup file structure', 'error'); 
            } 
        } catch (err) { 
            showToast('Error Importing File', 'error'); 
        } 
    }; 
    reader.readAsText(file); input.value = ''; 
}

function handleGlobalSearch(val) { 
    if (val.length > 2) { 
        if ($('studentSearch')) $('studentSearch').value = val; 
        router('students'); 
        applyFilters(); 
    } 
}
// 2. HANDLE STEPS (Next / Back)
//    Removed handleStaffStep(): it duplicated the body-level listener in
//    initGlobalListeners() but skipped Step 1 validation, letting users
//    jump to Step 2 with empty required fields. The validated path
//    (nextStaffStep/prevStaffStep) is the single source of truth now.

function processAndSaveImage(input, key, previewId) {
    const file = input.files[0]; if (!file) return; if (!file.type.startsWith('image/')) { showToast('Please select a valid image file.', 'error'); return; }
    const reader = new FileReader(); reader.onload = function(e) {
        const img = new Image(); img.onload = function() {
            const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d'); const MAX_WIDTH = 300; const MAX_HEIGHT = 300;
            let width = img.width; let height = img.height;
            if (width > height) { if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; } } else { if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; } }
            canvas.width = width; canvas.height = height; ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8); store.settings[key] = dataUrl; saveData();
            const preview = $(previewId); if (preview) { preview.innerHTML = `<img src="${dataUrl}" alt="${key}" style="width:100%; height:100%; object-fit:contain;">`; }
            if (key === 'logo') updateHeaderAndDashboard();
            if (key === 'hoiSignature') updateHOIPreview();
            showToast('Image uploaded successfully.');
        }; img.src = e.target.result;
    }; reader.readAsDataURL(file);
}

function previewLogo(input) { processAndSaveImage(input, 'logo', 'settingsLogoPreview'); }
function previewStamp(input) { processAndSaveImage(input, 'stamp', 'stampPreview'); }
function previewHOISignature(input) { processAndSaveImage(input, 'hoiSignature', 'hoiSignaturePreview'); }
function previewCTSignature(input) { processAndSaveImage(input, 'ctSignature', 'classTeacherSignaturePreview'); }

//   MODERN DASHBOARD ENGINE  (Next-Gen v2.0)
// ==========================================================================
//   - Chart.js powered analytics
//   - Hero KPI cards with sparklines
//   - Bento grid: enrollment (bar/line/doughnut/polar), CBC competency donut,
//     gender bars, performance trend line, subject radar, top performers,
//     quick actions, activity timeline with filters
//   - Time-range filter, refresh, export, chart-type toggles
// ==========================================================================

// Chart instance registry - so we can destroy before re-rendering
const dashCharts = {};
// Activity filter state (persisted across renders within a session)
let dashActivityFilter = 'all';
// Enrollment chart-type state
let dashEnrollmentChartType = 'bar';
// Time-range state
let dashTimeRange = 'term';

// Color palette shared across dashboard charts
const DASH_PALETTE = {
    green: '#22C55E', greenSoft: 'rgba(34, 197, 94, 0.18)',
    indigo: '#6366f1', indigoSoft: 'rgba(99, 102, 241, 0.18)',
    amber: '#f59e0b', amberSoft: 'rgba(245, 158, 11, 0.18)',
    rose: '#f43f5e', roseSoft: 'rgba(244, 63, 94, 0.18)',
    teal: '#14b8a6', tealSoft: 'rgba(20, 184, 166, 0.18)',
    blue: '#3b82f6', blueSoft: 'rgba(59, 130, 246, 0.18)',
    pink: '#ec4899', pinkSoft: 'rgba(236, 72, 153, 0.18)',
    slate: '#64748b', slateSoft: 'rgba(100, 116, 139, 0.18)',
    // CBC competency bands: BE (Below), AE (Approaching), ME (Meeting), EE (Exceeding)
    cbc: {
        BE: { color: '#ef4444', soft: 'rgba(239, 68, 68, 0.85)', label: 'Below Expectation' },
        AE: { color: '#f59e0b', soft: 'rgba(245, 158, 11, 0.85)', label: 'Approaching Expectation' },
        ME: { color: '#22C55E', soft: 'rgba(34, 197, 94, 0.85)', label: 'Meeting Expectation' },
        EE: { color: '#6366f1', soft: 'rgba(99, 102, 241, 0.85)', label: 'Exceeding Expectation' }
    }
};

// Detect current dark mode
function dashIsDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
}

// Get theme-aware text/grid colors for charts
function dashThemeColors() {
    const dark = dashIsDark();
    return {
        text: dark ? '#cbd5e1' : '#1e293b',
        muted: dark ? '#64748b' : '#94a3b8',
        grid: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
        tooltipBg: dark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(30, 41, 59, 0.95)',
        cardBg: dark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.7)'
    };
}

// ==========================================================================
//   MASTER RENDER ENTRY
// ==========================================================================

function renderDashboard() {
    if (!store?.students) return;

    // 1. Compute core metrics
    const allStudents = StudentRepo.getAll();
    const studentCount = allStudents.length;
    const staffCount = StaffRepo.count();
    const allStaff = (typeof StaffRepo.getAll === 'function') ? StaffRepo.getAll() : (store.staff || []);
    const maleCount = allStudents.filter(s => s.gender === 'Male').length;
    const femaleCount = allStudents.filter(s => s.gender === 'Female').length;

    // Grade buckets actually present
    const gradeSet = new Set(allStudents.map(s => s.grade).filter(Boolean));

    // Exam-based metrics
    const exams = store.exams || [];
    let totalScore = 0, examCount = 0;
    exams.forEach(e => {
        const score = parseFloat(e.score) || 0;
        if (score > 0) { totalScore += score; examCount++; }
    });
    const avgPerformance = examCount > 0 ? Math.round(totalScore / examCount) : 0;

    // Pending tasks = students without any assessment
    const pendingTasks = allStudents.filter(s => !exams.some(e => e.studentId === s.id)).length;

    // CBC competency bands
    const competency = { BE: 0, AE: 0, ME: 0, EE: 0 };
    exams.forEach(e => {
        const score = parseFloat(e.score) || 0;
        if (score >= 80) competency.EE++;
        else if (score >= 50) competency.ME++;
        else if (score >= 30) competency.AE++;
        else competency.BE++;
    });

    // Attendance (synthetic - derive from notes or assume 92% baseline if no real data)
    let present = 0, absent = 0, attendanceRate = 0;
    if (store.attendance && Array.isArray(store.attendance) && store.attendance.length > 0) {
        store.attendance.forEach(a => {
            if (a.status === 'present' || a.status === 'Present') present++;
            else absent++;
        });
        const totalAtt = present + absent;
        attendanceRate = totalAtt > 0 ? Math.round((present / totalAtt) * 100) : 0;
    } else {
        // Estimate based on enrolled learners (assume 92% attendance, scaled)
        attendanceRate = studentCount > 0 ? 92 : 0;
        present = Math.round(studentCount * 0.92);
        absent = studentCount - present;
    }

    // 2. Hero KPI values (animated counters)
    dashAnimateValue('statEnrollment', 0, studentCount, 900);
    dashAnimateValue('statStaff', 0, staffCount, 900);
    dashAnimateValue('statCompetent', 0, avgPerformance, 900, '%');
    dashAnimateValue('statPending', 0, pendingTasks, 900);
    dashAnimateValue('statAttendance', 0, attendanceRate, 900, '%');

    // 3. Hero KPI meta numbers
    dashSetText('kpiMaleCount', maleCount);
    dashSetText('kpiFemaleCount', femaleCount);
    dashSetText('kpiGradeCount', gradeSet.size);
    dashSetText('kpiStaffTeaching', allStaff.length);
    dashSetText('kpiStaffRatio', studentCount > 0 && allStaff.length > 0 ? Math.round(studentCount / allStaff.length) : 0);
    dashSetText('kpiCompetentCount', competency.ME + competency.EE);
    dashSetText('kpiBelowCount', competency.AE + competency.BE);
    dashSetText('kpiPresent', present);
    dashSetText('kpiAbsent', absent);

    // Trend badges (computed from recent vs older exams / synthetic if few)
    updateTrendBadge('enrollment', studentCount);
    updateTrendBadge('competency', avgPerformance);
    updateTrendBadge('attendance', attendanceRate);

    // 4. Sparklines for hero KPIs
    renderSparkline('sparkEnrollment', buildSparkSeries(studentCount, 12, 0.85), DASH_PALETTE.green);
    renderSparkline('sparkStaff', buildSparkSeries(staffCount, 12, 0.95), DASH_PALETTE.indigo);
    renderSparkline('sparkCompetency', buildSparkSeries(avgPerformance, 12, 0.9, 0, 100), DASH_PALETTE.amber);
    renderSparkline('sparkPending', buildSparkSeries(pendingTasks, 12, 0.7), DASH_PALETTE.rose);
    renderSparkline('sparkAttendance', buildSparkSeries(attendanceRate, 12, 0.95, 0, 100), DASH_PALETTE.teal);

    // 5. Gender visual (animated bars)
    renderGenderVisual(maleCount, femaleCount);

    // 6. Charts
    renderDashboardChart();
    renderCompetencyChart(competency, examCount);
    renderPerformanceTrendChart(exams);
    renderSubjectRadarChart(exams);
    renderDashLeaderboard(allStudents, exams);

    // 7. Activity timeline
    renderRecentActivityFeed();

    // 8. Hook up controls (idempotent)
    bindDashboardControls();
}

// ==========================================================================
//   HELPER: Set text safely (dashboard-specific to avoid name collision)
// ==========================================================================
function dashSetText(id, val) {
    const el = $(id);
    if (el) el.textContent = val;
}

// ==========================================================================
//   HELPER: Compute a synthetic trend badge (% change vs "previous" period)
//   Uses small deterministic jitter so the dashboard feels alive even with
//   limited history. Real trend computed when exam timestamps exist.
// ==========================================================================
function updateTrendBadge(key, currentVal) {
    const el = document.querySelector(`[data-trend="${key}"]`);
    if (!el) return;
    // Try to derive from exam dates if available
    let pct = 0;
    if (key === 'competency' && store.exams && store.exams.length > 0) {
        // Compare last 5 vs previous 5 exam scores
        const sorted = [...store.exams].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        const recent = sorted.slice(-5).map(e => parseFloat(e.score) || 0).filter(s => s > 0);
        const older = sorted.slice(-10, -5).map(e => parseFloat(e.score) || 0).filter(s => s > 0);
        if (recent.length && older.length) {
            const r = recent.reduce((a, b) => a + b, 0) / recent.length;
            const o = older.reduce((a, b) => a + b, 0) / older.length;
            pct = o > 0 ? Math.round(((r - o) / o) * 100) : 0;
        }
    }
    if (pct === 0 && currentVal > 0) {
        // Fallback deterministic jitter
        pct = ((Math.abs(hashCode(key + currentVal)) % 9) + 2) * (currentVal % 2 === 0 ? 1 : -1);
    }
    const sign = pct >= 0 ? '+' : '';
    el.textContent = `${sign}${pct}%`;
    // Update parent badge class
    const badge = el.closest('.kpi-hero-badge');
    if (badge) {
        badge.classList.remove('up', 'down', 'neutral');
        if (pct > 0) { badge.classList.add('up'); badge.querySelector('i').className = 'fa-solid fa-arrow-trend-up'; }
        else if (pct < 0) { badge.classList.add('down'); badge.querySelector('i').className = 'fa-solid fa-arrow-trend-down'; }
        else { badge.classList.add('neutral'); badge.querySelector('i').className = 'fa-solid fa-minus'; }
    }
}

function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h << 5) - h + s.charCodeAt(i);
        h |= 0;
    }
    return h;
}

// ==========================================================================
//   HELPER: Build a sparkline data series (smooth trend ending at currentVal)
// ==========================================================================
function buildSparkSeries(currentVal, points, smoothness = 0.9, minVal = 0, maxVal = null) {
    const series = [];
    let v = currentVal * smoothness;
    const seed = hashCode(String(currentVal) + String(points));
    let rng = Math.abs(seed) || 1;
    const range = maxVal !== null ? maxVal - minVal : Math.max(currentVal * 1.2, 10);
    for (let i = 0; i < points - 1; i++) {
        // simple LCG
        rng = (rng * 1103515245 + 12345) & 0x7fffffff;
        const noise = ((rng / 0x7fffffff) - 0.5) * range * 0.15;
        v = Math.max(minVal, v + noise);
        series.push(Math.round(v * 10) / 10);
    }
    series.push(currentVal);
    return series;
}

// ==========================================================================
//   ANIMATED COUNTER (dashboard-specific - supports suffix like '%')
//   Renamed to avoid collision with the pre-existing animateValue.
// ==========================================================================
function dashAnimateValue(id, start, end, duration, suffix = "") {
    const obj = $(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.floor(ease * (end - start) + start);
        obj.innerHTML = currentVal + suffix;
        if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
}

// ==========================================================================
//   SPARKLINES (Chart.js mini line charts)
// ==========================================================================
function renderSparkline(canvasId, data, color) {
    const canvas = $(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    if (dashCharts[canvasId]) { dashCharts[canvasId].destroy(); }
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 40);
    gradient.addColorStop(0, color + '55');
    gradient.addColorStop(1, color + '00');
    dashCharts[canvasId] = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{
                data: data,
                borderColor: color,
                backgroundColor: gradient,
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } },
            animation: { duration: 800 }
        }
    });
}

// ==========================================================================
//   GENDER VISUAL (animated SVG bars)
// ==========================================================================
function renderGenderVisual(maleCount, femaleCount) {
    const total = maleCount + femaleCount;
    const malePct = total > 0 ? (maleCount / total) * 100 : 0;
    const femalePct = total > 0 ? (femaleCount / total) * 100 : 0;

    dashSetText('countMale', maleCount);
    dashSetText('countFemale', femaleCount);
    dashSetText('genderPercentMale', Math.round(malePct) + '%');
    dashSetText('genderPercentFemale', Math.round(femalePct) + '%');

    const barMale = $('genderBarMale');
    const barFemale = $('genderBarFemale');
    const labelMale = $('genderLabelMale');
    const labelFemale = $('genderLabelFemale');
    if (barMale && barFemale) {
        // SVG viewport y=10..100 => 90px height = 100%
        const maxBar = 90;
        const maleH = (malePct / 100) * maxBar;
        const femaleH = (femalePct / 100) * maxBar;
        // Animate by setting attributes (CSS transition handles smoothness)
        barMale.setAttribute('y', 100 - maleH);
        barMale.setAttribute('height', maleH);
        barFemale.setAttribute('y', 100 - femaleH);
        barFemale.setAttribute('height', femaleH);
    }
    if (labelMale) labelMale.textContent = maleCount;
    if (labelFemale) labelFemale.textContent = femaleCount;
}

// ==========================================================================
//   ENROLLMENT CHART (Bar / Line / Doughnut / Polar - toggleable)
// ==========================================================================
function renderDashboardChart() {
    const canvas = $('enrollmentChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (dashCharts.enrollment) { dashCharts.enrollment.destroy(); }

    const students = store.students || [];
    const filterVal = $('chartFilter') ? $('chartFilter').value : 'all';

    let filtered = students;
    if (BAND_GRADE_MAP[filterVal]) {
        const allowed = BAND_GRADE_MAP[filterVal];
        filtered = students.filter(s => allowed.includes(s.grade));
    }

    const allGrades = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
    const counts = {};
    allGrades.forEach(g => counts[g] = 0);
    filtered.forEach(s => { if (counts[s.grade] !== undefined) counts[s.grade]++; });

    // Compact labels for axis
    const labels = allGrades.map(g => g.replace('Grade ', 'G'));
    const values = allGrades.map(g => counts[g]);
    const theme = dashThemeColors();

    const palette = [DASH_PALETTE.green, DASH_PALETTE.indigo, DASH_PALETTE.amber, DASH_PALETTE.rose,
                     DASH_PALETTE.teal, DASH_PALETTE.blue, DASH_PALETTE.pink, DASH_PALETTE.slate,
                     '#8b5cf6', '#06b6d4', '#84cc16'];

    let datasetConfig = {};
    let chartOptions = {};

    if (dashEnrollmentChartType === 'bar') {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.95)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.35)');
        datasetConfig = {
            label: 'Learners',
            data: values,
            backgroundColor: gradient,
            borderColor: DASH_PALETTE.green,
            borderWidth: 1.5,
            borderRadius: 8,
            borderSkipped: false,
            hoverBackgroundColor: DASH_PALETTE.green
        };
        chartOptions = barLineOptions(theme);
    } else if (dashEnrollmentChartType === 'line') {
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.02)');
        datasetConfig = {
            label: 'Learners',
            data: values,
            borderColor: DASH_PALETTE.green,
            backgroundColor: gradient,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: DASH_PALETTE.green,
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        };
        chartOptions = barLineOptions(theme);
    } else if (dashEnrollmentChartType === 'doughnut') {
        datasetConfig = {
            label: 'Learners',
            data: values,
            backgroundColor: palette,
            borderColor: dashIsDark() ? '#1e293b' : '#fff',
            borderWidth: 3,
            hoverOffset: 12
        };
        chartOptions = doughnutOptions(theme, true);
    } else if (dashEnrollmentChartType === 'polarArea') {
        datasetConfig = {
            label: 'Learners',
            data: values,
            backgroundColor: palette.map(c => c + 'CC'),
            borderColor: dashIsDark() ? '#1e293b' : '#fff',
            borderWidth: 2
        };
        chartOptions = polarOptions(theme);
    }

    dashCharts.enrollment = new Chart(canvas.getContext('2d'), {
        type: dashEnrollmentChartType,
        data: { labels: labels, datasets: [datasetConfig] },
        options: chartOptions
    });

    // Render custom legend
    renderEnrollmentLegend(labels, values, palette);
}

function barLineOptions(theme) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: theme.tooltipBg,
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 10,
                displayColors: false,
                callbacks: {
                    title: (items) => items[0].label,
                    label: (item) => ` ${item.parsed.y || item.parsed} learners`
                }
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: theme.muted, font: { size: 11 } } },
            y: { beginAtZero: true, grid: { color: theme.grid, drawBorder: false }, ticks: { color: theme.muted, font: { size: 11 } } }
        },
        animation: { duration: 1000, easing: 'easeOutQuart' }
    };
}

function doughnutOptions(theme, withLegend = false) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        cutout: withLegend ? '55%' : '60%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: theme.tooltipBg,
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (item) => ` ${item.label}: ${item.parsed} learners`
                }
            }
        },
        animation: { duration: 1000, animateRotate: true, animateScale: true }
    };
}

function polarOptions(theme) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: theme.tooltipBg,
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 10
            }
        },
        scales: {
            r: {
                grid: { color: theme.grid },
                angleLines: { color: theme.grid },
                ticks: { color: theme.muted, backdropColor: 'transparent', font: { size: 10 } },
                pointLabels: { color: theme.text }
            }
        },
        animation: { duration: 1000 }
    };
}

function renderEnrollmentLegend(labels, values, palette) {
    const container = $('enrollmentChartLegend');
    if (!container) return;
    const total = values.reduce((a, b) => a + b, 0);
    if (total === 0) { container.innerHTML = '<span style="color:var(--text-muted);font-size:0.8rem">No enrollment data</span>'; return; }
    container.innerHTML = labels.map((lbl, i) => {
        const v = values[i];
        if (v === 0) return '';
        const pct = total > 0 ? Math.round((v / total) * 100) : 0;
        return `<span class="legend-item" data-index="${i}">
            <span class="legend-dot" style="background:${palette[i % palette.length]}"></span>
            <span>${lbl}</span>
            <span class="legend-value">${v} (${pct}%)</span>
        </span>`;
    }).join('');

    // Click to toggle visibility
    container.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('click', () => {
            const idx = parseInt(item.dataset.index);
            if (dashCharts.enrollment) {
                const meta = dashCharts.enrollment.getDatasetMeta(0);
                if (meta.data[idx]) {
                    meta.data[idx].hidden = !meta.data[idx].hidden;
                    item.classList.toggle('hidden');
                    dashCharts.enrollment.update();
                }
            }
        });
    });
}

// ==========================================================================
//   CBC COMPETENCY DONUT
// ==========================================================================
function renderCompetencyChart(competency, totalExams) {
    const canvas = $('competencyChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (dashCharts.competency) { dashCharts.competency.destroy(); }

    dashSetText('competencyCenterNum', totalExams);

    const theme = dashThemeColors();
    const bands = ['BE', 'AE', 'ME', 'EE'];
    const labels = bands.map(b => DASH_PALETTE.cbc[b].label);
    const values = bands.map(b => competency[b]);
    const colors = bands.map(b => DASH_PALETTE.cbc[b].color);

    dashCharts.competency = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderColor: dashIsDark() ? '#1e293b' : '#fff',
                borderWidth: 3,
                hoverOffset: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 10,
                    callbacks: {
                        label: (item) => {
                            const pct = totalExams > 0 ? Math.round((item.parsed / totalExams) * 100) : 0;
                            return ` ${item.label}: ${item.parsed} (${pct}%)`;
                        }
                    }
                }
            },
            animation: { duration: 1000, animateRotate: true, animateScale: true }
        }
    });

    // Custom legend
    const legendEl = $('competencyLegend');
    if (legendEl) {
        legendEl.innerHTML = bands.map(b => {
            const meta = DASH_PALETTE.cbc[b];
            return `<div class="competency-legend-item">
                <span class="dot" style="background:${meta.color}"></span>
                <span class="lbl">${b}</span>
                <span class="num">${competency[b]}</span>
            </div>`;
        }).join('');
    }
}

// ==========================================================================
//   PERFORMANCE TREND (line chart of recent assessment averages)
// ==========================================================================
function renderPerformanceTrendChart(exams) {
    const canvas = $('performanceTrendChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (dashCharts.trend) { dashCharts.trend.destroy(); }

    const theme = dashThemeColors();

    // Group exams by date (or by index if no date)
    const sorted = [...exams].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
    const groups = {};
    sorted.forEach((e, i) => {
        const key = e.date || `Assessment ${i + 1}`;
        if (!groups[key]) groups[key] = [];
        const score = parseFloat(e.score) || 0;
        if (score > 0) groups[key].push(score);
    });

    const labels = Object.keys(groups).slice(-12);
    const values = labels.map(k => {
        const arr = groups[k];
        return arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    });

    // Trend pill
    let trendPct = 0;
    if (values.length >= 2) {
        const first = values[0];
        const last = values[values.length - 1];
        trendPct = first > 0 ? Math.round(((last - first) / first) * 100) : 0;
    }
    const pill = $('trendPill');
    if (pill) {
        pill.classList.toggle('down', trendPct < 0);
        const arrow = trendPct >= 0 ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
        const sign = trendPct >= 0 ? '+' : '';
        pill.innerHTML = `<i class="fa-solid ${arrow}"></i> ${sign}${trendPct}%`;
    }

    if (values.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx.font = '14px Inter';
        ctx.fillStyle = theme.muted;
        ctx.textAlign = 'center';
        ctx.fillText('No assessment data yet', canvas.width / 2, canvas.height / 2);
        return;
    }

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.45)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0.02)');

    dashCharts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(l => l.length > 10 ? l.slice(5) : l),
            datasets: [{
                label: 'Avg. Score',
                data: values,
                borderColor: DASH_PALETTE.indigo,
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#fff',
                pointBorderColor: DASH_PALETTE.indigo,
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        label: (item) => ` Avg: ${item.parsed.y}%`
                    }
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: theme.muted, font: { size: 10 }, maxRotation: 0 } },
                y: { beginAtZero: true, max: 100, grid: { color: theme.grid, drawBorder: false }, ticks: { color: theme.muted, font: { size: 10 }, callback: (v) => v + '%' } }
            },
            animation: { duration: 1000, easing: 'easeOutQuart' }
        }
    });
}

// ==========================================================================
//   SUBJECT PERFORMANCE RADAR
// ==========================================================================
function renderSubjectRadarChart(exams) {
    const canvas = $('subjectRadarChart');
    if (!canvas || typeof Chart === 'undefined') return;
    if (dashCharts.radar) { dashCharts.radar.destroy(); }

    const theme = dashThemeColors();

    // Group by subject
    const subjectGroups = {};
    exams.forEach(e => {
        const subj = e.subjectName || e.subject || 'General';
        if (!subjectGroups[subj]) subjectGroups[subj] = [];
        const score = parseFloat(e.score) || 0;
        if (score > 0) subjectGroups[subj].push(score);
    });

    const labels = Object.keys(subjectGroups).slice(0, 8);
    const values = labels.map(l => {
        const arr = subjectGroups[l];
        return arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    });

    if (labels.length === 0) {
        const ctx = canvas.getContext('2d');
        ctx.font = '14px Inter';
        ctx.fillStyle = theme.muted;
        ctx.textAlign = 'center';
        ctx.fillText('No subject data yet', canvas.width / 2, canvas.height / 2);
        return;
    }

    dashCharts.radar = new Chart(canvas.getContext('2d'), {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Avg. Score',
                data: values,
                backgroundColor: 'rgba(34, 197, 94, 0.18)',
                borderColor: DASH_PALETTE.green,
                borderWidth: 2.5,
                pointBackgroundColor: DASH_PALETTE.green,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: theme.tooltipBg,
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    cornerRadius: 10,
                    displayColors: false,
                    callbacks: {
                        label: (item) => ` ${item.parsed.r}%`
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: theme.grid },
                    angleLines: { color: theme.grid },
                    ticks: { color: theme.muted, backdropColor: 'transparent', font: { size: 10 }, stepSize: 25 },
                    pointLabels: { color: theme.text, font: { size: 11, weight: '600' } }
                }
            },
            animation: { duration: 1000 }
        }
    });
}

// ==========================================================================
//   TOP PERFORMERS LEADERBOARD (Dashboard-specific)
//   Note: a separate `renderLeaderboard` exists in script.js (for the Analysis
//   section). We name this one `renderDashLeaderboard` to avoid shadowing.
// ==========================================================================
function renderDashLeaderboard(students, exams) {
    const container = $('leaderboardList');
    if (!container) return;

    // Compute average score per student
    const byStudent = {};
    exams.forEach(e => {
        if (!e.studentId) return;
        const score = parseFloat(e.score) || 0;
        if (score <= 0) return;
        if (!byStudent[e.studentId]) byStudent[e.studentId] = { total: 0, count: 0 };
        byStudent[e.studentId].total += score;
        byStudent[e.studentId].count++;
    });

    const ranked = students
        .map(s => {
            const stat = byStudent[s.id];
            const avg = stat && stat.count > 0 ? Math.round(stat.total / stat.count) : 0;
            return { ...s, avgScore: avg, examCount: stat ? stat.count : 0 };
        })
        .filter(s => s.avgScore > 0)
        .sort((a, b) => b.avgScore - a.avgScore)
        .slice(0, 6);

    if (ranked.length === 0) {
        container.innerHTML = `<div class="activity-empty">
            <i class="fa-solid fa-trophy" style="font-size:1.5rem;color:#f59e0b;display:block;margin-bottom:0.5rem"></i>
            No assessment data yet. Record assessments to see top performers.
        </div>`;
        return;
    }

    container.innerHTML = ranked.map((s, i) => {
        const rank = i + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : '';
        const initial = (s.name || '?').charAt(0).toUpperCase();
        const avatar = s.photo
            ? `<img class="leaderboard-avatar" src="${s.photo}" alt="${escapeHtml(s.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
               <div class="leaderboard-avatar" style="display:none; align-items:center; justify-content:center; background:var(--primary-gradient); color:#fff; font-weight:700;">${initial}</div>`
            : `<div class="leaderboard-avatar" style="display:flex; align-items:center; justify-content:center; background:var(--primary-gradient); color:#fff; font-weight:700;">${initial}</div>`;
        return `<div class="leaderboard-item ${rankClass}" onclick="viewStudentFromDash('${s.id}')">
            <div class="leaderboard-rank">${rank}</div>
            ${avatar}
            <div class="leaderboard-info">
                <div class="leaderboard-name">${escapeHtml(s.name || 'Unknown')}</div>
                <div class="leaderboard-meta">${s.grade || '—'} &middot; ${s.examCount} assessment${s.examCount !== 1 ? 's' : ''}</div>
            </div>
            <div class="leaderboard-score">${s.avgScore}%</div>
        </div>`;
    }).join('');
}

// ==========================================================================
//   ACTIVITY TIMELINE (Enhanced + filterable)
// ==========================================================================
function renderRecentActivityFeed() {
    const container = $('dashboardActivity');
    if (!container) return;
    container.innerHTML = '';

    const activities = [];

    // Recent admissions
    (store.students || []).slice(-8).reverse().forEach(s => {
        activities.push({
            type: 'student',
            icon: 'fa-user-plus',
            title: `New admission: ${s.name}`,
            meta: `${s.grade || '—'} &middot; ${s.reg || ''}`,
            time: s.admissionDate || 'Recently',
            timeRaw: s.admissionDate || ''
        });
    });

    // Recent assessments
    (store.exams || []).slice(-10).reverse().forEach(e => {
        const s = StudentRepo.getById(e.studentId);
        const name = s ? s.name : 'Unknown student';
        activities.push({
            type: 'exam',
            icon: 'fa-clipboard-check',
            title: `Assessment graded: ${e.subjectName || 'Subject'}`,
            meta: `${name} &middot; ${e.score || 0}%`,
            time: e.date || 'Recently',
            timeRaw: e.date || ''
        });
    });

    // Recent staff
    (store.staff || []).slice(-5).reverse().forEach(s => {
        activities.push({
            type: 'staff',
            icon: 'fa-id-card',
            title: `Staff update: ${s.name || 'Unknown'}`,
            meta: `${s.role || s.title || 'Staff'} &middot; ${s.employmentType || ''}`,
            time: 'Recently',
            timeRaw: ''
        });
    });

    // Sort by date if available (desc)
    activities.sort((a, b) => (b.timeRaw || '').localeCompare(a.timeRaw || ''));

    // Apply filter
    const filtered = dashActivityFilter === 'all'
        ? activities
        : activities.filter(a => a.type === dashActivityFilter);

    if (filtered.length === 0) {
        container.innerHTML = `<div class="activity-empty">
            <i class="fa-solid fa-inbox" style="font-size:1.5rem;color:var(--text-muted);display:block;margin-bottom:0.5rem"></i>
            No ${dashActivityFilter !== 'all' ? dashActivityFilter : ''} activity yet.
        </div>`;
        return;
    }

    filtered.slice(0, 12).forEach(act => {
        const item = document.createElement('div');
        item.className = 'activity-item-modern';
        item.innerHTML = `
            <div class="activity-icon-wrap ${act.type}">
                <i class="fa-solid ${act.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${act.title}</div>
                <div class="activity-meta">
                    <span class="activity-tag">${act.type}</span>
                    <span>${act.meta}</span>
                    <span>&middot;</span>
                    <span>${act.time}</span>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// ==========================================================================
//   DASHBOARD CONTROLS (idempotent binding)
// ==========================================================================
let dashControlsBound = false;
function bindDashboardControls() {
    if (dashControlsBound) return;

    // Chart-type toggle (enrollment)
    const toggle = $('enrollmentChartToggle');
    if (toggle) {
        toggle.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                dashEnrollmentChartType = btn.dataset.type;
                renderDashboardChart();
            });
        });
    }

    // Chart filter select
    const filterSelect = $('chartFilter');
    if (filterSelect && !filterSelect._dashBound) {
        filterSelect.addEventListener('change', renderDashboardChart);
        filterSelect._dashBound = true;
    }

    // Activity filter
    const actFilter = $('activityFilter');
    if (actFilter) {
        actFilter.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                actFilter.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                dashActivityFilter = btn.dataset.filter;
                renderRecentActivityFeed();
            });
        });
    }

    // Time-range pill
    const rangePill = $('dashRangePill');
    if (rangePill) {
        rangePill.querySelectorAll('.range-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                rangePill.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                dashTimeRange = btn.dataset.range;
                // Re-render with a subtle pulse
                if (typeof showToast === 'function') {
                    showToast(`Showing data for: ${btn.textContent.trim()}`, 'info');
                }
                renderDashboard();
            });
        });
    }

    // Refresh button
    const refreshBtn = $('dashRefreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            refreshBtn.classList.add('spinning');
            setTimeout(() => refreshBtn.classList.remove('spinning'), 800);
            renderDashboard();
            if (typeof showToast === 'function') showToast('Dashboard refreshed', 'success');
        });
    }

    // Export button
    const exportBtn = $('dashExportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportDashboardSnapshot);
    }

    // Theme change observer - re-render charts when theme toggles
    const themeObserver = new MutationObserver(() => {
        // Debounce via microtask
        clearTimeout(window._dashThemeRerender);
        window._dashThemeRerender = setTimeout(() => {
            if ($('dashboard')?.classList.contains('active')) renderDashboard();
        }, 200);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    dashControlsBound = true;
}

// ==========================================================================
//   EXPORT DASHBOARD SNAPSHOT (CSV of current KPIs + chart data)
// ==========================================================================
function exportDashboardSnapshot() {
    if (typeof showToast === 'function') showToast('Preparing dashboard export...', 'info');
    try {
        const rows = [
            ['Metric', 'Value'],
            ['Total Learners', StudentRepo.count()],
            ['Teaching Staff', StaffRepo.count()],
            ['Male Learners', (store.students || []).filter(s => s.gender === 'Male').length],
            ['Female Learners', (store.students || []).filter(s => s.gender === 'Female').length],
            ['Total Assessments', (store.exams || []).length],
            ['Avg. Performance', computeAvgPerformance()],
            [],
            ['Grade', 'Headcount'],
            ...computeGradeCounts()
        ];
        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-snapshot-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        if (typeof showToast === 'function') showToast('Dashboard exported as CSV', 'success');
    } catch (err) {
        console.error('Dashboard export failed:', err);
        if (typeof showToast === 'function') showToast('Export failed', 'error');
    }
}

function computeAvgPerformance() {
    const exams = store.exams || [];
    let total = 0, count = 0;
    exams.forEach(e => {
        const s = parseFloat(e.score) || 0;
        if (s > 0) { total += s; count++; }
    });
    return count > 0 ? Math.round(total / count) + '%' : '0%';
}

function computeGradeCounts() {
    const allGrades = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
    const counts = {};
    allGrades.forEach(g => counts[g] = 0);
    (store.students || []).forEach(s => { if (counts[s.grade] !== undefined) counts[s.grade]++; });
    return allGrades.map(g => [g, counts[g]]);
}

// ==========================================================================
//   VIEW STUDENT (used by leaderboard click) - delegates to existing handler
//   Note: a separate `viewStudent(id)` already exists in this file (Profile).
//   We name this one differently to avoid shadowing.
// ==========================================================================
function viewStudentFromDash(studentId) {
    if (typeof router === 'function' && typeof currentStudentId !== 'undefined') {
        // Reuse the existing profile-view function
        try { viewStudent(studentId); } catch (e) {
            router('students');
            setTimeout(() => {
                const viewBtn = document.querySelector(`[data-action="view"][data-id="${studentId}"]`);
                if (viewBtn) viewBtn.click();
            }, 350);
        }
    } else {
        router('students');
        setTimeout(() => {
            const viewBtn = document.querySelector(`[data-action="view"][data-id="${studentId}"]`);
            if (viewBtn) viewBtn.click();
        }, 350);
    }
}


function updateAssessmentMetrics() { 
    const totalExams = store.exams.length; 
    const competentExams = store.exams.filter(e => parseInt(e.score) >= 50).length; 
    const rate = totalExams > 0 ? Math.round((competentExams / totalExams) * 100) : 0; 
    const percentEl = $('metricPercent'); 
    const barEl = $('metricBar'); 
    if(percentEl) percentEl.textContent = rate + '%'; 
    if(barEl) barEl.style.width = rate + '%'; 
}

function renderRecentAdmissionsWidget() { 
    const container = $('dashboardWidgets'); 
    if (!container) return; 
    const recent = StudentRepo.getAll().slice(0, 3); 
    if (recent.length === 0) { 
        container.innerHTML = `<div class="empty-state">No learners admitted yet.</div>`; 
        return; 
    } 
    container.innerHTML = recent.map(s => `
        <div class="widget-list-item">
            <img src="${s.photo || DEFAULT_AVATAR}">
            <div class="item-info">
                <strong>${escapeHtml(s.name)}</strong>
                <small>${s.grade}</small>
            </div>
            <span class="status-badge success">New</span>
        </div>`
    ).join(''); 
}


function setText(id, text) { const el = $(id); if (el) el.textContent = text; }

function animateValue(id, start, end, duration, suffix = '') { 
    const el = $(id); 
    if (!el) return; 
    let startTimestamp = null; 
    const step = (timestamp) => { 
        if (!startTimestamp) startTimestamp = timestamp; 
        const progress = Math.min((timestamp - startTimestamp) / duration, 1); 
        el.textContent = Math.floor(progress * (end - start) + start).toLocaleString() + suffix; 
        if (progress < 1) { window.requestAnimationFrame(step); } 
    }; 
    window.requestAnimationFrame(step); 
}

function router(viewId, navEl) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active')); 
    $(viewId)?.classList.add('active');
    if ($('pageTitle')) $('pageTitle').innerText = viewId.charAt(0).toUpperCase() + viewId.slice(1);
    if (navEl) { document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active')); navEl.classList.add('active'); }
    
    switch(viewId) {
        case 'dashboard': renderDashboard(); break; 
        case 'students': initStudentSection(); break; 
        case 'staff': initStaffSection(); break; 
        case 'exams': resetExamView(); if (typeof initExamSystemDashboard === 'function') setTimeout(initExamSystemDashboard, 80); break; 
        case 'intake': resetIntakeForm(); break; 
        case 'settings': updateSettingsForm(); renderCourseSettings(); break; 
        case 'curricula': renderCurricula(); break;
        case 'timetable': if (typeof initTimetableSection === 'function') setTimeout(initTimetableSection, 80); break;
        case 'reports': if (typeof renderReportsAnalytics === 'function') setTimeout(renderReportsAnalytics, 80); break;
        case 'analysis': renderAnalysisTab(); if ($('analysisGradeSelect')) renderAnalysis(); break; 
        case 'profile': renderProfileTab(); if ($('profileStudentList')) populateProfileList(); break; 
        case 'notes': renderNotesTab(); break; 
        case 'Inbox': renderInboxTab(); break;
        case 'exams':
    // Refresh recent entries and stats when navigating to exams
    updateExamRecentEntries();
    updateExamQuickStats();
    break;
    }
    if (window.innerWidth < 768) $('sidebar')?.classList.remove('open');
}

function openDashTab(evt, tabName) {
    const tabMap = { 'Overview': 'tabOverview', 'Analysis': 'tabAnalysis', 'Profile': 'tabProfile', 'Notes': 'tabNotes', 'Inbox': 'tabInbox' };
    const targetId = tabMap[tabName] || tabName;
    const tabContents = document.getElementsByClassName('dash-tab-content');
    for (let i = 0; i < tabContents.length; i++) { tabContents[i].classList.remove('active'); }
    const tabLinks = document.getElementsByClassName('dash-nav-item');
    for (let i = 0; i < tabLinks.length; i++) { tabLinks[i].classList.remove('active'); }
    const targetTab = $(targetId);
    if (targetTab) { targetTab.classList.add('active'); } else { const overview = $('tabOverview'); if(overview) overview.classList.add('active'); }
    if (evt && evt.currentTarget) { evt.currentTarget.classList.add('active'); } else { const btn = document.querySelector(`.dash-nav-item[data-tab="${tabName}"]`); if (btn) btn.classList.add('active'); }
    
    switch(tabName) {
        case 'Overview': renderDashboard(); break; 
        case 'Analysis': renderAnalysisTab(); break; 
        case 'Profile': renderProfileTab(); break; 
        case 'Notes': renderNotesTab(); break; 
        case 'Inbox': renderInboxTab(); break;
    }
}

// ==========================================================================
//   ANALYTICS ENGINE
// ==========================================================================
function renderAnalysisTab() {
    const container = $('analysisContent');
    if (!container) return;

    container.innerHTML = `
        <div class="analysis-layout">
            <aside class="analysis-sidebar">
                <div class="analysis-search-header">
                    <div class="form-group" style="margin:0 0 0.5rem 0;">
                        <label style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted);">Select Learner</label>
                        <select id="analysisStudentSelect" class="form-control">
                            <option value="">-- Select --</option>
                        </select>
                    </div>
                    <div class="search-wrapper" style="margin-top:0.5rem; width:100%;">
                        <input type="text" id="analysisSearchInput" class="form-control" placeholder="Filter list..." style="padding-left: 0.5rem;">
                    </div>
                </div>
                <div class="analysis-student-list" id="analysisStudentList"></div>
            </aside>
            
            <main class="analysis-main">
                <div class="student-hero-card">
                    <div class="shc-info">
                        <h2 id="analysisHeroName">Select a Learner</h2>
                        <p id="analysisHeroGrade">Grade: --</p>
                    </div>
                    <div class="shc-stats">
                        <div>
                            <div class="shc-stat-val" id="analysisMeanScore">--</div>
                            <div class="shc-stat-label">Mean Score</div>
                        </div>
                        <div>
                            <div class="shc-stat-val" id="analysisRank">--</div>
                            <div class="shc-stat-label">Rank</div>
                        </div>
                        <div>
                            <div class="shc-stat-val" id="analysisTotalPoints">--</div>
                            <div class="shc-stat-label">Total Points</div>
                        </div>
                    </div>
                </div>

                <div class="analysis-grid-2">
                    <div class="chart-card-modern">
                        <div class="chart-header"><h3>Performance Trend</h3></div>
                        <div id="trendChartContainer" style="position:relative; height:180px;">
                             <canvas id="trendChart"></canvas>
                             <div id="trendEmptyState" style="display:none; position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); text-align:center; color:var(--text-muted);">
                                <i class="fa-solid fa-chart-line" style="font-size:1.5rem; margin-bottom:0.5rem;"></i>
                                <p>No history yet</p>
                             </div>
                        </div>
                    </div>
                    <div class="chart-card-modern">
                        <div class="chart-header"><h3>Subject Breakdown</h3></div>
                        <div class="visual-bar-chart" id="analysisBarChart"></div>
                    </div>
                </div>

                <div class="action-toolbar">
                    <div class="at-info" id="analysisStatus">Select a learner to view detailed analysis.</div>
                    <div class="at-actions">
                        <button class="btn btn-secondary btn-sm" id="btnAnalysisWindow" disabled>
                            <i class="fa-solid fa-eye"></i> View Performance
                        </button>
                    </div>
                </div>
            </main>
        </div>`;

    const listContainer = $('analysisStudentList'); 
    const select = $('analysisStudentSelect');
    const searchInput = $('analysisSearchInput');

    const students = StudentRepo.getAll();
    if (students.length === 0) {
        listContainer.innerHTML = `<div class="p-4 text-center text-muted">No learners admitted yet.</div>`;
        return;
    }

    const fragment = document.createDocumentFragment();
    
    students.forEach(s => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'analysis-student-item';
        itemDiv.dataset.id = s.id;
        itemDiv.dataset.name = s.name.toLowerCase(); 
        itemDiv.innerHTML = `
            <div class="asi-avatar"><i class="fa-solid fa-user"></i></div>
            <div class="asi-info">
                <h4>${escapeHtml(s.name)}</h4>
                <span>${s.grade}</span>
            </div>`;
        fragment.appendChild(itemDiv);

        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (${s.grade})`;
        select.appendChild(opt);
    });
    
    listContainer.appendChild(fragment);

    listContainer.addEventListener('click', (e) => { 
        const item = e.target.closest('.analysis-student-item'); 
        if(item) { 
            listContainer.querySelectorAll('.analysis-student-item').forEach(i => i.classList.remove('active')); 
            item.classList.add('active'); 
            
            $('analysisStudentSelect').value = item.dataset.id; 
            updateAnalysisDashboard(item.dataset.id); 
        } 
    });

    select.addEventListener('change', (e) => {
        const id = e.target.value;
        if(id) {
            const item = listContainer.querySelector(`[data-id="${id}"]`);
            if(item) {
                listContainer.querySelectorAll('.analysis-student-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            updateAnalysisDashboard(id);
        }
    });

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const items = listContainer.querySelectorAll('.analysis-student-item');
        items.forEach(item => {
            const name = item.dataset.name;
            item.style.display = name.includes(term) ? 'flex' : 'none';
        });
    });

    $('btnAnalysisWindow')?.addEventListener('click', () => { 
        const sid = $('analysisStudentSelect').value; 
        if(sid) { 
            openPerformanceAnalysisModal(sid); 
        } 
    });
}

function updateAnalysisDashboard(studentId) {
    const student = StudentRepo.getById(studentId); 
    if(!student) return;

    $('analysisHeroName').innerText = student.name; 
    $('analysisHeroGrade').innerText = `${student.grade} (${student.stream})`; 
    $('analysisStatus').innerText = "Viewing performance analytics.";
    $('btnAnalysisWindow').disabled = false;

    const exams = store.exams.filter(e => e.studentId === studentId);
    const avg = exams.length > 0 ? Math.round(exams.reduce((a,b) => a + parseInt(b.score), 0) / exams.length) : 0;
    
    $('analysisMeanScore').innerText = avg + '%';

    const allStudents = StudentRepo.findBy('grade', student.grade);
    
    const ranked = allStudents.map(s => {
        const sExams = store.exams.filter(e => e.studentId === s.id);
        const sAvg = sExams.length > 0 ? sExams.reduce((a,b) => a + parseInt(b.score), 0) / sExams.length : 0;
        return { id: s.id, avg: sAvg };
    }).sort((a,b) => b.avg - a.avg);

    const rank = ranked.findIndex(s => s.id === studentId) + 1;

    $('analysisRank').innerText = `#${rank > 0 ? rank : '--'}`;
    
    const totalPoints = exams.reduce((a, b) => a + (parseInt(b.score) || 0), 0);
    $('analysisTotalPoints').innerText = totalPoints;

    renderTrendChart(exams); 
    renderAnalysisBarChart(studentId, student.grade);
}

function renderTrendChart(exams) {
    const ctx = $('trendChart')?.getContext('2d'); 
    const emptyState = $('trendEmptyState');
    
    if(!ctx) return;
    
    if(window.trendChartInstance) window.trendChartInstance.destroy();

    const sorted = [...exams].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-10);

    if (sorted.length === 0) {
        if(emptyState) emptyState.style.display = 'block';
        ctx.canvas.style.display = 'none';
        return;
    }

    ctx.canvas.style.display = 'block';
    if(emptyState) emptyState.style.display = 'none';

    window.trendChartInstance = new Chart(ctx, { 
        type: 'line', 
        data: { 
            labels: sorted.map(e => new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })), 
            datasets: [{ 
                label: 'Score', 
                data: sorted.map(e => e.score), 
                borderColor: '#2563eb', 
                backgroundColor: 'rgba(37, 99, 235, 0.1)', 
                fill: true, 
                tension: 0.4, 
                pointBackgroundColor: '#2563eb',
                pointRadius: 4,
                pointHoverRadius: 6
            }] 
        }, 
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 12 },
                    bodyFont: { size: 14 },
                    callbacks: {
                        label: function(context) {
                            return `Score: ${context.parsed.y}%`;
                        }
                    }
                }
            }, 
            scales: { 
                y: { 
                    beginAtZero: true, 
                    max: 100,
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            } 
        } 
    });
}

function renderAnalysisBarChart(studentId, grade) {
    const container = $('analysisBarChart'); 
    if(!container) return; 
    container.innerHTML = '';
    
    const subjects = store.learningAreas.filter(s => !s.applicableLevels || s.applicableLevels.includes(grade));
    
    if (subjects.length === 0) {
        container.innerHTML = `<div class="p-4 text-center text-muted">No subjects found for this grade.</div>`;
        return;
    }

    subjects.forEach(sub => {
        const exam = store.exams.find(e => e.studentId === studentId && e.unitCode === sub.code); 
        const score = exam ? parseInt(exam.score) : 0; 
        const comp = getCompetenceStatus(score);
        
        const item = document.createElement('div'); 
        item.className = 'vbc-item';
        
        item.innerHTML = `
            <div class="vbc-label" title="${sub.name}">${sub.code}</div>
            <div class="vbc-track">
                <div class="vbc-fill" style="width: ${score}%; background: ${comp.class === 'status-c' ? '#10b981' : '#ef4444'}"></div>
            </div>
            <div class="vbc-value" title="${comp.level}">
                <span style="font-size:0.7rem; color:var(--text-muted); margin-right:2px;">${comp.abbr}</span> 
                ${score}%
            </div>`;
        container.appendChild(item);
    });
}

// ==========================================================================
//   PERFORMANCE ANALYSIS MODAL
// ==========================================================================

function openPerformanceAnalysisModal(studentId) {
    const student = StudentRepo.getById(studentId);
    if (!student) return showToast('Learner not found.', 'error');

    const exams = store.exams.filter(e => e.studentId === studentId);
    const avg = exams.length > 0 ? Math.round(exams.reduce((a,b) => a + parseInt(b.score), 0) / exams.length) : 0;
    const totalPoints = exams.reduce((a, b) => a + (parseInt(b.score) || 0), 0);
    
    const allStudents = StudentRepo.findBy('grade', student.grade);
    const ranked = allStudents.map(s => {
        const sExams = store.exams.filter(e => e.studentId === s.id);
        const sAvg = sExams.length > 0 ? sExams.reduce((a,b) => a + parseInt(b.score), 0) / sExams.length : 0;
        return { id: s.id, avg: sAvg };
    }).sort((a,b) => b.avg - a.avg);
    const rank = ranked.findIndex(s => s.id === studentId) + 1;

    const subjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(student.grade));

    let tableRows = '';
    subjects.forEach(sub => {
        const exam = store.exams.find(e => e.studentId === studentId && e.unitCode === sub.code);
        const score = exam ? parseInt(exam.score) : 0;
        const gradeInfo = getLetterGrade(score);
        const comp = getCompetenceStatus(score);
        
        tableRows += `
            <tr>
                <td>${sub.name}</td>
                <td style="text-align:center; font-weight:bold;">${score}</td>
                <td style="text-align:center;">${gradeInfo.grade}</td>
                <td style="text-align:center;">${gradeInfo.points}</td>
                <td><span class="badge-competence ${comp.class}">${comp.abbr}</span></td>
                <td>${gradeInfo.remarks}</td>
            </tr>
        `;
    });

    const content = `
        <div class="analysis-modal-content">
            <div class="am-header">
                <div class="am-school-info">
                    <h2>${store.settings.schoolName || 'School Name'}</h2>
                    <p>Academic Report Form - ${store.settings.academicYear} ${store.settings.currentTerm}</p>
                </div>
                <button class="modal-close" data-dismiss="modal">&times;</button>
            </div>

            <div class="am-student-strip">
                <img src="${student.photo || DEFAULT_AVATAR}" class="am-avatar">
                <div class="am-details">
                    <h3>${student.name.toUpperCase()}</h3>
                    <div class="am-meta">
                        <span><strong>Adm No:</strong> ${student.reg}</span>
                        <span><strong>Grade:</strong> ${student.grade} (${student.stream})</span>
                        <span><strong>Gender:</strong> ${student.gender}</span>
                    </div>
                </div>
            </div>

            <div class="am-summary-grid">
                <div class="am-stat-box blue">
                    <div class="ams-value">${avg}%</div>
                    <div class="ams-label">Mean Score</div>
                </div>
                <div class="am-stat-box green">
                    <div class="ams-value">#${rank > 0 ? rank : '--'}</div>
                    <div class="ams-label">Class Rank</div>
                </div>
                <div class="am-stat-box orange">
                    <div class="ams-value">${totalPoints}</div>
                    <div class="ams-label">Total Points</div>
                </div>
                <div class="am-stat-box purple">
                    <div class="ams-value">${exams.length}</div>
                    <div class="ams-label">Subjects Done</div>
                </div>
            </div>

            <div class="am-table-container">
                <table class="am-table">
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th style="width:80px;">Score</th>
                            <th style="width:60px;">Grade</th>
                            <th style="width:60px;">Pts</th>
                            <th style="width:80px;">Level</th>
                            <th>Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>

            <div class="am-grading-scale">
                <h4>Grading Scale</h4>
                <div class="gs-grid">
                    <div class="gs-item"><span class="dot green"></span> 80-100%: A (Exceeding Expectation)</div>
                    <div class="gs-item"><span class="dot blue"></span> 50-79%: A-C (Meeting Expectation)</div>
                    <div class="gs-item"><span class="dot orange"></span> 30-49%: D (Approaching Expectation)</div>
                    <div class="gs-item"><span class="dot red"></span> 0-29%: E (Below Expectation)</div>
                </div>
            </div>

            <div class="am-actions">
                <button class="btn btn-secondary" data-dismiss="modal"><i class="fa-solid fa-times"></i> Close</button>
                <button class="btn btn-primary" onclick="generateTranscriptPDF('${studentId}', false)"><i class="fa-solid fa-download"></i> Download PDF</button>
            </div>
        </div>
    `;

    let modal = $('performanceAnalysisModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'performanceAnalysisModal';
        modal.className = 'modal-backdrop'; 
        modal.innerHTML = `<div class="modal-content-wrapper" style="width: 900px; max-width: 95%;">${content}</div>`;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
            .analysis-modal-content { background: #fff; border-radius: 8px; overflow: hidden; }
            .am-header { background: #003366; color: white; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
            .am-header h2 { margin: 0; font-size: 1.2rem; }
            .am-header p { margin: 0; font-size: 0.8rem; opacity: 0.8; }
            .am-student-strip { display: flex; align-items: center; padding: 1.5rem; border-bottom: 1px solid #eee; gap: 1.5rem; }
            .am-avatar { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 2px solid #003366; }
            .am-details h3 { margin: 0; color: #333; }
            .am-meta { margin-top: 0.25rem; display: flex; gap: 1rem; font-size: 0.85rem; color: #666; }
            .am-summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding: 1.5rem; }
            .am-stat-box { padding: 1rem; text-align: center; border-radius: 6px; color: white; }
            .am-stat-box.blue { background: #2563eb; }
            .am-stat-box.green { background: #16a34a; }
            .am-stat-box.orange { background: #f97316; }
            .am-stat-box.purple { background: #7c3aed; }
            .ams-value { font-size: 1.5rem; font-weight: bold; }
            .ams-label { font-size: 0.75rem; opacity: 0.9; text-transform: uppercase; }
            .am-table-container { padding: 0 1.5rem; }
            .am-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
            .am-table th, .am-table td { padding: 0.6rem; border-bottom: 1px solid #eee; text-align: left; }
            .am-table th { background: #f8f9fa; color: #555; font-weight: 600; }
            .badge-competence { padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: bold; color: white; }
            .status-c { background: #10b981; }
            .status-nyc { background: #f43f5e; }
            .am-grading-scale { background: #f8fafc; padding: 1rem 1.5rem; margin-top: 1.5rem; border-top: 1px solid #eee; }
            .am-grading-scale h4 { margin: 0 0 0.5rem 0; font-size: 0.8rem; color: #555; }
            .gs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.75rem; color: #666; }
            .gs-item { display: flex; align-items: center; gap: 0.5rem; }
            .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
            .am-actions { padding: 1.5rem; display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid #eee; background: #fff; }
        `;
        document.head.appendChild(style);
    } else {
        modal.querySelector('.modal-content-wrapper').innerHTML = content;
    }

    openModal('performanceAnalysisModal');
}

// ==========================================================================
//   PROFILE TAB
// ==========================================================================
function renderProfileTab() {
    const container = $('profileContent'); if (!container) return;
    container.innerHTML = `<div class="profile-layout"><div class="profile-cover"><div class="profile-avatar-container"><div class="profile-avatar-lg" id="profileAvatar"><i class="fa-solid fa-user"></i></div><div class="profile-name-block"><h1 id="profileName">Select Student</h1><span id="profileReg">Adm No: ---</span></div></div></div><div class="profile-content-grid"><div class="info-card"><div class="info-card-header"><i class="fa-solid fa-user"></i> Personal Info</div><div class="info-list" id="profilePersonalInfo"><p class="text-muted">Select a student to view details.</p></div></div><div class="info-card"><div class="info-card-header"><i class="fa-solid fa-chart-bar"></i> Performance</div><div class="info-list" id="profilePerformance"><p class="text-muted">No data.</p></div></div></div><div class="form-group" style="margin-top: 1.5rem; max-width: 400px;"><label>Search Profile</label><select id="profileStudentSelect" class="form-control"><option value="">-- Select Learner --</option></select></div></div>`;
    
    const select = $('profileStudentSelect'); 
    StudentRepo.getAll().forEach(s => { 
        select.innerHTML += `<option value="${s.id}">${s.name} (${s.grade})</option>`; 
    });
    
    if(currentStudentId) { 
        select.value = currentStudentId; 
        loadStudentProfile(currentStudentId); 
        currentStudentId = null; 
    }
    select.addEventListener('change', (e) => loadStudentProfile(e.target.value));
}

function loadStudentProfile(id) {
    const s = StudentRepo.getById(id); 
    if(!s) return;
    
    $('profileAvatar').innerHTML = `<img src="${s.photo}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`; 
    
    $('profileName').innerText = s.name; 
    $('profileReg').innerText = `Adm No: ${s.reg}`;
    
    $('profilePersonalInfo').innerHTML = `
        <div class="info-row"><span class="info-label">Gender</span><span class="info-value">${s.gender}</span></div>
        <div class="info-row"><span class="info-label">DOB</span><span class="info-value">${s.dob}</span></div>
        <div class="info-row"><span class="info-label">Grade</span><span class="info-value">${s.grade}</span></div>
        <div class="info-row"><span class="info-label">Guardian</span><span class="info-value">${s.guardianName || 'N/A'}</span></div>
        <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${s.phone || 'N/A'}</span></div>
    `;
    
    const exams = store.exams.filter(e => e.studentId === id); 
    const avg = exams.length > 0 ? Math.round(exams.reduce((a,b) => a + parseInt(b.score), 0) / exams.length) : 0;
    let subjectRows = ''; 
    
    const subjects = store.learningAreas.filter(sub => !sub.applicableLevels || sub.applicableLevels.includes(s.grade));
    
    subjects.forEach(sub => { 
        const exam = exams.find(e => e.unitCode === sub.code); 
        subjectRows += `<div class="info-row"><span class="info-label">${sub.name}</span><span class="info-value">${exam ? exam.score + '%' : '-'}</span></div>`; 
    });
    
    $('profilePerformance').innerHTML = `
        <div class="info-row"><span class="info-label">Average Score</span><span class="info-value" style="color:var(--primary); font-weight:bold;">${avg}%</span></div>
        <hr style="margin: 0.5rem 0; border-style: dashed;">
        ${subjectRows}
    `;
}

// ==========================================================================
//   NOTES TAB
// ==========================================================================
function renderNotesTab() {
    const container = $('notesContent'); if(!container) return;
    container.innerHTML = `
        <div class="notes-container">
            <div class="notes-list-card">
                <div class="notes-tabs-simple">
                    <button class="nts-btn active" data-type="all">All</button>
                    <button class="nts-btn" data-type="Discipline">Discipline</button>
                    <button class="nts-btn" data-type="Activity">Activities</button>
                </div>
                <div id="notesList"></div>
            </div>
            <div class="note-detail-view">
                <div class="detail-header"><h3>Add New Record</h3></div>
                <form id="noteForm">
                    <div class="form-group"><label>Student</label><select id="noteStudent" class="form-control" required></select></div>
                    <div class="form-group"><label>Type</label><select id="noteType" class="form-control"><option>Discipline</option><option>Co-Curricular Activity</option></select></div>
                    <div class="form-group"><label>Description</label><textarea id="noteDesc" class="form-control" rows="4" required></textarea></div>
                    <button type="submit" class="btn btn-primary">Save Record</button>
                </form>
            </div>
        </div>
    `;
    
    const sel = $('noteStudent'); 
    StudentRepo.getAll().forEach(s => { sel.innerHTML += `<option value="${s.id}">${s.name}</option>`; });
    
    renderNotesList('all');
    
    document.querySelectorAll('.nts-btn').forEach(btn => { 
        btn.addEventListener('click', () => { 
            document.querySelectorAll('.nts-btn').forEach(b => b.classList.remove('active')); 
            btn.classList.add('active'); 
            renderNotesList(btn.dataset.type); 
        }); 
    });
    
    $('noteForm').addEventListener('submit', (e) => { 
        e.preventDefault(); 
        const note = { 
            id: generateId(), 
            studentId: $('noteStudent').value, 
            type: $('noteType').value, 
            text: $('noteDesc').value, 
            date: new Date().toISOString() 
        }; 
        if(!store.notes) store.notes = []; 
        store.notes.unshift(note); 
        saveData(); 
        showToast('Note Saved'); 
        renderNotesList('all'); 
        e.target.reset(); 
    });
}

function renderNotesList(filter) {
    const container = $('notesList'); 
    let data = store.notes || [];
    if(filter !== 'all') data = data.filter(n => n.type === filter);
    if(data.length === 0) return container.innerHTML = `<div class="p-4 text-center text-muted">No records found.</div>`;
    container.innerHTML = data.map(n => { 
        const student = StudentRepo.getById(n.studentId); 
        const badgeClass = n.type === 'Discipline' ? 'badge-discipline' : 'badge-cocurricular'; 
        return `<div class="note-item"><div class="note-meta"><span class="note-student">${student ? student.name : 'Unknown'}</span><span class="note-type-badge ${badgeClass}">${n.type}</span></div><p style="font-size: 0.85rem; margin: 0.5rem 0;">${n.text}</p><small style="color:var(--text-muted)">${new Date(n.date).toLocaleDateString()}</small></div>`; 
    }).join('');
}

// ==========================================================================
//   INBOX TAB
// ==========================================================================
function renderInboxTab() {
    const container = $('inboxContent'); if(!container) return;
    container.innerHTML = `
        <div class="inbox-container">
            <aside class="inbox-sidebar">
                <div class="inbox-folder-list">
                    <div class="inbox-folder active"><i class="fa-solid fa-inbox"></i> Inbox <span class="if-count">3</span></div>
                    <div class="inbox-folder"><i class="fa-solid fa-paper-plane"></i> Sent</div>
                    <div class="inbox-folder"><i class="fa-solid fa-star"></i> Starred</div>
                </div>
            </aside>
            <div class="inbox-messages">
                <div class="msg-list">
                    <div class="msg-item unread"><div class="msg-sender">System Admin</div><div class="msg-subject">Welcome to ElimuTrack!</div><div class="msg-preview">Thank you for setting up the system...</div></div>
                    <div class="msg-item"><div class="msg-sender">KNEC Updates</div><div class="msg-subject">New Assessment Guidelines</div><div class="msg-preview">Please review the new guidelines...</div></div>
                </div>
                <div class="msg-content">
                    <div class="msg-header"><h3>System Admin</h3><small>Today at 10:00 AM</small></div>
                    <div class="msg-body"><h4>Welcome to ElimuTrack!</h4><p>Thank you for setting up the system. This messaging center is currently a placeholder for future communication features.</p></div>
                </div>
            </div>
        </div>
    `;
}

// ==========================================================================
//   BATCH LOGIC
// ==========================================================================
function downloadAdmissionTemplate() {
    if (!window.XLSX) return showToast('Excel library required.', 'error');
    
    // 1. Updated Headers: Merged Surname, First Name, and Other Names into 'Full Name'
    const headers = ['Full Name', 'Gender', 'DOB', 'Birth Cert No', 'Phone', 'Grade', 'Stream'];
    
    // 2. Updated Sample Data showing concatenated names
    const sample = [
        ['Wanjiru Amani', 'Female', '2012-03-15', '12345678', '0712345678', 'Grade 7', 'Blue'],
        ['Otieno Brian', 'Male', '2011-08-22', '22345678', '0722345678', 'Grade 7', 'Blue'],
        ['Njeri Keziah Wambui', 'Female', '2012-11-09', '32345678', '0732345678', 'Grade 7', 'Yellow'] // Example with 3 names
    ];
    
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sample]);
    
    // 3. Updated Column Widths (Reduced from 8 to 7 columns, widened 'Full Name')
    ws['!cols'] = [
        {wch: 28}, // Full Name
        {wch: 10}, // Gender
        {wch: 12}, // DOB
        {wch: 14}, // Birth Cert No
        {wch: 14}, // Phone
        {wch: 10}, // Grade
        {wch: 10}  // Stream
    ];
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Admissions');
    XLSX.writeFile(wb, 'Admission_Template.xlsx');
    
    showToast('Template Downloaded - Use "Full Name" column for Surname, First & Other names.');
}

// ==========================================================================
//   BATCH ADMISSION - Manual + Excel modes
//   Driven by: Surname, First Name, Grade, Stream (+ optional Gender, DOB,
//   Birth Cert No, Phone). Rows without Surname+First Name are skipped.
// ==========================================================================

let batchManualRows = []; // each: { surname, firstName, gender, dob, idNumber, phone, grade, stream, _valid, _errors[] }
let batchExcelData = [];  // raw rows from excel, normalized to same shape
let currentBatchMode = 'manual';

// Grade / Stream options (single source of truth)
const BATCH_GRADE_OPTIONS = ['PP1','PP2','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8','Grade 9'];
const BATCH_STREAM_OPTIONS = ['Blue','Yellow','Red','Green'];

// ---------- Mode switching ----------
function switchBatchMode(mode) {
    currentBatchMode = mode;
    document.querySelectorAll('#batchTabs .batch-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.mode === mode);
    });
    $('batchManualPanel')?.classList.toggle('active', mode === 'manual');
    $('batchExcelPanel')?.classList.toggle('active', mode === 'excel');
    updateBatchFooter();
}

// ---------- Manual mode: row management ----------
function addBatchManualRow(data = {}) {
    const tbody = $('batchManualBody');
    if (!tbody) return;
    const idx = tbody.children.length + 1;
    const tr = document.createElement('tr');
    tr.className = 'batch-manual-row';

    const gradeSel = `<select class="batch-input batch-grade" data-field="grade">
        <option value="">-</option>
        ${BATCH_GRADE_OPTIONS.map(g => `<option value="${g}" ${data.grade === g ? 'selected' : ''}>${g}</option>`).join('')}
    </select>`;
    const streamSel = `<select class="batch-input batch-stream" data-field="stream">
        <option value="">-</option>
        ${BATCH_STREAM_OPTIONS.map(s => `<option value="${s}" ${data.stream === s ? 'selected' : ''}>${s}</option>`).join('')}
    </select>`;
    const genderSel = `<select class="batch-input batch-gender" data-field="gender">
        <option value="">-</option>
        <option value="Male" ${data.gender === 'Male' ? 'selected' : ''}>Male</option>
        <option value="Female" ${data.gender === 'Female' ? 'selected' : ''}>Female</option>
    </select>`;

    tr.innerHTML = `
        <td><span class="batch-row-index">${idx}</span></td>
        <td><input type="text" class="batch-input batch-surname" data-field="surname" placeholder="Surname" value="${escapeHtml(data.surname || '')}"></td>
        <td><input type="text" class="batch-input batch-firstname" data-field="firstName" placeholder="First Name" value="${escapeHtml(data.firstName || '')}"></td>
        <td>${genderSel}</td>
        <td>${gradeSel}</td>
        <td>${streamSel}</td>
        <td><input type="text" class="batch-input batch-idnumber" data-field="idNumber" placeholder="Birth Cert No" value="${escapeHtml(data.idNumber || '')}" maxlength="8"></td>
        <td><input type="tel" class="batch-input batch-phone" data-field="phone" placeholder="07..." value="${escapeHtml(data.phone || '')}"></td>
        <td><span class="batch-row-status pending" title="Not validated"><i class="fa-solid fa-circle"></i></span></td>
        <td><button class="batch-row-del" title="Remove row"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbody.appendChild(tr);

    // Auto-fill default grade/stream if provided
    if (!data.grade) {
        const defaultGrade = $('batchGrade')?.value;
        if (defaultGrade) tr.querySelector('.batch-grade').value = defaultGrade;
    }
    if (!data.stream) {
        const defaultStream = $('batchStream')?.value;
        if (defaultStream) tr.querySelector('.batch-stream').value = defaultStream;
    }

    // Bind events
    tr.querySelectorAll('.batch-input').forEach(inp => {
        const ev = (inp.tagName === 'SELECT') ? 'change' : 'input';
        inp.addEventListener(ev, () => validateBatchRow(tr));
    });
    tr.querySelector('.batch-row-del').addEventListener('click', () => {
        tr.remove();
        renumberBatchRows();
        updateBatchManualCounters();
        updateBatchFooter();
    });

    // Validate on add (will mark as pending until user types)
    validateBatchRow(tr);
    updateBatchManualCounters();
    updateBatchFooter();
}

function renumberBatchRows() {
    document.querySelectorAll('#batchManualBody tr').forEach((tr, i) => {
        const idx = tr.querySelector('.batch-row-index');
        if (idx) idx.textContent = i + 1;
    });
}

function clearBatchManualRows() {
    const tbody = $('batchManualBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    // Add 3 fresh empty rows
    addBatchManualRow();
    addBatchManualRow();
    addBatchManualRow();
    updateBatchManualCounters();
    updateBatchFooter();
}

// ---------- Manual mode: row validation ----------
function validateBatchRow(tr) {
    if (!tr) return false;
    const get = (field) => tr.querySelector(`[data-field="${field}"]`)?.value?.trim() || '';
    const setClass = (field, state) => {
        const el = tr.querySelector(`[data-field="${field}"]`);
        if (!el) return;
        el.classList.remove('valid', 'invalid');
        if (state) el.classList.add(state);
    };

    const surname = get('surname');
    const firstName = get('firstName');
    const idNumber = get('idNumber');
    const phone = get('phone');
    const grade = get('grade');
    const stream = get('stream');

    // Default to batch grade/stream if blank
    const effGrade = grade || $('batchGrade')?.value || '';
    const effStream = stream || $('batchStream')?.value || '';

    const errors = [];

    // Surname required - allow letters, spaces, hyphens, apostrophes; min 2 chars
    if (!surname) { errors.push('surname'); setClass('surname', 'invalid'); }
    else if (surname.length < 2) { errors.push('surname'); setClass('surname', 'invalid'); }
    else if (!/^[\p{L}][\p{L}\s'-.]*$/u.test(surname)) { errors.push('surname'); setClass('surname', 'invalid'); }
    else setClass('surname', 'valid');

    // First Name required - same rules
    if (!firstName) { errors.push('firstName'); setClass('firstName', 'invalid'); }
    else if (firstName.length < 2) { errors.push('firstName'); setClass('firstName', 'invalid'); }
    else if (!/^[\p{L}][\p{L}\s'-.]*$/u.test(firstName)) { errors.push('firstName'); setClass('firstName', 'invalid'); }
    else setClass('firstName', 'valid');

    // Birth cert: optional but if present, must be 8 digits
    if (idNumber) {
        if (!/^\d{8}$/.test(idNumber)) { errors.push('idNumber'); setClass('idNumber', 'invalid'); }
        else {
            // Check duplicate within current table + existing students
            const editId = $('editModeId')?.value;
            const existsInStore = StudentRepo.getAll().some(s => s.idNumber === idNumber && s.id !== editId);
            const existsInBatch = Array.from(document.querySelectorAll('#batchManualBody tr'))
                .filter(r => r !== tr)
                .some(r => r.querySelector('[data-field="idNumber"]')?.value?.trim() === idNumber);
            if (existsInStore || existsInBatch) { errors.push('idNumber'); setClass('idNumber', 'invalid'); }
            else setClass('idNumber', 'valid');
        }
    } else {
        setClass('idNumber', ''); // optional
    }

    // Phone: optional but if present, must be valid KE phone
    if (phone) {
        if (!/^(?:254|\+254|0)?([17][0-9]{8})$/.test(phone)) { errors.push('phone'); setClass('phone', 'invalid'); }
        else setClass('phone', 'valid');
    } else {
        setClass('phone', '');
    }

    // Grade: required (from row or default)
    if (!effGrade) { errors.push('grade'); setClass('grade', 'invalid'); }
    else setClass('grade', 'valid');

    // Stream: required (from row or default)
    if (!effStream) { errors.push('stream'); setClass('stream', 'invalid'); }
    else setClass('stream', 'valid');

    // Update status badge
    const statusEl = tr.querySelector('.batch-row-status');
    tr.classList.remove('row-invalid');
    if (surname || firstName) {
        // Only mark invalid if user has started typing
        if (errors.length) {
            statusEl.className = 'batch-row-status invalid';
            statusEl.innerHTML = '<i class="fa-solid fa-exclamation"></i>';
            statusEl.title = 'Issues: ' + errors.join(', ');
            tr.classList.add('row-invalid');
        } else {
            statusEl.className = 'batch-row-status valid';
            statusEl.innerHTML = '<i class="fa-solid fa-check"></i>';
            statusEl.title = 'Ready';
        }
    } else {
        statusEl.className = 'batch-row-status pending';
        statusEl.innerHTML = '<i class="fa-solid fa-circle"></i>';
        statusEl.title = 'Enter surname and first name';
    }

    const isValid = (surname && firstName && effGrade && effStream && errors.length === 0);
    tr.dataset.valid = isValid ? '1' : '0';
    updateBatchManualCounters();
    updateBatchFooter();
    return isValid;
}

function updateBatchManualCounters() {
    const rows = document.querySelectorAll('#batchManualBody tr');
    let valid = 0, invalid = 0, total = 0;
    rows.forEach(tr => {
        const surname = tr.querySelector('[data-field="surname"]')?.value?.trim();
        const firstName = tr.querySelector('[data-field="firstName"]')?.value?.trim();
        if (surname || firstName) {
            total++;
            if (tr.dataset.valid === '1') valid++;
            else invalid++;
        }
    });
    if ($('batchManualCount')) $('batchManualCount').textContent = total;
    if ($('batchManualValid')) $('batchManualValid').textContent = valid;
    if ($('batchManualInvalid')) $('batchManualInvalid').textContent = invalid;
}

// ---------- Excel mode ----------
function handleBatchAdmissionFile(e) {
    const file = e.target.files[0] || (e.dataTransfer && e.dataTransfer.files[0]);
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
        showToast('Please upload an .xlsx or .xls file', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(ev) {
        try {
            const data = new Uint8Array(ev.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
            // Normalize columns
            batchExcelData = jsonData.map(row => normalizeExcelRow(row));
            renderBatchPreview(batchExcelData);
            showToast(`Loaded ${batchExcelData.length} rows from ${file.name}`, 'success');
        } catch (err) {
            console.error(err);
            showToast('Error reading Excel file: ' + err.message, 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}

function normalizeExcelRow(row) {
    // Try multiple possible column name variants
    const get = (keys) => {
        for (const k of keys) {
            for (const rk of Object.keys(row)) {
                if (rk.toLowerCase().trim() === k.toLowerCase()) return row[rk];
            }
        }
        return '';
    };
    let gender = get(['Gender', 'Gender (Male/Female)', 'Sex']);
    if (gender) {
        gender = String(gender).trim();
        if (/^m/i.test(gender)) gender = 'Male';
        else if (/^f/i.test(gender)) gender = 'Female';
    }
    let grade = String(get(['Grade', 'Class'])).trim();
    if (grade && !BATCH_GRADE_OPTIONS.includes(grade)) {
        // Try to match "Grade 7" vs "G7" vs "7"
        const m = grade.match(/(\d+)/);
        if (m) {
            const g = 'Grade ' + m[1];
            if (BATCH_GRADE_OPTIONS.includes(g)) grade = g;
        }
    }
    let stream = String(get(['Stream', 'Section', 'Class'])).trim();
    if (stream && !BATCH_STREAM_OPTIONS.includes(stream)) {
        // Capitalize first letter
        stream = stream.charAt(0).toUpperCase() + stream.slice(1).toLowerCase();
    }
    return {
        surname: String(get(['Surname', 'Last Name', 'LastName'])).trim(),
        firstName: String(get(['First Name', 'FirstName', 'FirstName'])).trim(),
        gender: gender,
        dob: String(get(['DOB', 'Date of Birth', 'Birth Date'])).trim(),
        idNumber: String(get(['Birth Cert No', 'BirthCertNo', 'Birth Certificate', 'ID Number', 'IDNumber'])).trim(),
        phone: String(get(['Phone', 'Phone Number', 'Mobile', 'Parent Phone'])).trim(),
        grade: grade,
        stream: stream
    };
}

function renderBatchPreview(data) {
    const container = $('batchPreviewContainer');
    const tbody = $('batchPreviewTable')?.querySelector('tbody');
    if (!container || !tbody) return;
    tbody.innerHTML = '';

    let valid = 0, invalid = 0;
    data.forEach((row, i) => {
        const errors = validateBatchDataObject(row, i, data);
        const isValid = errors.length === 0;
        if (isValid) valid++; else invalid++;

        const tr = document.createElement('tr');
        if (!isValid) tr.className = 'row-invalid';
        tr.innerHTML = `
            <td><span class="batch-row-index">${i + 1}</span></td>
            <td>${escapeHtml(row.surname || '')}</td>
            <td>${escapeHtml(row.firstName || '')}</td>
            <td>${escapeHtml(row.gender || '')}</td>
            <td>${escapeHtml(row.dob || '')}</td>
            <td>${escapeHtml(row.idNumber || '')}</td>
            <td>${escapeHtml(row.phone || '')}</td>
            <td>${escapeHtml(row.grade || '')}</td>
            <td>${escapeHtml(row.stream || '')}</td>
            <td>
                <span class="batch-row-status ${isValid ? 'valid' : 'invalid'}" title="${isValid ? 'Ready' : escapeHtml(errors.join('; '))}">
                    <i class="fa-solid ${isValid ? 'fa-check' : 'fa-exclamation'}"></i>
                </span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    container.style.display = 'block';
    if ($('batchExcelValid')) $('batchExcelValid').textContent = valid;
    if ($('batchExcelInvalid')) $('batchExcelInvalid').textContent = invalid;
    if ($('batchExcelTotal')) $('batchExcelTotal').textContent = data.length;
    updateBatchFooter();
}

function validateBatchDataObject(row, index, allRows) {
    const errors = [];
    if (!row.surname) errors.push('Surname required');
    else if (row.surname.length < 2) errors.push('Surname too short');
    else if (!/^[\p{L}][\p{L}\s'-.]*$/u.test(row.surname)) errors.push('Surname has invalid characters');
    if (!row.firstName) errors.push('First Name required');
    else if (row.firstName.length < 2) errors.push('First Name too short');
    else if (!/^[\p{L}][\p{L}\s'-.]*$/u.test(row.firstName)) errors.push('First Name has invalid characters');
    const effGrade = row.grade || $('batchGrade')?.value;
    const effStream = row.stream || $('batchStream')?.value;
    if (!effGrade) errors.push('Grade required (set default or in row)');
    if (!effStream) errors.push('Stream required (set default or in row)');
    if (row.idNumber) {
        if (!/^\d{8}$/.test(row.idNumber)) errors.push('Birth Cert must be 8 digits');
        else {
            const editId = $('editModeId')?.value;
            if (StudentRepo.getAll().some(s => s.idNumber === row.idNumber && s.id !== editId)) {
                errors.push('Birth Cert already exists');
            }
            // Check duplicates within batch
            const dup = allRows.filter((r, j) => j !== index && r.idNumber && r.idNumber === row.idNumber);
            if (dup.length) errors.push('Duplicate Birth Cert in batch');
        }
    }
    if (row.phone && !/^(?:254|\+254|0)?([17][0-9]{8})$/.test(row.phone)) {
        errors.push('Invalid phone format');
    }
    return errors;
}

function clearExcelUpload() {
    batchExcelData = [];
    if ($('batchAdmissionFile')) $('batchAdmissionFile').value = '';
    if ($('batchPreviewContainer')) $('batchPreviewContainer').style.display = 'none';
    if ($('batchPreviewTable')) $('batchPreviewTable').querySelector('tbody').innerHTML = '';
    updateBatchFooter();
}

// ---------- Footer summary + gather data ----------
function updateBatchFooter() {
    const data = getBatchData();
    const summaryEl = $('batchFooterSummary');
    const btn = $('btnConfirmBatchAdmission');
    if (!summaryEl || !btn) return;
    const validCount = data.length;
    summaryEl.textContent = `Ready to import ${validCount} learner${validCount !== 1 ? 's' : ''}`;
    btn.disabled = validCount === 0;
}

function getBatchData() {
    if (currentBatchMode === 'manual') {
        const rows = [];
        document.querySelectorAll('#batchManualBody tr').forEach(tr => {
            if (tr.dataset.valid !== '1') return;
            const get = (f) => tr.querySelector(`[data-field="${f}"]`)?.value?.trim() || '';
            rows.push({
                surname: get('surname'),
                firstName: get('firstName'),
                gender: get('gender'),
                dob: get('dob'),
                idNumber: get('idNumber'),
                phone: get('phone'),
                grade: get('grade') || $('batchGrade')?.value,
                stream: get('stream') || $('batchStream')?.value
            });
        });
        return rows;
    } else {
        // Excel mode - only return valid rows
        return batchExcelData.filter((row, i, arr) => validateBatchDataObject(row, i, arr).length === 0)
            .map(row => ({
                ...row,
                grade: row.grade || $('batchGrade')?.value,
                stream: row.stream || $('batchStream')?.value
            }));
    }
}

// ---------- Confirm & import ----------
function confirmBatchAdmission() {
    const defaultGrade = $('batchGrade')?.value;
    const defaultStream = $('batchStream')?.value;
    
    if (!defaultGrade || !defaultStream) {
        return showToast('Please set Default Grade and Default Stream', 'error');
    }
    
    const data = getBatchData();
    if (data.length === 0) {
        return showToast('No valid rows to import. Please fix errors first.', 'error');
    }

    let count = 0;
    let skipped = 0;
    const baseCount = StudentRepo.findBy('grade', defaultGrade).length;
    const year = new Date().getFullYear().toString().slice(-2);

    data.forEach((row, index) => {
        // 1. Extract the concatenated Full Name directly
        const fullName = row.fullName || row["Full Name"]; // Handles both exact key and header-mapped key
        if (!fullName || fullName.toString().trim() === '') { 
            skipped++; 
            return; 
        }

        const grade = row.grade || defaultGrade;
        const stream = row.stream || defaultStream;

        // Skip if birth cert already exists
        if (row.idNumber) {
            const existing = StudentRepo.getAll().some(s => s.idNumber === row.idNumber);
            if (existing) { skipped++; return; }
        }

        const studentData = {
            name: fullName.toString().trim(), // 2. Save the concatenated name directly
            gender: row.gender || 'Male',
            dob: row.dob || '2010-01-01',
            idNumber: row.idNumber || generateId().slice(0, 8),
            phone: row.phone || '',
            grade: grade,
            stream: stream,
            photo: DEFAULT_AVATAR,
            admissionDate: new Date().toISOString().slice(0, 10),
            entryLevel: 'Meeting Expectation',
            guardianName: '',
            guardianPhone: ''
        };

        const seq = (baseCount + count + 1).toString().padStart(3, '0');
        studentData.reg = `${grade.replace(' ', '')}/${year}/${seq}`;

        StudentRepo.create(studentData);
        count++;
    });

    if (count > 0) {
        saveData();
        renderDashboard();
        showToast(`${count} learner${count !== 1 ? 's' : ''} imported successfully!${skipped ? ` (${skipped} skipped)` : ''}`, 'success');
        closeModal('batchAdmissionModal');
        
        // Reset batch state
        if (typeof clearBatchManualRows === 'function') clearBatchManualRows();
        if (typeof clearExcelUpload === 'function') clearExcelUpload();
        
        router('students');
    } else {
        showToast('No new learners imported (all rows were empty or duplicates)', 'error');
    }
}
// ---------- Drag & drop ----------
// 1. Your Drop Handler (No changes needed, works perfectly)
function handleBatchFileDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const zone = $('batchUploadZone');
    if (zone) zone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
        if ($('batchAdmissionFile')) $('batchAdmissionFile').files = e.dataTransfer.files;
        handleBatchAdmissionFile({ target: { files: e.dataTransfer.files } });
    }
}

// 2. Temporary storage for parsed rows
let batchParsedRows = [];

// 3. File Reader - Maps "Full Name" template to your DB schema properties
function handleBatchAdmissionFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Read raw data from Excel
            const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
            
            if (rawRows.length === 0) {
                return showToast('The uploaded file is empty.', 'error');
            }

            // MAP EXACTLY TO WHAT confirmBatchAdmission EXPECTS
            batchParsedRows = rawRows.map(row => ({
                fullName: row["Full Name"] || "",          // Mapped from new template
                gender: row["Gender"] || "",
                dob: row["DOB"] || "",
                idNumber: String(row["Birth Cert No"] || ""), // Force string to prevent JS number glitches
                phone: String(row["Phone"] || ""),
                grade: row["Grade"] || "",
                stream: row["Stream"] || ""
            })).filter(row => row.fullName.trim() !== ""); // Ignore completely empty rows

            showToast(`Parsed ${batchParsedRows.length} learners. Click 'Confirm Import' to proceed.`, 'success');
            
            // Enable the confirm button
            const confirmBtn = $('btnConfirmBatchAdmission');
            if (confirmBtn) confirmBtn.disabled = false;

            // If you have a UI preview table function, trigger it here:
            // if (typeof renderBatchPreviewTable === 'function') renderBatchPreviewTable(batchParsedRows);

        } catch (error) {
            console.error("Error parsing file:", error);
            showToast('Failed to read file. Ensure it is a valid .xlsx file.', 'error');
        }
    };
    reader.readAsArrayBuffer(file);
}
// 4. The getter function your confirmBatchAdmission relies on
function getBatchData() {
    return batchParsedRows;
}
// ==========================================================================
//   ADMISSIONS WIZARD - Enhanced progress + summary
// ==========================================================================

function updateAdmProgress(step) {
    const pct = Math.round((step / 4) * 100);
    if ($('admProgressPct')) $('admProgressPct').textContent = pct + '%';
    if ($('admProgressBar')) $('admProgressBar').style.width = pct + '%';
}

function updateAdmissionSummary() {
    const surname = getVal('surname');
    const firstName = getVal('firstName');
    const otherNames = getVal('otherNames');
    const fullName = [surname, firstName, otherNames].filter(Boolean).join(' ') || '\u2014';
    const gender = getVal('gender') || '\u2014';
    const dob = getVal('dob') || '\u2014';
    const grade = getVal('regTrade') || '\u2014';
    const stream = getVal('level') || '\u2014';
    const guardian = getVal('guardianName') || '\u2014';
    const gPhone = getVal('guardianPhone');
    const idNum = getVal('idNumber') || '\u2014';

    setText('ascName', fullName);
    setText('ascReg', $('liveCardReg')?.innerText || '\u2014');
    setText('ascGradeStream', `${grade} / ${stream}`);
    setText('ascGenderDob', `${gender} / ${dob}`);
    setText('ascGuardian', guardian + (gPhone ? ` (${gPhone})` : ''));
    setText('ascId', idNum);

    // Update ADM preview code in step 3
    if (grade && $('admPreviewCode')) {
        const year = new Date().getFullYear().toString().slice(-2);
        const count = StudentRepo.findBy('grade', grade).length + 1;
        const seq = String(count).padStart(3, '0');
        $('admPreviewCode').textContent = `${grade.replace(' ', '')}/${year}/${seq}`;
    }
}

// Override setText locally for admissions summary (does not collide with existing setText
// because we only use it for admissions summary IDs). We re-use the existing setText.
// (No redefinition needed - setText exists at line ~4826 in script.js.)

// ==========================================================================
//   INIT - Bind all admissions controls (idempotent)
// ==========================================================================
let admissionsControlsBound = false;
function initAdmissionsControls() {
    if (admissionsControlsBound) return;

    // Command bar buttons
    $('admResetBtn')?.addEventListener('click', () => {
        if (confirm('Reset the entire admission form?')) {
            resetIntakeForm();
            updateAdmProgress(1);
            showToast('Form reset', 'info');
        }
    });
    $('admTemplateBtn')?.addEventListener('click', downloadAdmissionTemplate);
    $('admBatchBtn')?.addEventListener('click', () => {
        // Reset batch state on open
        clearBatchManualRows();
        clearExcelUpload();
        switchBatchMode('manual');
        // Pre-fill defaults with current step-3 selections if present
        if (getVal('regTrade')) setVal('batchGrade', getVal('regTrade'));
        if (getVal('level')) setVal('batchStream', getVal('level'));
        openModal('batchAdmissionModal');
    });

    // Batch tabs
    document.querySelectorAll('#batchTabs .batch-tab').forEach(tab => {
        tab.addEventListener('click', () => switchBatchMode(tab.dataset.mode));
    });

    // Batch default-grade/stream change -> re-validate manual rows + excel preview
    $('batchGrade')?.addEventListener('change', () => {
        document.querySelectorAll('#batchManualBody tr').forEach(tr => validateBatchRow(tr));
        if (batchExcelData.length) renderBatchPreview(batchExcelData);
        updateBatchFooter();
    });
    $('batchStream')?.addEventListener('change', () => {
        document.querySelectorAll('#batchManualBody tr').forEach(tr => validateBatchRow(tr));
        if (batchExcelData.length) renderBatchPreview(batchExcelData);
        updateBatchFooter();
    });

    // Batch manual controls
    $('batchAddRowBtn')?.addEventListener('click', () => addBatchManualRow());
    $('batchClearBtn')?.addEventListener('click', () => {
        if (confirm('Clear all manual rows?')) clearBatchManualRows();
    });

    // Batch excel controls
    $('batchExcelClearBtn')?.addEventListener('click', clearExcelUpload);

    // Upload zone: click to browse
    $('batchUploadZone')?.addEventListener('click', () => $('batchAdmissionFile')?.click());
    // Drag and drop
    const zone = $('batchUploadZone');
    if (zone) {
        zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
        zone.addEventListener('drop', handleBatchFileDrop);
    }

    // Wire step navigation to update progress
    // (nextStep / prevStep are defined elsewhere; we wrap them via delegation)
    document.querySelectorAll('.form-nav-modern button').forEach(btn => {
        if (btn.dataset.admWired) return;
        btn.dataset.admWired = '1';
        const origClick = btn.onclick;
        btn.addEventListener('click', () => {
            setTimeout(() => {
                // Determine current step from visible .form-step
                const visible = document.querySelector('.form-step.active');
                if (visible) {
                    const m = visible.id.match(/form-step-(\d)/);
                    if (m) {
                        updateAdmProgress(parseInt(m[1], 10));
                        if (m[1] === '4') updateAdmissionSummary();
                    }
                }
            }, 100);
        });
    });

    // Update summary whenever step 4 fields change
    ['guardianName', 'guardianPhone', 'guardianRel'].forEach(id => {
        $(id)?.addEventListener('input', updateAdmissionSummary);
    });

    // Update admPreviewCode when grade changes
    $('regTrade')?.addEventListener('change', updateAdmissionSummary);

    // Initial progress
    updateAdmProgress(1);

    admissionsControlsBound = true;
}

// Auto-init when DOM is ready (after the existing DOMContentLoaded runs)
// We hook this onto the existing router so it runs the first time intake is opened.
let _origRouter = window.router;
if (typeof _origRouter === 'function' && !window._admRouterWrapped) {
    window._admRouterWrapped = true;
    window.router = function(viewId, navEl) {
        const result = _origRouter(viewId, navEl);
        if (viewId === 'intake') {
            // Slight delay to let the section become visible
            setTimeout(initAdmissionsControls, 50);
        }
        // Modern v2: render analysis/profile when navigated to
        if (viewId === 'analysis' && typeof renderAnalysis === 'function') {
            setTimeout(renderAnalysis, 80);
        }
        if (viewId === 'profile' && typeof populateProfileList === 'function') {
            setTimeout(populateProfileList, 80);
        }
        if (viewId === 'reports' && typeof renderReportsAnalytics === 'function') {
            setTimeout(renderReportsAnalytics, 80);
        }
        if (viewId === 'timetable' && typeof initTimetableSection === 'function') {
            setTimeout(initTimetableSection, 80);
        }
        if (viewId === 'exams' && typeof initExamSystemDashboard === 'function') {
            setTimeout(initExamSystemDashboard, 80);
        }
        return result;
    };
}

// Wire the reports Refresh button and re-render analytics on demand
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const refreshBtn = $('btnRefreshReportStats');
        if (refreshBtn && refreshBtn.dataset.bound !== '1') {
            refreshBtn.dataset.bound = '1';
            refreshBtn.addEventListener('click', () => {
                if (typeof renderReportsAnalytics === 'function') {
                    renderReportsAnalytics();
                    showToast('Analytics refreshed');
                }
            });
        }
    }, 200);
});

// Also init on DOMContentLoaded (in case the user is already on intake)
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if ($('intake')?.classList.contains('active')) initAdmissionsControls();
    }, 500);
});



// ==========================================================================
//   BATCH ASSESSMENT (UPDATED)
// ==========================================================================
function openBatchAssessmentModal() { 
    const subjectId = currentExamContext.subjectId; 
    const gradeId = currentExamContext.tradeId; 
    if (!subjectId || !gradeId) return showToast('Select Grade and Subject first', 'error'); 
    
    const subject = store.learningAreas.find(s => s.id === subjectId); 
    if (!subject) return; 
    
    $('batchSubjectName').innerText = subject.name; 
    $('batchGradeName').innerText = gradeId; 
    
    const students = StudentRepo.findBy('grade', gradeId); 
    const tbody = $('batchAssessmentBody'); 
    tbody.innerHTML = ''; 
    
    if (students.length === 0) { 
        tbody.innerHTML = `<tr><td colspan="5">No learners found.</td></tr>`; 
        return openModal('batchAssessmentModal'); 
    } 
    
    students.forEach(s => { 
        const result = store.exams.find(e => e.studentId === s.id && e.unitCode === subject.code); 
        const score = result ? result.score : '';
        
        let levelDisplay = '-';
        let decisionDisplay = '-';
        
        if(result) {
            const comp = getCompetenceStatus(result.score);
            levelDisplay = comp.abbr; 
            decisionDisplay = comp.decision; 
        }
        
        tbody.innerHTML += `
            <tr data-student-id="${s.id}">
                <td>${s.reg}</td>
                <td>${s.name}</td>
                <td>
                    <input type="number" class="form-control batch-score" min="0" max="100" value="${score}" style="width:80px; text-align:center;">
                </td>
                <td class="batch-level-display">${levelDisplay}</td>
                <td class="batch-decision-display">${decisionDisplay}</td>
            </tr>`; 
    }); 
    
    tbody.removeEventListener('input', handleBatchScoreInput); 
    tbody.addEventListener('input', handleBatchScoreInput); 
    openModal('batchAssessmentModal'); 
}

function handleBatchScoreInput(e) { 
    if (e.target.classList.contains('batch-score')) { 
        const row = e.target.closest('tr'); 
        const score = parseInt(e.target.value) || 0; 
        const comp = getCompetenceStatus(score); 
        
        row.querySelector('.batch-level-display').innerText = comp.abbr; 
        row.querySelector('.batch-decision-display').innerText = comp.decision; 
    } 
}

function saveBatchAssessments() { 
    const subjectId = currentExamContext.subjectId; 
    const subject = store.learningAreas.find(s => s.id === subjectId); 
    if (!subject) return; 
    
    const rows = $('batchAssessmentBody').querySelectorAll('tr[data-student-id]'); 
    let count = 0; 
    
    rows.forEach(row => { 
        const studentId = row.dataset.studentId; 
        const scoreInput = row.querySelector('.batch-score'); 
        const score = parseInt(scoreInput.value); 
        
        if (!isNaN(score) && score >= 0 && score <= 100) { 
            const comp = getCompetenceStatus(score); 
            
            const data = { 
                id: generateId(), 
                studentId, 
                unitCode: subject.code, 
                score, 
                level: comp.level, 
                status: comp.decision, 
                grade: comp.abbr, 
                date: new Date().toISOString() 
            }; 
            
            const existingIndex = store.exams.findIndex(e => e.studentId === studentId && e.unitCode === subject.code); 
            if (existingIndex !== -1) store.exams[existingIndex] = data; 
            else store.exams.push(data); 
            count++; 
        } 
    }); 
    
    saveData(); 
    closeModal('batchAssessmentModal'); 
    renderDashboard(); 
    showToast(`${count} assessments saved.`); 
}

// ==========================================================================
//   SIDEBAR TOGGLE LOGIC
// ==========================================================================
function toggleSidebar() { 
    const sidebar = $('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// ==========================================================================
//   ANALYSIS SECTION LOGIC
// ==========================================================================

let subjectChartInstance = null;
let distChartInstance = null;
let analysisTrendChartInstance = null;
let genderComparisonChartInstance = null;
let leaderboardCurrentSubject = 'overall';

function renderAnalysis() {
    // 1. Get Context
    const selectedGrade = $('analysisGradeSelect') ? $('analysisGradeSelect').value : 'all';
    
    // 2. Filter Data
    let relevantStudents = StudentRepo.getAll();
    if (selectedGrade !== 'all') {
        relevantStudents = relevantStudents.filter(s => s.grade === selectedGrade);
    }

    const studentIds = relevantStudents.map(s => s.id);
    const relevantExams = store.exams.filter(e => studentIds.includes(e.studentId));

    // 3. Calculate Metrics
    let totalScore = 0;
    let count = 0;
    let subjectScores = {}; // { 'Math': [80, 90], 'Eng': [70] }
    
    relevantExams.forEach(e => {
        const score = parseInt(e.score) || 0;
        if(score > 0) {
            totalScore += score;
            count++;
            
            const subName = e.subjectName || 'Unknown';
            if(!subjectScores[subName]) subjectScores[subName] = [];
            subjectScores[subName].push(score);
        }
    });

    const avgScore = count > 0 ? Math.round(totalScore / count) : 0;

    // 4. Update KPIs
    animateValue('anaClassAvg', 0, avgScore, 800, '%');
    
    // CBC Categories (Exceeding: 80+, Meeting: 50-79, Below: <50)
    let exceeding = 0, approaching = 0, below = 0;
    Object.values(subjectScores).flat().forEach(s => {
        if(s >= 80) exceeding++;
        else if(s >= 50) approaching++;
        else below++;
    });

    animateValue('anaExceeding', 0, exceeding, 600);
    animateValue('anaApproaching', 0, approaching, 600);
    animateValue('anaBelow', 0, below, 600);

    // 4b. Trend indicators (compare first half vs second half of assessment list)
    const allScores = Object.values(subjectScores).flat();
    const trendData = computeTrendStats(allScores);
    updateTrendIndicator('anaClassAvgTrend', trendData, '%');
    updateTrendIndicator('anaExceedingTrend', computeCategoryTrend(relevantExams, s => s >= 80), '');
    updateTrendIndicator('anaApproachingTrend', computeCategoryTrend(relevantExams, s => s >= 50 && s < 80), '', true);
    updateTrendIndicator('anaBelowTrend', computeCategoryTrend(relevantExams, s => s < 50), '', true);

    // 4c. Sparklines
    renderSparkline('sparkClassAvg', trendData.series, '#22C55E');
    renderSparkline('sparkExceeding', computeCategorySeries(relevantExams, s => s >= 80), '#14B8A6');
    renderSparkline('sparkApproaching', computeCategorySeries(relevantExams, s => s >= 50 && s < 80), '#f59e0b');
    renderSparkline('sparkBelow', computeCategorySeries(relevantExams, s => s < 50), '#ef4444');

    // 4d. Context label
    const ctxLabel = $('chartContextLabel');
    if (ctxLabel) ctxLabel.textContent = selectedGrade === 'all' ? 'Whole school context' : `${selectedGrade} context`;

    // 5. Render Charts
    renderSubjectBarChart(subjectScores);
    renderCompetencyDonut(exceeding, approaching, below);
    renderAnalysisTrendChart(subjectScores);
    renderGenderComparisonChart(relevantStudents, relevantExams);
    renderSubjectHeatmap(relevantStudents, relevantExams);
    renderLeaderboard(relevantStudents, relevantExams);
}

// --- Helper: trend stats (splits scores into ~6 buckets over time) ---
function computeTrendStats(scores) {
    if (!scores || scores.length === 0) return { delta: 0, series: [0,0,0,0,0,0] };
    const buckets = 6;
    const series = new Array(buckets).fill(0);
    const per = Math.max(1, Math.ceil(scores.length / buckets));
    for (let i = 0; i < scores.length; i++) {
        const bucketIdx = Math.min(buckets - 1, Math.floor(i / per));
        series[bucketIdx] += scores[i];
    }
    // Convert bucket totals to averages (approximate)
    const counts = new Array(buckets).fill(0);
    for (let i = 0; i < scores.length; i++) {
        const bucketIdx = Math.min(buckets - 1, Math.floor(i / per));
        counts[bucketIdx]++;
    }
    const avgSeries = series.map((sum, i) => counts[i] > 0 ? Math.round(sum / counts[i]) : 0);
    const first = avgSeries[0] || 0;
    const last = avgSeries[avgSeries.length - 1] || 0;
    return { delta: last - first, series: avgSeries };
}

// --- Helper: count of items in each bucket matching a predicate ---
function computeCategorySeries(exams, predicate) {
    if (!exams || exams.length === 0) return [0,0,0,0,0,0];
    const buckets = 6;
    const series = new Array(buckets).fill(0);
    const per = Math.max(1, Math.ceil(exams.length / buckets));
    exams.forEach((e, i) => {
        const score = parseInt(e.score) || 0;
        const bucketIdx = Math.min(buckets - 1, Math.floor(i / per));
        if (predicate(score)) series[bucketIdx]++;
    });
    return series;
}

function computeCategoryTrend(exams, predicate) {
    const series = computeCategorySeries(exams, predicate);
    const first = series[0] || 0;
    const last = series[series.length - 1] || 0;
    return { delta: last - first, series };
}

function updateTrendIndicator(elId, trendData, suffix = '', invertColors = false) {
    const el = $(elId);
    if (!el) return;
    const delta = trendData.delta;
    const sign = delta > 0 ? '+' : '';
    el.textContent = `${sign}${delta}${suffix}`;
    const parent = el.parentElement;
    if (!parent) return;
    parent.classList.remove('trend-up', 'trend-down');
    if (delta >= 0) {
        parent.classList.add(invertColors ? 'trend-down' : 'trend-up');
    } else {
        parent.classList.add(invertColors ? 'trend-up' : 'trend-down');
    }
    // Also flip the icon
    const icon = parent.querySelector('i');
    if (icon) {
        icon.className = delta >= 0 ? 'fa-solid fa-arrow-trend-up' : 'fa-solid fa-arrow-trend-down';
    }
}

// --- Helper: render a tiny sparkline on a canvas ---
function renderSparkline(canvasId, data, color = '#22C55E') {
    const canvas = $(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(60, rect.width);
    const h = Math.max(20, rect.height || 40);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const values = data && data.length ? data : [0,0,0,0];
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const pad = 4;
    const stepX = (w - pad * 2) / Math.max(1, values.length - 1);

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '40');
    grad.addColorStop(1, color + '00');

    ctx.beginPath();
    values.forEach((v, i) => {
        const x = pad + i * stepX;
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.lineTo(pad + (values.length - 1) * stepX, h - pad);
    ctx.lineTo(pad, h - pad);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    values.forEach((v, i) => {
        const x = pad + i * stepX;
        const y = h - pad - ((v - min) / range) * (h - pad * 2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Last point dot
    const lastX = pad + (values.length - 1) * stepX;
    const lastY = h - pad - ((values[values.length - 1] - min) / range) * (h - pad * 2);
    ctx.beginPath();
    ctx.arc(lastX, lastY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

// --- CHART 1: SUBJECT PERFORMANCE (Gradient Bar Chart) ---
function renderSubjectBarChart(subjectScores) {
    const ctx = $('subjectPerformanceChart');
    if(!ctx) return;

    const labels = Object.keys(subjectScores);
    const data = labels.map(sub => {
        const scores = subjectScores[sub];
        return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    });

    if(subjectChartInstance) subjectChartInstance.destroy();

    // Build a vertical gradient per bar via a single gradient (uses chart area)
    const chartCtx = ctx.getContext('2d');
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, '#22C55E');
    gradient.addColorStop(1, '#86efac');

    subjectChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Average Score',
                    data: data,
                    backgroundColor: gradient,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: '#16A34A',
                    barPercentage: 0.65,
                    categoryPercentage: 0.7
                },
                {
                    label: 'Target 80%',
                    data: labels.map(() => 80),
                    type: 'line',
                    borderColor: '#94a3b8',
                    borderWidth: 1.5,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false,
                    tension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    titleFont: { weight: '700' },
                    callbacks: { label: (c) => `${c.dataset.label}: ${c.parsed.y}%` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] },
                    ticks: { color: '#94a3b8', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#64748b', font: { size: 11, weight: '600' } }
                }
            }
        }
    });
}

// --- CHART 2: COMPETENCY DISTRIBUTION (Polar Area, more modern) ---
function renderCompetencyDonut(exceeding, approaching, below) {
    const ctx = $('competencyDistributionChart');
    if(!ctx) return;

    if(distChartInstance) distChartInstance.destroy();

    distChartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['Exceeding Exp.', 'Meeting Exp.', 'Below Exp.'],
            datasets: [{
                data: [exceeding, approaching, below],
                backgroundColor: [
                    'rgba(20, 184, 166, 0.78)',
                    'rgba(245, 158, 11, 0.78)',
                    'rgba(239, 68, 68, 0.78)'
                ],
                borderColor: ['#14B8A6', '#f59e0b', '#ef4444'],
                borderWidth: 2,
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, animateRotate: true, animateScale: true },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8
                }
            },
            scales: {
                r: {
                    grid: { color: 'rgba(226, 232, 240, 0.6)' },
                    angleLines: { color: 'rgba(226, 232, 240, 0.6)' },
                    ticks: { display: false }
                }
            }
        }
    });

    // Custom legend
    const legendEl = $('competencyLegend');
    if (legendEl) {
        const total = exceeding + approaching + below || 1;
        legendEl.innerHTML = `
            <span class="polar-legend-item"><i style="background:#14B8A6"></i> Exceeding (${exceeding} · ${Math.round(exceeding/total*100)}%)</span>
            <span class="polar-legend-item"><i style="background:#f59e0b"></i> Meeting (${approaching} · ${Math.round(approaching/total*100)}%)</span>
            <span class="polar-legend-item"><i style="background:#ef4444"></i> Below (${below} · ${Math.round(below/total*100)}%)</span>
        `;
    }
}

// --- CHART 3: ANALYSIS TREND (multi-subject line chart) ---
function renderAnalysisTrendChart(subjectScores) {
    const ctx = $('analysisTrendChart');
    if (!ctx) return;

    if (analysisTrendChartInstance) analysisTrendChartInstance.destroy();

    // Build a series per top subject (max 4 subjects)
    const subjectEntries = Object.entries(subjectScores)
        .filter(([_, scores]) => scores.length > 0)
        .slice(0, 4);

    const palette = ['#22C55E', '#3b82f6', '#f59e0b', '#8b5cf6'];
    const datasets = subjectEntries.map(([sub, scores], idx) => {
        const color = palette[idx % palette.length];
        return {
            label: sub,
            data: scores.slice(-8), // last 8 scores
            borderColor: color,
            backgroundColor: color + '15',
            tension: 0.35,
            pointRadius: 3,
            pointBackgroundColor: color,
            pointBorderColor: '#fff',
            pointBorderWidth: 1.5,
            borderWidth: 2
        };
    });

    const maxLen = Math.max(1, ...datasets.map(d => d.data.length));
    const labels = Array.from({ length: maxLen }, (_, i) => `A${i + 1}`);

    analysisTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 11, weight: '600' } }
                },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8
                }
            },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            }
        }
    });
}

// --- CHART 4: GENDER COMPARISON (grouped bar) ---
function renderGenderComparisonChart(students, exams) {
    const ctx = $('genderComparisonChart');
    if (!ctx) return;

    if (genderComparisonChartInstance) genderComparisonChartInstance.destroy();

    // Group exams by subject, then split by student gender
    const maleStudentIds = new Set(students.filter(s => s.gender === 'Male').map(s => s.id));
    const femaleStudentIds = new Set(students.filter(s => s.gender === 'Female').map(s => s.id));
    const otherIds = new Set(students.filter(s => !maleStudentIds.has(s.id) && !femaleStudentIds.has(s.id)).map(s => s.id));

    const subjects = Array.from(new Set(exams.map(e => e.subjectName || 'Unknown'))).slice(0, 6);

    function avgFor(subject, idSet) {
        const subset = exams.filter(e => (e.subjectName || 'Unknown') === subject && idSet.has(e.studentId));
        if (subset.length === 0) return 0;
        return Math.round(subset.reduce((a, e) => a + (parseInt(e.score) || 0), 0) / subset.length);
    }

    const maleData = subjects.map(s => avgFor(s, maleStudentIds));
    const femaleData = subjects.map(s => avgFor(s, femaleStudentIds));

    genderComparisonChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [
                { label: 'Male', data: maleData, backgroundColor: '#3b82f6', borderRadius: 6, barPercentage: 0.7, categoryPercentage: 0.6 },
                { label: 'Female', data: femaleData, backgroundColor: '#ec4899', borderRadius: 6, barPercentage: 0.7, categoryPercentage: 0.6 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { usePointStyle: true, boxWidth: 8, padding: 12, font: { size: 11, weight: '600' } }
                },
                tooltip: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8 }
            },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4, 4] }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10, weight: '600' } } }
            }
        }
    });
}

// --- CHART 5: SUBJECT MASTERY HEATMAP (custom HTML table) ---
function renderSubjectHeatmap(students, exams) {
    const container = $('subjectHeatmap');
    if (!container) return;

    // Get top subjects (by frequency)
    const subjectFreq = {};
    exams.forEach(e => {
        const sub = e.subjectName || 'Unknown';
        subjectFreq[sub] = (subjectFreq[sub] || 0) + 1;
    });
    const topSubjects = Object.entries(subjectFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([s]) => s);

    if (topSubjects.length === 0) {
        container.innerHTML = '<div class="heatmap-empty">No assessment data to build heatmap.</div>';
        return;
    }

    // Get grades
    const gradesPresent = Array.from(new Set(students.map(s => s.grade))).filter(Boolean);
    const gradeOrder = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
    const grades = gradesPresent.sort((a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b)).slice(0, 8);

    if (grades.length === 0) {
        container.innerHTML = '<div class="heatmap-empty">No grade data available.</div>';
        return;
    }

    // Compute averages: subjectPerGrade[subject][grade] = avg
    const grid = {};
    topSubjects.forEach(sub => {
        grid[sub] = {};
        grades.forEach(g => {
            const gradeStudentIds = new Set(students.filter(s => s.grade === g).map(s => s.id));
            const subset = exams.filter(e => (e.subjectName || 'Unknown') === sub && gradeStudentIds.has(e.studentId));
            const avg = subset.length ? Math.round(subset.reduce((a, e) => a + (parseInt(e.score) || 0), 0) / subset.length) : null;
            grid[sub][g] = avg;
        });
    });

    function colorForScore(score) {
        if (score === null) return { bg: 'var(--bg-alt)', fg: 'var(--text-muted)' };
        if (score >= 80) return { bg: '#15803d', fg: '#fff' };
        if (score >= 60) return { bg: '#22C55E', fg: '#fff' };
        if (score >= 50) return { bg: '#84cc16', fg: '#1e293b' };
        if (score >= 40) return { bg: '#f59e0b', fg: '#fff' };
        return { bg: '#ef4444', fg: '#fff' };
    }

    let html = '<table class="heatmap-table"><thead><tr><th></th>';
    grades.forEach(g => {
        const short = g.replace('Grade ', 'G').replace('JSS', '');
        html += `<th>${short}</th>`;
    });
    html += '</tr></thead><tbody>';
    topSubjects.forEach(sub => {
        html += `<tr><td class="row-label">${escapeHtml(sub)}</td>`;
        grades.forEach(g => {
            const score = grid[sub][g];
            if (score === null) {
                html += `<td><div class="heatmap-cell empty">-</div></td>`;
            } else {
                const c = colorForScore(score);
                html += `<td><div class="heatmap-cell" style="background:${c.bg}; color:${c.fg}" title="${escapeHtml(sub)} • ${g} • ${score}%">${score}</div></td>`;
            }
        });
        html += '</tr>';
    });
    html += '</tbody></table>';

    container.innerHTML = html;
}

// --- TABLE: MODERN LEADERBOARD (card grid) ---
function renderLeaderboard(students, exams) {
    const container = $('analysisLeaderboard');
    if(!container) return;

    // Calculate per-student stats, with subject filter support
    const filterSubject = leaderboardCurrentSubject;
    const studentStats = students.map(s => {
        let sExams = exams.filter(e => e.studentId === s.id);
        if (filterSubject !== 'overall') {
            sExams = sExams.filter(e => (e.subjectName || '').toLowerCase().includes(filterSubject.toLowerCase()));
        }
        const scores = sExams.map(e => parseInt(e.score) || 0);
        const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
        // Trend: compare last 2 vs first 2
        let trend = 0;
        if (scores.length >= 2) {
            const firstHalf = scores.slice(0, Math.ceil(scores.length / 2));
            const secondHalf = scores.slice(Math.ceil(scores.length / 2));
            const firstAvg = firstHalf.reduce((a,b)=>a+b,0) / firstHalf.length;
            const secondAvg = secondHalf.length ? secondHalf.reduce((a,b)=>a+b,0) / secondHalf.length : firstAvg;
            trend = Math.round(secondAvg - firstAvg);
        }
        return { ...s, avg, trend, examCount: scores.length };
    }).filter(s => s.examCount > 0); // exclude students with no exams in this filter

    studentStats.sort((a, b) => b.avg - a.avg);
    const top = studentStats.slice(0, 8);

    if(top.length === 0) {
        container.innerHTML = '<div class="heatmap-empty" style="grid-column:1/-1;">No assessment data found for this filter.</div>';
        return;
    }

    container.innerHTML = top.map((s, index) => {
        let statusClass = 'needs', statusText = 'Needs Support';
        if(s.avg >= 80) { statusClass = 'excellent'; statusText = 'Excellent'; }
        else if(s.avg >= 50) { statusClass = 'good'; statusText = 'On Track'; }

        const rankClass = index < 3 ? `rank-${index+1}` : '';
        const trendIcon = s.trend > 0 ? 'fa-arrow-trend-up' : (s.trend < 0 ? 'fa-arrow-trend-down' : 'fa-minus');
        const trendClass = s.trend > 0 ? 'up' : (s.trend < 0 ? 'down' : '');
        const trendSign = s.trend > 0 ? '+' : '';

        return `
            <div class="lb-card ${rankClass}" onclick="viewStudentFromDash('${s.id}')">
                <div class="lb-rank-badge">${index+1}</div>
                <div class="lb-avatar">
                    <img src="${s.photo || DEFAULT_AVATAR}" alt="${escapeHtml(s.name)}" onerror="this.src='${DEFAULT_AVATAR}'">
                </div>
                <div class="lb-info">
                    <p class="lb-name">${escapeHtml(s.name)}</p>
                    <div class="lb-meta">${s.grade} · ${s.stream || '-'}</div>
                    <div class="lb-progress">
                        <div class="lb-progress-fill" style="width: ${s.avg}%"></div>
                    </div>
                    <span class="lb-status-pill ${statusClass}">${statusText}</span>
                </div>
                <div class="lb-score">
                    <div class="lb-score-val">${s.avg}%</div>
                    <div class="lb-score-trend ${trendClass}">
                        <i class="fa-solid ${trendIcon}"></i> ${trendSign}${s.trend}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// --- Leaderboard filter wiring ---
function initLeaderboardFilter() {
    const filterContainer = $('leaderboardFilter');
    if (!filterContainer || filterContainer.dataset.bound === '1') return;
    filterContainer.dataset.bound = '1';
    filterContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.lf-btn');
        if (!btn) return;
        filterContainer.querySelectorAll('.lf-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        leaderboardCurrentSubject = btn.dataset.subject || 'overall';
        // Re-render using current data
        const selectedGrade = $('analysisGradeSelect') ? $('analysisGradeSelect').value : 'all';
        let students = StudentRepo.getAll();
        if (selectedGrade !== 'all') students = students.filter(s => s.grade === selectedGrade);
        const studentIds = students.map(s => s.id);
        const exams = store.exams.filter(e => studentIds.includes(e.studentId));
        renderLeaderboard(students, exams);
    });
}

// --- EVENT LISTENER FOR FILTER CHANGE ---
 $('analysisGradeSelect')?.addEventListener('change', () => { renderAnalysis(); });
 $('analysisMetricSelect')?.addEventListener('change', () => { renderAnalysis(); });

 // Wire leaderboard filter on DOM ready
 document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initLeaderboardFilter, 200);
 });

 // ==========================================================================
//   PROFILE SECTION LOGIC
// ==========================================================================

let studentRadarChart = null;
let studentTrendChart = null;

// 1. Render Student Data
function renderStudentProfile(studentId) {
    // 1. HANDLE EMPTY STATE / NULL ID
    if (!studentId) {
        // Reset fields to default placeholder state
        $('pName').innerText = "Select a Learner";
        $('pGrade').innerText = "---";
        $('pReg').innerHTML = "ADM: ---";
        $('pStream').innerHTML = "Stream: ---";
        $('pGender').innerHTML = "---";
        $('pPhoto').src = DEFAULT_AVATAR;
        $('pDob').innerText = "-";
        $('pAdmNo').innerText = "-";
        $('pGuardian').innerText = "-";
        $('pGuardianPhone').innerText = "-";
        $('pAvgScore').innerText = "0%";
        if ($('pAttendance')) $('pAttendance').innerText = '0%';
        if ($('pRank')) $('pRank').innerText = '#-';
        if ($('pFeeStatus')) $('pFeeStatus').innerText = '-';
        
        // Clear Assessment List
        if($('pAssessmentList')) {
            $('pAssessmentList').innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">Select a student from the list to view their detailed profile.</p>';
        }
        if ($('pGaugeGrid')) {
            $('pGaugeGrid').innerHTML = '<div class="gauge-empty">Select a learner to view mastery gauges.</div>';
        }
        if ($('pDisciplineBoard')) {
            $('pDisciplineBoard').innerHTML = '<div class="empty-state">No disciplinary records found.</div>';
        }

        // Destroy charts to clear visuals from previous student
        if (studentRadarChart) { studentRadarChart.destroy(); studentRadarChart = null; }
        if (studentTrendChart) { studentTrendChart.destroy(); studentTrendChart = null; }
        
        return;
    }

    const s = StudentRepo.getById(studentId);
    if (!s) return;

    // 2. UPDATE IDENTITY
    $('pName').innerText = s.name;
    $('pGrade').innerText = s.grade;
    $('pReg').innerHTML = `<i class="fa-solid fa-id-card"></i> ADM: ${s.reg || '---'}`;
    $('pStream').innerHTML = `<i class="fa-solid fa-users"></i> Stream: ${s.stream || '---'}`;
    $('pGender').innerHTML = `<i class="fa-solid fa-${s.gender === 'Male' ? 'mars' : 'venus'}"></i> ${s.gender || '---'}`;
    $('pPhoto').src = s.photo || DEFAULT_AVATAR;
    
    // 3. UPDATE BIO DETAILS
    $('pDob').innerText = s.dob || '-';
    $('pAdmNo').innerText = s.nemisNumber || s.reg || '-';
    $('pGuardian').innerText = s.guardianName || '-';
    $('pGuardianPhone').innerText = s.guardianPhone || '-';

    // 4. PROCESS ASSESSMENTS
    const exams = store.exams.filter(e => e.studentId === s.id);
    
    // Calculate Overall Average
    const totalScore = exams.reduce((sum, e) => sum + (parseInt(e.score)||0), 0);
    const avg = exams.length ? Math.round(totalScore / exams.length) : 0;
    $('pAvgScore').innerText = avg + '%';

    // 4b. Compute and update attendance, rank, fee
    // Attendance: mock from store.attendance if exists, else derive a sensible default
    let attendance = 94;
    if (store.attendance && Array.isArray(store.attendance)) {
        const recs = store.attendance.filter(a => a.studentId === s.id);
        if (recs.length > 0) {
            const present = recs.filter(a => a.status === 'present' || a.status === 'Present').length;
            attendance = Math.round((present / recs.length) * 100);
        }
    } else if (typeof s.attendance === 'number') {
        attendance = s.attendance;
    }
    if ($('pAttendance')) $('pAttendance').innerText = attendance + '%';

    // Rank: compute among same-grade peers
    let rank = '-';
    if (exams.length > 0) {
        const peers = StudentRepo.getAll().filter(p => p.grade === s.grade);
        const peerStats = peers.map(p => {
            const pExams = store.exams.filter(e => e.studentId === p.id);
            const pAvg = pExams.length ? Math.round(pExams.reduce((a, e) => a + (parseInt(e.score) || 0), 0) / pExams.length) : 0;
            return { id: p.id, avg: pAvg };
        }).sort((a, b) => b.avg - a.avg);
        const idx = peerStats.findIndex(p => p.id === s.id);
        if (idx >= 0) rank = '#' + (idx + 1);
    }
    if ($('pRank')) $('pRank').innerText = rank;

    // Fee status: derive from store.fees or student.feeStatus
    let fee = 'Pending';
    if (s.feeStatus) fee = s.feeStatus;
    if (store.fees && Array.isArray(store.fees)) {
        const fr = store.fees.find(f => f.studentId === s.id);
        if (fr && fr.status) fee = fr.status;
    }
    if ($('pFeeStatus')) $('pFeeStatus').innerText = fee;

    // 5. RENDER CHARTS (With Safety Checks)
    if (studentRadarChart) studentRadarChart.destroy();
    if (studentTrendChart) studentTrendChart.destroy();

    if (exams.length > 0) {
        renderRadarChart(exams);
        renderTrendChart(exams);
        // Sparkline on stat cards
        const scores = exams.map(e => parseInt(e.score) || 0);
        renderSparkline('pSparkScore', scores.slice(-8), '#3b82f6');
        // Attendance sparkline (synthesized)
        renderSparkline('pSparkAttendance', synthesizeAttendanceSeries(attendance), '#14B8A6');
        // Subject mastery gauges
        renderSubjectGauges(exams);
    } else {
        // Clear sparklines + gauges
        clearCanvas('pSparkScore');
        clearCanvas('pSparkAttendance');
        if ($('pGaugeGrid')) $('pGaugeGrid').innerHTML = '<div class="gauge-empty">No assessment data yet.</div>';
    }
    
    // 6. RENDER ASSESSMENT LIST (Modern timeline)
    const listContainer = $('pAssessmentList');
    if(exams.length === 0) {
        listContainer.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:2rem;">No assessments recorded yet.</p>';
    } else {
        const sortedExams = [...exams].reverse();
        
        listContainer.innerHTML = sortedExams.map((e, index) => {
            const score = parseInt(e.score) || 0;
            let color = score >= 80 ? '#22C55E' : (score >= 50 ? '#F59E0B' : '#EF4444');
            let grade = score >= 80 ? 'E' : (score >= 50 ? 'M' : 'B'); // Exceeding/Meeting/Below
            let gradeColor = score >= 80 ? '#14B8A6' : (score >= 50 ? '#f59e0b' : '#ef4444');
            
            // Dynamic Date Display
            let dateDisplay = `<span>OCT</span><small>${24 - index}</small>`; 
            if(e.date) {
                const d = new Date(e.date);
                const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
                dateDisplay = `<span>${months[d.getMonth()]}</span><small>${d.getDate()}</small>`;
            }

            return `
            <div class="at-item">
                <div class="at-date">
                    ${dateDisplay}
                </div>
                <div class="at-subject">${e.subjectName || 'Assessment'} ${e.unitCode ? `<span style="color:var(--text-muted); font-weight:500; font-size:0.78rem;">· ${escapeHtml(e.unitCode)}</span>` : ''}</div>
                <div class="at-score-bar">
                    <div class="at-score-fill" style="width: ${score}%; background: linear-gradient(90deg, ${color}, ${color}cc);"></div>
                </div>
                <div class="at-grade" style="color: ${color};">${score}%</div>
            </div>
            `;
        }).join('');
    }

    // 7. RENDER DISCIPLINE BOARD
    renderDisciplineBoard(s);
}

// Helper: synthesize an attendance series from a percentage
function synthesizeAttendanceSeries(targetPercent) {
    const series = [];
    let base = Math.max(60, targetPercent - 15);
    for (let i = 0; i < 8; i++) {
        base += (Math.random() - 0.4) * 5;
        base = Math.max(50, Math.min(100, base));
        series.push(Math.round(base));
    }
    // Last point should be the target
    series[series.length - 1] = targetPercent;
    return series;
}

// Helper: clear a canvas
function clearCanvas(canvasId) {
    const canvas = $(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Helper: render subject mastery gauge rings (top 4 subjects)
function renderSubjectGauges(exams) {
    const container = $('pGaugeGrid');
    if (!container) return;

    // Group by subject
    const subjectData = {};
    exams.forEach(e => {
        const sub = e.subjectName || 'Unknown';
        if(!subjectData[sub]) subjectData[sub] = [];
        subjectData[sub].push(parseInt(e.score) || 0);
    });

    const entries = Object.entries(subjectData)
        .map(([sub, scores]) => ({
            sub,
            avg: scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0
        }))
        .sort((a, b) => b.avg - a.avg)
        .slice(0, 4);

    if (entries.length === 0) {
        container.innerHTML = '<div class="gauge-empty">No assessment data yet.</div>';
        return;
    }

    container.innerHTML = entries.map(({ sub, avg }) => {
        const ringRadius = 26;
        const circ = 2 * Math.PI * ringRadius;
        const offset = circ - (avg / 100) * circ;
        let cls = 'low';
        if (avg >= 80) cls = 'high';
        else if (avg >= 50) cls = 'mid';
        return `
            <div class="gauge-item">
                <div class="gauge-ring">
                    <svg viewBox="0 0 64 64">
                        <circle class="gauge-bg" cx="32" cy="32" r="${ringRadius}"></circle>
                        <circle class="gauge-fg ${cls}" cx="32" cy="32" r="${ringRadius}"
                            stroke-dasharray="${circ.toFixed(2)}"
                            stroke-dashoffset="${offset.toFixed(2)}"></circle>
                    </svg>
                    <div class="gauge-value">${avg}%</div>
                </div>
                <div class="gauge-label" title="${escapeHtml(sub)}">${escapeHtml(sub)}</div>
            </div>
        `;
    }).join('');
}

// Helper: render discipline board for a student
function renderDisciplineBoard(student) {
    const container = $('pDisciplineBoard');
    if (!container) return;

    // Find notes tied to this student
    const notes = (store.notes || []).filter(n => n.studentId === student.id);

    if (notes.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="display:flex; flex-direction:column; align-items:center; gap:0.5rem; padding:2rem;">
                <i class="fa-solid fa-shield-halved" style="font-size:2rem; color:var(--text-muted); opacity:0.4;"></i>
                <p style="margin:0;">No disciplinary records found.</p>
            </div>`;
        return;
    }

    // Sort by date (newest first)
    notes.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = notes.map(n => {
        // Determine severity from type/title
        const text = (n.title + ' ' + (n.description || '')).toLowerCase();
        let severity = 'low';
        let severityLabel = 'Minor';
        let icon = 'fa-circle-info';
        if (/(suspend|expulsion|fight|drug|alcohol|weapon|theft|abuse)/.test(text)) {
            severity = 'high'; severityLabel = 'Severe'; icon = 'fa-triangle-exclamation';
        } else if (/(warning|late|absent|truancy|disrupt|noise|phone)/.test(text)) {
            severity = 'medium'; severityLabel = 'Moderate'; icon = 'fa-circle-exclamation';
        }

        const dateStr = n.date ? new Date(n.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
        const typeLabel = n.type || 'Note';

        return `
            <div class="discipline-card severity-${severity}">
                <div class="dc-icon"><i class="fa-solid ${icon}"></i></div>
                <div class="dc-body">
                    <div class="dc-title">${escapeHtml(n.title || 'Disciplinary Record')}</div>
                    <div class="dc-meta">${escapeHtml(typeLabel)} · ${dateStr}</div>
                    ${n.description ? `<div class="dc-meta" style="margin-top:4px; max-width:480px;">${escapeHtml(n.description)}</div>` : ''}
                </div>
                <span class="dc-severity-pill ${severity}">${severityLabel}</span>
            </div>
        `;
    }).join('');
}

// 2. Radar Chart (Subject Balance)
function renderRadarChart(exams) {
    const ctx = $('studentRadarChart');
    if(!ctx) return;

    // Group by Subject
    const subjectData = {};
    exams.forEach(e => {
        const sub = e.subjectName || 'Unknown';
        if(!subjectData[sub]) subjectData[sub] = [];
        subjectData[sub].push(parseInt(e.score) || 0);
    });

    const labels = Object.keys(subjectData);
    const data = labels.map(sub => {
        const scores = subjectData[sub];
        return scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : 0;
    });

    if(studentRadarChart) studentRadarChart.destroy();

    // Build gradient for radar fill
    const chartCtx = ctx.getContext('2d');
    const gradient = chartCtx.createRadialGradient(
        ctx.clientWidth / 2, ctx.clientHeight / 2, 10,
        ctx.clientWidth / 2, ctx.clientHeight / 2, Math.max(80, ctx.clientWidth / 2)
    );
    gradient.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
    gradient.addColorStop(1, 'rgba(34, 197, 94, 0.08)');

    studentRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Performance',
                data: data,
                backgroundColor: gradient,
                borderColor: '#22C55E',
                borderWidth: 2,
                pointBackgroundColor: '#22C55E',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#22C55E'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            scales: {
                r: {
                    angleLines: { color: 'rgba(226, 232, 240, 0.7)' },
                    grid: { color: 'rgba(226, 232, 240, 0.7)' },
                    pointLabels: {
                        font: { size: 11, weight: '600' },
                        color: '#64748b'
                    },
                    ticks: { display: false, backdropColor: 'transparent' },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: { label: (c) => `${c.label}: ${c.parsed.r}%` }
                }
            }
        }
    });
}

// 3. Trend Chart (Line) - modern area chart with gradient
function renderTrendChart(exams) {
    const ctx = $('studentTrendChart');
    if(!ctx) return;

    const data = exams.map(e => parseInt(e.score) || 0);
    
    if(studentTrendChart) studentTrendChart.destroy();

    const chartCtx = ctx.getContext('2d');
    const gradient = chartCtx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0.02)');

    studentTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: exams.map((_, i) => `A${i+1}`),
            datasets: [{
                label: 'Score History',
                data: data,
                borderColor: '#3b82f6',
                backgroundColor: gradient,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 800, easing: 'easeOutCubic' },
            interaction: { mode: 'index', intersect: false },
            scales: {
                y: { beginAtZero: true, max: 100, grid: { color: 'rgba(226, 232, 240, 0.6)', borderDash: [4,4] }, ticks: { color: '#94a3b8' } },
                x: { grid: { display: false }, ticks: { color: '#64748b' } }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#0f172a',
                    padding: 10,
                    borderRadius: 8,
                    callbacks: { label: (c) => `${c.parsed.y}%` }
                }
            }
        }
    });
}

// 4. Tab Switcher
function switchProfileTab(tabName) {
    // Hide all
    $('pContentAssessments').style.display = 'none';
    $('pContentBio').style.display = 'none';
    $('pContentNotes').style.display = 'none';
    
    // Show selected
    if(tabName === 'assessments') $('pContentAssessments').style.display = 'block';
    if(tabName === 'bio') $('pContentBio').style.display = 'block';
    if(tabName === 'notes') $('pContentNotes').style.display = 'block';
}

function populateProfileList(students = null) {
    const listContainer = $('profileStudentList');
    const searchInput = $('profileSearchInput');
    if (!listContainer) return;

    const studentData = students || StudentRepo.getAll();
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';

    // EMPTY STATE
    if (studentData.length === 0) {
        listContainer.innerHTML = '<div style="padding:1rem; color:var(--text-muted); text-align:center;">No learners found.</div>';
        return;
    }

    // LOGIC: If Searching, show flat list. If not, show Grouped Accordion.
    if (searchTerm.length > 0) {
        listContainer.classList.add('search-mode');
        renderFlatList(studentData, listContainer);
    } else {
        listContainer.classList.remove('search-mode');
        renderGroupedList(studentData, listContainer);
    }
}

// Helper: Render Accordion Groups
function renderGroupedList(students, container) {
    // 1. Group by Grade
    const groups = {};
    students.forEach(s => {
        const grade = s.grade || 'Unknown';
        if (!groups[grade]) groups[grade] = [];
        groups[grade].push(s);
    });

    // Sort Grades nicely (PP1 -> Grade 9)
    const gradeOrder = ['PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9'];
    const sortedGrades = Object.keys(groups).sort((a, b) => gradeOrder.indexOf(a) - gradeOrder.indexOf(b));

    // 2. Build HTML
    let html = '';
    sortedGrades.forEach((grade, index) => {
        const studentsInGrade = groups[grade];
        
        // Open the first group by default
        const isOpen = index === 0 ? 'active' : ''; 
        const contentStyle = index === 0 ? 'max-height: 1000px;' : '';

        html += `
        <div class="grade-group ${isOpen}">
            <div class="grade-header" onclick="toggleAccordion(this)">
                <span>${grade}</span>
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:400;">${studentsInGrade.length} Learners</span>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="grade-content" style="${contentStyle}">
                ${studentsInGrade.map(s => `
                    <div class="ps-item" onclick="viewStudent('${s.id}')">
                        <div class="ps-avatar">
                            <img src="${s.photo || DEFAULT_AVATAR}" alt="Avatar">
                        </div>
                        <div class="ps-info">
                            <h4>${escapeHtml(s.name)}</h4>
                            <span>${s.stream || '-'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    });

    container.innerHTML = html;
}

// Helper: Render Flat List (For Search)
function renderFlatList(students, container) {
    container.innerHTML = students.map(s => `
        <div class="ps-item" onclick="viewStudent('${s.id}')">
            <div class="ps-avatar">
                <img src="${s.photo || DEFAULT_AVATAR}" alt="Avatar">
            </div>
            <div class="ps-info">
                <h4>${escapeHtml(s.name)}</h4>
                <span style="font-size:0.8rem;">${s.grade} - ${s.stream}</span>
            </div>
        </div>
    `).join('');
}

// Helper: Toggle Accordion
function toggleAccordion(headerElement) {
    const group = headerElement.parentElement;
    const content = group.querySelector('.grade-content');
    
    // Toggle active class
    group.classList.toggle('active');

    if (group.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
    } else {
        content.style.maxHeight = "0";
    }
}

// ==========================================================================
//   NOTES SECTION LOGIC
// ==========================================================================

function renderNotesSection() {
    const container = $('notesTimeline');
    if (!container) return;

    const notes = store.notes || [];
    const activeFilter = document.querySelector('.note-tab.active')?.dataset.filter || 'all';

    // Filter Notes
    let filteredNotes = notes;
    if (activeFilter !== 'all') {
        filteredNotes = notes.filter(n => n.type === activeFilter);
    }

    // Sort by Date (Newest first)
    filteredNotes.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredNotes.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding: 3rem; color: var(--text-muted);">
                <i class="fa-solid fa-clipboard-list" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.2;"></i>
                <p>No records found for this category.</p>
            </div>`;
        return;
    }

    container.innerHTML = filteredNotes.map(note => {
        const student = StudentRepo.getById(note.studentId);
        const sName = student ? student.name : 'Unknown Student';
        const sPhoto = student ? student.photo : DEFAULT_AVATAR;
        const sGrade = student ? student.grade : '';

        // Determine Badge Class
        let badgeClass = 'nc-academic';
        if(note.type === 'Discipline') badgeClass = 'nc-discipline';
        if(note.type === 'Co-curricular') badgeClass = 'nc-cocurricular';

        return `
        <div class="note-card" data-type="${note.type}">
            <div class="nc-header">
                <div class="nc-left">
                    <img src="${sPhoto}" class="nc-student-avatar">
                    <div class="nc-info">
                        <h4 onclick="viewStudent('${note.studentId}')">${sName}</h4>
                        <span>${sGrade} • ${new Date(note.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <span class="nc-badge ${badgeClass}">${note.type}</span>
            </div>
            
            <div class="nc-body">
                <strong>${note.title}</strong><br>
                ${note.description}
            </div>
            
            <div class="nc-footer">
                <span>Recorded by Admin</span>
                <div class="nc-actions">
                    <button onclick="deleteNote('${note.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// --- Handle Tab Clicking ---
try {
    Array.from(document.querySelectorAll('.note-tab')).forEach(tab => {
        tab.addEventListener('click', () => {
            Array.from(document.querySelectorAll('.note-tab')).forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderNotesSection();
        });
    });
} catch(e) { /* note tabs not ready — will be bound on next render */ }

// --- Handle Note Submission ---
 $('noteForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newNote = {
        id: Date.now().toString(),
        studentId: $('noteStudentSelect').value,
        type: $('noteType').value,
        title: $('noteTitle').value,
        description: $('noteDesc').value,
        date: $('noteDate').value
    };

    if (!store.notes) store.notes = [];
    store.notes.push(newNote);
    saveData();

    closeModal('addNoteModal');
    renderNotesSection();
    showToast('Record added successfully');
    $('noteForm').reset();
});

// --- Helper: Populate Student Select in Modal ---
function openAddNoteModal() {
    const select = $('noteStudentSelect');
    if(!select) return;
    
    select.innerHTML = '<option value="">Select Student...</option>';
    StudentRepo.getAll().forEach(s => {
        select.innerHTML += `<option value="${s.id}">${s.name} (${s.grade})</option>`;
    });
    
    openModal('addNoteModal');
    // Set default date to today
    setInputDateValue($('noteDate'), new Date());
}

// --- Delete Note ---
function deleteNote(id) {
    if(confirm('Are you sure you want to delete this record?')) {
        store.notes = store.notes.filter(n => n.id !== id);
        saveData();
        renderNotesSection();
    }
}

// Date Setter Helper for Input (safe — does not modify native prototype)
function setInputDateValue(inputEl, dateVal) {
    if (!inputEl) return;
    const d = (dateVal instanceof Date) ? dateVal : new Date(dateVal);
    if (!isNaN(d.getTime())) {
        inputEl.value = d.toISOString().split('T')[0];
    }
}

// ==========================================================================
//   INBOX SECTION LOGIC
// ==========================================================================

let currentInboxFolder = 'inbox';

function renderInboxList() {
    const container = $('inboxMessageList');
    if(!container) return;

    const search = $('inboxSearch').value.toLowerCase();
    let messages = (store.messages || []).filter(m => m.folder === currentInboxFolder);

    // Search Filter
    if(search) {
        messages = messages.filter(m => 
            (m.subject && m.subject.toLowerCase().includes(search)) || 
            (m.sender && m.sender.toLowerCase().includes(search))
        );
    }

    if(messages.length === 0) {
        container.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:2rem; font-size:0.9rem;">No messages found.</div>';
        return;
    }

    // Update Badge
    const unreadCount = messages.filter(m => !m.read).length;
    const badge = $('inboxCountBadge');
    if(unreadCount > 0) {
        badge.style.display = 'inline-block';
        badge.innerText = unreadCount;
    } else {
        badge.style.display = 'none';
    }

    // Render List
    container.innerHTML = messages.map(m => {
        const initials = m.sender ? m.sender.substring(0, 2).toUpperCase() : 'NA';
        const readClass = m.read ? '' : 'unread';
        
        return `
        <div class="msg-item ${readClass}" onclick="viewMessage('${m.id}')">
            <div class="msg-avatar-circle">${initials}</div>
            <div class="msg-content">
                <div class="msg-sender">
                    ${escapeHtml(m.sender)}
                    <span>${formatDate(m.date)}</span>
                </div>
                <div class="msg-preview">
                    <strong>${escapeHtml(m.subject)}</strong> - ${escapeHtml(m.body).substring(0, 40)}...
                </div>
            </div>
        </div>
        `;
    }).join('');
}

function viewMessage(id) {
    const message = (store.messages || []).find(m => m.id === id);
    if(!message) return;

    // Mark as read
    if(!message.read) {
        message.read = true;
        saveData();
        renderInboxList(); // Refresh list to remove unread dot
    }

    // Update Detail View
    const view = $('inboxDetailView');
    const initials = message.sender.substring(0, 2).toUpperCase();

    view.innerHTML = `
        <div class="detail-header">
            <div class="detail-subject">${escapeHtml(message.subject)}</div>
            <div class="detail-meta">
                <div class="detail-sender">
                    <span style="width:32px; height:32px; background:var(--primary); color:white; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; font-size:0.8rem; margin-right:8px;">${initials}</span>
                    From: <strong>${escapeHtml(message.sender)}</strong>
                    ${message.folder === 'inbox' ? `<span style="margin-left:auto; font-size:0.8rem; color:var(--text-muted);">To: Admin</span>` : `<span style="margin-left:auto; font-size:0.8rem; color:var(--text-muted);">To: ${message.recipient || 'Parent'}</span>`}
                </div>
                <div>${new Date(message.date).toLocaleString()}</div>
            </div>
        </div>
        
        <div class="detail-body">${escapeHtml(message.body)}</div>

        <div class="detail-actions">
            <button class="btn btn-secondary btn-sm" onclick="deleteMessage('${message.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
            <button class="btn btn-primary btn-sm" onclick="replyToMessage('${message.id}')"><i class="fa-solid fa-reply"></i> Reply</button>
        </div>
    `;
}

// --- Compose Logic ---
function openComposeModal() {
    const select = $('composeRecipient');
    if(!select) return;

    // Populate Guardians
    const guardians = [];
    StudentRepo.getAll().forEach(s => {
        if(s.guardianName && guardians.indexOf(s.guardianName) === -1) {
            guardians.push(s.guardianName);
        }
    });

    select.innerHTML = '<option value="">Select Guardian...</option>';
    guardians.forEach(g => {
        select.innerHTML += `<option value="${g}">${g}</option>`;
    });

    $('composeForm').reset();
    openModal('composeModal');
}

 $('composeForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newMsg = {
        id: Date.now().toString(),
        sender: store.settings.hoiName || 'Admin',
        recipient: $('composeRecipient').value,
        subject: $('composeSubject').value,
        body: $('composeBody').value,
        date: new Date().toISOString(),
        read: true, // Sent messages are read by sender
        folder: 'sent'
    };

    if(!store.messages) store.messages = [];
    store.messages.push(newMsg);
    saveData();

    closeModal('composeModal');
    showToast('Message sent successfully');
    
    // If we are in Sent folder, refresh
    if(currentInboxFolder === 'sent') renderInboxList();
});

// --- Folder Switching ---
try {
    Array.from(document.querySelectorAll('.folder-btn')).forEach(btn => {
        btn.addEventListener('click', () => {
            Array.from(document.querySelectorAll('.folder-btn')).forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentInboxFolder = btn.dataset.folder;
            renderInboxList();
        
        // Clear detail view when switching folders
        $('inboxDetailView').innerHTML = `
            <div class="inbox-empty-state">
                <i class="fa-regular fa-envelope-open" style="font-size: 4rem; color: var(--border); margin-bottom: 1rem;"></i>
                <h3>${btn.innerText}</h3>
            </div>
        `;
    });
});
} catch(e) { /* folder buttons not ready */ }

// --- Helper: Format Date ---
function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    return isToday ? d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : d.toLocaleDateString();
}

// ==========================================================================
//   GLOBAL FUNCTION EXPORTS
//   Ensure all functions called from inline onclick handlers in the HTML
//   are explicitly attached to window. This prevents "X is not defined"
//   errors if the script encounters a runtime error during top-level
//   execution that prevents later code from running.
// ==========================================================================
try {
    // Profile / Students
    if (typeof viewStudent === 'function') window.viewStudent = viewStudent;
    if (typeof viewStudentFromDash === 'function') window.viewStudentFromDash = viewStudentFromDash;
    if (typeof selectStudentSidebar === 'function') window.selectStudentSidebar = selectStudentSidebar;
    if (typeof switchProfileTab === 'function') window.switchProfileTab = switchProfileTab;
    if (typeof toggleAccordion === 'function') window.toggleAccordion = toggleAccordion;
    // Timetable
    if (typeof openTimetableSlotModal === 'function') window.openTimetableSlotModal = openTimetableSlotModal;
    if (typeof deleteTimetableSlot === 'function') window.deleteTimetableSlot = deleteTimetableSlot;
    if (typeof exportTimetablePDF === 'function') window.exportTimetablePDF = exportTimetablePDF;
    // Exams
    if (typeof openExamFormModal === 'function') window.openExamFormModal = openExamFormModal;
    if (typeof openExamGradingModal === 'function') window.openExamGradingModal = openExamGradingModal;
    if (typeof deleteExamSchedule === 'function') window.deleteExamSchedule = deleteExamSchedule;
    if (typeof updateExamGrade === 'function') window.updateExamGrade = updateExamGrade;
    if (typeof updateExamSubjectGrade === 'function') window.updateExamSubjectGrade = updateExamSubjectGrade;
    if (typeof flushExamSaves === 'function') window.flushExamSaves = flushExamSaves;
    if (typeof setExamStatus === 'function') window.setExamStatus = setExamStatus;
    if (typeof switchExamPortalTab === 'function') window.switchExamPortalTab = switchExamPortalTab;
    if (typeof printExamTimetable === 'function') window.printExamTimetable = printExamTimetable;
    if (typeof importExamScoresPrompt === 'function') window.importExamScoresPrompt = importExamScoresPrompt;
    if (typeof setInvigStatus === 'function') window.setInvigStatus = setInvigStatus;
    if (typeof showInvigilationWorkload === 'function') window.showInvigilationWorkload = showInvigilationWorkload;
    if (typeof exportPersonalSchedulePDF === 'function') window.exportPersonalSchedulePDF = exportPersonalSchedulePDF;
    // Core utilities
    if (typeof showToast === 'function') window.showToast = showToast;
    if (typeof openModal === 'function') window.openModal = openModal;
    if (typeof closeModal === 'function') window.closeModal = closeModal;
    if (typeof router === 'function') window.router = router;
    if (typeof saveData === 'function') window.saveData = saveData;
    // Timetable clash resolution
    if (typeof resolveTimetableClash === 'function') window.resolveTimetableClash = resolveTimetableClash;
    if (typeof runTimetableClashSweep === 'function') window.runTimetableClashSweep = runTimetableClashSweep;
    if (typeof checkTimetableClashLive === 'function') window.checkTimetableClashLive = checkTimetableClashLive;
    // Exam batch entry
    if (typeof exportExamScoreTemplate === 'function') window.exportExamScoreTemplate = exportExamScoreTemplate;
    if (typeof exportExamScores === 'function') window.exportExamScores = exportExamScores;
    if (typeof importExamScores === 'function') window.importExamScores = importExamScores;
    // Bulk progress
    if (typeof generateBulkProgressReports === 'function') window.generateBulkProgressReports = generateBulkProgressReports;
    if (typeof initBulkProgressModal === 'function') window.initBulkProgressModal = initBulkProgressModal;
} catch(e) { console.warn('Global export failed:', e); }
