import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BlogFilterableFields } from './blog.constant';
import { BlogService } from './blog.service';

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.insertIntoDB(req?.user?.userId,req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog created successfully`,
    data: result,
  });
});
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, BlogFilterableFields);
  const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
  const result = await BlogService.getAllFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog fetched successfully`,
    data: result,
  });
});
const getByID = catchAsync(async (req: Request, res: Response) => {
  console.log("hit me");
  const { id } = req.params;
  const result = await BlogService.getByID(id);
 
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog fetched successfully`,
    data: result,
  });
});
const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const result = await BlogService.updateBlog(req?.user?.userId, id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog updated successfully`,
    data: result,
  });
});
const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogService.deleteBlog(req?.user?.userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Blog deleted successfully`,
    data: result,
  });
});

export const BlogController = {
  insertIntoDB,
  getAllFromDB,
  getByID,
  updateBlog,
  deleteBlog,
};
