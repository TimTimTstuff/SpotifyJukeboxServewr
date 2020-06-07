import { BaseController } from "./BaseController";
import { AppContext } from "../AppContext";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyTrack } from "../model/entities";

export class SpotifyUserApiCtrl extends BaseController {

    private _sapi: SpotifyWebApi
    constructor() {
        super('jb');
        this._sapi = AppContext.self.spotifyApi
        this.addGet('search/:track', async (req, res) => {

            let resultSet: SpotifyTrack[] = []
            let total:number = 999
            let count = 0
            try {
               
                while(resultSet.length < 50 && resultSet.length < total){
                    total = await this.readTracks(req.params['track'],count*20,resultSet) || total
                    count++
                    console.log(resultSet.length)
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
                res.send(this.fail(res,err.message))
            }
            res.send('play song')
        })

        this.addGet('play', async (req, res) => {
            let d = await this.getToEnd()
            res.send(d)
        })
    }

    private async readTracks(search:string, offset:number = 0, result:SpotifyTrack[]):Promise<number|undefined> {
        let tracks = await this._sapi.searchTracks(search)
        tracks.body.tracks?.items.forEach(tr => {
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
        await this._sapi.play({ uris: [uri] })
    }
}