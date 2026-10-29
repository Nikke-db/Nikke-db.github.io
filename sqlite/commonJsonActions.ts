import * as fs from "node:fs"
import {AbstractEntity} from "./typeorm/AbstractEntity";

// banned id list
// this is composed of npc that have non npc ids
const bannedIds = [
    "c250", "c251", "c252", "c253", "c254", "c255", // mass produced nikkes
    "c803", "c804", // npcs from chainsaw man
    "c813", "c853", // npcs from nier & stellar blade

    // skins
    "c010_01", "c010_02", "c010_03", // rapi skins, I manually modified her ids due to CBT sprites
    "c082_80", "c233_80", "c260_80", // cn exclusive skins,
    "c600_02", "c601_02", // mint and prika weird skin handling
    "c803_01", // chainsawman,
    "c570_99" // ark ranger black
]

export interface l2d {
    name: string | undefined // equals to EN language
    id: string
    ko: string | undefined
    jp: string | undefined
    tw: string | undefined
    cn: string | undefined
    de: string | undefined
    th: string | undefined
    fr: string | undefined
    es: string | undefined
    f: string | undefined
}

/**
 * load the L2D file and return specific data
 * the specific data is equals to :
 * data.ko === undefined && data.id matches regex
 * it is considered that if the ko property is undefined, every other property is also undefined
 * in return, a list of entries to be updated is returned.
 * Some entries can have no found translations ( ie NPCS ) and will be always excluded ( that's why id 9xx are excluded )
 * check the calls of this method to find the regexes if updates are required
 * @param regex a regex to apply on the id
 * @return a list of entries that need to be updated throught typeorm & sqlite.
 */
export const detectContentToUpdate = (regex: string): l2d[] => {
    const f = fs.readFileSync(process.env.L2D_FILE)
    const json: l2d[] = JSON.parse(f.toString())

    return json.filter((j) => {
        if (!j.id.startsWith("c")) return false // exclude non playable & skins
        if (j.id.startsWith("c9")) return false // exclude NPCs
        if (bannedIds.includes(j.id)) return false

        if (j.kr === undefined && j.id.match(regex)) return true
        return false
    })
}

/**
 * fetch the full json as l2d[] and update entries according to the found entities.
 * then rewrite the json in pretty mode on disk.
 * if we have skins, we also need to fetch to original character name to merge name + skin name.
 * @param data data entities containing all the name translations
 * @param isSkins a boolean to dictate if we are in a skin names update or not
 */
export const updateJson = (data: AbstractEntity[], isSkins: boolean)  => {
    const f = fs.readFileSync(process.env.L2D_FILE)
    const json: l2d[] = JSON.parse(f.toString())

    data.forEach((d) => {
        const entry = json.find((f) => {
            return f.id === d.id
        })

        let original = {} as l2d
        if (isSkins) {
            const id = d.id.split("_")[0]
            original = json.find((f) => {
                return f.id === id
            })
        }

        entry.name = ( isSkins ? original.name + " " : "") + d.en
        entry.ko = ( isSkins ? original.ko + " " : "") + d.ko
        entry.jp = ( isSkins ? original.jp + " " : "") + d.ja
        entry.tw = ( isSkins ? original.tw + " " : "") + d.zhtw
        entry.cn = ( isSkins ? original.cn + " " : "") + d.zhcn
        entry.de = ( isSkins ? original.de + " " : "") + d.de
        entry.th = ( isSkins ? original.th + " " : "") + d.th
        entry.fr = ( isSkins ? original.fr + " " : "") + d.fr
        // entry.es = ( isSkins ? original.es + " " : "") + d.es
    })

    // once everything updated, write the json back in pretty form
    fs.writeFileSync(process.env.L2D_FILE,JSON.stringify(json, null, 2))
    console.log("wrote entries")
}