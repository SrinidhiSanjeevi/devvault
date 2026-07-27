import express from 'express';
import { getResources, createResource, updateResource, deleteResource } from '../controllers/resourceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getResources)
  .post(protect, createResource);

router.route('/:id')
  .put(protect, updateResource)
  .delete(protect, deleteResource);

export default router;
