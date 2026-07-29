// ============================================
// RANDOM USER GENERATOR - RandomUser API
// ============================================

const USER_API = 'https://randomuser.me/api/';

let currentUser = null;
let contacts = JSON.parse(localStorage.getItem('contacts')) || [];

// ===== DOM Elements =====
const userContent = document.getElementById('userContent');
const newUserBtn = document.getElementById('newUserBtn');
const saveUserBtn = document.getElementById('saveUserBtn');
const downloadVCardBtn = document.getElementById('downloadVCardBtn');
const contactsGrid = document.getElementById('contactsGrid');

// ===== Event Listeners =====
newUserBtn.addEventListener('click', generateUser);
saveUserBtn.addEventListener('click', saveContact);
downloadVCardBtn.addEventListener('click', downloadVCard);

// ===== Generate Random User =====
async function generateUser() {
    showUserLoading();

    try {
        const response = await fetch(USER_API);
        
        if (!response.ok) throw new Error('Failed to generate user');
        
        const data = await response.json();
        const user = data.results[0];

        currentUser = {
            name: `${user.name.title} ${user.name.first} ${user.name.last}`,
            firstName: user.name.first,
            lastName: user.name.last,
            email: user.email,
            location: `${user.location.city}, ${user.location.country}`,
            street: `${user.location.street.number} ${user.location.street.name}`,
            city: user.location.city,
            state: user.location.state,
            country: user.location.country,
            postcode: user.location.postcode,
            avatar: user.picture.large,
            phone: user.phone,
            cell: user.cell,
            dob: new Date(user.dob.date).toLocaleDateString(),
            age: user.dob.age
        };

        displayUser(currentUser);
    } catch (error) {
        userContent.innerHTML = `
            <div style="text-align:center;color:#fca5a5;padding:20px;">
                <i class="fas fa-exclamation-circle" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
                <p>Failed to generate user. Please try again.</p>
                <button onclick="generateUser()" class="btn btn-primary" style="margin-top:10px;">
                    <i class="fas fa-sync"></i> Retry
                </button>
            </div>
        `;
    }
}

// ===== Display User =====
function displayUser(user) {
    userContent.innerHTML = `
        <div class="user-card">
            <img src="${user.avatar}" alt="${user.name}">
            <div class="user-name">${user.name}</div>
            <div class="user-email"><i class="fas fa-envelope"></i> ${user.email}</div>
            <div class="user-location"><i class="fas fa-map-pin"></i> ${user.location}</div>
            <div style="margin-top:10px;display:flex;gap:20px;justify-content:center;flex-wrap:wrap;color:#64748b;font-size:0.85rem;">
                <span><i class="fas fa-phone"></i> ${user.phone}</span>
                <span><i class="fas fa-calendar"></i> ${user.age} years</span>
            </div>
        </div>
    `;
}

// ===== Save Contact =====
function saveContact() {
    if (!currentUser) {
        showToast('⚠️ Generate a user first!', 'error');
        return;
    }

    if (contacts.some(c => c.email === currentUser.email)) {
        showToast('⚠️ This contact is already saved!', 'error');
        return;
    }

    contacts.push({ ...currentUser });
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
    showToast('✅ Contact saved successfully!');
}

// ===== Display Contacts =====
function displayContacts() {
    if (contacts.length === 0) {
        contactsGrid.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;color:#64748b;padding:20px;">
                <i class="fas fa-users" style="font-size:2rem;display:block;margin-bottom:10px;color:#475569;"></i>
                <p>No contacts saved yet. Generate a user and click "Save Contact"!</p>
            </div>
        `;
        return;
    }

    contactsGrid.innerHTML = contacts.map((contact, index) => `
        <div class="contact-card">
            <img src="${contact.avatar}" alt="${contact.name}">
            <h4>${contact.name}</h4>
            <p>${contact.email}</p>
            <p style="font-size:0.75rem;color:#64748b;">${contact.location}</p>
            <div class="contact-actions">
                <button class="btn btn-danger btn-small" onclick="removeContact(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ===== Remove Contact =====
function removeContact(index) {
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    displayContacts();
    showToast('🗑️ Contact removed');
}

// ===== Download vCard =====
function downloadVCard() {
    if (!currentUser) {
        showToast('⚠️ Generate a user first!', 'error');
        return;
    }

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${currentUser.name}
N:${currentUser.lastName};${currentUser.firstName};;;
EMAIL:${currentUser.email}
TEL:${currentUser.phone}
ADR:${currentUser.street};${currentUser.city};${currentUser.state};${currentUser.postcode};${currentUser.country}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentUser.name.replace(/\s/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('📥 vCard downloaded!');
}

// ===== UI Helpers =====
function showUserLoading() {
    userContent.innerHTML = `
        <div class="loading">
            <i class="fas fa-spinner"></i>
            <p>Generating user...</p>
        </div>
    `;
}

// ===== Toast Notification =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';
    if (type === 'error') toast.classList.add('error');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== Initialize =====
displayContacts();

// Load initial user
generateUser();
