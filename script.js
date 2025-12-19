/*NAVBAR*/
document.addEventListener("DOMContentLoaded", () => {
    const hamMenu = document.getElementById("hamburger-menu");
    const menu = document.getElementById("menu");

    if (hamMenu && menu) {
        hamMenu.addEventListener("click", () => {
            menu.classList.toggle("hidden");
        });
    }
});

/*LOGIN*/
function login() {
    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (!usernameInput || !passwordInput) {
        message.textContent = "Semua kolom harus diisi!";
        message.style.color = "red";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const foundUser = users.find(
        u => u.username === usernameInput && u.password === passwordInput
    );

    if (foundUser) {
        message.textContent = "Login berhasil!";
        message.style.color = "green";

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", foundUser.username);

        setTimeout(() => {
            window.location.href = "index_login.html";
        }, 800);
    } else {
        message.textContent = "Username atau password salah!";
        message.style.color = "red";
    }
}

/*REGISTER*/
function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("registerMessage");

    if (!username || !password) {
        message.textContent = "Semua kolom harus diisi!";
        message.style.color = "red";
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(u => u.username === username)) {
        message.textContent = "Username sudah terdaftar!";
        message.style.color = "red";
        return;
    }

    users.push({ username, password });
    localStorage.setItem("users", JSON.stringify(users));

    message.textContent = "Pendaftaran berhasil!";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}

/*CEK LOGIN*/
function cekLogin() {
    if (localStorage.getItem("isLoggedIn") !== "true") {
        alert("Silakan login terlebih dahulu!");
        window.location.href = "login.html";
        return;
    }

    const namaUser = document.getElementById("namaUser");
    if (namaUser) {
        namaUser.textContent = localStorage.getItem("username");
    }
}

/*LOGOUT*/
function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    alert("Logout berhasil!");
    window.location.href = "index.html";
}

/*AFTAR EKSPEDISI*/
function daftarEkspedisi() {
    const robloxUser = document.getElementById("robloxUser").value.trim();
    const robloxID = document.getElementById("robloxID").value.trim();
    const divisi = document.getElementById("divisi").value;
    const message = document.getElementById("daftarEkspedisiMessage");

    if (!robloxUser || !robloxID) {
        message.textContent = "Semua kolom harus diisi!";
        message.style.color = "red";
        return;
    }

    const currentUser = localStorage.getItem("username");
    localStorage.setItem(
        "ekspedisi_" + currentUser,
        JSON.stringify({ robloxUser, robloxID, divisi })
    );

    message.textContent = "Pendaftaran berhasil!";
    message.style.color = "green";

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 800);
}

/*STATUS EKSPEDISI*/
function loadStatusEkspedisi() {
    const currentUser = localStorage.getItem("username");
    const statusDiv = document.getElementById("statusContent");

    const data = localStorage.getItem("ekspedisi_" + currentUser);
    if (!data) {
        statusDiv.innerHTML = "<p>Anda belum mendaftar ekspedisi.</p>";
        return;
    }

    const e = JSON.parse(data);
    statusDiv.innerHTML = `
        <p><b>Username Roblox:</b> ${e.robloxUser}</p>
        <p><b>ID Roblox:</b> ${e.robloxID}</p>
        <p><b>Divisi:</b> ${e.divisi}</p>
    `;
}

/*GALERI PRIBADI*/
function loadMyGallery() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    gallery.innerHTML = "";
    const user = localStorage.getItem("username");
    const photos = JSON.parse(localStorage.getItem("foto_" + user)) || [];

    if (photos.length === 0) {
        gallery.innerHTML = "<p>Belum ada foto.</p>";
        return;
    }

    photos.forEach((item, index) => {
        const box = document.createElement("div");
        box.className = "myGalleryItem";

        const img = document.createElement("img");
        img.src = item.img;
        img.onclick = () => openFotoModal(item.img, item.desc);

        const desc = document.createElement("p");
        desc.textContent = item.desc;

        const btn = document.createElement("button");
        btn.textContent = "Hapus";
        btn.onclick = () => hapusFoto(index);

        box.append(img, desc, btn);
        gallery.appendChild(box);
    });
}

function uploadFoto() {
    const file = document.getElementById("foto").files[0];
    const desc = document.getElementById("deskripsiFoto").value.trim();
    if (!file) return alert("Pilih foto!");

    const reader = new FileReader();
    reader.onload = e => {
        const user = localStorage.getItem("username");
        const key = "foto_" + user;
        const data = JSON.parse(localStorage.getItem(key)) || [];

        data.push({ img: e.target.result, desc: desc || "Tanpa deskripsi" });
        localStorage.setItem(key, JSON.stringify(data));
        loadMyGallery();
    };
    reader.readAsDataURL(file);
}

function hapusFoto(index) {
    const user = localStorage.getItem("username");
    const key = "foto_" + user;
    const data = JSON.parse(localStorage.getItem(key)) || [];
    if (!confirm("Hapus foto?")) return;
    data.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(data));
    loadMyGallery();
}

/*GALERI PUBLIK*/
function loadPublicGallery() {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;

    gallery.innerHTML = "";
    let ada = false;

    Object.keys(localStorage).forEach(key => {
        if (key.startsWith("foto_")) {
            const user = key.replace("foto_", "");
            const photos = JSON.parse(localStorage.getItem(key)) || [];

            photos.forEach(item => {
                ada = true;
                const box = document.createElement("div");
                box.className = "galleryItem";

                const img = document.createElement("img");
                img.src = item.img;
                img.onclick = () => openFotoModal(item.img, item.desc);

                const desc = document.createElement("p");
                desc.textContent = item.desc;

                const name = document.createElement("p");
                name.textContent = "Diunggah oleh: " + user;

                box.append(img, desc, name);
                gallery.appendChild(box);
            });
        }
    });

    if (!ada) gallery.innerHTML = "<p>Belum ada foto.</p>";
}

/*MODAL FOTO*/
function openFotoModal(src, desc) {
    document.getElementById("fotoModal").style.display = "flex";
    document.getElementById("modalImg").src = src;
    document.getElementById("modalDesc").textContent = desc;
}

function closeFotoModal() {
    document.getElementById("fotoModal").style.display = "none";
}
