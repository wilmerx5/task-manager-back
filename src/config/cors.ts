import { CorsOptions } from "cors"

export const corsConfig :CorsOptions={
    origin: function(origin, callback){

        const whiteList=[process.env.FRONTEND_URL]
        callback(null,true)
        return
        if(whiteList.includes(origin) || origin==process.env.FRONTEND_URL){
        }else{
        callback(new Error('Cors error'))
        }
    }
} 