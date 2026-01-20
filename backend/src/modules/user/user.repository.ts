import { appDataSouce } from '../../data-source';
import { User } from '../../entities/User';
export const getUserRepository = appDataSouce.getRepository(User);
