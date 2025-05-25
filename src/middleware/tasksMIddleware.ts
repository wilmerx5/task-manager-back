import { NextFunction, Request, Response } from 'express'
import Task, { ITask } from '../models/Task'

declare global {
    namespace Express {
        interface Request {
            task: ITask
        }
    }
}
export const validateTaskExist = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { taskId } = req.params
        const task = await Task.findById(taskId)
        if (!task) return res.status(404).json({ data: 'task not found' })

        req.task = task
        next()
    }
    catch (e) {

        res.status(400).json({ data: 'error bad request' })
    }

}

export const taskBelongsToProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.task.project != req.project.id.toString()) return res.status(404).json({ data: { msg: 'This tasks is missing' } })
        next()
    }
    catch (e) {
        res.status(400).json({ data: 'error bad request' })
    }

}
export const hasAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.id .toString() !== req.project.manager.toString()){
         res.status(400).json({ data: 'Invalid action' })

        }
        next()
    }
    catch (e) {
        res.status(400).json({ data: 'error bad request' })
    }

}