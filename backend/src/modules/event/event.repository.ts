import { appDataSource } from '../../data-source';
import { Events } from '../../entities/Event';
import { EventImage } from '../../entities/EventImage';
export const getEventRepository = appDataSource.getRepository(Events);

export const getImageRepository = appDataSource.getRepository(EventImage);
