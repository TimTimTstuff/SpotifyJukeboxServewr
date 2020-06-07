import { BaseController } from "./BaseController";
import { TLog } from "../system/TLog";
import { AppContext } from "../AppContext";
import { Env } from "../env";
import { AccessSave } from "../model/entities";

export class SpotifyAdminApiCtrl extends BaseController {
    /**
     *
     */
    constructor() {
        super('sadmin');

        this.setAccessData(AppContext.self.accessData.token, 600, AppContext.self.accessData.refresh)
        this.addGet('login',(req, res) => {
            let uri = this.getAccessUri();
            res.send(uri)
        })

        this.addGet('access',async (req, res) => {
            TLog.debug(`APICALL: access`)
            let authCode:string = (<any>req.query).code
            try {
                await this.grantUserAccess(authCode);
            }catch(err) {
                TLog.err(err)
                res.send(this.fail(res,err))
                return
            }
            res.send(`Access Successfull`)
        })

        this.addGet('me',async (req, res) => {
            res.send(await this.getMe())
        })
    }

    public async getMe(): Promise<{success:boolean, me:string}> {
      try{
          let me = await AppContext.self.spotifyApi.getMe()
          return Promise.resolve({me:me.body.display_name||"Unkown", success:true})  
      }catch(err) {
          return Promise.resolve({me:err.message, success:false})
      }
    }

    public async refreshToken() {
     
        let minutesToRefresh = (new Date(AppContext.self.accessData.refreshOn).getTime()-new Date().getTime())/(1000*60)
        TLog.info(`Refresh in: ${minutesToRefresh} - ${new Date(AppContext.self.accessData.refreshOn)} - ${new Date()} `)
        if(minutesToRefresh < 1){
            TLog.info(`Refresh Token!`)
            let authData = await AppContext.self.spotifyApi.refreshAccessToken()
            this.setAccessData(authData.body.access_token, authData.body.expires_in)
            AppContext.self.readAccessData()
        }
    }

    public async setAccessData(token:string, expires:number, refresh:string|null = null):Promise<void> {
        refresh = refresh || AppContext.self.accessData.refresh
        let refreshOn = new Date();
        refreshOn.setSeconds(refreshOn.getSeconds() + expires - 600);
        AppContext.self.spotifyApi.setAccessToken(token)
        AppContext.self.spotifyApi.setRefreshToken(refresh)
        await AppContext.self.storage.writeSaveObject('access', (<AccessSave>{ token: token, refresh: refresh, refreshOn: refreshOn }));
    }

    private async grantUserAccess(authCode: string) {
        let authData = await AppContext.self.spotifyApi.authorizationCodeGrant(authCode);
        this.setAccessData(authData.body.access_token, authData.body.expires_in, authData.body.refresh_token)
    }

    private getAccessUri() {
        let uri = AppContext.self.spotifyApi.createAuthorizeURL(Env.spotify_app_scope, Env.spotify_app_state);
        TLog.info(`Created access uri: ${uri}`);
        return uri;
    }
}