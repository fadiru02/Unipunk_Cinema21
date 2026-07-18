import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MovieDetailPage } from '../pages/MovieDetailPage';
import { BookingPage } from '../pages/BookingPage';
import { CheckoutPage } from '../pages/CheckoutPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <LandingPage />
            },
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            },
            {
                path: 'movies/:slug',
                element: <MovieDetailPage />
            },
            {
                path: 'booking/:scheduleId',
                element: <BookingPage />
            },
            {
                path: 'checkout/:scheduleId',
                element: <CheckoutPage />
            }
        ]
    }
]);