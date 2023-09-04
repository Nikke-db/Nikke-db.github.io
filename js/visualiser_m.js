"use strict";

const qs = (val) => {
    return document.querySelector(val)
}

const qsa = (val) => {
    return document.querySelectorAll(val)
}

//redirects pc user to /v
if (!navigator.userAgentData.mobile) {
      location.href = "v"
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
        if (val.id==="story1902") return false
        const liste_item = document.createElement("li");

        liste_item.innerHTML = "<img src='images/sprite/si_" + val.id + "_00_s.png'/>" + " " + val.name
        liste_item.setAttribute('spineversion', val.version)

        liste_item.classList.add("charDiv")

        liste_item.addEventListener("click", (e) => {
            id = val.id;
            currentVersion = val.version
            changeSpine(val.id)
        })
        div.appendChild(liste_item) //div character list
    })

}

initJSON()

let skin;
let currentVersion = 4.0

let changeSpine = (id) => {

    // starting 18th may 2023, the game uses spine 4.1 for their animation
    // I'm loading both 4.0 and 4.1 runtimes to avoid updating all 170 characters to 4.1
    // and only keep 4.1 for the newests
    // 4.0 : release to overzone event
    // 4.1 : 777 event to ?
    let spineVersionLoader;
    if (currentVersion == 4.1) {
        spineVersionLoader = spine41
    } else {
        spineVersionLoader = spine
    }

    // exception list when a character have spine 4.1 and 4.0 assets
    if (id === "c131_01" && current_l2d === "aim") spineVersionLoader = spine //pepper's skin
    if (id === "c160" && current_l2d === "fb") spineVersionLoader = spine41 // yuni
    if (id === "c161" && current_l2d === "fb") spineVersionLoader = spine41 // mihara

    qs("#player-container").innerHTML = ""

    // skin exception list , if not it'll go to default skin
    if (skin !== "weapon_2" || id !== "c220") {
        skin = "default"
    }
    //rapi_old and shifty_old exception
    if (id === "c010_01" || id === "c907_01") {
        skin = "00"
    }

    if (current_pose === "fb") {
        //if snow white / maxine / E.H. / drake racer/ Mast / 
            // 2B / 2B skirtless > use skin acc
            if(     id==="c220" || id==="c102" || id==="c940" || id==="c101_01" || id==="c350" || 
                    id==="c810" || id==="c810_01") {
                        skin="acc"
            }

            //if anchor / brid black moon / 2b skin gacha > use skin bg
            if(id==="c351" || id==="c070_02" || id==="c810_02") skin="bg"

        new spineVersionLoader.SpinePlayer("player-container", {
            skelUrl: "/l2d/" + id + "/" + id + "_00.skel",
            atlasUrl: "/l2d/" + id + "/" + id + "_00.atlas",
            animation: "idle",
            skin: skin,
            backgroundColor: "#2f353a",
            alpha: false,
            debug: false,
            preserveDrawingBuffer: true
        });
    } else if (current_pose === "cover") {
        //if snow white and weapon_2 not selected> use weapon2
        if (id === "c220" && skin !== "weapon_2") skin = "weapon_1"

        new spineVersionLoader.SpinePlayer("player-container", {
            skelUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.skel",
            atlasUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.atlas",
            skin: skin,
            backgroundColor: "#2f353a",
            animation: "cover_idle",
            alpha: false,
            debug: false,
            preserveDrawingBuffer: true
        })
    } else if (current_pose === "aim") {
        new spineVersionLoader.SpinePlayer("player-container", {
            skelUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.skel",
            atlasUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.atlas",
            skin: skin,
            animation: "aim_idle",
            backgroundColor: "#2f353a",
            alpha: false,
            debug: false,
            preserveDrawingBuffer: true
        })
    }

}

let id = "c010";
let current_pose = "fb"
changeSpine(id)

const radio_array = qsa(".form-check-input")

for (let i = 0; i < radio_array.length; i++) {
    radio_array[i].addEventListener("click", (e) => {
        current_pose = e.target.value
        console.log(e);
        changeSpine(id)
    })
}

//skin exception checkers
document.addEventListener("click", (e) => {
    // we need to do something special for snow white weapon_2 skin because it is too large for the container ( it'll be auto cropped)
    if (e.target.innerHTML === "weapon_2") {
        skin = "weapon_2";
        changeSpine(id)
    }
    if ((e.target.innerHTML === "weapon_1" || e.target.innerHTML === "default") && skin === "weapon_2") {
        skin = "default"
        changeSpine(id)
    }
})