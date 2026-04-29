document.addEventListener('DOMContentLoaded', () => {
    const surveyForm = document.getElementById('survey-form');
    const resultPanel = document.getElementById('result');
    const generateMembersBtn = document.getElementById('generate-members');
    const membersContainer = document.getElementById('members-container');
    // ⚠️ IMPORTANT: Replace this with your actual Google Apps Script deployment URL
    // See SETUP_GUIDE.md for instructions on how to get this URL
    const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycby6pA4CmiP880_UuT68l6FAngbAUvMNL9fZB2gwVWZc_GGTf2Szb7K7c8v5LNpTf-VY/exec';

    // Initialize offline detection and sync
    initializeOfflineSupport();

    if (!surveyForm || !generateMembersBtn || !membersContainer) {
        console.error('Required elements not found in DOM.');
        return;
    }

    // --- Event Listeners ---

    generateMembersBtn.addEventListener('click', () => {
        const countInput = document.getElementById('household-members');
        const count = Number(countInput?.value);
        if (!count || count < 1 || count > 20) {
            alert('Please enter a valid number of members (1-20).');
            return;
        }
        generateMemberEntries(count);
    });

    membersContainer.addEventListener('input', (e) => {
        if (e.target.classList.contains('member-dob')) updateMemberAge(e.target);
    });

    membersContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('registered-barangay')) toggleBarangayOther(e.target);
        if (e.target.classList.contains('youth-status')) toggleYouthFields(e.target);
    });

    surveyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 1. Bot Protection (Honeypot)
        if (document.getElementById('honeypot')?.value !== "") return;

        if (!surveyForm.checkValidity()) {
            alert('Please fill out all required fields.');
            return;
        }

        const submitBtn = surveyForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";

        // 2. Data Collection (Capturing Text instead of IDs)
        const getDisplayValue = (fieldset, selector) => {
            const el = fieldset.querySelector(selector);
            if (!el) return '';
            return el.tagName === 'SELECT' ? el.options[el.selectedIndex].text : el.value;
        };

        const formData = new FormData(surveyForm);

        // Map through fieldsets to get member data
        const members = Array.from(
            membersContainer.querySelectorAll('.member-fieldset')
        ).map((fieldset) => {
            const getVal = (selector) => fieldset.querySelector(selector)?.value || '';

            const data = {
                name: getVal('[name="name[]"]'),
                relationship: getVal('[name="relationship[]"]'),
                sex: getVal('[name="sex[]"]'),
                dob: getVal('[name="dob[]"]'),
                age: getVal('[name="age[]"]'),
                enrolled: getVal('[name="enrolled[]"]'),
                schoolLevel: getVal('[name="schoolLevel[]"]'),
                placeOfSchool: getVal('[name="placeOfSchool[]"]'),
                occupation: getVal('[name="occupation[]"]'),
                monthlyIncome: getVal('[name="monthlyIncome[]"]'),
                sourceOfIncome: getVal('[name="sourceOfIncome[]"]'),
                placeOfWork: getVal('[name="workPlace[]"]'),
                workStatus: getVal('[name="workStatus[]"]'),
                maritalStatus: getVal('[name="maritalStatus[]"]'),
                highestEducation: getVal('[name="highestEducation[]"]'),
                registeredBarangay: getVal('[name="registeredBarangay[]"]'),
                registeredBarangayOther: getVal('[name="registeredBarangayOther[]"]'),
            };

            return {
                ...data,
                registeredBarangay:
                    data.registeredBarangay === 'OTHERS' && data.registeredBarangayOther
                        ? data.registeredBarangayOther
                        : data.registeredBarangay,
            };
        });

        const surveyValues = {
            province: formData.get('province') || '',
            city: formData.get('city') || '',
            barangay: formData.get('barangay') || '',
            address: formData.get('address') || '',
            respondent: formData.get('respondent') || '',
            contactNumber: formData.get('contactNumber') || '',
            householdHead: formData.get('householdHead') || '',
            householdHeadContact: formData.get('householdHeadContact') || '',
            householdMembers: formData.get('householdMembers') || '',
        };

        try {
            // 1. Submit to Google Sheets
            await submitToGoogleSheet(surveyValues, members, GOOGLE_SHEETS_WEBHOOK_URL);

            // 2. Generate Result UI
            renderResult(surveyValues, members, resultPanel);

            // 3. Clear Form
            surveyForm.reset();
            membersContainer.innerHTML = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error(err);
            alert('Failed to submit survey. Please try again.');
        } finally {
            submitBtn.disabled = false;
        }
    });
});

