
import { Request, Response } from 'express'
import Project from '../models/Project'
export default {
    getAllProjects: async (req: Request, res: Response) => {
        try {
            //TODO where
            const projects = await Project.find({
                $or: [
                    { manager: { $in: req.user.id } },
                    {team:{$in :req.user.id}}
                ]
            })
            res.status(200).json({

                projects

            })
        }
        catch (e) {
            res.status(400).json({
                data: {
                    error: e
                }
            })
        }
    },
    createProject: async (req: Request, res: Response) => {

        try {
            const project = new Project(req.body)
            project.manager = req.user.id
            const projectSaved = await project.save()

            res.status(201).json({
                data: {
                    msg: 'success',
                    product: projectSaved
                }
            })
        }
        catch (e) {
            res.status(400).json({
                data: {
                    msg: 'error',
                    error: e
                }
            })
        }
    },
    getProjectById: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const project = await Project.findById(id).populate('tasks')
            if (!project) return res.status(404).json({ data: { msg: 'Project not found' } })
            if (project.manager.toString() !== req.user.id.toString() && !project.team.includes(req.user.id)) {
                return res.status(401).json({ msg: 'Ups you are not allowed for that' })

            }

            return res.status(200).json({ project })
        } catch (e) {
            return res.status(400).json({ data: { error: e, msg: 'Bad Request' } })

        }
    },
    updateProject: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const project = await Project.findById(id)

            if (!project) return res.status(404).json({ data: { msg: 'Project not found' } })

            if (project.manager.toString() !== req.user.id.toString()) {
                return res.status(401).json({ msg: 'Ups you are not allowed for that' })

            }

            project.clientName = req.body.clientName
            project.description = req.body.description
            project.projectName = req.body.projectName

            await project.save()


            return res.status(200).json({ data: { project } })
        } catch (e) {
            return res.status(400).json({ data: { error: e, msg: 'Bad Request' } })

        }
    },
    deleteProject: async (req: Request, res: Response) => {
        try {
            const { id } = req.params
            const project = await Project.findByIdAndDelete(id)

            if (!project) return res.status(404).json({ data: { msg: 'Project not found' } })

            if (project.manager.toString() !== req.user.id.toString()) {
                return res.status(401).json({ msg: 'Ups you are not allowed for that' })

            }

            return res.status(200).json({ data: { msg: 'deleted' } })
        } catch (e) {
            return res.status(400).json({ data: { error: e, msg: 'Bad Request' } })

        }
    }


}