

import { Env } from '../env';
import SpotifyWebApi from 'spotify-web-api-node';




export class TSpotifyClient {


    private _sapi: SpotifyWebApi 

    /**
     *
     */
    constructor(sapi: SpotifyWebApi) {
        this._sapi = sapi
    }
    
    public get isReady() : boolean {
        return Env.spotify_access_token !== null
    }
    
    



    private GrantToken() {
        this._sapi.clientCredentialsGrant().then(r => {
            console.log(`Token: ${r.body.access_token}`);
            console.log(`Expires in: ${r.body.expires_in}`);
            Env.spotify_access_token = r.body.access_token;
            Env.refresh_in = Date.now() + r.body.expires_in;
        });
    }

    private setAccessToken() {
        if (Env.spotify_access_token == null)
            throw `Create access token!`;
        this._sapi.setAccessToken(Env.spotify_access_token);
    }

    public async searchForTrack(trackSearch:string) { 
         this.setAccessToken();
        return await this._sapi.searchTracks(trackSearch)
    }

    public async currentlyPlaying(){
        this.setAccessToken()
        console.log(this._sapi)
        return await this._sapi.getMyCurrentPlayingTrack()
    }
    
    public authorizationUrl():string {
        let scopes = ['user-read-private', 'user-read-email','user-read-playback-position', 'user-read-recently-played', 'playlist-read-private','playlist-modify-private','user-read-currently-playing','user-library-modify']
        let state = 'tstuff'
        return this._sapi.createAuthorizeURL(scopes,state)
    }

}