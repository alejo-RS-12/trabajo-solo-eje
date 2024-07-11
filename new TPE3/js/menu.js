/*Menú responsive*/
"use strict";
document.querySelector(".btn-menu").addEventListener("click",alternarMenu);
function alternarMenu() {
    document.querySelector(".navbar").classList.toggle("show");
}