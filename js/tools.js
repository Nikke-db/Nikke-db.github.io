"use strict";

const qs = (val) => {
    return document.querySelector(val)
}

const qsa = (val) => {
    return document.querySelectorAll(val)
}

const MENUS = qsa(".tool_menu");

//rotate the " > " when open and closing the tool tab
MENUS.forEach((menu)=>{
    menu.addEventListener("click",(e)=>{
        let svg = menu.children[0];

        if (svg.style.transform === "" || svg.style.transform === "rotate(0deg)"){
            svg.style.transform = "rotate(90deg)";
        }else{
            svg.style.transform = "rotate(0deg)";
        }
    })
})