import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { App } from './App';
import './styles/app.css';

declare global {
  interface Window {
    __INITIAL_DATA__?: {
      route: string;
      data: any;
    };
  }
}

const initialData = window.__INITIAL_DATA__ || {
  route: window.location.pathname,
  data: {},
};

const rootElement = document.getElementById('root');
if (rootElement) {
  if (rootElement.innerHTML.trim() === '' || rootElement.innerHTML.includes('<!--app-html-->')) {
    createRoot(rootElement).render(<App route={initialData.route} data={initialData.data} />);
  } else {
    hydrateRoot(rootElement, <App route={initialData.route} data={initialData.data} />);
  }
}

