import { getUserRepository } from '../user/user.repository';
import { getEventRepository, getImageRepository } from './event.repository';
import { uploadEventImage } from './event.upload';
export const createEventService = async (
  title: string,
  description: string,
  userId: string,
  startDate: string,
  endDate: string,
  isFree: string,
  price: string,
  location: string,
  capacity: string,
  category: string,
  rules: string,
  files: Express.Multer.File[],
) => {
  const user = await getUserRepository.findOne({
    where: { id: userId },
  });

  if (!user) throw new Error('user not found');
  const parsedIsFree = isFree === 'true';
  const parsedPrice = parsedIsFree ? 0 : Number(price);
  const parsedCapacity = Number(capacity);

  const event = getEventRepository.create({
    title,
    description,
    user,
    startDate,
    endDate,
    isFree: parsedIsFree,
    price: parsedPrice,
    location,
    capacity: parsedCapacity,
    category,
    rules,
    status: 'published',
  });

  await getEventRepository.save(event);

  for (const file of files) {
    const imageUrl = await uploadEventImage(file);

    const image = getImageRepository.create({
      imageUrl: imageUrl,
      event: event,
    });

    await getImageRepository.save(image);
  }

  return event;
};
