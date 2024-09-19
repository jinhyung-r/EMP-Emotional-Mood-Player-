export const isTokenExpired = (expiresAt) => {
  return Date.now() >= expiresAt;
};