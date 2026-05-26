import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      };
    case 'AUTH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { ...initialState, loading: false, user: null, token: null, isAuthenticated: false };
    case 'UPDATE_USER':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      try {
        const res = await authService.getProfile();
        dispatch({ type: 'UPDATE_USER', payload: res.data.user });
      } catch {
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    verifyToken();
  }, []);

  const register = async (data) => {
    dispatch({ type: 'AUTH_START' });
    const res = await authService.register(data);
    dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
    return res.data;
  };

  const login = async (data) => {
    dispatch({ type: 'AUTH_START' });
    const res = await authService.login(data);
    dispatch({ type: 'AUTH_SUCCESS', payload: res.data });
    return res.data;
  };

  const logout = () => dispatch({ type: 'LOGOUT' });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
