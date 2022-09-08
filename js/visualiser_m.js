"use strict";

const qs = (val) => {
    return document.querySelector(val)
}

const qsa = (val) => {
    return document.querySelectorAll(val)
}

const div = qs("#visualiserMain");

async function initJSON() {
      const response = await fetch('js/json/l2d.json');
      const json = await response.json()
      json.sort(function (a, b) {
            return a.name.localeCompare(b.name);

      })
      json.map((val) => {
        if (!RELEASED_UNITS.includes(val.name)) return false
            const liste_item = document.createElement("li");

            liste_item.innerHTML = "<img src='images/sprite/si_" + val.id + "_00_s.png'/>" + " " + val.name

            liste_item.classList.add("charDiv")

            liste_item.addEventListener("click", (e) => {
                id = val.id;
                changeSpine(val.id)
            })
            div.appendChild(liste_item) //div character list
      })

}

initJSON()

let changeSpine = (id) => {

    qs("#player-container").innerHTML = ""

    if (current_pose==="fb"){
        new spine.SpinePlayer("player-container", {
            skelUrl: "/l2d/" + id + "/" + id + "_00.skel",
            atlasUrl: "/l2d/" + id + "/" + id + "_00.atlas",
            animation: "idle",
            skin: "00",
            backgroundColor: "#2f353a",
            alpha: false,
            debug: false,
            preserveDrawingBuffer:true
        });
    } else if (current_pose==="cover"){
        new spine.SpinePlayer("player-container", {
            skelUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.skel",
            atlasUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.atlas",
            skin: "00",
            backgroundColor: "#2f353a",
            animation: "cover_idle",
            alpha: false,
            debug: false,
            preserveDrawingBuffer:true
      })
    } else if (current_pose==="aim"){
        new spine.SpinePlayer("player-container", {
            skelUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.skel",
            atlasUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.atlas",
            skin: "00",
            animation: "aim_idle",
            backgroundColor: "#2f353a",
            alpha: false,
            debug: false,
            preserveDrawingBuffer:true
      })
    }
    
}

let id = "c210";
let current_pose="fb"
changeSpine(id)

const radio_array = qsa(".form-check-input")

for (let i = 0; i < radio_array.length; i++){
    radio_array[i].addEventListener("click",(e)=>{
        current_pose = e.target.value
        console.log(e);
        changeSpine(id)
    })
}
