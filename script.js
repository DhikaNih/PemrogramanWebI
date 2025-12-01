/*Buka Tutup Navbar*/
const hamMenu = document.getElementById("hamburger-menu");
const menu = document.getElementById("menu");

hamMenu.addEventListener("click", function () {
    menu.classList.toggle("hidden");
});

