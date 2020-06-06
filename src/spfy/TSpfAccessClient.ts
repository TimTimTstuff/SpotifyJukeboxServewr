import { Env } from "../env";
import SpotifyWebApi from "spotify-web-api-node";

export class TSpfAccessClient {
    
    private _sapi: SpotifyWebApi

    constructor(sapi:SpotifyWebApi) {
        this._sapi = sapi
    }
    public async isTokenValide():Promise<boolean> {
        console.info('=== Validate Token ====')
        if(Env.spotify_access_token == null) return Promise.resolve(false)
        this._sapi.setAccessToken(Env.spotify_access_token)
        console.info('Get Me')
        try{
        let me =  await this._sapi.getMe()
        
        console.info('has me?')
        console.log(me)
        return Promise.resolve(false)
        }catch(err) {
            if(err.statusCode == 401)
                return Promise.resolve(false)
        }
        return Promise.resolve(false)
    }

}