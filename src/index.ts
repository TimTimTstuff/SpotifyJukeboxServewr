import express from 'express'
import { Env } from './env'

const app = express()

app.get('/',(req,res) => {
    res.send({message:'Welcome to the Spotify Jukebox. Have fun3!'})
})

app.listen(Env.port,()  => {
    console.log(`Server started on port: ${Env.port}, have fun!`)
})