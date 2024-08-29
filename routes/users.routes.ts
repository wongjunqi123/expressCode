import express from 'express';
import LoginController from '../controllers/login.controller';
import RegisterController from '../controllers/register.controller';
import SaveProfileDetailsController from '../controllers/saveProfile.controller';
import  createOrder  from '../controllers/order.controller';

const router = express.Router();

router.post('/login', LoginController.login);
router.post('/register', RegisterController.register);
router.post('/saveProfile', SaveProfileDetailsController.saveProfileDetails);
router.post('/createOrder', createOrder);

export default router;