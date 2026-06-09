'use strict';
// Define your backend API URL
// SMART URL: Automatically uses localhost if testing, or the live site if deployed
const API_URL = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : window.location.origin; 
    // window.location.origin automatically becomes https://cbeguru.onrender.com

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
    learningAreas: DEFAULT_LEARNING_AREAS
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
    }
}

function closeModal(id) { if ($(id)) { $(id).classList.remove('active'); document.body.style.overflow = ''; } }

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
        // 1. FETCH SPECIFIC ENDPOINTS (As per your snippet request)
        const [studentsRes, staffRes, settingsRes, examsRes, learningAreasRes] = await Promise.all([
            fetch(`${API_URL}/students`),
            fetch(`${API_URL}/staff`),
            fetch(`${API_URL}/settings`),
            fetch(`${API_URL}/exams`),
            fetch(`${API_URL}/learningAreas`)
        ]);

        // 2. PARSE DATA
        const students = await studentsRes.json();
        const staff = await staffRes.json();
        const settings = await settingsRes.json();
        const exams = await examsRes.json();
        const learningAreas = await learningAreasRes.json();

        // 3. POPULATE THE STORE
        store.students = students || [];
        store.staff = staff || [];
        store.exams = exams || [];
        store.clearedStudents = []; // Assuming this is local-only or needs another endpoint
        store.notes = [];
        store.messages = [];
        
        // Merge Settings (Default + Server)
        store.settings = { ...store.settings, ...settings };

        // Intelligent Subject Merging (Keep your defaults, add new ones from server)
        let existingAreas = learningAreas || [];
        DEFAULT_LEARNING_AREAS.forEach(def => {
            const exists = existingAreas.some(area => area.code === def.code);
            if (!exists) existingAreas.push(def);
        });
        store.learningAreas = existingAreas;

        // Refresh UI
        renderDashboard(); 
        renderStaff();

    } catch (err) {
        console.error("Failed to load data from server.", err);
        showToast('Error connecting to server. Check internet.', 'error');
    }
}
async function saveData() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        // Optional: Remove heavy image data if the API has payload size limits
        // const dataToSend = { ...store }; 
        // dataToSend.settings.logo = null; // If you want to skip logo to save space

        const res = await fetch(API_URL, {
            method: 'POST', // Change to 'PUT' if your backend expects a full replacement
            mode: 'cors',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(store)
        });

        if (!res.ok) {
            throw new Error(`Failed to save: ${res.status}`);
        }
        
        // Optional: Visual feedback that save happened
        // console.log('Data saved successfully');
    } catch (err) {
        console.error("Failed to save data to server", err);
        showToast('Failed to save changes to server.', 'error');
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

function initializeApp(user) {
    applyRoleRestrictions(user.role);
    initTheme();
    initGlobalListeners();
    startClock();
    renderDashboard();
    updateSettingsForm();
    updateHeaderAndDashboard();
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
}

// ==========================================================================
//   ADMISSIONS / INTAKE
// ==========================================================================
function clearErrors() { document.querySelectorAll('.form-control.error').forEach(el => el.classList.remove('error')); }
function validateName(input) { if (!input) return false; const regex = /^[A-Za-z\s]+$/; if (!regex.test(input.value) && input.value !== '') { input.classList.add('error'); return false; } input.classList.remove('error'); return true; }
function validateID(input) { if (!input) return false; input.value = input.value.replace(/\D/g, ''); const val = input.value; const isValid = val.length === 8; const editId = $('editModeId')?.value; const isDuplicate = StudentRepo.getAll().some(s => s.idNumber === val && s.id !== editId); if (val.length > 0 && (!isValid || isDuplicate)) { input.classList.add('error'); if (isDuplicate) showToast('A student with this ID already exists!', 'error'); return false; } input.classList.remove('error'); return isValid; }
function validatePhone(input) { if (!input || !input.value) return true; const val = input.value; const regex = /^(?:254|\+254|0)?([17][0-9]{8})$/; if (!regex.test(val)) { input.classList.add('error'); return false; } input.classList.remove('error'); return true; }
function autoCapitalize(input) { const value = input.value; input.value = value.charAt(0).toUpperCase() + value.slice(1); }
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
function nextStep(current, next) { if (!validateStep(current)) return; $(`form-step-${current}`).classList.remove('active'); $(`form-step-${next}`).classList.add('active'); const stepIndicators = document.querySelectorAll('.stepper .step'); stepIndicators.forEach((step, index) => { step.classList.remove('active'); if (index + 1 < next) step.classList.add('completed'); else if (index + 1 === next) step.classList.add('active'); }); if (next === 3) updateLiveCard(); }
function prevStep(current, prev) { $(`form-step-${current}`).classList.remove('active'); $(`form-step-${prev}`).classList.add('active'); const stepIndicators = document.querySelectorAll('.stepper .step'); stepIndicators.forEach((step, index) => { step.classList.remove('active'); if (index + 1 === prev) { step.classList.add('active'); step.classList.remove('completed'); } }); }
function resetIntakeForm() { $('newStudentForm')?.reset(); if ($('editModeId')) $('editModeId').value = ""; if ($('studentPhotoPreview')) $('studentPhotoPreview').src = DEFAULT_AVATAR; if ($('liveCardPhoto')) $('liveCardPhoto').src = DEFAULT_AVATAR; document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active')); $('form-step-1')?.classList.add('active'); const stepIndicators = document.querySelectorAll('.stepper .step'); stepIndicators.forEach((step, index) => { step.classList.remove('active', 'completed'); if (index === 0) step.classList.add('active'); }); clearErrors(); updateLiveCard(); }

function submitRegistration(e) { 
    e.preventDefault(); 
    if (!validateStep(4)) return; 
    
    const grade = getVal('regTrade');
    const names = [getVal('surname'), getVal('firstName'), getVal('otherNames')].filter(Boolean).join(' '); 
    const editId = $('editModeId')?.value; 
    const photoSrc = $('studentPhotoPreview').src; 
    const finalPhoto = (photoSrc && !photoSrc.includes('No Photo') && !photoSrc.startsWith('data:image/svg+xml')) ? photoSrc : DEFAULT_AVATAR; 
    
    const studentData = { 
        name: names, 
        gender: getVal('gender'), 
        dob: getVal('dob'), 
        idNumber: getVal('idNumber'), 
        phone: getVal('phone'), 
        grade: grade,
        stream: getVal('level'), 
        photo: finalPhoto,
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
        showToast('Learner Updated Successfully!'); 
    } else { 
        const year = new Date().getFullYear().toString().slice(-2);
        const count = StudentRepo.findBy('grade', grade).length + 1;
        const seq = String(count).padStart(3, '0');
        const gCode = grade.replace(' ', '');
        studentData.reg = `${gCode}/${year}/${seq}`; 
        StudentRepo.create(studentData); 
        showToast('Learner Registered Successfully!'); 
    }
    router('students'); resetIntakeForm(); renderDashboard();
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
function initStudentSection() { setView('grid', 'students'); }
function setView(type, section = 'students') { currentView[section] = type; if (section === 'students') applyFilters(); }
function applyFilters() { 
    const search = ($('studentSearch')?.value || '').toLowerCase(); 
    const grade = $('courseFilter')?.value || 'all';
    const stream = $('levelFilter')?.value || 'all'; 
    
    let filtered = StudentRepo.getAll().filter(s => { 
        if (!s || !s.name) return false; 
        const matchSearch = !search || s.name.toLowerCase().includes(search) || (s.reg && s.reg.toLowerCase().includes(search)); 
        const matchGrade = grade === 'all' || s.grade === grade; 
        const matchStream = stream === 'all' || s.stream === stream; 
        return matchSearch && matchGrade && matchStream; 
    }); 
    
    renderStudentList(filtered); 
    updateStudentStats(filtered); 
}
function updateStudentStats(filteredData) { const all = StudentRepo.getAll(); if ($('countTotal')) $('countTotal').textContent = all.length; if ($('countMale')) $('countMale').textContent = all.filter(s => s.gender === 'Male').length; if ($('countFemale')) $('countFemale').textContent = all.filter(s => s.gender === 'Female').length; }
function renderStudentList(data) { const gridContainer = $('studentsGridContainer'); const listContainer = $('studentsListContainer'); if (!gridContainer || !listContainer) return; if (currentView.students === 'grid') { gridContainer.style.display = 'block'; listContainer.style.display = 'none'; renderStudentGrid(data, gridContainer); } else { gridContainer.style.display = 'none'; listContainer.style.display = 'block'; renderStudentTable(data, $('studentsTableBody')); } renderPagination(data.length); }
function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationControls = document.querySelector('.pagination-controls');
    if (totalPages === 0) totalPages = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    if (paginationControls) {
        let html = '';
        html += `<button class="btn btn-page" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                html += `<button class="btn btn-page ${i === currentPage ? 'active' : ''}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                html += `<button class="btn btn-page" disabled>...</button>`;
            }
        }
        html += `<button class="btn btn-page" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
        paginationControls.innerHTML = html;
    }
}

function renderStudentGrid(data, container) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);
    
    if (paginatedData.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><i class="fa-solid fa-users-slash"></i><p>No learners found matching criteria.</p></div>`;
        return;
    }
    
    container.innerHTML = paginatedData.map(s => {
        return `<div class="student-card"><div class="card-header"><div class="avatar-wrapper"><img src="${s.photo}" alt="${escapeHtml(s.name)}" onerror="this.src='${DEFAULT_AVATAR}'"></div><div class="info"><div class="name">${escapeHtml(s.name)}</div><div class="meta">${s.reg} &bull; ${s.grade}</div></div></div><div class="card-body"><div class="detail-item"><label>Stream</label><span>${s.stream}</span></div><div class="detail-item"><label>Phone</label><span>${s.phone}</span></div></div><div class="card-footer"><button class="action-btn" data-action="view" data-id="${s.id}" title="View Profile"><i class="fa-solid fa-eye"></i></button><button class="action-btn" data-action="edit" data-id="${s.id}" title="Edit"><i class="fa-solid fa-edit"></i></button><button class="action-btn danger" data-action="delete" data-type="student" data-id="${s.id}" title="Delete Learner" style="color:var(--danger); margin-left:auto;"><i class="fa-solid fa-trash"></i></button></div></div>`;
    }).join('');
}

