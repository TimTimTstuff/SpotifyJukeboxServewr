export interface AccessSave {
    token:string
    refresh:string
    refreshOn:Date
}

export interface SpotifyTrack {
    song:string,
    name:string,
    artist:string,
    id:string
}

export interface SpotifyDevice {
    id:string,
    active:boolean,
    name:string,
    type:string,
    volume:number
}