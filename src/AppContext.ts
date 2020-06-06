import { TSpfAccessClient } from "./spfy/TSpfAccessClient";
import SpotifyWebApi from "spotify-web-api-node";
import { TSpotifyClient } from "./spfy/TSpotifyClient";
import { Env } from "./env";
import { SaveState } from "./system/SaveState";

export class AppContext {

    public sAccess: TSpfAccessClient
    public sApi:SpotifyWebApi
    public tClient: TSpotifyClient
    private isIntizialized:boolean = false
    /**
     *
     */
    constructor(redirectUri:string) {
        this.sApi = new SpotifyWebApi({
            clientId: Env.spotify_app_client_id,
            clientSecret: Env.spotify_app_client_secret,
            redirectUri: redirectUri
        })
        this.sAccess = new TSpfAccessClient(this.sApi)
        this.tClient = new TSpotifyClient(this.sApi)
        SaveState.readState('token', (v)=>{
            if(v == undefined){
                SaveState.writeState('token','')
                return
            }
            Env.spotify_access_token = v
        })
    }

    public initializeContext():void {
        if(this.isIntizialized) return
        SaveState.readState('lastsave',(d)=>{
            console.log(`Last save: ${d}`)
        })
        
        SaveState.writeState('lastsave',new Date().toString())
        
        this.sAccess.isTokenValide().then(r => {
            console.log(`Is Valide: ${r}`)
            if(r === false){
            
            }
        })
        
    }

}