// makes a regex for asset studio si_xxxx_s lookup. exclude all already known ids
import fs from "node:fs"
import clipboard from 'clipboardy';

// builds a regex following the scheme : 
// (^si_c)(?!(010|011))(\d{3})(.*)(_s$)
    // starts with si_c
    // exclude ids
    // must have a least 3 decimals afterward ( exclude backgrounds )
    // follow by characters ( targets _00/_01/_02/_03/...)
    // must end with _s

// npc regex : (^c)(\d{4}).*[.](atlas$)

const extra_ids_to_exclude = ["5006", "8001", "999", "9997", "9998", "9999", "966", "965", "000", "944", "984_01"]

const l2d_file = fs.readFileSync("../nikke-db-vue/src/utils/json/l2d.json")
const l2d_json = JSON.parse(l2d_file.toString())
let id_arr = l2d_json.map((m) => m.id.replace("c",""))
id_arr.push(...extra_ids_to_exclude)
id_arr = id_arr.map((m) => {
  if (m.includes("_")) return m
  else return m + "_00"
})


let regex = "(^si_c)"
regex += "(?!("
regex += id_arr.join('|')
regex += "))"
regex += "(\\d{3})"
regex += ("(.*)")
regex += ("(_s$)")

let npcRegex = "(^c)"
npcRegex += "(?!("
npcRegex += id_arr.filter((f) => {
  const str = f.replace("c","").split("_")[0]
  return str.length === 4 && !isNaN(parseInt(str))
}).join('|')
npcRegex += "))"
npcRegex += "(\\d{4})"
npcRegex += ".*[.](atlas$)"

clipboard.writeSync(regex)
console.log("regex for si_ lookup copied to clipboard. use it for AS")

console.log("\nOther regexes : ")
console.log("Lookup all l2d files for 1 character ( skin or vanilla ) : (^cid)(_cover|_aim|)(_skinid)[.]{0,1}(skel$|atlas$|$)")
console.log("Lookup for npcs not getting through the si_ regex : usually they have id with 4 digits now. only look for atlas files. just grab the new id and search for it in name search")



console.log(npcRegex)