import * as fs from 'fs'

export class SaveHandler {

    private _baseDir: string

    /**
     *
     */
    constructor(baseDir:string) {
        this._baseDir = baseDir
        if(!fs.existsSync(this._baseDir)){
            try {
              fs.promises.mkdir(this._baseDir)
            }catch(err) {
                throw err
            }
        }
    }

    public async writeSaveObject(key:string, data:any):Promise<void> {
       return await fs.promises.writeFile(`${this._baseDir}${key}.json`,JSON.stringify(data))
    }

    public async getSaveObject<T>(key:string):Promise<T|null> {
        if(!fs.existsSync(`${this._baseDir}${key}.json`)){
            return Promise.resolve(null)
        }
        let data = await fs.promises.readFile(`${this._baseDir}${key}.json`)
        return <T>JSON.parse(data.toString())
    }

}