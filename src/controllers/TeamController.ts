import { Request, Response } from "express"
import Project from "../models/Project"
import { User } from "../models/User"
export default {
    findMemberByEmail: async (req: Request, res: Response) => {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ msg: 'oops we cannot find your friend' })
        }
        res.json(user)
    },
    addMemberById: async (req: Request, res: Response) => {
        const { id } = req.body
        const user = await User.findById(id)
        if (!user) {
            return res.status(404).json({ msg: 'oops we cannot find your friend' })
        }

        if (req.project.team.includes(user.id)) {
            return res.status(405).json({ msg: 'That person are already on the project' })

        }
        req.project.team.push(user.id)
        await req.project.save()
        res.send('user added')
    },
    deleteMemberById: async (req: Request, res: Response) => {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) {
             res.status(404).json({ msg: 'oops we cannot find that member on your team' })
        }

        if ( !req.project.team.includes(user.id.toString())) {
            res.status(409).json({ msg: 'That person are not on  the project' })

        }
        req.project.team= req.project.team.filter(member => member.toString() !== user.id.toString())
        await req.project.save()
        res.json(req.project)
    },

    getProjectTeam: async (req: Request, res: Response) => {
        const project = await Project.findById(req.project.id).populate({path:'team',
            select:'id email userName'
        })
      res.json(project)
    },
}