function renderStudentTable(data, tbody) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = data.slice(start, end);
    
    if (paginatedData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No learners found.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = paginatedData.map(s => {
        return `<tr><td><input type="checkbox" class="student-check" data-id="${s.id}"></td><td><strong>${s.reg}</strong></td><td><div style="display:flex; align-items:center; gap:10px;"><img src="${s.photo}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">${escapeHtml(s.name)}</div></td><td>${s.grade} (${s.stream})</td><td>${s.gender}</td><td><div class="btn-group"><button class="btn btn-sm btn-ghost" data-action="view" data-id="${s.id}"><i class="fa-solid fa-eye"></i></button><button class="btn btn-sm btn-ghost" data-action="edit" data-id="${s.id}"><i class="fa-solid fa-edit"></i></button><button class="btn btn-sm btn-ghost" data-action="delete" data-type="student" data-id="${s.id}"><i class="fa-solid fa-trash" style="color:var(--danger)"></i></button></div></td></tr>`;
    }).join('');
}

function viewStudent(id) {
    currentStudentId = id;
    
    // 1. Navigate to the Dashboard first (Profile is a tab inside Dashboard)
    router('dashboard');
    
    // 2. Switch to the Profile Tab (using a small timeout to ensure DOM is ready)
    setTimeout(() => {
        openDashTab(null, 'Profile');
    }, 50); 
}

