
import { RedisClient } from '../../../shared/redis';
import { IUserEventsData } from './user.interface';
import { UserService } from './user.service';

const initUserEvents = () => {
  RedisClient.subscribe('user.created', async (e: string) => {
    const data = JSON.parse(e);
    
    const newData:IUserEventsData = {
      username: data.username,
      userId: data.id,
      email: data.email,
      password: data.password,
    };
    await UserService.registrationFromEvent(newData)
   
  });
};

export default initUserEvents;
