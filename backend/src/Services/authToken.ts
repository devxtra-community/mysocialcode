import { appDataSource } from '../data-source';
import { RefreshTokenEntity } from '../entities/refreshToken';
import { User } from '../entities/User';
import { generateRefreshToken, hashRefreshToken } from './refreshToken';
const REFRESH_TOKEN_DAYS = 30;

export const createRefreshTokenSession = async (user: User) => {
  const refreshToken = generateRefreshToken();
  console.log('Raw refresh token generated');

  const tokenHash = hashRefreshToken(refreshToken);
  console.log('Token hashed');

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_DAYS);

  const repo = appDataSource.getRepository(RefreshTokenEntity);
  console.log('Got refresh token repository');

  await repo.save({
    tokenHash,
    user,
    expiresAt,
  });
  console.log('Refresh token saved');
  return refreshToken;
};
