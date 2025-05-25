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


router.get("/user", authenticate, authController.getUser)


//profiles

router.put("/profile", authenticate,
    body('userName')
        .notEmpty().withMessage('name is required'),
    body('email')
        .isEmail().withMessage('invalid email'),
    handleInputErrors,
    authController.editProfile)


router.put("/update-password", authenticate,
    body('currentPassword')
        .notEmpty().withMessage('current password is required'),
    body('password')
        .notEmpty().withMessage('password'),
    handleInputErrors,
    authController.updatePasswordCurrentUser)


router.post("/check-password", authenticate,
    body('password')
        .notEmpty().withMessage('password'),
    handleInputErrors,
    authController.checkUser)
export default router