// --- Helper Functions ---

function renderResult(surveyValues, members, resultPanel) {
    let memberHtml = members.map((member, idx) => {
        const age = Number(member.age);
        let youthHtml = '';
        let econHtml = `
            <dt>Occupation</dt><dd>${escapeHtml(member.occupation)}</dd>
            <dt>Monthly Income</dt><dd>${escapeHtml(member.monthlyIncome)}</dd>
            <dt>Source of Income</dt><dd>${escapeHtml(member.sourceOfIncome)}</dd>
            <dt>Place of Work</dt><dd>${escapeHtml(member.placeOfWork)}</dd>
            <dt>Status of Work</dt><dd>${escapeHtml(member.workStatus)}</dd>`;
        const isYoung = age >= 10 && age <= 24;

        if (isYoung && (member.enrolled === '1' || member.enrolled === '2')) {
            youthHtml = `
                <dt>Currently enrolled</dt><dd>${escapeHtml(member.enrolled)}</dd>
                <dt>School level</dt><dd>${escapeHtml(member.schoolLevel)}</dd>
                <dt>Place of school</dt><dd>${escapeHtml(member.placeOfSchool)}</dd>`;
            econHtml = '';
        }

        return `
            <div class="member-summary">
                <h3>Member ${idx + 1}: ${escapeHtml(member.name)}</h3>
                <dl>
                    <dt>Relationship</dt><dd>${escapeHtml(member.relationship)}</dd>
                    <dt>Sex</dt><dd>${escapeHtml(member.sex)}</dd>
                    <dt>Age</dt><dd>${escapeHtml(member.age)}</dd>
                    <dt>Marital Status</dt><dd>${escapeHtml(member.maritalStatus)}</dd>
                    <dt>Highest Education</dt><dd>${escapeHtml(member.highestEducation)}</dd>
                    ${youthHtml}
                    ${econHtml}
                    <dt>Registered Barangay</dt><dd>${escapeHtml(member.registeredBarangay)}</dd>
                </dl>
            </div>
        `;
    }).join('');

    resultPanel.innerHTML = `
        <h2>Survey Submitted Successfully</h2>
        <p>Thank you for contributing to the Labor and Employment Mapping survey.</p>
        <dl>
            <dt>Province</dt><dd>${escapeHtml(surveyValues.province)}</dd>
            <dt>City/Municipality</dt><dd>${escapeHtml(surveyValues.city)}</dd>
            <dt>Barangay</dt><dd>${escapeHtml(surveyValues.barangay)}</dd>
            <dt>Address</dt><dd>${escapeHtml(surveyValues.address)}</dd>
            <dt>Respondent</dt><dd>${escapeHtml(surveyValues.respondent)}</dd>
            <dt>Respondent Contact</dt><dd>${escapeHtml(surveyValues.contactNumber)}</dd>
            <dt>Household Head</dt><dd>${escapeHtml(surveyValues.householdHead)}</dd>
            <dt>Household Head Contact</dt><dd>${escapeHtml(surveyValues.householdHeadContact)}</dd>
            <dt>Total Household Members</dt><dd>${escapeHtml(surveyValues.householdMembers)}</dd>
        </dl>
        <h3>Household Members</h3>
        ${memberHtml}
    `;
    resultPanel.classList.remove('hidden');
}

async function submitToGoogleSheet(surveyValues, members, url) {
    if (!url || !url.trim() || url === 'YOUR_WEBHOOK_URL_HERE') {
        console.warn('Google Sheets webhook URL is not configured. Skipping remote submission.');
        return;
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyValues, members }),
    });

    if (!response.ok) throw new Error('Network response was not ok');
}

