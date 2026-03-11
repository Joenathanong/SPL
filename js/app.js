// Konfigurasi global
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exechttps://script.google.com/macros/s/AKfycbwJwBJDKbFRIgIVvCVD0JjH6LHhspx8Ty0GTSW2vjbYnSN-tdAP9P8iiRmdriLfvdY8/exec',
    DEPARTEMEN: ['FGWH', 'WH', 'LOGISTIK', 'PRODUKSI'],
    STATUS: ['BULANAN', 'HARIAN']
};

// Fungsi utility
function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatTanggalIndonesia(date) {
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const d = new Date(date);
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

// Fungsi API
async function apiGet(action, params = {}) {
    const url = new URL(CONFIG.API_URL);
    url.searchParams.append('action', action);
    
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });
    
    try {
        const response = await fetch(url.toString());
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function apiPost(action, data) {
    const formData = new FormData();
    formData.append('action', action);
    
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });
    
    try {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            body: formData
        });
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Notifikasi
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Validasi form
function validateLemburForm(data) {
    const errors = [];
    
    if (!data.nama) errors.push('Nama harus diisi');
    if (!data.tanggal) errors.push('Tanggal harus diisi');
    if (!data.jam_mulai) errors.push('Jam mulai harus diisi');
    if (!data.jam_pulang) errors.push('Jam pulang harus diisi');
    
    // Validasi jam
    const mulai = new Date(`1970-01-01T${data.jam_mulai}`);
    const pulang = new Date(`1970-01-01T${data.jam_pulang}`);
    
    if (pulang <= mulai) {
        errors.push('Jam pulang harus setelah jam mulai');
    }
    
    if (data.jam_istirahat && (data.jam_istirahat < 0 || data.jam_istirahat > 4)) {
        errors.push('Jam istirahat tidak valid (0-4 jam)');
    }
    
    return errors;
}