export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getCurrentUserRole = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).role : null;
};

export const logoutUser = (navigate) => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  navigate('/login');
};
