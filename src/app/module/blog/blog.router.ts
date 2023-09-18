import express from 'express';
import auth from '../../middlewares/auth';
import { BlogController } from './blog.controller';


const router = express.Router()


router.get('/',BlogController.getAllFromDB)
router.get('/:id',BlogController.getByID)
router.delete('/:id',auth(),BlogController.deleteBlog)
router.patch('/update/:id',auth(),BlogController.updateBlog)
router.post('/create-blog',auth(), BlogController.insertIntoDB)
export const BlogRoutes = router