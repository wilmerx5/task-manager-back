import { Router } from "express";
import { body, param } from "express-validator";
import NoteController from "../controllers/NoteController";
import projectController from "../controllers/projectController";
import taskController from "../controllers/taskController";
import TeamController from "../controllers/TeamController";
import { validateProjectExist } from "../middleware/projectMiddleware";
import { hasAuthorization, taskBelongsToProject, validateTaskExist } from "../middleware/tasksMIddleware";
import { handleInputErrors } from "../middleware/validation";



const router = Router()
//Create
router.post('/',
    body('projectName').notEmpty().withMessage('projectname is required'),
    body('clientName').notEmpty().withMessage('client name is required'),
    body('description').notEmpty().withMessage('description is required'),
    handleInputErrors,
    projectController.createProject)


//getall
router.get('/', projectController.getAllProjects)
//get by id
router.get('/:id',
    param('id').isMongoId().withMessage('Invalid ID')
    , handleInputErrors,
    projectController.getProjectById)

router.put('/:id',
    body('projectName').notEmpty().withMessage('projectname is required'),
    body('clientName').notEmpty().withMessage('client name is required'),
    body('description').notEmpty().withMessage('description is required'),
    param('id').isMongoId().withMessage('Invalid ID')
    , handleInputErrors,
    projectController.updateProject)


router.delete('/:id',
    param('id').isMongoId().withMessage('Invalid ID')
    , handleInputErrors,
    projectController.deleteProject)


//Task routes//

router.param('projectId', validateProjectExist)
router.param('taskId', validateTaskExist)
router.param('taskId', taskBelongsToProject)



router.post('/:projectId/tasks',
    hasAuthorization,
    body('name').notEmpty().withMessage('name is required'),
    body('description').notEmpty().withMessage('description is required'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    taskController.createTask)

router.get('/:projectId/tasks',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    taskController.getTasks)


router.get('/:projectId/tasks/:taskId',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    taskController.getTaskById)


router.put('/:projectId/tasks/:taskId',
    hasAuthorization,
    body('name').notEmpty().withMessage('name is required'),
    body('description').notEmpty().withMessage('description is required'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    taskController.updateTask)


router.delete('/:projectId/tasks/:taskId',
    hasAuthorization,
    param('projectId').isMongoId().withMessage('Invalid ID'),
    param('taskId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    taskController.deleteTask)



router.post('/:projectId/tasks/:taskId/status',
    body('status').notEmpty().withMessage('status is rquired'),
    param('projectId').isMongoId().withMessage('Invalid ID'),
    handleInputErrors,
    taskController.updateStatus)


//Routes for Team Members
router.post('/:projectId/team/find',
    param('projectId').isMongoId().withMessage('Invalid ID'),
    body('email').isEmail().withMessage('invalid Email'),
    handleInputErrors,
    TeamController.findMemberByEmail

)

router.post('/:projectId/team',
    body('id').isMongoId().withMessage('invalid id'),
    handleInputErrors,
    TeamController.addMemberById
)

router.get('/:projectId/team',
    TeamController.getProjectTeam
)


router.delete('/:projectId/team/:userId',
    param('userId').isMongoId().withMessage('invalid id'),
    handleInputErrors,
    TeamController.deleteMemberById
)

//routes for notes
router.post('/:projectId/tasks/:taskId/notes',
    body('content').notEmpty().withMessage('note content is empty'),
    handleInputErrors,
    NoteController.createNote
)
router.get('/:projectId/tasks/:taskId/notes',
    NoteController.getNotes
)

router.delete('/:projectId/tasks/:taskId/notes',
    NoteController.getNotes
)
export default router