function updateMemberAge(dobInput) {
    const fieldset = dobInput.closest('.member-fieldset');
    const ageInput = fieldset?.querySelector('.member-age');
    if (!ageInput || !dobInput.value) return;

    const dob = new Date(dobInput.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;

    ageInput.value = age >= 0 ? age : '';
    toggleYouthStatus(fieldset, age);
}

function generateMemberEntries(count) {
    const container = document.getElementById('members-container');
    container.innerHTML = '';
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = 1; i <= count; i++) {
        const fieldset = createMemberFieldset(i, today);
        container.appendChild(fieldset);
    }
}

function createMemberFieldset(index, maxDate) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'member-fieldset';
    fieldset.innerHTML = `
        <legend>Member ${index}</legend>
        <div class="field-grid">
            <label>Name <input type="text" name="name[]" required /></label>
            <label>Relationship <select name="relationship[]" required>
                <option value="">Select...</option>
                <option value="01">Head</option>
                <option value="02">Spouse</option>
                <option value="03">Son</option>
                <option value="04">Daughter</option>
                <option value="05">Stepson</option>
                <option value="06">Stepdaughter</option>
                <option value="08">Daughter-in-Law</option>
                <option value="09">Grandson</option>
                <option value="10">Granddaughter</option>
                <option value="11">Father</option>
                <option value="12">Mother</option>
                <option value="13">Brother</option>
                <option value="14">Sister</option>
                <option value="15">Uncle</option>
                <option value="16">Aunt</option>
                <option value="17">Nephew</option>
                <option value="18">Niece</option>
                <option value="19">Other Relative</option>
                <option value="20">Non-Relative</option>
                <option value="21">Boarder</option>
                <option value="22">Domestic Helper</option>
            </select></label>
            <label>Date of Birth <input type="date" name="dob[]" class="member-dob" max="${maxDate}" required /></label>
            <label>Age <input type="text" name="age[]" class="member-age" readonly /></label>
            <label>Sex <select name="sex[]" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select></label>
            <label>Marital Status <select name="maritalStatus[]" required>
                <option value="">Select...</option>
                <option value="1">Single</option>
                <option value="2">Married</option>
                <option value="3">Living in</option>
                <option value="4">Widowed</option>
                <option value="5">Separated</option>
            </select></label>
            <label>Highest Education <select name="highestEducation[]" required>
                <option value="">Select...</option>
                <option value="0">No Education</option>
                <option value="01">Pre-School</option>
                <option value="02">Elementary Level</option>
                <option value="03">Elementary Graduate</option>
                <option value="04">High School Level</option>
                <option value="05">High School Graduate</option>
                <option value="06">Junior HS</option>
                <option value="07">Junior HS Graduate</option>
                <option value="08">Senior HS Level</option>
                <option value="09">Senior HS Graduate</option>
                <option value="10">Vocational/Tech</option>
                <option value="11">College Level</option>
                <option value="12">College Graduate</option>
                <option value="13">Post-Graduate</option>
            </select></label>
            <div class="youth-status-group hidden">
                <label>Currently enrolled <select name="enrolled[]" class="youth-status">
                    <option value="">Select...</option>
                    <option value="1">Yes, Public</option>
                    <option value="2">Yes, Private</option>
                    <option value="0">No</option>
                </select></label>
            </div>
            <div class="school-group hidden">
                <label>School Level <select name="schoolLevel[]">
                    <option value="">Select...</option>
                    <option value="1">Elementary Level</option>
                    <option value="2">Junior High School</option>
                    <option value="3">Senior High School</option>
                    <option value="4">Vocational</option>
                    <option value="5">College/University</option>
                </select></label>
                <label>Place of School <input type="text" name="placeOfSchool[]" /></label>
            </div>
            <div class="work-group">
                <label>Occupation <input type="text" name="occupation[]" /></label>
                <label>Monthly Income <select name="monthlyIncome[]">
                    <option value="">Select...</option>
                    <option value="0">Php 0-999</option>
                    <option value="1">Php 1,000-4,999</option>
                    <option value="2">Php 5,000-9,999</option>
                    <option value="3">Php 10,000-19,999</option>
                    <option value="4">Php 20,000-49,999</option>
                    <option value="5">Php 50,000 up</option>
                </select></label>
                <label>Source of Income <select name="sourceOfIncome[]">
                    <option value="">Select...</option>
                    <option value="1">Employment (Formal)</option>
                    <option value="2">Employment (Informal)</option>
                    <option value="3">Self-Employed / Business</option>
                    <option value="4">Farming / Fishing</option>
                    <option value="5">Remittance</option>
                    <option value="6">Pension / Social</option>
                    <option value="0">No Income</option>
                </select></label>
                <label>Place of Work <input type="text" name="workPlace[]" /></label>
                <label>Status of Work <select name="workStatus[]">
                    <option value="">Select...</option>
                    <option value="1">Regular</option>
                    <option value="2">Seasonal</option>
                    <option value="3">Sideline/On Call</option>
                    <option value="0">No Income</option>
                </select></label>
            </div>
            <label>Registered barangay<select name="registeredBarangay[]" class="registered-barangay" required>
                <option value="BABO_PANGULO">BABO_PANGULO</option>
                <option value="BABO_SACAN">BABO_SACAN</option>
                <option value="BALUBAD">BALUBAD</option>
                <option value="CALZADANG_BAYU">CALZADANG_BAYU</option>
                <option value="CAMIAS">CAMIAS</option>
                <option value="CANGATBA">CANGATBA</option>
                <option value="DIAZ">DIAZ</option>
                <option value="HACIENDA_DOLORES">HACIENDA_DOLORES</option>
                <option value="INARARO">INARARO</option>
                <option value="JALUNG">JALUNG</option>
                <option value="MANCATIAN">MANCATIAN</option>
                <option value="MANIBAUG_LIBUTAD">MANIBAUG_LIBUTAD</option>
                <option value="MANIBAUG_PARALAYA">MANIBAUG_PARALAYA</option>
                <option value="MANIBAUG_PASIG">MANIBAUG_PASIG</option>
                <option value="MANUALI">MANUALI</option>
                <option value="MITLA_PROPER">MITLA_PROPER</option>
                <option value="PALAT">PALAT</option>
                <option value="PIAS">PIAS</option>
                <option value="PIO">PIO</option>
                <option value="PLANAS">PLANAS</option>
                <option value="POBLACION">POBLACION</option>
                <option value="PULONG_SANTOL">PULONG_SANTOL</option>
                <option value="SALU">SALU</option>
                <option value="SAN_JOSE_MITLA">SAN_JOSE_MITLA</option>
                <option value="SANTA_CRUZ">SANTA_CRUZ</option>
                <option value="SAPANG_UWAK">SAPANG_UWAK</option>
                <option value="SEPUNG_BULAON">SEPUNG_BULAON</option>
                <option value="SEÑORA">SEÑORA</option>
                <option value="VILLA_MARIA">VILLA_MARIA</option>
                <option value="OTHERS">OTHERS</option>
            </select></label>
            <label class="others-barangay hidden">If others, specify: <input type="text" name="registeredBarangayOther[]" /></label>
        </div>
    `;
    return fieldset;
}

