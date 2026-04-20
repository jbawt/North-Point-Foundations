import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { HomePage } from '../pages/HomePage.tsx';

const AboutPage = lazy(() => import('../pages/AboutPage.tsx').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/ContactPage.tsx').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage.tsx').then((m) => ({ default: m.NotFoundPage })));
const QuoteThankYouPage = lazy(() =>
  import('../pages/QuoteThankYouPage.tsx').then((m) => ({ default: m.QuoteThankYouPage })),
);
const ServicesPage = lazy(() => import('../pages/ServicesPage.tsx').then((m) => ({ default: m.ServicesPage })));

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'services',
        element: <ServicesPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'contact',
        element: <ContactPage />,
      },
      {
        path: 'thank-you',
        element: <QuoteThankYouPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(routes, basename ? { basename } : undefined);
