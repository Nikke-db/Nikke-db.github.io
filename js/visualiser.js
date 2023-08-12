"use strict";

alert("Sorry for the alert! But I'd like you, users, to fill in a form for me ! https://forms.gle/yqWw46ymxv9UsKDJA , a clickable link is available on the homepage of the website. I will let the form going until the next website update, if you already filled it, please ignore the alert. Thanks!")

const qs = (val) =>{
      return document.querySelector(val)
}

const qsa = (val) => {
      return document.querySelectorAll(val)
}

//block access to mobile to android and mac os
if (navigator.userAgent.includes("Android")|| 
(navigator.userAgent.includes("Mac OS X")) && !navigator.userAgent.includes("Macintosh")){
      location.href = "v_m"
}

const div = document.getElementById("visualiserMain");

async function initJSON() {
      const response = await fetch('js/json/l2d.json');
      const json = await response.json()
      json.sort(function (a, b) {
            return a.name.localeCompare(b.name);

      })
      json.map((val) => {
            if (!RELEASED_UNITS.includes(val.name)) return false
            const liste_item = document.createElement("li");

            liste_item.innerHTML = "<img src='images/sprite/si_" + val.id + "_00_s.png'/>" + " <span>" + val.name+ "</span>"
            liste_item.setAttribute('spineversion', val.version)

            liste_item.classList.add("charDiv")

            liste_item.addEventListener("click", (e) => {
                  currentVersion = val.version
                  changeSpine(val.id)
            })
            div.appendChild(liste_item) //div character list
      })

}

initJSON()

let currentspine = "";
let currentid = "";
let currentVersion = 4.0
let harran_story = false;

if (localStorage.getItem("bg_hex") === null){
      localStorage.setItem("bg_hex","#2f353a");
}

let current_color = localStorage.getItem("bg_hex")
document.body.style.backgroundColor = current_color;
let transparent = false
let skin

const changeSpine = (id) => {

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

      // empties the div to clear the current spine
      // every listeners MUST be in changeSpine because
      // there aren't any spine currently, so if the listened divs
      // doesn't exist, it will break the code and nothing will work
      // update august 12th 2023 : I have no clue what the four lines of comment above mean
      if (currentspine !== ""){
            currentspine.dispose();
      }

      qs("#player-container").innerHTML = ""

      currentid = id

      // harran's ch19 story is headass too small so we need to bruteforce a zoom on it
      if ( currentid === "story1902"){
            let canvas = qs("#player-container")
            canvas.style.height = 320 + "vh"
            canvas.style.left = document.documentElement.clientWidth * -0.66 + "px"
            canvas.style.top = document.documentElement.clientHeight * -1.25 + "px"
            harran_story = true
      } else if (currentid !== "story1902" && harran_story){
            let canvas = qs("#player-container")
            canvas.style.height = 100 +"vh";
            canvas.style.left = 0 + "px"
            canvas.style.top = 0 + "px"
            harran_story = false;
      } else { harran_story = false }
      
      // skin exception list , if not it'll go to default skin
      if ( skin !=="weapon_2" || id !== "c220"){ skin = "default" }
      //rapi_old and shifty_old exception
      if ( id === "c010_01" || id === "c907_01") { skin = "00" } 

      if (current_l2d === "fb") {
            //if snow white / maxine / E.H. / drake racer/ Mast > use skin acc
            //if anchor > use skin bg
            if(id==="c220" || id==="c102" || id==="c940" || id==="c101_01" || id==="c350") skin="acc"
            if(id==="c351") skin="bg"

            currentspine = new spineVersionLoader.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/" + id + "_00.skel",
                  atlasUrl: "/l2d/" + id + "/" + id + "_00.atlas",
                  animation: "idle",
                  skin: skin,
                  backgroundColor: transparent ? "#00000000" : current_color,
                  alpha: transparent ? true : false,
                  mipmaps:false,
                  debug: false,
                  preserveDrawingBuffer:true
            });               
      }
      if (current_l2d === "cover") {
            //if snow white and weapon_2 not selected> use weapon2
            if(id==="c220" && skin!=="weapon_2") skin="weapon_1"

            currentspine = new spineVersionLoader.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.skel",
                  atlasUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.atlas",
                  skin: skin,
                  backgroundColor: transparent ? "#00000000" : current_color,
                  alpha: transparent ? true : false,
                  animation: "cover_idle",
                  debug: false,
                  preserveDrawingBuffer:true
            })
      }
      if (current_l2d === "aim") {
            currentspine = new spineVersionLoader.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.skel",
                  atlasUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.atlas",
                  skin: skin,
                  animation: "aim_idle",
                  backgroundColor: transparent ? "#00000000" : current_color,
                  alpha: transparent ? true : false,
                  debug: false,
                  preserveDrawingBuffer:true

            })
      }

      qs(".spine-player-canvas").width = qs(".spine-player-canvas").height

      qs(".spine-player-canvas").style.width = null

      qs(".spine-player-canvas").style.display = "inline"

}


