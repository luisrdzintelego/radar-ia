
const API_BASE = process.env.REACT_APP_API_BASE;

//export const logout = async () => { 
export const logout = () => {
  // Limpiar todos los tokens y datos de sesión
  sessionStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Llamar al servidor para invalidar la cookie
  /* try {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.log('Error en logout del servidor:', err);
  } */

  // Llamar al servidor sin await (fire and forget)
  fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  }).catch(err => console.log('Error en logout:', err));


  // Limpiar contexto y redirigir
  /* GConText.setUserId('');
  GConText.setNombre('');
  GConText.setGrupo('');
  GConText.setType('');
 */
  // Redirigir al login
  window.location.href = '/';
  
};


// Función alternativa que no necesita contexto
export const logoutSimple = () => {
  // Limpiar tokens
  sessionStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  
  // Llamar al servidor sin await (fire and forget)
  fetch(`${API_BASE}/logout`, {
    method: 'POST',
    credentials: 'include'
  }).catch(err => console.log('Error en logout:', err));

  // Redirigir inmediatamente
  window.location.href = '/';
};