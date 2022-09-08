"use strict";

const div = document.getElementById("character-list");

let ascending = true;
let current_sort = "id"
let allchar
let oldactive = "";

async function initJSON() {
    const response = await fetch('js/json/Characters.json');
    const json = await response.json()

    const statresp = await fetch('js/json/CharacterStatTable.json')
    const statjson = await statresp.json()

    if (current_sort==="min-hp" ||current_sort==="min-atk" || current_sort==="min-def" ){
        let stat;
        switch (current_sort){
            case "min-hp": stat = "level_hp"; break;
            case "min-atk":stat = "level_attack"; break;
            case "min-def":stat = "level_defence"; break;
        }
        json.map((val)=>{
            
            statjson.records.map((statval)=>{
                if (val.stat_enhance_id===statval.group && statval.level === 1){
                    val.stat = statval[stat]
                }
            })
        })
        
        if (ascending) {
            json.sort(function (a, b) {
                return +(a.stat - b.stat);
            })
        } else {
            json.sort(function (a, b) {
                return -(a.stat - b.stat);
            })
        }

    }else{
        if (ascending) {
            json.sort(function (a, b) {
                return +(a[current_sort].localeCompare(b[current_sort]));
            })
        } else {
            json.sort(function (a, b) {
                return -(a[current_sort].localeCompare(b[current_sort]));
            })
        }
    }

    json.map((val) => {
        
        if (!RELEASED_UNITS.includes(val.name)) return false
            
        const liste_item = document.createElement("li");

        liste_item.innerHTML = "<img src='images/sprite/si_" + val.id + "_00_s.png'/>" + val.name

        // attributes for filters
        liste_item.setAttribute('manufacturer', val.corporation);
        liste_item.setAttribute('gun', val.weapon.weapon_type);
        liste_item.setAttribute('rarity', val.rarity);
        liste_item.setAttribute('classe', val.class);
        liste_item.setAttribute('drive', val.use_burst_skill);

        liste_item.classList.add("charDiv")

        liste_item.addEventListener("click", (e) => {
            // document.querySelector(".nav-btn").scrollIntoView()
            e.target.classList.add("activeChar")
            changeData(val, oldactive)
            oldactive = e.target
        })
        div.appendChild(liste_item) //div character list
    })

    setTimeout(() => {
        allchar = document.querySelectorAll(".charDiv")
    }, 500);


    const paramURL = window.location.search;
    const ParsedParam = new URLSearchParams(paramURL);

    if (ParsedParam.get('id') != null) {
        let check = false
        let i = 0
        json.map((val) => {
            if (val.id === ParsedParam.get('id')) {
                changeData(val)
                check = true
                let target = document.querySelectorAll(".charDiv")[i]
                target.classList.add("activeChar")
                oldactive = target
            }
            i++
        })
        if (!check) {
            changeData(json[0])
            let target=document.querySelectorAll(".charDiv")[0]
            target.classList.add("activeChar")
            oldactive = target
        }
    } else {
        changeData(json[0])
        let target=document.querySelectorAll(".charDiv")[0]
            target.classList.add("activeChar")
            oldactive = target
    }
    
}

initJSON()



// filter value booleans
let fmg = false,
    fssr = false,
    fsmg = false,
    fsri = false,
    fdef = false,
    fatk = false,
    frl = false,
    far = false,
    fsg = false,
    fsr = false,
    fel = false,
    fmi = false,
    ftl = false,
    fpi = false,
    fsup = false,
    fr = false,
    fi = false,
    fii = false,
    fiii = false

const setFilters = (input) => {
    switch (input.value) {
        case "SSR": fssr = input.checked; break;
        case "SMG": fsmg = input.checked; break;
        case "SRI": fsri = input.checked; break;
        case "DEF": fdef = input.checked; break;
        case "ATK": fatk = input.checked; break;
        case "SUP": fsup = input.checked; break;
        case "MG": fmg = input.checked; break;
        case "RL": frl = input.checked; break;
        case "AR": far = input.checked; break;
        case "SG": fsg = input.checked; break;
        case "SR": fsr = input.checked; break;
        case "EL": fel = input.checked; break;
        case "MI": fmi = input.checked; break;
        case "TL": ftl = input.checked; break;
        case "PI": fpi = input.checked; break;
        case "R": fr = input.checked; break;
        case "I": fi = input.checked; break;
        case "II": fii = input.checked; break;
        case "III": fiii = input.checked; break;
    }
}

const checkManufacturer = (unit) => {
    if (!fpi && !fel && !fmi && !ftl) return true
    switch (unit) {
        case "PILGRIM": if (fpi) return true; break;
        case "ELYSION": if (fel) return true; break;
        case "MISSILIS": if (fmi) return true; break;
        case "TETRA": if (ftl) return true; break;
    }
}

const checkRarity = (unit) => {
    if (!fssr && !fsr && !fr) return true
    switch (unit) {
        case "SSR": if (fssr) return true; break;
        case "SR": if (fsr) return true; break;
        case "R": if (fr) return true; break;
    }
}

const checkClasse = (unit) => {
    if (!fatk && !fdef && !fsup) return true
    switch (unit) {
        case "Supporter": if (fsup) return true; break;
        case "Defender": if (fdef) return true; break;
        case "Attacker": if (fatk) return true; break;
    }
}

const checkGun = (unit) => {
    if (!fsmg && !fsri && !far && !frl && !fsg && !fmg) return true
    switch (unit) {
        case "RL": if (frl) return true; break;
        case "SR": if (fsri) return true; break;
        case "AR": if (far) return true; break;
        case "SG": if (fsg) return true; break;
        case "MG": if (fmg) return true; break;
        case "SMG": if (fsmg) return true; break;
    }
}

const checkDrive = (unit) => {
    if (!fi && !fii && !fiii) return true
    switch (unit) {
        case "Step1": if (fi) return true; break;
        case "Step2": if (fii) return true; break;
        case "Step3": if (fiii) return true; break;
    }
}

const listHidden = () => {
    for (let i = 0; i < allchar.length; i++) {
        if (checkManufacturer(allchar[i].getAttribute("manufacturer"))
            && checkRarity(allchar[i].getAttribute("rarity"))
            && checkClasse(allchar[i].getAttribute("classe"))
            && checkGun(allchar[i].getAttribute("gun"))
            && checkDrive(allchar[i].getAttribute("drive"))) {
                
            if (allchar[i].outerText.toLowerCase().includes(query.value.toLowerCase())) {
               
                allchar[i].hidden = false
            } else {
                
                allchar[i].hidden = true
            }
        }
        else {
            
            allchar[i].hidden = true
        }
    }
}

const query = document.querySelector("#character-search-input")
const filters = document.querySelectorAll(".filtercontent input")

for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", (e) => {
        setFilters(e.target)
        listHidden()
    })
}

query.addEventListener("input", (e) => {
    listHidden()
})

const sortingdata = document.querySelectorAll("#sortingmodal .modal-body .wrapperfilter .wrfi3 input")

for (let i = 0; i < sortingdata.length; i++) {

    sortingdata[i].addEventListener("click", (e) => {

        current_sort = e.target.value
        document.querySelector("#character-list").innerHTML = ""
        initJSON()

    })
}

const sortingorder = document.querySelectorAll("#sortingmodal .modal-body .wrapperfilter .wrfi5 input")

for (let i = 0; i < sortingorder.length; i++) {

    sortingorder[i].addEventListener("click", (e) => {

        switch (e.target.value) {
            case "asc": ascending = true; break;
            case "desc": ascending = false; break;
        }

        document.querySelector("#character-list").innerHTML = ""
        initJSON()

    })
}