let current_l2d = "fb"
// let current_l2d = "aim"
// let current_l2d = "cover"

// need to be uncommented if want to load a 4.1 animation
// currentVersion=4.1 
changeSpine("c010")


let move = false
let oldx = "";
let oldy = "";

// zoom with mouse wheel, only on wanted divs ( so it doesn't zoom while browsing units )
document.addEventListener("wheel", (e) => {

      if (  e.target !== qs("#background-div") &&
            e.target !== qs(".spine-player") &&
            e.target !== qs(".spine-player-canvas") &&
            e.target !== qs("#nikketxtgrid") &&
            e.target !== qs("#nikketxtgrid div") &&
            e.target !== qs("body")) {
            return false
      }
      let canvas = qs("#player-container")
      let height = canvas.style.height.replaceAll("vh", "")

      switch (e.deltaY > 0) {
            case true:
                  if (parseInt(canvas.style.height.replaceAll("vh", "")) <= 20) return false
                  canvas.style.height = parseInt(height) - 5 + "vh";
                  break;
            case false:
                  if (parseInt(canvas.style.height.replaceAll("vh", "")) >= 500) return false
                  canvas.style.height = parseInt(height) + 5 + "vh";
                  break;
      }
})

document.addEventListener("mousedown", (e) => {

      if (  e.target !== qs("#background-div") &&
            e.target !== qs(".spine-player-canvas") &&
            e.target !== qs("#nikketxtgrid") &&
            e.target !== qs("#nikketxtgrid div") &&
            e.target !== qs("body")) {
            return false
      }
      move = true
      oldx = e.clientX;
      oldy = e.clientY;
})

document.addEventListener("mouseup", (e) => {
      oldx = ""
      oldy = ""
      move = false
})

document.addEventListener("mousemove", (e) => {
      if (move) {

            let newx = e.clientX
            let newy = e.clientY

            let stylel = qs("#player-container").style.left.replaceAll("px", "")

            let stylet = qs("#player-container").style.top.replaceAll("px", "")

            if (newx > oldx) {
                  qs("#player-container").style.left = (parseInt(stylel) + (newx - oldx)) + "px"
            }
            if (newx < oldx) {
                  qs("#player-container").style.left = (parseInt(stylel) + (newx - oldx)) + "px"
            }
            if (newy < oldy) {
                  qs("#player-container").style.top = (parseInt(stylet) + (newy - oldy)) + "px"
            }
            if (newy > oldy) {
                  qs("#player-container").style.top = (parseInt(stylet) + (newy - oldy)) + "px"
            }
            oldx = newx
            oldy = newy
      }
})

// CHANGE BG COLOR --------------------------------------------------------------------------------------------------------------------

qs("#l2dbgcolorchanger button").addEventListener("click", (e) => {
      let rgbPanelVisible = qs("#colorChangePanel").hidden
      if (rgbPanelVisible) {
            qs("#colorChangePanel").hidden = false
            qs("#l2dbgimgchangerpannel").hidden = true
      } else {
            qs("#colorChangePanel").hidden = true
      }
      rgbPanelVisible = qs("#colorChangePanel").hidden
})

let r = parseInt(qs("#customRangeRed").value)
let g = parseInt(qs("#customRangeGreen").value)
let b = parseInt(qs("#customRangeBlue").value)


const rgb2hex = (v) => {
      let val = v.toString(16);
      return val.length == 1 ? "0" + val : val
}

let hex = "#" + rgb2hex(r) + rgb2hex(g) + rgb2hex(b)

