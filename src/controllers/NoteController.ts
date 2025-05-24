import { Request, Response } from "express"
import Note from "../models/Note"


export default{
    createNote:async(req:Request, res:Response)=>{
        const note =  new Note()

        note.content = req.body.content
        note.createdBy = req.user.id
        note.task = req.task.id
        req.task.notes.push(note.id)
        try{
            await Promise.allSettled([req.task.save(),note.save()])
            res.json({msg:'created'})

        }
        catch(e){
            console.log(e)
            res.status(500).json({msg:'server error',error:e})
        }
    },
    getNotes:async(req:Request, res:Response)=>{

        try{
            const notes= await Note.find(
                {task:req.task.id}
            )
            res.json({notes:notes})

        }
        catch(e){
            console.log(e)
            res.status(500).json({msg:'server error',error:e})
        }
    }
}