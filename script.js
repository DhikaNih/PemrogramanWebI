/*Buka Tutup Navbar*/
const hamMenu = document.getElementById("hamburger-menu");
const menu = document.getElementById("menu");

hamMenu.addEventListener("click", function () {
    menu.classList.toggle("hidden");
});


/*Login*/
function login() {
    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (usernameInput === "" || passwordInput === "") {
        message.textContent = "Semua kolom harus diisi!";
        message.style.color = "red";
        return;
    }

    // Ambil daftar user
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cari user sesuai input
    const foundUser = users.find(
        u => u.username === usernameInput && u.password === passwordInput
    );

    if (foundUser) {
        message.textContent = "Login berhasil! Mengarahkan...";
        message.style.color = "green";

        // Set login status
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", foundUser.username);

        setTimeout(() => {
            window.location.href = "index_login.html";
        }, 1000);
    } else {
        message.textContent = "Username atau password salah!";
        message.style.color = "red";
    }
}


// Cek Login (Anti Bypass)
function cekLogin() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    if (isLoggedIn !== "true") {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "index_login.html";
    }

    if (!username) {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    // Tampilkan nama user di dashboard
    const namaUserElem = document.getElementById("namaUser");
    if (namaUserElem) {
        namaUserElem.textContent = username;
    }
}

/*Register*/
function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("registerMessage");

    if (username === "" || password === "") {
        message.textContent = "Semua kolom harus diisi!";
        message.style.color = "red";
        return;
    }

    // Ambil list user dari localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Cek apakah username sudah ada
    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        message.textContent = "Username sudah terdaftar!";
        message.style.color = "red";
        return;
    }

    // Tambahkan user baru ke array
    users.push({ username: username, password: password });

    // Simpan kembali ke localStorage
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Pendaftaran berhasil! Silakan login.";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1200);
}


/*Logout*/
function logout() {
    // Hapus status login
    localStorage.removeItem("isLoggedIn");

    // (OPSIONAL) jika mau hapus username & password simpanan
    // localStorage.removeItem("username");
    // localStorage.removeItem("password");

    alert("Anda telah logout!");
    window.location.href = "login.html"; // arahkan ke halaman login
}

/*Daftar Ekspedisi*/
// Fungsi Daftar Ekspedisi
function daftarEkspedisi() {
    const robloxUser = document.getElementById("robloxUser").value.trim();
    const robloxID = document.getElementById("robloxID").value.trim();
    const divisi = document.getElementById("divisi").value;
    const message = document.getElementById("daftarEkspedisiMessage");

    if (robloxUser === "" || robloxID === "") {
        message.textContent = "Semua kolom harus diisi!";
        message.style.color = "red";
        return;
    }

    // Ambil username login sekarang
    const currentUser = localStorage.getItem("username");
    if (!currentUser) {
        alert("Harus login dulu!");
        return;
    }

    // Simpan data pendaftaran spesifik untuk user tersebut
    const daftarData = {
        robloxUser: robloxUser,
        robloxID: robloxID,
        divisi: divisi
    };

    // simpan data di localStorage dengan nama ekspedisi_username
    localStorage.setItem("ekspedisi_" + currentUser, JSON.stringify(daftarData));

    message.textContent = "Pendaftaran berhasil!";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1200);
}

/*Memuat Status Ekspedisi*/
function loadStatusEkspedisi() {
    const currentUser = localStorage.getItem("username");
    const statusDiv = document.getElementById("statusContent");

    const data = localStorage.getItem("ekspedisi_" + currentUser);

    if (!data) {
        statusDiv.innerHTML = "<p>Anda belum mendaftar ekspedisi.</p>";
        return;
    }

    const ekspedisi = JSON.parse(data);

    statusDiv.innerHTML = `
        <p><strong>Username Roblox:</strong> ${ekspedisi.robloxUser}</p>
        <p><strong>ID Roblox:</strong> ${ekspedisi.robloxID}</p>
        <p><strong>Divisi / Peran:</strong> ${ekspedisi.divisi}</p>
    `;
}

/*Galeri Upload*/
// Load Galeri Foto User Login
function loadMyGallery() {
    const galleryDiv = document.getElementById("gallery");
    galleryDiv.innerHTML = "";

    const username = localStorage.getItem("username");

    // Ambil data foto milik user
    const dataFoto = JSON.parse(localStorage.getItem("foto_" + username)) || [];

    if (dataFoto.length === 0) {
        galleryDiv.innerHTML = "<p>Belum ada foto yang diupload</p>";
        return;
    }

    // Tampilkan foto
    dataFoto.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        img.classList.add("uploadedFoto");
        galleryDiv.appendChild(img);
    });
}

// Upload Foto
function uploadFoto() {
    const fileInput = document.getElementById("foto");
    const file = fileInput.files[0];

    if (!file) {
        alert("Pilih foto terlebih dahulu!");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (event) {
        const fotoBase64 = event.target.result;

        const username = localStorage.getItem("username");
        const key = "foto_" + username;

        // Ambil galeri lama user
        let userPhotos = JSON.parse(localStorage.getItem(key)) || [];

        // Tambahkan foto ke array
        userPhotos.push(fotoBase64);

        // Simpan kembali ke localStorage
        localStorage.setItem(key, JSON.stringify(userPhotos));

        // Refresh galeri
        loadMyGallery();

        alert("Foto berhasil diupload!");
        fileInput.value = ""; // reset input file
    };

    // Convert ke Base64
    reader.readAsDataURL(file);
}


// Menampilkan Semua Foto Di Galeri
function loadPublicGallery() {
    const galleryContainer = document.querySelector(".gallery");

    if (!galleryContainer) return; // kalau bukan di galeri.html, hentikan

    galleryContainer.innerHTML = "";

    let keys = Object.keys(localStorage);

    let totalFoto = 0;

    keys.forEach(key => {

        // Hanya ambil data yang prefix-nya "foto_"
        if (key.startsWith("foto_")) {

            const username = key.replace("foto_", "");
            const fotoArray = JSON.parse(localStorage.getItem(key)) || [];

            fotoArray.forEach(src => {
                totalFoto++;

                // membuat elemen card foto
                const box = document.createElement("div");
                box.classList.add("galleryItem");

                const img = document.createElement("img");
                img.src = src;

                const userTag = document.createElement("p");
                userTag.textContent = "Diunggah oleh: " + username;
                userTag.classList.add("uploaderName");

                box.appendChild(img);
                box.appendChild(userTag);

                galleryContainer.appendChild(box);
            });
        }

    });

    // Jika belum ada foto sama sekali
    if (totalFoto === 0) {
        galleryContainer.innerHTML = "<p class='noFoto'>Belum ada foto dari para pemain.</p>";
    }

    document.addEventListener("DOMContentLoaded", function () {
        loadPublicGallery();
    });
}
