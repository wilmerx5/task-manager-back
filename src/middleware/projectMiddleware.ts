import { NextFunction, Request, Response } from 'express'
import Project, { IProject } from '../models/Project'

declare global{
    namespace Express{
        interface Request{
            project: IProject
        }
    }
}
export const validateProjectExist = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { projectId } = req.params
        const project = await Project.findById(projectId)
        if (!project) return res.status(404).json({ data: 'Project not found' })

        req.project = project    
        next()
    }
    catch (e) {

        res.status(400).json({ data: 'error bad request' })
    }

}