function clearStudent(id) {
    const student = StudentRepo.getById(id);
    if(!student) return;

    const isCompletionGrade = student.grade === 'Grade 6' || student.grade === 'Grade 9';
    const reason = isCompletionGrade ? 'Completion of Cycle' : 'Transfer';
    
    if(confirm(`Are you sure you want to clear ${student.name} for ${reason}?`)) {
        generateLeavingCertificatePDF(student.id);
        if (!store.clearedStudents) store.clearedStudents = [];
        student.clearanceDate = new Date().toISOString();
        student.clearanceReason = reason;
        store.clearedStudents.push(student);
        StudentRepo.delete(id);
        closeModal('viewStudentModal'); 
        applyFilters();
        renderDashboard();
        showToast('Student cleared and archived.');
    }
}

function secureDelete(id) { pendingAction = 'delete'; pendingActionData = id; $('authMessage').textContent = 'WARNING: Enter admin password to DELETE learner record.'; $('adminPassword').value = ''; openModal('authModal'); }

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
    // Ensure we respect the current view setting on init
    const activeBtn = document.querySelector(`.btn-group .btn[data-section="staff"][data-view="${currentView.staff}"]`);
    if(activeBtn) {
        document.querySelectorAll('.btn-group .btn[data-section="staff"]').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }
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
        
        // Validate ID (must be unique if provided)
        if (idNo.value) {
            const editId = $('staffEditId')?.value;
            const isDuplicate = StaffRepo.getAll().some(s => s.idNo === idNo.value && s.id !== editId);
            if (isDuplicate) { 
                idNo.classList.add('error'); 
                showToast('Staff ID already exists.', 'error'); 
                isValid = false; 
            }
        }
        
        if (phone.value && !validatePhone(phone)) { 
            phone.classList.add('error'); 
            isValid = false; 
        }
    }
    
    if (!isValid) showToast('Please fill required fields correctly.', 'error');
    return isValid; 
}

