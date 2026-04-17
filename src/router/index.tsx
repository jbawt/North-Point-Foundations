import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { AboutPage } from '../pages/AboutPage.tsx';
import { ContactPage } from '../pages/ContactPage.tsx';
import { HomePage } from '../pages/HomePage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';
import { QuoteThankYouPage } from '../pages/QuoteThankYouPage.tsx';
import { ServicesPage } from '../pages/ServicesPage.tsx';

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
