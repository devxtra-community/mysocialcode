import { appDataSource } from '../../data-source';
import { User } from '../../entities/User';
export const getUserRepository = appDataSource.getRepository(User);