function nextStaffStep(current, next) { if (!validateStaffStep(current)) return; $(`staff-form-step-${current}`).classList.remove('active'); $(`staff-form-step-${next}`).classList.add('active'); }
function prevStaffStep(current, prev) { $(`staff-form-step-${current}`).classList.remove('active'); $(`staff-form-step-${prev}`).classList.add('active'); }

function resetStaffForm() { 
    $('staffForm')?.reset(); 
    $('staffEditId').value = ""; 
    $('staffModalTitle').innerText = "Add New Staff"; 
    const preview = $('staffPhotoPreview');
    preview.src = DEFAULT_AVATAR;
    preview.style.width = "150px";
    preview.style.height = "150px";
    preview.style.objectFit = "cover";
    preview.style.borderRadius = "50%";
    preview.style.display = "block";
    preview.style.margin = "0 auto";
    openModal('staffModal'); 
}

function openStaffModal() { resetStaffForm(); openModal('staffModal'); }

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

function submitStaff(e) { 
    e.preventDefault(); 
    const surname = getVal('staffSurname'); const firstName = getVal('staffFirstName'); const otherNames = getVal('staffOtherNames'); const name = `${surname} ${firstName} ${otherNames}`.trim();
    const editId = $('staffEditId')?.value; const photoSrc = $('staffPhotoPreview')?.src; const finalPhoto = (photoSrc && !photoSrc.includes('data:image/svg+xml')) ? photoSrc : DEFAULT_AVATAR; 
    const staffData = { name, surname, firstName, otherNames, gender: getVal('staffGender'), dob: getVal('staffDob'), idNo: getVal('staffIdNo'), phone: getVal('staffPhone'), email: getVal('staffEmail'), designation: getVal('staffDesignation'), dept: getVal('staffDept'), tsc: getVal('staffTsc'), employmentType: getVal('staffEmploymentType'), appointmentDate: getVal('staffAppointmentDate'), subjects: getVal('staffSubjects'), photo: finalPhoto }; 
    if (editId) { StaffRepo.update(editId, staffData); showToast('Staff Updated Successfully!'); } else { StaffRepo.create(staffData); showToast('Staff Added Successfully!'); } 
    closeModal('staffModal'); renderStaff(); renderDashboard(); 
}

