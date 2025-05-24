import { Request, Response } from "express";
import Task from "../models/Task";

export default {
    createTask: async (req: Request, res: Response) => {
        try {
            const { project } = req
            const task = new Task(req.body)
            task.project = project.id
            project.tasks.push(task.id)
            const [projectResult, savedTask] = await Promise.allSettled([project.save(), task.save()])
            res.status(201).json({ data: { msg: 'task created', task: savedTask } })
        }
        catch (e) {
            res.status(400).send('Bad request')
        }
    },
    getTasks: async (req: Request, res: Response) => {
        try {
            const { project, } = req
            const tasks = await Task.find({
                project: project.id
            }).populate('project')
            res.status(201).json({ data: { project: project.id, tasks } })
        }
        catch (e) {
            res.status(400).send('Bad request')
        }
    }, getTaskById: async (req: Request, res: Response) => {
        try {
            const task = await  (await Task.findById(req.task.id)
            .populate({path:'completedBy.user', select:'id  email '}))
            .populate({path:'notes', populate:{path:'createdBy',select:'id email userName'}})

            res.status(201).json({ data: { task } })
        }
        catch (e) {
            res.status(400).send('Bad request')
        }
    },
    updateTask: async (req: Request, res: Response) => {
        try {
            const { task } = req

            task.name = req.body.name
            task.description = req.body.description
          
            await task.save()
            res.status(201).json({ data: { msg: "success updated", task } })
        }
        catch (e) {
            res.status(400).send('Bad request')
        }
    },
    deleteTask: async (req: Request, res: Response) => {
        try {
            const { taskId } = req.params
            const task = req.task

            req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId)

            await Promise.allSettled([task.deleteOne(), req.project.save()])
            res.status(201).json({ data: { msg: 'deleted successfully' } })
        }
        catch (e) {
            res.status(400).send('Bad request')
        }
    },
    updateStatus: async (req: Request, res: Response) => {
        try {
            const { status } = req.body
            const task = req.task
            const data={
                user:req.user.id,
                status
            }
            req.task.completedBy.push(data)
            task.status = status
            await task.save()
            res.status(201).json({ data: { msg: 'status updated' } })
        }
        catch (e) {
            res.status(400).send('Bad request')
        }
    },

}