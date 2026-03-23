import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout.tsx';
import { AboutPage } from '../pages/AboutPage.tsx';
import { HomePage } from '../pages/HomePage.tsx';
import { NotFoundPage } from '../pages/NotFoundPage.tsx';
import { ServicesPage } from '../pages/ServicesPage.tsx';

export const router = createBrowserRouter([
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
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
