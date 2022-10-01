"use strict";

const qs = (val) => {
    return document.querySelector(val)
}
const qsa = (val) => {
    return document.querySelectorAll(val)
}


let currentSkill = 0;

const hideSkill = () => {
    for (let i = 0; i<4; i++){
        qsa(".activeHeader")[i].hidden = true
        qsa(".activeDesc")[i].hidden = true
        qsa("#wr3div1 .btn")[i].classList.remove("activeskill")
    }
}
const showSkill = (index) => {
    hideSkill()
    qsa(".activeHeader")[index].hidden = false
    qsa(".activeDesc")[index].hidden = false
    qsa("#wr3div1 .btn")[index].classList.add("activeskill")
}
const skillValues= async (desc, id) => {
    const response = await fetch('js/json/SkillInfoTable.json')
    const json = await response.json()
    await json.records.map((val)=>{
        if (val.id === id){
            for (let i = 0; i< val.description_value_list.length; i++){
                if (i >=9){
                    desc = desc.replaceAll(`{description_value_${i+1}}`,val.description_value_list[i].description_value)
                }else{
                desc = desc.replaceAll(`{description_value_0${i+1}}`,val.description_value_list[i].description_value)
                }
            }
        }
    })
    return desc
}


const formatSkill = (skill) =>{  
    return skill
    .replaceAll("■", "</p><p>■")
    .replaceAll("[Own]"                 ,"On herself:")
    .replaceAll("[Apply on all enemies]","On all enemies: ")
    .replaceAll("] [lasts"              ," ")
    .replaceAll("[Apply on enemy] "     ,"Apply on enemy: ")
    .replaceAll("[Apply on target]"     ,"Apply on target:")
    .replaceAll("[Apply on All allies]" ,"All allies")
    .replaceAll("\r\n"                  ,"<br>")
    .replaceAll("▲"                     ,"<span class='buffarrow'>▲</span>")
    .replaceAll("▼"                     ,"<span class='debuffarrow'>▼</span>")
    .replaceAll("ATK"                   ,"<span class='statatk'>ATK</span>" )
    .replaceAll("HP"                    ,"<span class='stathp'>HP</span>" )
    .replaceAll("DEF"                   ,"<span class='statdef'>DEF</span>" )
    .replaceAll("herself"               ,"<span class='AAAA'>herself</span>")
    .replaceAll("self"                  ,"<span class='AAAA'>self</span>")
    .replaceAll("(Self)"                ,"On <span class='AAAA'>herself</span>")
    .replaceAll("friendly"              ,"<span class='AAAA'>friendly</span>")
    .replaceAll("unit "                 ,"<span class='AAAA'>unit </span>")
    .replaceAll("units"                 ,"<span class='AAAA'>units</span>")
    .replaceAll("allies"                ,"<span class='AAAA'>allies</span>")
    .replaceAll("ally"                  ,"<span class='AAAA'>ally</span>")
    .replaceAll("target"                ,"<span class='ZZZZ'>target</span>")
    .replaceAll("enemy"                 ,"<span class='ZZZZ'>enemy</span>")
    .replaceAll("enemies"               ,"<span class='ZZZZ'>enemies</span>")
    .replaceAll("["                     ,"")
    .replaceAll("]"                     ,"")
    .slice(4)
    + "</p>"
}

const changeData = async (val, oldactive) => {

    // console.log(oldactive);
    if (oldactive!==undefined && oldactive!=="") oldactive.classList.remove("activeChar")
    
    // change side image ( full body )
    qs("#character-FB img").src = "images/FB/"+val.id+"_00.png"
    qs("#character-FB img").alt = "Missing image for " +val.name
    
    const paramURL= window.location.search;
    const ParsedParam = new URLSearchParams(paramURL);

    ParsedParam.set("id", val.id)
    window.history.replaceState(null, null, "?id="+ParsedParam.get('id'))
    
    let minhp,minatt,mindef;

    const response = await fetch('js/json/CharacterStatTable.json');
    const json = await response.json()
    json.records.map((valstat)=>{
        if(valstat.level === 1 && valstat.group === val.stat_enhance_id){
            minhp = valstat.level_hp
            minatt= valstat.level_attack
            mindef= valstat.level_defence
        }
    })

    //gun type
    let gun;
    switch (val.weapon.weapon_type){
        case "AR": gun="Assault Rifle";  break;
        case "SG": gun="Shotgun";        break;
        case "SR": gun="Sniper Rifle";   break;
        case "MG": gun="Machine Gun";    break;
        case "SMG":gun="SubMachine Gun"; break;
        case "RL": gun="Rocket Launcher";break;
    }

    //change char name
    qs("#charNameH1").innerHTML = val.name

    //change char description
    if(val.description===undefined){
        qs("#charDescription").innerHTML = "Missing description"
    }else{
        qs("#charDescription").innerHTML = val.description
    }

    qs("#stat_rarity").innerHTML = val.rarity

    //change manufacturer
    switch(val.manufacturer){
        case "ELYSION": qs("#stat_manufacturer").innerHTML = "Elysion";break;
        case "TETRA": qs("#stat_manufacturer").innerHTML = "Tetra Lines";break;
        case "MISSILIS": qs("#stat_manufacturer").innerHTML = "Missilis Industries";break;
        case "PILGRIM": qs("#stat_manufacturer").innerHTML = "Pilgrim";break;
    }

    //change squad
    qs("#stat_squad").innerHTML = val.squad

    qs("#stat_weapon_type").innerHTML=gun;

    qs("#stat_weapon_ammo").innerHTML=val.weapon.max_ammo+ " ammunitions";
    qs("#stat_weapon_element").innerHTML=val.weapon.attack_type

    qs("#stat_hp").innerHTML = minhp
    qs("#stat_att").innerHTML = minatt
    qs("#stat_def").innerHTML = mindef

    //show the class image and drive tier, next to stats 
    qs("#stat_class").innerHTML = val.class

    qs("#stat_drive_tier").innerHTML = val.drive_tier
  
    // show skills
    hideSkill()

    qs("#SkillRegularHeader").innerHTML = "TO BE ADDED WITH RELEASE";
    qs("#Skill1Header").innerHTML = val.skill1_name;
    qs("#Skill2Header").innerHTML = val.skill2_name;
    qs("#SkillBurstHeader").innerHTML = val.ulti_name;

    qs("#SkillRegularDesc").innerHTML = "TO BE ADDED WITH RELEASE";
    qs("#Skill1Desc").innerHTML   =   formatSkill(await skillValues(val.skill1_description, val.skill1_id));
    qs("#Skill2Desc").innerHTML   =   formatSkill(await skillValues(val.skill2_description, val.skill2_id));
    qs("#SkillBurstDesc").innerHTML = formatSkill(await skillValues(val.ulti_description, val.ulti_skill_id));

    showSkill(currentSkill)

}

qs("#btn-regular-attack").addEventListener("click", (e)=>{
    currentSkill=0
    showSkill(currentSkill)
})
qs("#btn-skill-1").addEventListener("click", (e)=>{
    currentSkill=1
    showSkill(currentSkill)
})
qs("#btn-skill-2").addEventListener("click", (e)=>{
    currentSkill=2
    showSkill(currentSkill)
})
qs("#btn-burst-skill").addEventListener("click", (e)=>{
    currentSkill = 3
    showSkill(currentSkill)
})
