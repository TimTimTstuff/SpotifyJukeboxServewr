import { BaseController } from "./BaseController";
import { AppContext } from "../AppContext";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyTrack, SpotifyDevice } from "../model/entities";
import { Env } from "../env";


export class SpotifyUserApiCtrl extends BaseController {

    private _sapi: SpotifyWebApi
    public deviceId:string | undefined


    constructor() {
        super('jb');
        this._sapi = AppContext.self.spotifyApi
        
        this.addGet('search/:track', async (req, res) => {

            let resultSet: SpotifyTrack[] = []
            let total:number = 999
            let count = 0
            let maxRequests = Env.spotify_max_search_songs / Env.spotify_songs_per_request
            try {
               
                while(count < maxRequests && resultSet.length < total-2){
                    console.log('Run Song search')
                    total = await this.readTracks(req.params['track'],count*Env.spotify_songs_per_request,resultSet) || -1
                    count++
                    if(total < Env.spotify_songs_per_request || total == -1) break
                }

                res.send({ 'found': resultSet, 'total': total })

            } catch (err) {
                this.fail(res, err)
            }

        })

        this.addGet('play/:track', async (req, res) => {
            try{
                await this.playSong(req.params['track'])
            }catch(err){
                console.log(err)
                res.send(this.fail(res,err.message))
            }
            res.send('play song')
        })

        this.addGet('device', async (req, res) =>{
          
            try {

            let result: SpotifyDevice[] = await this.getDeviceList();
            res.send(result)

            }catch(err){
                throw err
            }
        })

        this.addGet('setdevice/:id', async(req, res) => {
            try{
                this.deviceId = req.params['id']
                res.send('Device Set!')
            }catch(err){
                throw err
            }
        })

        this.addGet('device/active', async (req, res) => {
            try {

                let result: SpotifyDevice[] = await this.getDeviceList();
                
                res.send(result.find(d => d.active == true))
    
                }catch(err){
                    throw err
                }
        })

        this.addGet('play', async (req, res) => {
            let d = await this.getToEnd()
            res.send(d)
        })
    }

    private async getDeviceList() {
        let devices = await this.getCurrentDevice();
        let result: SpotifyDevice[] = [];
        devices.body.devices.forEach(d => {
            result.push({
                active: d.is_active,
                id: d.id || '',
                name: d.name,
                type: d.type,
                volume: d.volume_percent || 0
            });
        });
        return result;
    }

    private async getCurrentDevice() {
       return await this._sapi.getMyDevices()
    }

    private async readTracks(search:string, offset:number = 0, result:SpotifyTrack[]):Promise<number|undefined> {
        let tracks = await this._sapi.searchTracks(search,{offset:offset, limit:Env.spotify_songs_per_request})
        tracks.body.tracks?.items.forEach(tr => {
            if(result.find(s => s.id == tr.id)){
                console.log(`ID found: ${result.find(s=>s.id == tr.id)?.name}`)
               // return
            }
            result.push(this.getTrackObject(tr))
        })
        return tracks.body.tracks?.total
    }

    private getTrackObject(data: SpotifyApi.TrackObjectFull): SpotifyTrack {
        let artist = ""
        data.artists.forEach(a => { artist += `${a.name} ` })

        return { artist: artist, name: data.name, song: data.uri, id: data.id }
    }

    private async getToEnd() {
        return await this._sapi.getMyCurrentPlaybackState()
    }

    private async playSong(uri: string) {
        console.log(uri)
        await this._sapi.play({ uris: [uri], device_id:this.deviceId })
    }
}