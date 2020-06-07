import SpotifyWebApi from "spotify-web-api-node"
import exp from 'express'
import { Env } from "./env"
import { HApi } from "./HApi"
import { SaveHandler } from "./system/SaveHandler"
import { AccessSave } from "./model/entities"

export class AppContext {

    public static self:AppContext

    public spotifyApi:SpotifyWebApi
    public hapi: HApi
    public storage: SaveHandler
    private _accessData: AccessSave | null = null

    /**
     *
     */
    constructor(redirectUri:string) {
        this.storage = new SaveHandler(Env.save_base_dir)
        this.spotifyApi = new SpotifyWebApi({
            clientId: Env.spotify_app_client_id,
            clientSecret: Env.spotify_app_client_secret,
            redirectUri: Env.spotify_app_redirectUri
        })

        this.hapi = new HApi(Env.port)
        let d = this.readAccessData()
        AppContext.self = this
    }

    
    public readAccessData() {
        return this.storage.getSaveObject<AccessSave>('access').then(d => {
            this._accessData = d
        })
    }

    public get accessData() : AccessSave {
        if(this._accessData == null) throw `Access data not set!`
        return this._accessData
    }
    

  

}