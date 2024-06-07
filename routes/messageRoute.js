import express from 'express'
import {sendMessageController,getMessageController} from '../controller/messageController.js'
import protectRoute from '../middleware/protectedRoute.js'

const router = express.Router()

//route for sending message
router.post('/send/:id', protectRoute, sendMessageController)

//route for getting messages
router.get("/get/:id", protectRoute,getMessageController);

export default router