const updateHex = () => {
      let localhex = rgb2hex(r) + rgb2hex(g) + rgb2hex(b)
      qs("#inputhex").value = localhex
}

updateHex()

const updateRgb = () => {
      qs("#customRangeRed").value = r
      qs("#labelred").innerHTML = "Red - " +qs("#customRangeRed").value
      qs("#customRangeGreen").value = g
      qs("#labelgreen").innerHTML = "Green - " + qs("#customRangeGreen").value
      qs("#customRangeBlue").value = b
      qs("#labelblue").innerHTML = "Blue - " + qs("#customRangeBlue").value
}


const setColorPreview = (r, g, b) => {
      qs(".progress-rgb").style.backgroundColor = `rgb(${r},${g},${b})`
}

qs("#customRangeRed").addEventListener("input", (e) => {
      qs("#labelred").innerHTML = "Red - " + qs("#customRangeRed").value
      r = parseInt(qs("#customRangeRed").value)
      setColorPreview(r, g, b)
      updateHex()
})
qs("#customRangeGreen").addEventListener("input", (e) => {
      qs("#labelgreen").innerHTML = "Green - " + qs("#customRangeGreen").value
      g = parseInt(qs("#customRangeGreen").value)
      setColorPreview(r, g, b)
      updateHex()
})
qs("#customRangeBlue").addEventListener("input", (e) => {
      qs("#labelblue").innerHTML = "Blue - " + qs("#customRangeBlue").value
      b = parseInt(qs("#customRangeBlue").value)
      setColorPreview(r, g, b)
      updateHex()
})
qs("#ColorApply").addEventListener("click", (e) => {
      qs("body").style.backgroundColor = `rgb(${r},${g},${b})`
      hex = "#" + rgb2hex(r) + rgb2hex(g) + rgb2hex(b)
      current_color = hex;
      localStorage.setItem("bg_hex", hex)
      
      if (currentid) {
            changeSpine(currentid)
      }
})

let oldhex = qs("#inputhex").value

qs("#inputhex").addEventListener("input", (e) => {
      let currenthex = qs("#inputhex").value
      let newhex = ""
      for (let i = 0; i < currenthex.length; i++) {
            if (currenthex.charAt(i) === "#" ||
                  i > 5 || /^[g-zG-Z]+$/.test(currenthex.charAt(i))) {

            } else {
                  newhex += currenthex.charAt(i)
            }
      }
      qs("#inputhex").value = newhex
      if (newhex.length === 6) {
            r = parseInt(newhex.slice(0, 2), 16)
            g = parseInt(newhex.slice(2, 4), 16)
            b = parseInt(newhex.slice(4, 6), 16)
            updateRgb()
            setColorPreview(r, g, b)
      }
      oldhex = newhex
})

// HIDE BOTTOM BAR ------------------------------------------------------------------------------------------------------

// qs(".hidebar").addEventListener("click", (e) => {
//       let hidden = qs(".spine-player-controls").hidden
//       if (hidden) {
//             qs(".spine-player-controls").hidden = false
//             qs(".scrollbar-msg").hidden = false
//       } else {
//             qs(".spine-player-controls").hidden = true
//             qs(".scrollbar-msg").hidden = true
//       }
// })

// hide top menu/navbar

// qs(".hidenav").addEventListener("click",(e)=>{
//       let hidden = qs(".wrapperindex").hidden
//       if (hidden){
//             qs(".wrapperindex").hidden = false
//       }else{
//             qs(".wrapperindex").hidden = true
//       }
// })

//hide all UI

const UI = [
      "#visualiserMain",
      "#l2dbgcolorchanger",
      ".wrapperindex",
      ".spine-player-controls",
      ".scrollbar-msg"
      ]

let hidden_ui = false;

qs(".hideUI").addEventListener("click",(e)=>{
      alert("To turn the UI back on, press the Enter key of your keyboard")
      hidden_ui=true;

      for (let i = 0 ; i<UI.length; i++){
            qs(UI[i]).hidden = true
      }

})
// show all UI , reset zoom and position