function editStaff(id) { 
    const s = StaffRepo.getById(id); 
    if (!s) return; 
    
    openStaffModal(); 
    
    $('staffModalTitle').innerText = "Edit Staff Details"; 
    $('staffEditId').value = id; 
    
    const preview = $('staffPhotoPreview');
    if(s.photo) {
        preview.src = s.photo;
    } else {
        preview.src = DEFAULT_AVATAR;
    }
    preview.style.width = "150px";
    preview.style.height = "150px";
    preview.style.objectFit = "cover";
    preview.style.borderRadius = "50%";
    preview.style.display = "block";
    preview.style.margin = "0 auto";
    
    setVal('staffSurname', s.surname || s.name.split(' ')[0]); 
    setVal('staffFirstName', s.firstName || s.name.split(' ')[1] || ''); 
    setVal('staffOtherNames', s.otherNames || s.name.split(' ').slice(2).join(' ')); 
    setVal('staffGender', s.gender); 
    setVal('staffDob', s.dob); 
    setVal('staffIdNo', s.idNo); 
    setVal('staffPhone', s.phone); 
    setVal('staffEmail', s.email); 
    setVal('staffTsc', s.tsc);
    setVal('staffDesignation', s.designation || ''); 
    setVal('staffDept', s.dept || ''); 
    setVal('staffEmploymentType', s.employmentType); 
    setVal('staffAppointmentDate', s.appointmentDate); 
    setVal('staffSubjects', s.subjects || '');
}

function deleteStaff(id) { if (confirm('Are you sure?')) { if (StaffRepo.delete(id)) { renderStaff(); renderDashboard(); showToast('Staff Deleted'); } } }


