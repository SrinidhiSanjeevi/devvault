import express from 'express';
import { getSnippets, createSnippet, updateSnippet, deleteSnippet } from '../controllers/snippetController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getSnippets)
  .post(protect, createSnippet);

router.route('/:id')
  .put(protect, updateSnippet)
  .delete(protect, deleteSnippet);

export default router;
