import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import store, { RootState, AppDispatch } from '@/store';
import { fetchUsers } from '@/store/slices/usersSlice';
import { fetchMenuItems } from '@/store/slices/menuSlice';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import { setAuth, logout } from '@/store/slices/authSlice';

import { SchoolUser } from '@/store/slices/schoolUsersSlice';

import axios, { initializeAxios } from '@/api/axiosInstance';

import { Loading } from '@/components/base/Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const NonProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    validateAuthTokens();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUsers());
      dispatch(fetchMenuItems());
      dispatch(fetchCategories());
    }
  }, [isAuthenticated, dispatch]);

  const validateAuthTokens = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Initialize axios with the stored tokens
      initializeAxios(
        { accessToken, refreshToken },
        handleLogout,
        (newAccessToken: string) => {
          const state = store.getState();
          dispatch(
            setAuth({
              ...state.auth,
              accessToken: newAccessToken,
            }),
          );
        },
      );

      const response = await axios.get('/auth/current_user/');
      handleAuthSuccess(response.data, accessToken, refreshToken);
    } catch (error) {
      console.error('Access token validation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSuccess = (
    user: SchoolUser,
    accessToken: string,
    refreshToken: string,
  ) => {
    dispatch(
      setAuth({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      }),
    );

    // Fetch menu items after successful auth
    dispatch(fetchMenuItems());
    dispatch(fetchUsers());

    if (location.pathname === '/' || location.pathname === '/login') {
      navigate('/home');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default NonProtectedRoute;
