export const handleResponse = (response) => {
  if (response.success) {
    return response;
  } else {
    throw new Error(response.message);
  }
};