function toggleYouthFields(select) {
    const fieldset = select.closest('.member-fieldset');
    const age = Number(fieldset.querySelector('.member-age')?.value);
    toggleYouthStatus(fieldset, age);
}

function toggleYouthStatus(fieldset, age) {
    const youthStatusGroup = fieldset.querySelector('.youth-status-group');
    const schoolGroup = fieldset.querySelector('.school-group');
    const workGroup = fieldset.querySelector('.work-group');
    const enrolledSelect = fieldset.querySelector('[name="enrolled[]"]');
    const enrolledValue = enrolledSelect?.value;

    if (age >= 10 && age <= 24) {
        youthStatusGroup.classList.remove('hidden');
        enrolledSelect.required = true;

        if (enrolledValue === '1' || enrolledValue === '2') {
            schoolGroup?.classList.remove('hidden');
            workGroup?.classList.add('hidden');
            workGroup?.querySelectorAll('select, input').forEach(el => el.value = '');
        } else if (enrolledValue === '0') {
            schoolGroup?.classList.add('hidden');
            workGroup?.classList.remove('hidden');
            schoolGroup?.querySelectorAll('select, input').forEach(el => el.value = '');
        } else {
            schoolGroup?.classList.add('hidden');
            workGroup?.classList.add('hidden');
        }
    } else {
        youthStatusGroup.classList.add('hidden');
        enrolledSelect.required = false;
        youthStatusGroup.querySelector('select')?.value = '';
        schoolGroup?.classList.add('hidden');
        workGroup?.classList.remove('hidden');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// --- Offline Support ---

/**
 * Initialize offline detection and queue syncing
 */
function initializeOfflineSupport() {
    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial status
    updateOnlineStatus();

    // Attempt to sync any pending submissions
    syncPendingSubmissions();
}

/**
 * Handle when connection is restored
 */
function handleOnline() {
    updateOnlineStatus();
    syncPendingSubmissions();
}

/**
 * Handle when connection is lost
 */
function handleOffline() {
    updateOnlineStatus();
}

/**
 * Update UI to show online/offline status
 */
function updateOnlineStatus() {
    if (!navigator.onLine) {
        console.log('App is offline - data will be queued');
    } else {
        console.log('App is online - submissions will be sent immediately');
    }
}

/**
 * Submit survey data with offline queue support
 */
async function submitToGoogleSheet(surveyValues, members, url) {
    if (!url || !url.trim() || url === 'YOUR_WEBHOOK_URL_HERE') {
        console.warn('Google Sheets webhook URL is not configured.');
        console.warn('Please follow the setup instructions in SETUP_GUIDE.md');
        alert('Survey app is not properly configured. Please contact the administrator.');
        throw new Error('Webhook URL not configured');
    }

    const payload = { surveyValues, members };

    try {
        // Try to submit directly if online
        if (navigator.onLine) {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const text = await response.text();
            const result = JSON.parse(text);
            console.log('Survey submitted successfully', result);
            
        } else {
            // Queue for later submission
            queueForSubmission(payload);
        }
    } catch (error) {
        console.error('Submission error:', error);
        // Queue for retry
        queueForSubmission(payload);
    }
}

/**
 * Queue a submission for later sync
 */
function queueForSubmission(payload) {
    try {
        const queue = JSON.parse(localStorage.getItem('surveyQueue') || '[]');
        queue.push({
            timestamp: new Date().toISOString(),
            payload: payload
        });
        localStorage.setItem('surveyQueue', JSON.stringify(queue));
        console.log('Survey queued for offline sync. Total queued:', queue.length);
    } catch (error) {
        console.error('Failed to queue submission:', error);
    }
}

/**
 * Sync all pending submissions
 */
async function syncPendingSubmissions() {
    if (!navigator.onLine) return;

    try {
        const queue = JSON.parse(localStorage.getItem('surveyQueue') || '[]');
        
        if (queue.length === 0) {
            console.log('No pending submissions to sync');
            return;
        }

        console.log('Syncing', queue.length, 'pending submissions...');

        let successCount = 0;
        let failedIndices = [];

        for (let i = 0; i < queue.length; i++) {
            const item = queue[i];
            try {
                const url = document.querySelector('[data-webhook-url]')?.getAttribute('data-webhook-url') ||
                           localStorage.getItem('webhookUrl') ||
                           'YOUR_WEBHOOK_URL_HERE';

                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(item.payload),
                    mode: 'no-cors',
                    cache: 'no-cache'
                });

                successCount++;
                console.log('Successfully synced submission from', item.timestamp);
            } catch (error) {
                console.error('Failed to sync submission from', item.timestamp, ':', error);
                failedIndices.push(i);
            }
        }

        // Remove successfully synced items
        const updatedQueue = queue.filter((_, i) => failedIndices.includes(i));
        localStorage.setItem('surveyQueue', JSON.stringify(updatedQueue));

        if (successCount > 0) {
            console.log('Synced', successCount, 'submissions successfully');
        }
        if (failedIndices.length > 0) {
            console.log(failedIndices.length, 'submissions still pending');
        }
    } catch (error) {
        console.error('Error during sync:', error);
    }
}

/**
 * Clear all queued submissions (admin function)
 */
function clearSubmissionQueue() {
    localStorage.removeItem('surveyQueue');
    console.log('Submission queue cleared');
}