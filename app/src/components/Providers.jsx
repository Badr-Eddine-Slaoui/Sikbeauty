"use client";

import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../contexts/AuthContext';
import { CartProvider } from '../contexts/CartContext';
import ScrollToTop from '../components/ScrollTop';

const CustomCloseButton = ({ closeToast }) => (
  <button
    onClick={closeToast}
    style={{
      background: 'rgba(181, 72, 58, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: '#B5483A',
      fontSize: '18px',
      fontWeight: 'bold',
      lineHeight: '1',
      transition: 'all 0.2s ease',
      flexShrink: 0,
      padding: 0,
    }}
    onMouseEnter={(e) => {
      e.target.style.background = 'rgba(181, 72, 58, 0.2)';
      e.target.style.transform = 'scale(1.1)';
    }}
    onMouseLeave={(e) => {
      e.target.style.background = 'rgba(181, 72, 58, 0.1)';
      e.target.style.transform = 'scale(1)';
    }}
    aria-label="Close notification"
  >
    ×
  </button>
);

export default function Providers({ children }) {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Toaster 
            position="top-center mt-10"
            toastOptions={{
              duration: 3000,
              className: 'font-montserrat',
              closeButton: CustomCloseButton,
              style: {
                background: 'linear-gradient(to bottom right, #fdf4f2, #fffaf9, white)',
                color: '#1f1f1f',
                border: '1px solid rgba(181, 72, 58, 0.15)',
                borderRadius: '1.5rem',
                padding: '18px 24px',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 20px 25px -5px rgba(181, 72, 58, 0.1), 0 10px 10px -5px rgba(181, 72, 58, 0.04)',
                minWidth: '320px',
                maxWidth: '420px',
              },
              success: {
                duration: 3000,
                className: 'font-montserrat',
                closeButton: CustomCloseButton,
                style: {
                  background: 'linear-gradient(to bottom right, #f0fdf4, #fdf4f2, white)',
                  color: '#1f1f1f',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '1.5rem',
                  padding: '18px 24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.1), 0 10px 10px -5px rgba(16, 185, 129, 0.04)',
                  minWidth: '320px',
                  maxWidth: '420px',
                },
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#f0fdf4',
                },
              },
              error: {
                duration: 4000,
                className: 'font-montserrat',
                closeButton: CustomCloseButton,
                style: {
                  background: 'linear-gradient(to bottom right, #fef2f2, #fdf4f2, white)',
                  color: '#1f1f1f',
                  border: '1px solid rgba(181, 72, 58, 0.3)',
                  borderRadius: '1.5rem',
                  padding: '18px 24px',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 20px 25px -5px rgba(181, 72, 58, 0.15), 0 10px 10px -5px rgba(181, 72, 58, 0.08)',
                  minWidth: '320px',
                  maxWidth: '420px',
                },
                iconTheme: {
                  primary: '#B5483A',
                  secondary: '#fef2f2',
                },
              },
            }}
            gutter={12}
          />
          {children}
        </CartProvider>
      </AuthProvider>
    </>
  );
}
