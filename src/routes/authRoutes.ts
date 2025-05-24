import { Router } from "express"
import { body, param } from "express-validator"
import authController from "../controllers/authController"
import { authenticate } from "../middleware/auth"
import { handleInputErrors } from "../middleware/validation"


const router = Router()

router.post("/sign-up",
    body('userName')
        .notEmpty().withMessage('name is required'),
    body('password')
        .isLength({ min: 8 }).withMessage('password too short'),
    body('email')
        .isEmail().withMessage('invalid email'),
    handleInputErrors,
    authController.signUp)

router.post("/confirm-account",
    body('token')
        .notEmpty().withMessage('token is required'),
    handleInputErrors,
    authController.confirmAccount)

router.post("/login",

    body('password')
        .isLength({ min: 8 }).withMessage('password too short'),
    body('email')
        .isEmail().withMessage('invalid email'),
    handleInputErrors
    , authController.login)


router.post("/request-confirmation-code",
    body('email')
        .isEmail().withMessage('invalid email'),
    handleInputErrors
    , authController.requestConfirmationToken)


router.post("/forgot-password",
    body('email')
        .isEmail().withMessage('invalid email'),
    handleInputErrors
    , authController.forgotPassword)

router.post("/validate-token",
    body('token')
        .notEmpty().withMessage('not token received'),
    handleInputErrors
    , authController.validateToken)

router.post("/update-password/:token",
    param('token').isNumeric().withMessage('invalidToken'),
    body('password')
        .isLength({ min: 8 }).withMessage('password too short'),
    handleInputErrors
    , authController.updatePasswordWithToken)


router.get("/user",authenticate, authController.getUser)
export default router