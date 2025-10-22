import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import { CookiesProvider } from 'react-cookie';
//aws configuración


// Solo para producción
/* if (process.env.NODE_ENV === 'production') {
  console.error = () => {}; // Suprimir TODOS los errores en producción
} */
// Interceptar fetch globalmente para suprimir logs de red
if (process.env.NODE_ENV === 'production') {
  //console.log('🚀 ~ production:');
  
  // Interceptar fetch para evitar que el navegador muestre errores de red
  const originalFetch = window.fetch;
  window.fetch = async function(...args) {
    try {
      const response = await originalFetch.apply(this, args);
      
      // Si es un error 401 en login, crear una respuesta "silenciosa"
      if (response.status === 401 && args[0].includes('/login')) {
        // Clonar la respuesta para evitar el log del navegador
        const clonedResponse = response.clone();
        
        // Suprimir el error visual del navegador
        /* setTimeout(() => {
          if (console.clear) console.clear();
        }, 100); */
        
        return clonedResponse;
      }
      
      return response;
    } catch (error) {
      // Suprimir errores de red completamente
      if (error.message && error.message.includes('401')) {
        const mockResponse = new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          statusText: 'Unauthorized',
          headers: { 'Content-Type': 'application/json' }
        });
        return mockResponse;
      }
      throw error;
    }
  };
  
  // Suprimir console.error como respaldo
  const originalError = console.error;
  console.error = (...args) => {
    const message = args.join(' ');
    if (message.includes('execute-api') || message.includes('401')) {
      return;
    }
    originalError.apply(console, args);
  };
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  //Es intencional. El StrictMode de React renderiza dos veces los componentes para ayudarte a detectar efectos secundarios de la renderización. Esto solo ocurre durante el desarrollo.
  //por eso se ven los console log 2 veces
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
//<CookiesProvider>
  <App />
  //</CookiesProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
