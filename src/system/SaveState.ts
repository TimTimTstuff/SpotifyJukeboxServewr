import * as fs from "fs";

export class SaveState {
    public static fileLocation = `../data/`

    private static dirExistOrCreate() {
        if(!fs.existsSync(SaveState.fileLocation)){
            fs.mkdir(SaveState.fileLocation,{recursive:true}, (err) => {
                console.error(`FS: Can't create dir! ${err?.message}`)
            })
        }
    }

    public static writeState(key:string, value:string):void {
        SaveState.dirExistOrCreate()
        fs.writeFile(`${this.fileLocation}${key}.txt`, value, (err) => {
            if(!err) return
            console.log(`FS: Can't write SaveState ${key}. Error: ${err?.message}`)
        })
    } 

    public static readState(key:string,callback:(value:string|undefined)=>void):void {
        fs.readFile(`${this.fileLocation}${key}.txt`, (err, data) => {
            if(err) {
                console.log(`FS: Can't read file: ${key}`)
                callback(undefined)
                return
            }
            callback(data.toString())
        })
    }

}