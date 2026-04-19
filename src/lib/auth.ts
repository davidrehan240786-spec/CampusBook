// coderabbit full review trigger
export type UserRole = 'user' | 'admin';

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getCurrentUser = () => {
  if (!isLoggedIn()) {
    return { id: '', name: 'Guest', role: 'guest', campus: '' };
  }
  
  const userData = localStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  }
  
  // Fallback for safety during transition
  return { id: '1', name: 'Rehan Busters', role: 'user', campus: 'SJCE' };
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const setUserRole = (role: UserRole, user?: any, token?: string) => {
  localStorage.setItem('userRole', role);
  localStorage.setItem('isLoggedIn', 'true');
  if (user) {
    localStorage.setItem('userData', JSON.stringify(user));
  }
  if (token) {
    localStorage.setItem('token', token);
  }
};

export const logout = () => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userData');
  localStorage.removeItem('token');
  window.location.href = '/';
};
