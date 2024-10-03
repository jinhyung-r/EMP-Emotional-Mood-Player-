export const getToken = (hash) => {
  const token = new URLSearchParams(hash.replace('#', '')).get('access_token');
  return token;
};
