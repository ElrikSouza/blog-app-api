import { JwtFromRequestFunction } from 'passport-jwt';
import { Request } from 'express';
import { FastifyRequest } from 'fastify';

const extractJwtFromCookies = (request: FastifyRequest) => {
  const { value, valid } = request.unsignCookie(
    request.cookies.Authorization ?? '',
  );

  if (!valid || typeof value !== 'string') {
    return null;
  }

  return value;
};

const extractJwtFromHeaders = (request: Request) => {
  const { authorization } = request.headers as { authorization: string };

  if (typeof authorization !== 'string') {
    return null;
  }

  const splitHeader = authorization.split(' ');

  if (splitHeader.length != 2) {
    return null;
  }

  return splitHeader[1];
};

/**
 * The function will try to get the "Authorization" cookie first,
 * and then will check if the "Authorization" header is present.
 *
 * SameSite+HttpOnly Cookies are the prefered way for browsers. The Authorization header
 * should only be used by mobile clients.
 *
 * @param {Request} request
 */
export const getJwtFromCookiesOrAuthHeader: JwtFromRequestFunction = (
  request: Request,
) => {
  const tokenFromCookies = extractJwtFromCookies(
    (request as unknown) as FastifyRequest,
  );

  if (!tokenFromCookies) {
    return extractJwtFromHeaders(request);
  }

  return tokenFromCookies;
};
