import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import App from './App';
import './index.css';

// Dynamic Capacitor platform bridge check
const isNative = window.Capacitor !== undefined;

if (isNative) {
  // Hide splash after app loads
  SplashScreen.hide().catch(e => console.warn('[Capacitor] SplashScreen hide failed:', e.message));

  // Premium orange status bar
  StatusBar.setStyle({ style: Style.Light }).catch(e => console.warn('[Capacitor] StatusBar setStyle failed:', e.message));
  StatusBar.setBackgroundColor({ color: '#f97316' }).catch(e => console.warn('[Capacitor] StatusBar setBackgroundColor failed:', e.message));

  // Handle Android hardware back button navigation
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapApp.exitApp();
    } else {
      window.history.back();
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
