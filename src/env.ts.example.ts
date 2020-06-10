import { LogLevel } from "./system/TLog"

export class Env {
    /** Server Config */
    public static port: number = 3000
    public static save_base_dir: string = '../data/'
    public static systemloop_idle: number = 10000

    /** Spotify App config */
    public static spotify_songs_per_request: number = 20
    public static spotify_max_search_songs: number = 60

    /** Spotify Auth config */
    public static spotify_app_client_id: string = 'client_id'
    public static spotify_app_client_secret: string = 'client_secret'
    public static spotify_app_redirectUri: string = 'http://localhost:3000/sadmin/access'
    public static spotify_app_state: string = '<state>'
    public static spotify_app_scope: string[] = [
        'user-read-private',
        'user-read-email',
        'user-read-playback-position',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-modify-private',
        'user-read-currently-playing',
        'user-library-modify',
        'user-modify-playback-state',
        'user-read-playback-state']

    /** LOG Config */
    public static LOG_LEVEL: LogLevel = LogLevel.Debug
    public static LOG_PATH: string = '../LOGS/'
}