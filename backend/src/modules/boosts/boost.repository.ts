import { appDataSource } from '../../data-source';
import { Boost } from '../../entities/Boost';

export const getBoostRepository = appDataSource.getRepository(Boost);