function renderStaff() { 
    const container = $('staffContainer'); 
    if (!container) return;

    const searchTerm = ($('staffSearch')?.value || '').toLowerCase();
    const deptFilter = $('staffDeptFilter')?.value || 'all';
    
    let data = StaffRepo.getAll().filter(s => {
        const matchSearch = !searchTerm || 
                            (s.name && s.name.toLowerCase().includes(searchTerm)) || 
                            (s.tsc && s.tsc.toLowerCase().includes(searchTerm)) ||
                            (s.phone && s.phone.includes(searchTerm));
        const matchDept = deptFilter === 'all' || s.dept === deptFilter;
        return matchSearch && matchDept;
    });

    // Check View Mode
    if (currentView.staff === 'list') {
        container.style.display = 'block';
        renderStaffTable(data, container);
    } else {
        container.style.display = 'grid';
        renderStaffGrid(data, container);
    }
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
        // Check for linked subjects
        const assignedSubjects = store.learningAreas.filter(area => area.teacherId === s.id).map(area => area.name);
        const teachesDisplay = assignedSubjects.length > 0 ? assignedSubjects.join(', ') : (s.subjects || 'N/A');
        
        // Determine Department Class for Card Border Color
        let deptClass = '';
        const d = (s.dept || '').toLowerCase();
        if (d.includes('lower')) deptClass = 'dept-lower-primary';
        else if (d.includes('upper')) deptClass = 'dept-upper-primary';
        else if (d.includes('jss') || d.includes('junior')) deptClass = 'dept-jss';
        else if (d.includes('admin')) deptClass = 'dept-admin';
        else if (d.includes('support')) deptClass = 'dept-support';

        // FIX: Corrected Class Names to match CSS (.staff-card, .staff-card-footer)
        return `
        <div class="staff-card ${deptClass}">
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
                    <strong>Teaches:</strong> ${teachesDisplay}
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
        doc.line(10, pageHeight - 25, pageWidth - 10, pageHeight - 25);
        doc.setFontSize(8).setTextColor(150); 
        doc.text("OFFICIAL DOCUMENT - CONFIDENTIAL", 15, pageHeight - 20);
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

// ==========================================================================
//   MODERN DASHBOARD ENGINE
// ==========================================================================

function renderDashboard() {
    if (!store?.students) return;

    // 1. Calculate Core Metrics
    const studentCount = StudentRepo.count();
    const staffCount = StaffRepo.count();
    const maleCount = StudentRepo.getAll().filter(s => s.gender === 'Male').length;
    const femaleCount = StudentRepo.getAll().filter(s => s.gender === 'Female').length;
    
    // Calculate Average Performance
    let totalScore = 0, examCount = 0;
    store.exams.forEach(e => {
        const score = parseInt(e.score) || 0;
        if (score > 0) { totalScore += score; examCount++; }
    });
    const avgPerformance = examCount > 0 ? Math.round(totalScore / examCount) : 0;

    // Calculate Pending Tasks (Simulated "Attention")
    // Example logic: Count students without any exams OR specific flags
    const pendingTasks = StudentRepo.getAll().filter(s => {
        const hasExams = store.exams.some(e => e.studentId === s.id);
        return !hasExams; // Students with no assessments are "Pending"
    }).length;

    // 2. Determine System State (The Answer)
    const statusHero = $('statusHero');
    const statusHeadline = $('statusHeadline');
    const statusSummary = $('statusSummary');
    
    let state = 'operational';
    let headline = "System Operational";
    let summary = "All systems functioning normally. No immediate attention required.";

    if (avgPerformance < 50 || pendingTasks > 20) {
        state = 'critical';
        headline = "Critical Attention Required";
        summary = `Low performance detected or high backlog of ${pendingTasks} pending tasks.`;
    } else if (avgPerformance < 70 || pendingTasks > 5) {
        state = 'degraded';
        headline = "Performance Degraded";
        summary = "Some metrics are below target. Review pending tasks.";
    }

    // Apply State
    statusHero.className = `status-hero ${state}`;
    statusHeadline.innerText = headline;
    statusSummary.innerText = summary;

    // 3. Update Context Cards (Golden Signals)
    animateValue('statEnrollment', 0, studentCount, 800);
    animateValue('statStaff', 0, staffCount, 800);
    $('statCompetent').innerText = avgPerformance + '%';
    $('perfBar').style.width = avgPerformance + '%';
    
    // Attention Card
    $('statPending').innerText = pendingTasks;
    $('statPendingDesc').innerText = pendingTasks > 0 ? "Incomplete assessments" : "All records updated";
    $('cardAttention').style.display = pendingTasks > 0 ? 'flex' : 'none';

    // Ratio
    const ratio = studentCount > 0 && staffCount > 0 ? (studentCount / staffCount).toFixed(1) : '-';
    $('statRatio').innerText = ratio + ':1';

    // 4. Render Visuals
    renderDashboardChart('grade');
    renderRecentActivityFeed();
}

function renderRecentActivityFeed() {
    const container = $('dashboardActivity');
    if (!container) return;
    
    // Generate synthetic "Logs"
    const activities = [
        ...StudentRepo.getAll().slice(0, 5).map(s => ({
            type: 'admission', icon: 'fa-user-plus', color: 'success',
            text: `<strong>${s.name}</strong> admitted to ${s.grade}`,
            time: new Date()
        })),
        ...store.exams.filter(e => e.score >= 80).slice(0, 3).map(e => ({
            type: 'performance', icon: 'fa-award', color: 'warning',
            text: `High score recorded for <strong>${StudentRepo.getById(e.studentId)?.name || 'Student'}</strong>`,
            time: new Date(e.date)
        }))
    ].sort((a,b) => b.time - a.time);

    if (activities.length === 0) {
        container.innerHTML = `<div class="timeline-placeholder">System initialized. Awaiting activity.</div>`;
        return;
    }

    container.innerHTML = activities.map(act => `
        <div class="timeline-item">
            <div class="timeline-dot bg-${act.color}"></div>
            <div class="timeline-content">
                <p><i class="fa-solid ${act.icon}"></i> ${act.text}</p>
                <span>${act.time.toLocaleTimeString()}</span>
            </div>
        </div>`
    ).join('');
}

function renderDashboardChart(type) {
    const chart = $('tradeDistributionChart');
    if (!chart) return;
    chart.innerHTML = '';

    let data = [];
    if (type === 'grade') {
        const grades = Object.keys(CBC_LEVELS);
        data = grades.map(g => ({ label: g.replace('Grade ', 'G'), value: StudentRepo.findBy('grade', g).length }));
    }

    const max = Math.max(...data.map(d => d.value), 1);
    
    data.forEach(d => {
        const heightPercent = (d.value / max) * 100;
        const group = document.createElement('div');
        group.className = 'bar-group';
        group.innerHTML = `
            <div class="bar-value">${d.value}</div>
            <div class="bar" style="height: ${Math.max(heightPercent, d.value > 0 ? 5 : 0)}%"></div>
            <div class="bar-label">${d.label}</div>`;
        chart.appendChild(group);
    });
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

function animateValue(id, start, end, duration) { 
    const el = $(id); 
    if (!el) return; 
    let startTimestamp = null; 
    const step = (timestamp) => { 
        if (!startTimestamp) startTimestamp = timestamp; 
        const progress = Math.min((timestamp - startTimestamp) / duration, 1); 
        el.textContent = Math.floor(progress * (end - start) + start).toLocaleString(); 
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
        case 'exams': resetExamView(); break; 
        case 'intake': resetIntakeForm(); break; 
        case 'settings': updateSettingsForm(); renderCourseSettings(); break; 
        case 'curricula': renderCurricula(); break;
        case 'analysis': renderAnalysisTab(); break; 
        case 'profile': renderProfileTab(); break; 
        case 'notes': renderNotesTab(); break; 
        case 'Inbox': renderInboxTab(); break;
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
    const headers = ['Surname', 'First Name', 'Gender (Male/Female)', 'DOB (YYYY-MM-DD)', 'Birth Cert No', 'Phone']; 
    const ws = XLSX.utils.aoa_to_sheet([headers]); 
    const wb = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(wb, ws, 'Template'); 
    XLSX.writeFile(wb, 'Admission_Template.xlsx'); 
    showToast('Template Downloaded'); 
}

function handleBatchAdmissionFile(e) { 
    const file = e.target.files[0]; 
    if (!file) return; 
    const reader = new FileReader(); 
    reader.onload = function(e) { 
        try { 
            const data = new Uint8Array(e.target.result); 
            const workbook = XLSX.read(data, { type: 'array' }); 
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]]; 
            const jsonData = XLSX.utils.sheet_to_json(firstSheet); 
            currentBatchData = jsonData; 
            renderBatchPreview(jsonData); 
        } catch (err) { 
            showToast('Error reading file', 'error'); 
        } 
    }; 
    reader.readAsArrayBuffer(file); 
}

function renderBatchPreview(data) { 
    const container = $('batchPreviewContainer'); 
    const tbody = $('batchPreviewTable')?.querySelector('tbody'); 
    if (!container || !tbody) return; 
    tbody.innerHTML = ''; 
    data.forEach((row, i) => { 
        tbody.innerHTML += `<tr><td>${i+1}</td><td>${row['Surname']} ${row['First Name']}</td><td>${row['Gender (Male/Female)']}</td><td>Ready</td></tr>`; 
    }); 
    container.style.display = 'block'; 
    $('btnConfirmBatchAdmission').disabled = false; 
}

function confirmBatchAdmission() { 
    const grade = getVal('batchGrade'); 
    const stream = getVal('batchStream'); 
    if (!grade || !stream) return showToast('Please select Target Grade and Stream', 'error'); 
    if (!currentBatchData || currentBatchData.length === 0) return showToast('No data to import', 'error'); 
    
    let count = 0; 
    const baseCount = StudentRepo.findBy('grade', grade).length; 
    
    currentBatchData.forEach((row, index) => { 
        const surname = row['Surname']; 
        const firstName = row['First Name']; 
        if (!surname || !firstName) return; 
        
        const genderVal = (row['Gender (Male/Female)'] || '').startsWith('M') ? 'Male' : 'Female'; 
        const name = `${surname} ${firstName}`.trim(); 
        
        const studentData = { 
            name: name, 
            gender: genderVal, 
            dob: row['DOB (YYYY-MM-DD)'] || '2010-01-01', 
            idNumber: row['Birth Cert No'] || generateId(), 
            phone: row['Phone'] || '', 
            grade: grade, 
            stream: stream, 
            photo: DEFAULT_AVATAR 
        }; 
        
        const year = new Date().getFullYear().toString().slice(-2); 
        const seq = (baseCount + index + 1).toString().padStart(3, '0'); 
        studentData.reg = `${grade.replace(' ', '')}/${year}/${seq}`; 
        
        StudentRepo.create(studentData); 
        count++; 
    }); 
    
    saveData(); 
    closeModal('batchAdmissionModal'); 
    renderDashboard(); 
    router('students'); 
    showToast(`${count} learners imported successfully!`); 
}

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