document.addEventListener("keypress",(e)=>{
      if (e.key==="Enter"){
            hidden_ui=false;
            for (let i = 0 ; i<UI.length; i++){
                  qs(UI[i]).hidden = false
            }
      }
      if(e.key.toLowerCase()==="z"){
            let canvas = qs("#player-container");
            canvas.style.height = 100 +"vh";
            changeSpine(currentid);
            qs("#player-container").style.left = 0;
            qs("#player-container").style.top = 0;

            if (hidden_ui) qs(".spine-player-controls").hidden=true
      }
      
})

const arraypose = ["fb","cover","aim"]

for (let i = 0; i< arraypose.length; i++){
      qs("#"+arraypose[i]).addEventListener("click",(e)=>{
            current_l2d = arraypose[i]
            changeSpine(currentid)
      })
}

qs(".screenshot").addEventListener("click",async (e) => {

      const canvas = qs("#player-container")

      const oldZoom = parseInt(canvas.style.height.replaceAll("vh", ""))

      canvas.style.height = 500 + "vh"

      setTimeout(() => {
            const dataURL = currentspine.canvas.toDataURL()
      
            let link = document.createElement('a');
            link.download= new Date().getTime()+"_"+"NIKKE"+"_"+currentid+"_"+current_l2d+".png"
            link.href=dataURL
            link.click()
            
            canvas.style.height = oldZoom + "vh"
      } , 250)
      
      
})

//skin exception checkers
document.addEventListener("click",(e)=>{
      // we need to do something special for snow white weapon_2 skin because it is too large for the container ( it'll be auto cropped)
      if(e.target.innerHTML==="weapon_2"){
            skin="weapon_2";
            changeSpine(currentid)
      }
      if ((e.target.innerHTML==="weapon_1" || e.target.innerHTML==="default") && skin=== "weapon_2"){
            skin="default"
            changeSpine(currentid)
      }
})

qs("#transparent").addEventListener("change",(e)=>{
      if(e.target.checked){
//             alert("CHARACTERS THAT WERE BROKEN WHEN TAKING A SCREENSHOT WITH TRANSPARENCY AREN'T ANYMORE, KEEPING THE ALERT TO LET PEOPLE KNOW, WILL DELETE THE ALERT IN THE FUTURE, THANKS 神罰の執行者 ライラ FOR THE INSTRUCTIONS ON HOW TO FIX IT");
      }
      transparent = e.target.checked;
})


// change background image

// https://stackoverflow.com/questions/36280818/how-to-convert-file-to-base64-in-javascript


qs("#l2dbgimgchangerbtn").addEventListener("click", (e) => {
      let bgimgpannelvisible = qs("#l2dbgimgchangerpannel").hidden

      if (bgimgpannelvisible) {
            qs("#l2dbgimgchangerpannel").hidden = false
            qs("#colorChangePanel").hidden = true
            
      } else if (!bgimgpannelvisible) {
            qs("#l2dbgimgchangerpannel").hidden = true
      }
})

qs(".bgdropdown .form-control-sm").addEventListener("change", (e) => {
      let fileReader = new FileReader()
      fileReader.readAsDataURL(e.target.files[0])
      fileReader.onload = () => {
            qs("body").style.backgroundImage = "url(" + fileReader.result + ")"
      }

      if (!transparent) {
            transparent = true
            changeSpine(currentid)
            qs("#transparent").checked = true
      }
})


qsa("#bgimgpositionwrapper button").forEach((btn) => {
      btn.addEventListener('click', (e) => {
            qs("body").style.backgroundPosition = btn.value
            resetBtnPositionClasses()
            updateClickedBtnClasses(btn)
      })
})

qsa("#bgimgsizewrapper button").forEach((btn) => {
      btn.addEventListener('click', (e) => {
            qs('body').style.backgroundSize = btn.value
            resetBtnSizeClasses()
            updateClickedBtnClasses(btn)
      })
}) 

const resetBtnPositionClasses = () => {
      qsa("#bgimgpositionwrapper button").forEach((btn)=> {
            btn.classList.remove('btn-info')
            btn.classList.remove('btn-success')
            btn.classList.add('btn-success')
      })
}

const resetBtnSizeClasses = () => {
      qsa("#bgimgsizewrapper button").forEach((btn) => {
            btn.classList.remove('btn-info')
            btn.classList.remove('btn-success')
            btn.classList.add('btn-success')
      })
}

const updateClickedBtnClasses = (btn) => {
      btn.classList.remove('btn-success')
      btn.classList.add('btn-info')
}