export const authService = {
  isRegistered: () => {
    return localStorage.getItem('user_pin') !== null;
  },

  register: (name, pin) => {
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_pin', btoa(pin)); // extremely basic obfuscation for local use
  },

  verifyPin: (pin) => {
    const stored = localStorage.getItem('user_pin');
    if (!stored) return false;
    return btoa(pin) === stored;
  },

  getUserName: () => {
    return localStorage.getItem('user_name') || 'User';
  },

  logout: () => {
    sessionStorage.removeItem('is_authenticated');
  },

  loginSession: () => {
    sessionStorage.setItem('is_authenticated', 'true');
  },

  isAuthenticatedSession: () => {
    return sessionStorage.getItem('is_authenticated') === 'true';
  }
};
