// coderabbit full review trigger
export type UserRole = 'user' | 'admin';

export const isLoggedIn = () => {
  return localStorage.getItem('isLoggedIn') === 'true';
};

export const getCurrentUser = () => {
  if (!isLoggedIn()) {
    return { id: '', first_name: 'Guest', last_name: '', name: 'Guest', role: 'guest', campus: '' };
  }
  
  const userData = localStorage.getItem('userData');
  if (userData) {
    const user = JSON.parse(userData);
    // Add compatibility: ensure first_name/last_name exist or fallback to name
    if (!user.first_name && user.name) {
      const parts = user.name.split(' ');
      user.first_name = parts[0];
      user.last_name = parts.slice(1).join(' ');
    }
    return user;
  }
  
  // Fallback for safety during transition
  return { id: '1', first_name: 'Rehan', last_name: 'Busters', name: 'Rehan Busters', role: 'user', campus: 'KLE' };
};

export const getFullName = (user: any) => {
  if (!user) return 'Guest';
  if (user.first_name) {
    return `${user.first_name} ${user.last_name || ''}`.trim();
  }
  return user.name || 'Unknown User';
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
