import {Column, PrimaryColumn} from "typeorm";

export class AbstractEntity {

    @PrimaryColumn({type:'text', name: "key", unique: true})
    key: string

    @Column({type:'text', name: "ko", unique: true})
    ko: string

    @Column({type:'text', name: "en", unique: true})
    en: string

    @Column({type:'text', name: "ja", unique: true})
    ja: string

    @Column({type:'text', name: "zh-TW", unique: true})
    zhtw: string

    @Column({type:'text', name: "zh-CN", unique: true})
    zhcn: string

    @Column({type:'text', name: "de", unique: true})
    de: string

    @Column({type:'text', name: "th", unique: true})
    th: string

    @Column({type:'text', name: "fr", unique: true})
    fr: string

    @Column({type:'text', name: "es", unique: true})
    es: string


    // not a db column, but a simple property for easier code handling
    id: string
}