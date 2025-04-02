// Fungsi untuk memeriksa status login
function checkAuth() {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const authCookie = cookies.find(c => c.startsWith('auth='));
    
    if (!authCookie || authCookie.split('=')[1] !== 'true') {
        window.location.href = 'login.html';
    }
}

// Jalankan pengecekan saat halaman dimuat
document.addEventListener('DOMContentLoaded', checkAuth);