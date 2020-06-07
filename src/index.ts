import { AppContext } from "./AppContext";
import { SpotifyAdminApiCtrl } from "./api/SpotifyAdminApiCtrl";
import { TLog } from "./system/TLog";
import { Env } from "./env";
import SpotifyWebApi from "spotify-web-api-node";
import { SpotifyUserApiCtrl } from "./api/SpotifyUserApiCtrl";

const appContext = new AppContext('http://localhost:3000/sadmin/access')

setTimeout(() => {
 appContext.hapi.addController(new SpotifyAdminApiCtrl())
 appContext.hapi.addController(new SpotifyUserApiCtrl())

appContext.hapi.run()   
}, 1000);


var timeLogger = 0;
setInterval(() => {

    appContext.hapi.getController<SpotifyAdminApiCtrl>('sadmin')?.refreshToken()
   
	timeLogger++;
	if (timeLogger > 10) {
		TLog.info(`Job Loop Alive!`);
		timeLogger = 0;
	}

}, Env.systemloop_idle);


/**
app.get('/',(req,res) => {
    preCheckCall()
    res.send({message:'Welcome to the Spotify Jukebox. Have fun3!'})
})

app.get('/track',(req,res) => {
    preCheckCall()
    TLog.info(`Request Track`)
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


app.listen(Env.port,()  => {
    console.log(`Server started on port: ${Env.port}, have fun!`)
})

**/