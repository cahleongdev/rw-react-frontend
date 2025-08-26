import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Layout from '@/layouts/Layout';

import {
  LogInPage,
  MFAMethodSelectionPage,
  MFACodeVerificationPage,
  EnableMFAPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ResetPasswordCompletePage,
  ResetLinkSentPage,
  CheckInboxPage,
  RequestNewMagicLinkPage,
  LinkExpiredPage,
  AlreadyRegisteredPage,
  SignUpPage,
  NotificationsPage,
  NotFoundPage,
  TransparencyPageExternalView,
} from '@/pages/Common';
import { ComplaintsPageExternalView } from '@/pages/AgencyAdmin';

import ProtectedRoute from '@/helpers/ProtectedRoute';
import NonProtectedRoute from '@/helpers/NonProtectedRoute';

import { RootState } from '@/store';

import { getProtectedRoutes } from './routes.config';

const AppRoutes: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const protectedRoutes = getProtectedRoutes(user?.role || '');

  return (
    <Routes>
      <Route
        path="login"
        element={
          <NonProtectedRoute>
            <LogInPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="mfa-method-selection"
        element={
          <NonProtectedRoute>
            <MFAMethodSelectionPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="mfa-code-verification"
        element={
          <NonProtectedRoute>
            <MFACodeVerificationPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <NonProtectedRoute>
            <ForgotPasswordPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <NonProtectedRoute>
            <ResetPasswordPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="reset-password-complete"
        element={
          <NonProtectedRoute>
            <ResetPasswordCompletePage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="reset-link-sent"
        element={
          <NonProtectedRoute>
            <ResetLinkSentPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="check-inbox"
        element={
          <NonProtectedRoute>
            <CheckInboxPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="request-new-magic-link"
        element={
          <NonProtectedRoute>
            <RequestNewMagicLinkPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="link-expired"
        element={
          <NonProtectedRoute>
            <LinkExpiredPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="already-registered"
        element={
          <NonProtectedRoute>
            <AlreadyRegisteredPage />
          </NonProtectedRoute>
        }
      />
      <Route
        path="signup"
        element={
          <NonProtectedRoute>
            <SignUpPage />
          </NonProtectedRoute>
        }
      />

      <Route
        path="setup-mfa"
        element={
          <ProtectedRoute>
            <EnableMFAPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="transparency/:agency_id"
        element={<TransparencyPageExternalView />}
      />
      <Route
        path="complaints/:agency_id"
        element={<ComplaintsPageExternalView />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="notifications" element={<NotificationsPage />} />
        {protectedRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
