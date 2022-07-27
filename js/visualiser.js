"use strict";

const qs = (val) =>{
      return document.querySelector(val)
}

const qsa = (val) => {
      return document.querySelectorAll(val)
}

//block access to mobile to android and mac os
if (navigator.userAgent.includes("Android") || 
(navigator.userAgent.includes("Mac OS X")) && !navigator.userAgent.includes("Macintosh")){
      qs("#player-container").hidden = true
      qs("#background-div").hidden = true
      qs(".wrapperindex").hidden = true
      qs("#l2dbgcolorchanger").hidden = true
      qs("#visualiserMain").hidden = true
      qs("#mobile_message").hidden = false
      qs("body").style.overflow = "auto"
}


const div = document.getElementById("visualiserMain");

async function initJSON() {
      const response = await fetch('js/json/l2d.json');
      const json = await response.json()
      json.sort(function (a, b) {
            return a.name.localeCompare(b.name);

      })
      json.map((val) => {
            if (val.available === "no") return false
            const liste_item = document.createElement("li");

            liste_item.innerHTML = "<img src='images/sprite/si_" + val.id + "_00_s.png'/>" + " " + val.name

            liste_item.classList.add("charDiv")

            liste_item.addEventListener("click", (e) => {
                  changeSpine(val.id)
            })
            div.appendChild(liste_item) //div character list
      })

}

initJSON()

let currentspine = "";
let currentid = ""
let current_color = "#2f353a"


const changeSpine = (id) => {

      // empties the div to clear the current spine
      // every listeners MUST be in changeSpine because
      // there aren't any spine currently, so if the listened divs
      // doesn't exist, it will break the code and nothing will work

      qs("#player-container").innerHTML = ""

      currentid = id

      if (current_l2d === "fb") {
            currentspine = new spine.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/" + id + "_00.skel",
                  atlasUrl: "/l2d/" + id + "/" + id + "_00.atlas",
                  animation: "idle",
                  skin: "00",
                  backgroundColor: current_color,
                  alpha: false,
                  debug: false,
                  preserveDrawingBuffer:true
            });
      }
      if (current_l2d === "cover") {
            currentspine = new spine.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.skel",
                  atlasUrl: "/l2d/" + id + "/cover/" + id + "_cover_00.atlas",
                  skin: "00",
                  backgroundColor: current_color,
                  animation: "cover_idle",
                  alpha: false,
                  debug: false,
                  preserveDrawingBuffer:true
            })
      }
      if (current_l2d === "aim") {
            currentspine = new spine.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.skel",
                  atlasUrl: "/l2d/" + id + "/aim/" + id + "_aim_00.atlas",
                  skin: "00",
                  animation: "aim_idle",
                  backgroundColor: current_color,
                  alpha: false,
                  debug: false,
                  preserveDrawingBuffer:true

            })
      }
      if (current_l2d === "skillcut") {
            currentspine = new spine.SpinePlayer("player-container", {
                  skelUrl: "/l2d/" + id + "/skillcut/" + id + "_skillcut.skel",
                  atlasUrl: "/l2d/" + id + "/skillcut/" + id + "_skillcut.atlas",
                  backgroundColor: current_color,
                  animation:"skillcut_1",
                  alpha: true,
                  debug: false,
                  preserveDrawingBuffer:true
            })
      }

      qs(".spine-player-canvas").width = qs(".spine-player-canvas").height

      qs(".spine-player-canvas").style.width = null

      qs(".spine-player-canvas").style.display = "inline"

}
let current_l2d = "fb"
changeSpine("c210")

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
            let stylel;

            stylel = qs("#player-container").style.left.replaceAll("px", "")

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

let rgbPanelVisible = qs("#colorChangePanel").hidden
let imgPanelVisible = qs("#colorChangePanel").hidden

qs("#l2dbgcolorchanger button").addEventListener("click", (e) => {
      if (rgbPanelVisible) {
            qs("#colorChangePanel").hidden = false
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
      current_color = hex
      
      if (currentid) {
            changeSpine(currentid)
      }
})

let oldhex = qs("#inputhex").value

qs("#inputhex").addEventListener("input", (e) => {
      currenthex = qs("#inputhex").value
      newhex = ""
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

qs(".hidebar").addEventListener("click", (e) => {
      let hidden = qs(".spine-player-controls").hidden
      if (hidden) {
            qs(".spine-player-controls").hidden = false
            qs(".scrollbar-msg").hidden = false
      } else {
            qs(".spine-player-controls").hidden = true
            qs(".scrollbar-msg").hidden = true
      }
})

// hide top menu/navbar

qs(".hidenav").addEventListener("click",(e)=>{
      let hidden = qs(".wrapperindex").hidden
      if (hidden){
            qs(".wrapperindex").hidden = false
      }else{
            qs(".wrapperindex").hidden = true
      }
})

//hide all UI

const UI = [
      "#visualiserMain",
      "#l2dbgcolorchanger",
      ".wrapperindex",
      ".spine-player-controls",
      ".scrollbar-msg"
      ]

qs(".hideUI").addEventListener("click",(e)=>{
      alert("To turn the UI back on, press the Enter key of your keyboard")

      for (let i = 0 ; i<UI.length; i++){
            qs(UI[i]).hidden = true
      }

})
// show all UI , reset zoom and position

document.addEventListener("keypress",(e)=>{
      if (e.key==="Enter"){
            for (let i = 0 ; i<UI.length; i++){
                  qs(UI[i]).hidden = false
            }
      }
      if(e.key.toLowerCase()==="z"){
            let canvas = qs("#player-container")
            canvas.style.height = 100 +"vh"
            changeSpine(currentid)
            qs("#player-container").style.left = 0
            qs("#player-container").style.top = 0
      }
      
})

const arraypose = ["fb","cover","aim"]

for (let i = 0; i< arraypose.length; i++){
      qs("#"+arraypose[i]).addEventListener("click",(e)=>{
            current_l2d = arraypose[i]
            changeSpine(currentid)
      })
}

qs(".screenshot").addEventListener("click",async (e) =>{
      
      
      const dataURL = currentspine.canvas.toDataURL()
      
      let link = document.createElement('a');
      link.download= new Date().getTime()+"_"+"NIKKE"+"_"+currentid+"_"+current_l2d+".png"
      link.href=dataURL
      link.click()
      
})