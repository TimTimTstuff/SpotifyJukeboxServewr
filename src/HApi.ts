import exp from 'express';
import { BaseController } from './api/BaseController';
import { TLog } from './system/TLog';


export class HApi{
    protected _app:exp.Application;
    protected _port:number;
    protected _ctrls:BaseController[] = [];

    constructor(port:number) {
        this._app = exp();
        this._port = port;
        this._app.get("/",(req,res)=>{
            let r:any[] = [];
            this._ctrls.forEach(c=>{
                r.push(c.getRoutingInfo());
            });

            console.log(r);
            res.json(r);
        });
    }

    public getController<T>(path:string):T|undefined {
        return <T>(<any>this._ctrls.find((p)=>p.getBasePath() == path))
    }

    public addController(ctrl:BaseController){
        this._app.use("/",ctrl.getRoute());
        this._ctrls.push(ctrl);
    }

    public run():void{
        this._app.listen(this._port,"0.0.0.0",(a)=>{
            TLog.info(`Express server started on port: ${this._port}`);
        });
    }

}