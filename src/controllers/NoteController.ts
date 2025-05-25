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
    },

    deleteNote:async(req:Request, res:Response)=>{

        const noteId= req.params.noteId
        const note = await Note.findById(noteId)

        if(!note){
            return res.status(404).json({msg:'note not found'})
        }

        if(note.createdBy.toString()!==req.user._id.toString()){
            return res.status(401).json({msg:'that is not your note'})
        }
        try{
            
            req.task.notes = req.task.notes.filter(note =>note.toString() !==noteId.toString())

            await Promise.allSettled( [note.deleteOne(), req.task.save()])
            res.json({msg:'note deleted'})

        }
        catch(e){
            console.log(e)
            res.status(500).json({msg:'server error',error:e})
        }
    },
}