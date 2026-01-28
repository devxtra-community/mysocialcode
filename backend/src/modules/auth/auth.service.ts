import { hashRefreshToken } from '../../Services/refreshToken';
import { appDataSource } from '../../data-source';
import { RefreshTokenEntity } from '../../entities/refreshToken';
import { signAccessToken } from '../../Services/jwt.service';

export const refreshAccessTokenService = async (token: string) => {
  const tokenHash = hashRefreshToken(token);
  const refreshrepo = appDataSource.getRepository(RefreshTokenEntity);
  const tokenRecord = await refreshrepo.findOne({
    where: { tokenHash },
    relations: ['user'],
  });
  if (!tokenRecord) {
    throw new Error('no token record');
  }
  if (tokenRecord.expiresAt < new Date()) {
    throw new Error(' token is expired');
  }
  return signAccessToken({ userId: tokenRecord.user.id });
};
