const logout = () => {
  localStorage.removeItem('token');
  setUser(null);
};
