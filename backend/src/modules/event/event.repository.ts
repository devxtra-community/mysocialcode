import { appDataSouce } from '../../data-source';
import { Events } from '../../entities/Event';
import { EventImage } from '../../entities/EventImage';
export const getEventRepository = appDataSouce.getRepository(Events);

export const getImageRepository = appDataSouce.getRepository(EventImage);
