import express from 'express'
import { Env } from './env'
import { TSpotifyClient } from './spfy/TSpotifyClient'
import { SaveState } from './system/SaveState'
import SpotifyWebApi from 'spotify-web-api-node'
import { AppContext } from './AppContext'
const app = express()
const appContext = new AppContext("http://localhost:3000/access")


function preCheckCall() {
    appContext.initializeContext()
}



app.get('/',(req,res) => {
    preCheckCall()
    res.send({message:'Welcome to the Spotify Jukebox. Have fun3!'})
})

app.get('/track',(req,res) => {
    preCheckCall()
    console.log('Requst track')
    if(Env.spotify_access_token == null){
        res.send('No access is set!')
        return
    }
    let s:string = (<any>req.query).s
    appContext.tClient.searchForTrack(s).then(r => {
        console.log('fine!')
        if(r.body.tracks == undefined){
            res.send({err:`Can't find songs with: ${s}`})
        }
        console.log(r.body.tracks?.total)
        res.send(r.body.tracks)

    }).catch(r=>{
        console.log('Error')
        console.log(r)
        res.send(r)
    })

})

app.get('/play',(req,res) =>{
    preCheckCall()
    console.log(Env.spotify_access_token)
    appContext.tClient.currentlyPlaying().then(r => {
        res.send(r)
    }).catch(r => {
        res.send(r)
    })
})

app.get('/login',(req, res) => {
    res.send(appContext.tClient.authorizationUrl())
})

app.get('/access',async (req, res) => {
    console.log('call access')
    let code:string = (<any>req.query).code
    let auth = await appContext.sApi.authorizationCodeGrant(code)
    console.log(auth)
    SaveState.writeState('token',auth.body.access_token) 
  
    res.send()
   

})

app.listen(Env.port,()  => {
    console.log(`Server started on port: ${Env.port}, have fun!`)
})