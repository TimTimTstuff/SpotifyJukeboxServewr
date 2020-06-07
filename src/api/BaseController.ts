import exp from "express";
import { TLog } from "../system/TLog";

export class BaseController {
    protected _router: exp.Router
    protected _basePath:string

    /**
     *
     */
    constructor(basePath:string) {
        this._router = exp.Router({caseSensitive:false})
        this._basePath = basePath
        this._router.get(`/${this._basePath}`,(req,res)=>{
            console.log(this._router.stack)
            res.send(this.getRoutingInfo())
        })
    }

    public getBasePath():string{
        return this._basePath
    }

    public getRoute():exp.Router{
        return this._router;
    }

    protected addGet(path:string, action: (req:exp.Request,res:exp.Response)=>void){
        this._router.get(`/${this._basePath}/${path}`,(req,res)=>{
            try{
                 action(req,res);
            }catch(err){
                this.fail(res,err);
            } 
        });
    }

    protected addPost(path:string, action:(req:exp.Request,res:exp.Response)=>void){
        this._router.post(`/${this._basePath}/${path}`,(req,res)=>{
            try{
                 action(req,res);
            }catch(err){
                this.fail(res,err);
            }

            res.send();
        });
    }

    public getRoutingInfo(): any {
        let all:any[] = [];
        this._router.stack.forEach(r=>{
            let methods = Object.keys(r.route.methods);
            //all.push(r);
            all.push(`${methods.join(",")} - ${r.route.path}`);
        });

        return all;
    }

    protected fail(res:exp.Response,error:Error|string){
        TLog.err(error);
        return res.status(500).json({message:error.toString()});
    }
}