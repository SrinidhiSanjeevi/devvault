import express from 'express';
import { getCommands, createCommand, updateCommand, deleteCommand } from '../controllers/commandController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getCommands)
  .post(protect, createCommand);

router.route('/:id')
  .put(protect, updateCommand)
  .delete(protect, deleteCommand);

export default router;
