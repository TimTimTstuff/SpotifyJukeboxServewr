import chalk from 'chalk';
import fs  from 'fs';
import { Env } from '../env';

export enum LogLevel{
    Debug=0,
    Info =1,
    Warning =2,
    Error = 3
}

export class TLog{

    
 

    public static debug(obj:any){
        console.log(chalk.cyanBright(obj));
        if(Env.LOG_LEVEL > LogLevel.Debug)return;
        TLogger.writeToFile(obj,LogLevel.Debug);    
    }
    public static info(obj:any){
        console.log(chalk.blue(obj));
        if(Env.LOG_LEVEL > LogLevel.Info)return;
        TLogger.writeToFile(obj,LogLevel.Info);
    }
    public static warn(obj:any){
        console.log(chalk.yellow(obj));
        if(Env.LOG_LEVEL> LogLevel.Warning)return;
        TLogger.writeToFile(obj,LogLevel.Warning);
    }
    public static err(obj:any){
        console.log(chalk.red(obj));
        if(Env.LOG_LEVEL > LogLevel.Error)return;
        TLogger.writeToFile(obj,LogLevel.Error);
    }
}



class TLogger{

    public static getLogFileName():string{
        let d = new Date();
        return `${Env.LOG_PATH}/log_${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}_${d.getHours()}.log`;
    }

    public static loggerBroken:boolean = false;

    public static writeToFile(log:any,level:LogLevel):void{
       if(this.loggerBroken)return;

        fs.exists(Env.LOG_PATH,(exists)=>{
            //console.log(`Log Path Exists? ${exists}`);
            if(!exists){fs.mkdir(Env.LOG_PATH,(err)=>{
                if(err!==null){
                    TLog.err(err);
                    this.loggerBroken = true;
                    TLog.info("Error in Logger. Logger Broken!");
                }          
            });}
            else{
                let logString = {date:new Date(),content:log,level:level};
                fs.appendFile(TLogger.getLogFileName(),JSON.stringify(logString)+"\n",(err)=>{
                if(err !== null)TLog.err(err);
            });
            }
        });
       
       
    }

}