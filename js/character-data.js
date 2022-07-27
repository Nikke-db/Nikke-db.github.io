"use strict";

const qs = (val) => {
    return document.querySelector(val)
}
const qsa = (val) => {
    return document.querySelectorAll(val)
}


let currentSkill = 0;
const progress_value = (val, type)=>{
    let maxstat
    switch(type){
        case "hp":
            maxstat = 350000
            break;
        case "att":
            maxstat = 5000
            break;
        case "def":
            maxstat = 750
            break;
    }
    return  100*val/maxstat
}

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
    
    let corporation = val.corporation=="TETRA"? "tetraline" : val.corporation.toLowerCase()
    let minhp,maxhp,minatt,maxatt,mindef,maxdef;
    let maxlvl

    switch(val.rarity){
        case "SSR": maxlvl = 200; break;
        case "SR" : maxlvl = 120; break;
        case "R"  : maxlvl = 80 ; break;
    }

    const response = await fetch('js/json/CharacterStatTable.json');
    const json = await response.json()
    json.records.map((valstat)=>{
        if(valstat.level === 1 && valstat.group === val.stat_enhance_id){
            minhp = valstat.level_hp
            minatt= valstat.level_attack
            mindef= valstat.level_defence
        }
        if(valstat.level === maxlvl && valstat.group === val.stat_enhance_id){
            maxhp = valstat.level_hp
            maxatt= valstat.level_attack
            maxdef= valstat.level_defence
        }
    })

    //change char name
    qs("#charNameH1").innerHTML = val.name

    //change char sub header small data because i don't know where else to write it
    let gun;
    switch (val.weapon.weapon_type){
        case "AR": gun="Assault Rifle";  break;
        case "SG": gun="Shotgun";        break;
        case "SR": gun="Sniper Rifle";   break;
        case "MG": gun="Machine Gun";    break;
        case "SMG":gun="SubMachine Gun"; break;
        case "RL": gun="Rocket Launcher";break;
    }
    qs("#charsubheaderdata").innerHTML = gun + " - " + val.weapon.attack_type + "<br/>" + 
                                        val.weapon.max_ammo + " Bullets per Magazine <br/>" +
                                        val.squad

    //change char description
    if(val.description===undefined){
        qs("#charDescription").innerHTML = "Missing description"
    }else{
        qs("#charDescription").innerHTML = val.description
    }

    //change weapon icon, rarity icon , manufacturer icon
    qs("#wr2div1 img").src = "images/gun/full/icn_weapon_"+val.weapon.weapon_type.toLowerCase()+"_full.png"

    qs("#wr2div2 img").src = "images/rarity/"+val.rarity.toLowerCase()+".png"

    qs("#wr2div3 img").src = "images/manufacturer/icn_corp_"+corporation+".png"

    // change the stat progress bars with written values, and different sizes 
    // lazy to automate using arrays and several if & switch

    

        qs(".prog-min-hp").innerHTML  = "Lv.1 Health: "+minhp
        qs(".prog-min-hp").style.width= progress_value(minhp, "hp")+"%"

        qs(".prog-max-hp").innerHTML  = "Lv."+maxlvl+" Health: "+maxhp
        qs(".prog-max-hp").style.width= progress_value(maxhp, "hp")+"%"

        qs(".prog-min-att").innerHTML = "Lv.1 Attack: "+minatt
        qs(".prog-min-att").style.width= progress_value(minatt, "att")+"%"

        qs(".prog-max-att").innerHTML = "Lv."+maxlvl+" Attack: "+maxatt
        qs(".prog-max-att").style.width= progress_value(maxatt, "att")+"%"

        qs(".prog-min-def").innerHTML = "Lv.1 Defense: "+mindef
        qs(".prog-min-def").style.width= progress_value(mindef, "def")+"%"

        qs(".prog-max-def").innerHTML = "Lv."+maxlvl+" Defense: "+maxdef
        qs(".prog-max-def").style.width= progress_value(maxdef, "def")+"%"
    

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

    //show the class image and drive tier, next to stats 
    qs("#class-img img").src = "images/classes/"+val.class+".png"
    qs("#drive-img img").src = "images/drive/"+val.use_burst_skill+".png"
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