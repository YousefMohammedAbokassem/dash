export const headerApi = (token) => {
  return {
    Authorization: `Bearer ${token}`,
    // api_key: process.env.REACT_APP_API_KEY,
  };
};
