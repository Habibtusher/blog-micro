import { Blog, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import {
  BlogRelationalFields,
  BlogRelationalFieldsMapper,
  BlogSearchableFields,
} from './blog.constant';

const insertIntoDB = async (userId: string, data: Blog): Promise<Blog> => {
  const user = await prisma.user.findFirst({
    where: {
      userId: userId,
    },
  });
 
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  data.authorId = user?.id;
  const result = await prisma.blog.create({
    data,
    include: {
      author: true,
    },
  });
  if (result) {
    await RedisClient.publish('blog.created', JSON.stringify(result));
  }
  return result;
};
const getAllFromDB = async (filters: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: BlogSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }
  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (BlogRelationalFields.includes(key)) {
          return {
            [BlogRelationalFieldsMapper[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  const whereConditions: Prisma.BlogWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.blog.findMany({
    include: {
      author: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });
  const total = await prisma.blog.count({
    where: whereConditions,
  });
  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};
const getByID = async (id: string): Promise<Blog | null> => {
  const result = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });
  return result;
};
const updateBlog = async (
  userId: string,
  id: string,
  payload: Partial<Blog>
): Promise<Blog | null> => {
  const findPost = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (findPost?.author.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to update this post"
    );
  }
  const result = await prisma.blog.update({
    where: {
      id,
    },
    data: payload,
    include:{
      author:true
    }
  });
  return result;
};
const deleteBlog = async (userId: string, id: string): Promise<Blog | null> => {
  const findPost = await prisma.blog.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (findPost?.author.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You don't have permission to delete this post"
    );
  }
  const result = await prisma.blog.delete({
    where: {
      id,
    },
  });
  return result;
};
export const BlogService = {
  insertIntoDB,
  getAllFromDB,
  getByID,
  updateBlog,
  deleteBlog,
};
