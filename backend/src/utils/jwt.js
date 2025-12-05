import jwt from 'jsonwebtoken';

const sign = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });
const verify = (token, secret) => jwt.verify(token, secret);

export const signAccess = (payload) =>
  sign(payload, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '1d');

export const signRefresh = (payload) =>
  sign(payload, process.env.REFRESH_SECRET, process.env.REFRESH_EXPIRES_IN || '7d');

export const verifyAccess = (token) => verify(token, process.env.JWT_SECRET);
export const verifyRefresh = (token) => verify(token, process.env.REFRESH_SECRET);

