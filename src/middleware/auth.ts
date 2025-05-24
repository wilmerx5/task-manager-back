import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'
import { IUser, User } from "../models/User"
declare global{
    namespace Express{
        interface Request{
            user?:IUser
        }
    }
}


export const authenticate = async(req:Request,res:Response,next:NextFunction)=>{
   const {authorization}=req.headers
   if(!authorization){
   return  res.status(401).send('Not authorization token found')
   }
   //Split bearer from token and take only the token
   const token = authorization.split(' ')[1]
   
   try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded)
    if(typeof decoded ==='object'&&decoded.id){
        const user = await User.findById(decoded.id).select('_id userName email')
        if(user){
            req.user = user
           return  next()
        }

        res.status(404).send('ups something went wrogn we canot authenticate you')


    }
    throw new Error('Unknonw error')

   }catch(e){
     res.status(500).json({error:'Your token is invalid',e})
   }
}