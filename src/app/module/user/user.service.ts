import { User } from '@prisma/client';
import prisma from '../../../shared/prisma';
import { IUserEventsData } from './user.interface';

const registration = async (data: User): Promise<User> => {
  const result = await prisma.user.create({
    data,
  });
  return result;
};
const registrationFromEvent = async (data: IUserEventsData) => {
  await prisma.user.create({
    data,
  });
 
};

export const UserService = {
  registration,
  registrationFromEvent
};
