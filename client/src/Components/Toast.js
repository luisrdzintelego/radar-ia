import toast, { Toaster } from 'react-hot-toast';

// Configuraciones predefinidas
export const showToast = {
  success: (message) => toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px 16px'
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981'
    }
  }),

  error: (message) => toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px 16px'
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#EF4444'
    }
  }),

  warning: (message) => toast(message, {
    duration: 3500,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px 16px'
    }
  }),

  info: (message) => toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px 16px'
    }
  }),

  loading: (message) => toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#6B7280',
      color: '#fff',
      fontWeight: 'bold',
      borderRadius: '8px',
      padding: '12px 16px'
    }
  })
};

// Componente Toaster para incluir en App.js
export const ToastContainer = () => (
  <Toaster
    position="top-right"
    reverseOrder={false}
    gutter={8}
    containerClassName=""
    containerStyle={{}}
    toastOptions={{
      className: '',
      duration: 3000,
      style: {
        background: '#363636',
        color: '#fff',
        maxWidth: '500px',
        fontSize: '14px'
      }
    }}
  />
);

export default showToast;
