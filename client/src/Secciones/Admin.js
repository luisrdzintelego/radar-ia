import React, { useRef, useState, useContext, useEffect, useMemo } from 'react';
import { Link, resolvePath } from 'react-router-dom';
import { VarContext } from '../Context/VarContext';

//import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2'

//import { DownloadTableExcel } from 'react-export-table-to-excel';

import * as XLSX from "xlsx";

import { showToast } from '../Components/Toast';
import toast from 'react-hot-toast'; // Para toast.dismiss()

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faEdit, faTrash, faSave, faUpload, faDownload, faFileArrowDown, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { faCancel, faSortUp, faSortDown, faSort, faPowerOff, faEye, faEyeSlash, faPlus, faSync, faUser, faUserShield, faLock, faCheck, faSpinner, faPlay, faClock, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import { faEdit, faTrash, faSave, faUpload, faDownload, faFileArrowDown, faFileExport, faList, faCheckCircle, faTimesCircle, faBuilding, faChartBar, faExclamationTriangle, faInfoCircle, faCalendarAlt, faCog } from '@fortawesome/free-solid-svg-icons'

import './Admin.css';

//import * as Img from '../Components/Imagenes'
import Nav from '../Components/Nav'

import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/minimal.css';

import { CustomVarContext } from '../Context/CustomVarContext';

import { saveAs } from 'file-saver';

//import bcrypt from 'bcryptjs';

import { logout } from '../utils/auth';



const Admin = () => {

    const GConText = useContext(VarContext);
  //para migrar las contraseñas planas a bcrypt
  /* const migrarPasswords = async () => {
    const usuarios = await DataStore.query(Ranking);
    for (const usuario of usuarios) {
      if (usuario.password && !usuario.password.startsWith('$2a$') && !usuario.password.startsWith('$2b$')) { // Solo si no está encriptada
        const hashedPassword = await bcrypt.hash(usuario.password, 10);
        await DataStore.save(
          Ranking.copyOf(usuario, updated => {
            updated.password = hashedPassword;
          })
        );
        if (GConText.logs) console.log(`Contraseña migrada para usuario: ${usuario.username}`);
      }
    }
    alert('Migración de contraseñas finalizada');
  }; */

  // Funciones API para reemplazar DataStore
  const getUsersFromAPI = async () => {
    const token = sessionStorage.getItem('accessToken');
    /* const response = await fetch(`${process.env.REACT_APP_API_BASE}/get-all-users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }); */
    const response = await apiCall(`${process.env.REACT_APP_API_BASE}/get-all-users`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Error obteniendo usuarios');
    }

    const data = await response.json();
    return data.users;
  };

  const updateUserAPI = async (userId, updates) => {
    const token = sessionStorage.getItem('accessToken');
    /* const response = await fetch(`${process.env.REACT_APP_API_BASE}/update-user`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ userId, updates })
    }); */

    const response = await apiCall(`${process.env.REACT_APP_API_BASE}/update-user`, {
      method: 'PUT',
      body: JSON.stringify({ userId, updates })
    });

    if (!response.ok) {
      throw new Error('Error actualizando usuario');
    }

    const data = await response.json();
    return data.user;
  };

  const deleteUserAPI = async (userId) => {
    const token = sessionStorage.getItem('accessToken');
    /* const response = await fetch(`${process.env.REACT_APP_API_BASE}/delete-user`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ userId })
    }); */

    const response = await apiCall(`${process.env.REACT_APP_API_BASE}/delete-user`, {
      method: 'DELETE',
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Error eliminando usuario');
    }

    return await response.json();
  };

  const createUserAPI = async (userData) => {
    const token = sessionStorage.getItem('accessToken');
    /* const response = await fetch(`${process.env.REACT_APP_API_BASE}/create-user`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(userData)
    }); */

    const response = await apiCall(`${process.env.REACT_APP_API_BASE}/create-user`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error creando usuario');
    }

    return await response.json();
  };

  // En Admin.js - nueva función para carga masiva optimizada
  const batchCreateUsersAPI = async (users) => {
    const token = sessionStorage.getItem('accessToken');
    /* const response = await fetch(`${process.env.REACT_APP_API_BASE}/batch-create-users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ users })
    }); */

    const response = await apiCall(`${process.env.REACT_APP_API_BASE}/batch-create-users`, {
      method: 'POST',
      body: JSON.stringify({ users })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error en carga masiva');
    }

    return await response.json();
  };

const handleTokenExpiration = (response) => {
  if (GConText.logs) console.log('🔍 Verificando token - Status:', response.status);
  
  if (response.status === 401 || response.status === 403) {
    if (GConText.logs) console.log('🔒 Token expirado detectado - Ejecutando logout');
    
    showToast.error("⚠️ SESIÓN EXPIRADA - Cerrando sesión automáticamente", {
      duration: 2000
    });
    
    // Limpiar almacenamiento
    if (GConText.logs) console.log('🧹 Limpiando almacenamiento...');
    sessionStorage.clear();
    localStorage.clear();
    
    // Limpiar contexto
    if (GConText && GConText.resetAll) {
      GConText.resetAll();
    }
    
    // ✨ Logout INMEDIATO sin setTimeout
    if (GConText.logs) console.log('🚪 Ejecutando logout inmediato...');
    logout();
    
    return true; // Indica que el token expiró
  }
  return false; // Token válido
};

// Función temporal para testing (eliminar después)
const testTokenExpiration = () => {
  if (GConText.logs) console.log('🧪 Probando manejo de token expirado...');
  handleTokenExpiration({ status: 401 });
};
// Hacer la función accesible globalmente para testing
useEffect(() => {
  if (GConText.logs) {
    window.testTokenExpiration = testTokenExpiration;
    return () => {
      delete window.testTokenExpiration;
    };
  }
}, [GConText.logs]);


const debugTokenInfo = () => {
  const token = sessionStorage.getItem('accessToken');
  
  if (!token) {
    if (GConText.logs) console.log('🔒 No hay token disponible');
    return;
  }

  try {
    // Decodificar el JWT (solo la parte del payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    const now = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    const exp = payload.exp; // Tiempo de expiración del token
    const iat = payload.iat; // Tiempo de emisión del token
    
    const timeLeft = exp - now; // Tiempo restante en segundos
    const totalTime = exp - iat; // Tiempo total de vida del token
    
    if (GConText.logs)  console.log('🔐 === DEBUG TOKEN INFO ===');
    if (GConText.logs)  console.log('📅 Emitido:', new Date(iat * 1000).toLocaleString());
    if (GConText.logs)  console.log('⏰ Expira:', new Date(exp * 1000).toLocaleString());
    if (GConText.logs)  console.log('⏳ Tiempo restante:', timeLeft > 0 ? `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s` : 'EXPIRADO');
    if (GConText.logs)  console.log('📊 Progreso:', `${Math.round(((totalTime - timeLeft) / totalTime) * 100)}%`);
    if (GConText.logs)  console.log('👤 Usuario:', payload.username || payload.sub || 'N/A');
    if (GConText.logs)  console.log('🎭 Rol:', payload.type || payload.role || 'N/A');
    if (GConText.logs)  console.log('🔐 === FIN DEBUG TOKEN ===');
    
    // Advertencia si queda poco tiempo
    if (timeLeft < 300 && timeLeft > 0) { // Menos de 5 minutos
      console.warn('⚠️ TOKEN EXPIRARÁ PRONTO:', `${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`);
    }
    
  } catch (error) {
    console.error('❌ Error decodificando token:', error);
  }
};

useEffect(() => {
  if (GConText.logs) {
    // Debug inicial
    debugTokenInfo();
    
    // Debug cada 5 minutos
    const interval = setInterval(debugTokenInfo, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }
}, [GConText.logs]);

// Crear un wrapper para todas las llamadas API:
//funcion para el manejo de tokens expirado
const apiCall = async (url, options = {}) => {
  const token = sessionStorage.getItem('accessToken');
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    },
    credentials: 'include',
    ...options
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    // ✨ Verificar token expirado en todas las llamadas
    if (handleTokenExpiration(response)) {
      throw new Error('Token expirado');
    }

    return response;
  } catch (error) {
    console.error('Error en API call:', error);
    throw error;
  }
};

//version con 5 estados
/* const getCourseStatus = (user) => {
  if (!user.bookmark || user.bookmark === '' || user.bookmark === 'empty') {
    return 'no-iniciado';
  }

  try {
    // Split por '&&' para obtener las secciones
    const bookmarkParts = user.bookmark.split('&&');
    const laminasString = bookmarkParts[0]; // "1-0-0-0|1-0-0-0|1-0-0-0|1-0-0-0|1-0-0-0"
    
    if (!laminasString) return 'no-iniciado';
    
    // Split por '|' para obtener cada lámina
    const laminas = laminasString.split('|');
    
    let totalLaminas = 0;
    let laminasCompletadas = 0;
    let laminasIniciadas = 0;
    
    laminas.forEach(lamina => {
      if (lamina) {
        totalLaminas++;
        const primerNumero = parseInt(lamina.charAt(0));
        
        if (primerNumero === 3) {
          laminasCompletadas++;
        } else if (primerNumero > 1) {
          laminasIniciadas++;
        }
      }
    });
    
    // Calcular porcentaje de progreso
    const porcentajeCompletado = totalLaminas > 0 ? (laminasCompletadas / totalLaminas) * 100 : 0;
    const porcentajeIniciado = totalLaminas > 0 ? ((laminasCompletadas + laminasIniciadas) / totalLaminas) * 100 : 0;
    
    // Determinar estado basado en el progreso
    if (porcentajeCompletado === 100) {
      return 'completado';
    } else if (porcentajeCompletado >= 80) {
      return 'en-progreso';
    } else if (porcentajeCompletado >= 40) {
      return 'iniciado';
    } else if (porcentajeIniciado > 0) {
      return 'pendiente';
    } else {
      return 'no-iniciado';
    }

  } catch (error) {
    console.error('Error analizando bookmark:', error);
    return 'no-iniciado';
  }
}; */

//version con 3 estados
const getCourseStatus = (user) => {
  if (!user.bookmark || user.bookmark === '' || user.bookmark === 'empty') {
    return 'no-iniciado';
  }

  try {
    // Split por '&&' para obtener las secciones
    const bookmarkParts = user.bookmark.split('&&');
    const laminasString = bookmarkParts[0]; // "1-0-0-0|1-0-0-0|1-0-0-0|1-0-0-0|1-0-0-0"
    
    if (!laminasString) return 'no-iniciado';
    
    // Split por '|' para obtener cada lámina
    const laminas = laminasString.split('|');
    
    let totalLaminas = 0;
    let laminasCompletadas = 0;
    
    laminas.forEach(lamina => {
      if (lamina) {
        totalLaminas++;
        const primerNumero = parseInt(lamina.charAt(0));
        
        if (primerNumero === 3) {
          laminasCompletadas++;
        }
      }
    });
    
    // Calcular porcentaje de progreso
    const porcentajeCompletado = totalLaminas > 0 ? (laminasCompletadas / totalLaminas) * 100 : 0;
    
    // Solo 3 estados
    if (porcentajeCompletado === 100) {
      return 'completado';
    } else {
      return 'en-progreso'; // Si existe bookmark pero no está 100% completado
    }
    
  } catch (error) {
    console.error('Error analizando bookmark:', error);
    return 'no-iniciado';
  }
};

//version con 5 estados
/* const getStatusConfig = (status) => {
  const configs = {
    'completado': {
      label: 'Completado',
      icon: faCheckCircle,
      className: 'badge-completado'
    },
    'en-progreso': {
      label: 'En Progreso',
      icon: faSpinner,
      className: 'badge-en-progreso'
    },
    'iniciado': {
      label: 'Iniciado',
      icon: faPlay,
      className: 'badge-iniciado'
    },
    'pendiente': {
      label: 'Pendiente',
      icon: faClock,
      className: 'badge-pendiente'
    },
    'no-iniciado': {
      label: 'No Iniciado',
      icon: faTimesCircle,
      className: 'badge-no-iniciado'
    }
  };
  return configs[status] || configs['no-iniciado'];
}; */

//version con 3 estados
const getStatusConfig = (status) => {
  const configs = {
    'completado': {
      label: 'Completado',
      icon: faCheckCircle,
      className: 'badge-completado'
    },
    'en-progreso': {
      label: 'En Progreso',
      icon: faSpinner,
      className: 'badge-en-progreso'
    },
    'no-iniciado': {
      label: 'No Iniciado',
      icon: faTimesCircle,
      className: 'badge-no-iniciado'
    }
  };
  return configs[status] || configs['no-iniciado'];
};

// Función adicional para obtener detalles del progreso
const getProgressDetails = (user) => {
  if (!user.bookmark || user.bookmark === '' || user.bookmark === 'empty') {
    return { completadas: 0, total: 0, porcentaje: 0 };
  }

  try {
    const bookmarkParts = user.bookmark.split('&&');
    const laminasString = bookmarkParts[0];
    
    if (!laminasString) return { completadas: 0, total: 0, porcentaje: 0 };
    
    const laminas = laminasString.split('|');
    let totalLaminas = 0;
    let laminasCompletadas = 0;
    
    laminas.forEach(lamina => {
      if (lamina) {
        totalLaminas++;
        const primerNumero = parseInt(lamina.charAt(0));
        if (primerNumero === 3) {
          laminasCompletadas++;
        }
      }
    });
    
    const porcentaje = totalLaminas > 0 ? Math.round((laminasCompletadas / totalLaminas) * 100) : 0;
    
    return {
      completadas: laminasCompletadas,
      total: totalLaminas,
      porcentaje: porcentaje
    };
    
  } catch (error) {
    console.error('Error obteniendo detalles de progreso:', error);
    return { completadas: 0, total: 0, porcentaje: 0 };
  }
};

  // Validación de entrada para prevenir XSS
  const validateInput = (input) => {
    return typeof input === 'string'
      ? input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      : input;
  };

  //const [todos, setTodos] = useState({ notes: [] })
  const [todos, setTodos] = useState([])
  const [originalTodos, setOriginalTodos] = useState([]); // Nuevo estado para el orden original

  const [isActive, setIsActive] = useState(true);

  //jun2025-2    
  const [verId, setVerId] = useState(false);
  const handleId = () => {
    setVerId(!verId);
  };
  const [verUltimaActualizacion, setUltimaActualizacion] = useState(false);
  const handleUltimaActualizacion = () => {
    setUltimaActualizacion(!verUltimaActualizacion);
  };
  const [verFechaAlta, setFechaAlta] = useState(false);
  const handleFechaAlta = () => {
    setFechaAlta(!verFechaAlta);
  };
  const [verBookmark, setVerBookmark] = useState(false);
  const handleBookmark = () => {
    setVerBookmark(!verBookmark);
  };

  const [verPassword, setVerPassword] = useState(false);
  const handlePassword = () => {
    setVerPassword(!verPassword);
  };

  const [verER, setVerER] = useState(false);
  const handleER = () => {
    setVerER(!verER);
  };

  const [sortDirection, setSortDirection] = useState(null);
  const [sortingEnabled, setSortingEnabled] = useState(true); // Nuevo estado

  const compareDates = (a, b) => {
    const dateA = new Date(a.updatedAt);
    const dateB = new Date(b.updatedAt);

    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  };

  const sortData = (direction) => {
    const sortedData = [...todos].sort((a, b) => {
      const comparison = compareDates(a, b);
      return direction === 'asc' ? comparison : -comparison;
    });
    setTodos(sortedData);
  };

  // Nuevo: restaurar el orden original al deshabilitar el orden
  useEffect(() => {
    if (!sortingEnabled) {
      setTodos(originalTodos);
    }
  }, [sortingEnabled, originalTodos]);

  // Función para limpiar los campos que NO quieres exportar
  function limpiarCamposExport(obj, i) {
    return {
      No: i + 1,
      grupo: validateInput(obj.grupo),
      username: validateInput(obj.username),
      nombre: validateInput(obj.nombre),
      status: obj.status ? 'completado' : 'no completado',
      // Agrega aquí más campos si los necesitas, en el orden que quieras
    };
  }

  // Botón para exportar el Excel limpio
  const ExportarExcelFiltrado = () => {
    const exportar = () => {
      // Aplica la limpieza a cada objeto de filteredTodos
      const datosLimpios = filteredTodos.map(limpiarCamposExport);
      const worksheet = XLSX.utils.json_to_sheet(datosLimpios);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

      // Obtener fecha actual en formato YYYY-MM-DD
      const fecha = new Date();
      const yyyy = fecha.getFullYear();
      const mm = String(fecha.getMonth() + 1).padStart(2, '0');
      const dd = String(fecha.getDate()).padStart(2, '0');
      const fechaStr = `${yyyy}-${mm}-${dd}`;
      saveAs(blob, `usuarios-${fechaStr}.xlsx`);

    };

    return (
      <span className='btn_ch bg-mint me-1' onClick={exportar}>
        <FontAwesomeIcon icon={faDownload} /> Exportar Excel
      </span>
    );
  };

// Agregar esta función en Admin.js, después de exportSelectedUsers:
const ExportarExcelTodos = () => {
  const exportAllUsers = () => {
    // ✨ Usar 'todos' para exportar TODOS los usuarios
    const allUsersData = todos;
    
    // Calcular estadísticas de TODOS los usuarios
    const estadisticasTotales = {
      'completado': 0,
      'en-progreso': 0,
      'no-iniciado': 0
    };

    allUsersData.forEach(user => {
      const status = getCourseStatus(user);
      estadisticasTotales[status]++;
    });

    const totalUsuarios = allUsersData.length;
    const porcentajeCompletado = totalUsuarios > 0 ? Math.round((estadisticasTotales['completado'] / totalUsuarios) * 100) : 0;
    const porcentajeEnProgreso = totalUsuarios > 0 ? Math.round((estadisticasTotales['en-progreso'] / totalUsuarios) * 100) : 0;
    const porcentajeNoIniciado = totalUsuarios > 0 ? Math.round((estadisticasTotales['no-iniciado'] / totalUsuarios) * 100) : 0;

    // Datos de TODOS los usuarios
    const datosLimpios = allUsersData.map((obj, i) => ({
      No: i + 1,
      grupo: obj.grupo,
      username: obj.username,
      nombre: obj.nombre,
      status: (() => {
        const status = getCourseStatus(obj);
        return status === 'completado' ? 'Completado' :
          status === 'en-progreso' ? 'En Progreso' : 'No Iniciado';
      })(),
    }));

    // Agregar estadísticas al final
    const estadisticasData = [
      { No: '', grupo: '', username: '', nombre: '', status: '' },
      { No: 'ESTADÍSTICAS GENERALES', grupo: '', username: '', nombre: '', status: '' },
      { No: 'Total usuarios:', grupo: totalUsuarios, username: '', nombre: '', status: '' },
      { No: 'Completados:', grupo: estadisticasTotales['completado'], username: `${porcentajeCompletado}%`, nombre: '', status: '' },
      { No: 'En Progreso:', grupo: estadisticasTotales['en-progreso'], username: `${porcentajeEnProgreso}%`, nombre: '', status: '' },
      { No: 'No Iniciados:', grupo: estadisticasTotales['no-iniciado'], username: `${porcentajeNoIniciado}%`, nombre: '', status: '' }
    ];

    const datosCompletos = [...datosLimpios, ...estadisticasData];

    const worksheet = XLSX.utils.json_to_sheet(datosCompletos);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Todos los Usuarios');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});

    const fecha = new Date().toISOString().split('T')[0];
    saveAs(blob, `todos-los-usuarios-${fecha}.xlsx`);
    
    showToast.success(`${totalUsuarios} usuarios exportados correctamente`);
  };

  return (
    <span className='btn_ch bg-mint me-1' onClick={exportAllUsers}>
      <FontAwesomeIcon icon={faFileArrowDown} /> Exportar Excel
    </span>
  );
};


  function formatearFechaSimple(fechaISO, zona = Intl.DateTimeFormat().resolvedOptions().timeZone) {
    const fecha = new Date(fechaISO);

    const opcionesFecha = { day: "numeric", month: "numeric", year: "numeric", timeZone: zona };
    const opcionesHora = { hour: "numeric", minute: "2-digit", hour12: true, timeZone: zona };

    const fechaStr = new Intl.DateTimeFormat("es-MX", opcionesFecha).format(fecha);
    let horaStr = new Intl.DateTimeFormat("es-MX", opcionesHora).format(fecha).toLowerCase();
    // Eliminar puntos en "a.m." / "p.m." → "am" / "pm"
    horaStr = horaStr.replace(" a.m.", "am").replace(" p.m.", "pm");

    return `${fechaStr}/${horaStr}`;
  }

  const [subiendo, setSubiendo] = useState(false);
  const [terminarSubiendo, setTerminarSubiendo] = useState(false);
  const [bitacora, setBitacora] = useState([]);
  const [item, setItem] = useState('')
  const [registros, setRegistros] = useState(0)


  //V api
  const chkData = async () => {
    const loadingToast = showToast.loading("Cargando usuarios...");
    try {
      const users = await getUsersFromAPI();
      // Agregar propiedades necesarias para la UI
      const data = users.map((option, i) => ({
        ...option,
        id: option.id,
        Ranking: i + 1,
        isOpen: false, // ← Agregar esta propiedad
      }));
      setTodos(data);
      setOriginalTodos(data); // ← También agregar esto
      if (GConText.logs) console.log('✅ Usuarios cargados via API:', data.length);
        toast.dismiss(loadingToast);
        showToast.success("Usuarios cargados correctamente");
      
    } catch (error) {
      if (GConText.logs) console.error('❌ Error cargando usuarios:', error);
      toast.dismiss(loadingToast);
      // ✨ Si es token expirado, no hacer nada más (ya se maneja en handleTokenExpiration)
      if (!error.message.includes('Token expirado')) {
        showToast.error('Error cargando usuarios');
      }
    }
  };


  useEffect(() => {
    chkData();
  }, [])

  /* const [edit, setEdit] = useState(false)
  let inputName = useRef();
  let inputPass = useRef();
  let inputUser = useRef();
  let inputGrupo = useRef();
  let selectType = useRef();
  let selectStatus = useRef(); */
  const tableRef = useRef();

  //para descargar sin imagenes la tabla
  const tableRef2 = useRef();


// Reemplazar la función submitDelete existente por esta versión mejorada:
const submitDelete = (id, username, user) => {
  // Crear el contenido HTML personalizado con FontAwesome
  const htmlContent = `
    <div style="text-align: left; padding: 10px;">
      <p><strong><i class="fas fa-user"></i> Usuario:</strong> ${user.username}</p>
      <p><strong><i class="fas fa-id-card"></i> Nombre:</strong> ${user.nombre}</p>
      <p><strong><i class="fas fa-building"></i> Grupo:</strong> ${user.grupo}</p>
      <p><strong><i class="fas fa-cog"></i> Tipo:</strong> ${user.type === 'admin' ? '<i class="fas fa-user-shield"></i> Administrador' : '<i class="fas fa-user"></i> Usuario'}</p>
      <p><strong><i class="fas fa-chart-line"></i> Estado:</strong> ${user.status ? '<i class="fas fa-check-circle" style="color: green;"></i> Completado' : '<i class="fas fa-times-circle" style="color: red;"></i> No completado'}</p>
      ${user.createdAt ? `<p><strong><i class="fas fa-calendar-alt"></i> Creado:</strong> ${formatearFechaSimple(user.createdAt)}</p>` : ''}
    </div>
  `;

  Swal.fire({
    title: `<i class="fas fa-trash"></i> ¿Eliminar usuario?`,
    html: htmlContent,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: '<i class="fas fa-trash"></i> Sí, eliminar',
    cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
    width: '500px',
    customClass: {
      popup: 'swal-delete-popup',
      title: 'swal-delete-title',
      htmlContainer: 'swal-delete-content'
    },
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      deleteNote(id);
      
      showToast.success("Usuario eliminado correctamente");
    }
  });
};


  const submitUpload = () => {

    Swal.fire({
      title: `Cargar Usuario en la plataforma`,
      text: `${GConText.nombre} Estas segura de hacer esto?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si Cargarlos",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar"

    }).then((result) => {
      if (result.isConfirmed) {
        uploadUsers(items)
      } else {
        setIsActive(true)
      }
    });
  };


  //V3 - API
  const deleteNote = async (id) => {
    try {
      await deleteUserAPI(id);
      setTodos(todos.filter((item) => item.id !== id));
      if (GConText.logs) console.log('✅ Usuario eliminado via API');
      /* showToast.success("Usuario eliminado correctamente"); */
    } catch (error) {
      console.error("❌ Error eliminando usuario:", error);
      showToast.error("No se pudo eliminar el usuario");
    }
  };

  //------LUIS: FILTRO ---///
  const [sg, setSg] = useState("");
  const [su, setSu] = useState("");
  const [sn, setSn] = useState("");
  const [ss, setSs] = useState("");

  //🔍 1. Búsqueda Global - Implementación:
  const [globalSearch, setGlobalSearch] = useState('');
  // Agregar después de las otras funciones de filtro
  const handleGlobalSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setGlobalSearch(searchTerm);
    setPaginaActual(1); // Resetear a la primera página
  };


  //V2 - Filtros combinados (búsqueda global + filtros específicos)
  const filteredTodos = useMemo(() => {
    let result = todos;

    // Aplicar búsqueda global primero
    if (globalSearch) {
      result = result.filter(user =>
        user.nombre?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.username?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.grupo?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.type?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        user.id?.toLowerCase().includes(globalSearch.toLowerCase()) ||
        (user.status ? 'completado' : 'no completado').includes(globalSearch.toLowerCase())
      );
    }

    // Luego aplicar filtros específicos
    return result.filter(el => {
      // Filtros dinámicos: solo filtra si el campo tiene valor
      if (sn && !el.nombre.toLowerCase().includes(sn)) return false;
      if (su && !el.username.toLowerCase().includes(su)) return false;
      if (sg && !el.grupo.toLowerCase().includes(sg)) return false;
      /* if (ss) {
        const status = (el.status === null || el.status === false) ? 'false' : 'true';
        if (!status.includes(ss)) return false;
      } */
      // Actualizar filteredTodos para usar los nuevos estados:
      if (ss) {
        const userStatus = getCourseStatus(el);
        if (userStatus !== ss) return false;
      }

      return true;
    });
  }, [sg, su, sn, ss, todos, globalSearch]); // ← Agregar globalSearch a las dependencias


// En el useMemo de estadísticas, agregar:
//simple sin estados solo completado y no completado
/* const estadisticas = useMemo(() => {
  const total = filteredTodos.length;
  const completados = filteredTodos.filter(u => u.status === true).length;
  const admins = filteredTodos.filter(u => u.type === 'admin').length;
  const users = filteredTodos.filter(u => u.type === 'user').length;
  const noCompletados = filteredTodos.filter(u => u.status === false).length;
  
  return {
    total,
    admins,
    users,
    completados,
    noCompletados,
    grupos: [...new Set(filteredTodos.map(u => u.grupo))].length,
    // Porcentajes
    porcentajeCompletados: total > 0 ? Math.round((completados / total) * 100) : 0,
    porcentajeAdmins: total > 0 ? Math.round((admins / total) * 100) : 0,
    porcentajeUsers: total > 0 ? Math.round((users / total) * 100) : 0,
    porcentajePendientes: total > 0 ? Math.round((noCompletados / total) * 100) : 0
  };
}, [filteredTodos]); */

//con 5 estados
/* const estadisticas = useMemo(() => {
  const total = filteredTodos.length;
  const statusCounts = {
    completado: 0,
    'en-progreso': 0,
    iniciado: 0,
    pendiente: 0,
    'no-iniciado': 0
  };
  
  filteredTodos.forEach(user => {
    const status = getCourseStatus(user);
    statusCounts[status]++;
  });
  
  return {
    total,
    ...statusCounts,
    // Porcentajes
    porcentajeCompletados: total > 0 ? Math.round((statusCounts.completado / total) * 100) : 0,
    porcentajeEnProgreso: total > 0 ? Math.round((statusCounts['en-progreso'] / total) * 100) : 0,
    porcentajeIniciado: total > 0 ? Math.round((statusCounts.iniciado / total) * 100) : 0,
    porcentajePendiente: total > 0 ? Math.round((statusCounts.pendiente / total) * 100) : 0,
    porcentajeNoIniciado: total > 0 ? Math.round((statusCounts['no-iniciado'] / total) * 100) : 0
  };
}, [filteredTodos]); */

//con 3 estados
const estadisticas = useMemo(() => {
  const total = filteredTodos.length;
  const statusCounts = {
    completado: 0,
    'en-progreso': 0,
    'no-iniciado': 0
  };
  
  filteredTodos.forEach(user => {
    const status = getCourseStatus(user);
    statusCounts[status]++;
  });
  
  return {
    total,
    ...statusCounts,
    // Porcentajes
    porcentajeCompletados: total > 0 ? Math.round((statusCounts.completado / total) * 100) : 0,
    porcentajeEnProgreso: total > 0 ? Math.round((statusCounts['en-progreso'] / total) * 100) : 0,
    porcentajeNoIniciado: total > 0 ? Math.round((statusCounts['no-iniciado'] / total) * 100) : 0
  };
//}, [filteredTodos]);
}, [todos]); // ← Cambiar dependencia de filteredTodos a todos

  //2025may
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  //const ultimoItemIndex = paginaActual * itemsPorPagina
  //const primerItemIndex = ultimoItemIndex - itemsPorPagina

  const primerItemIndex = (paginaActual - 1) * itemsPorPagina
  const ultimoItemIndex = primerItemIndex + itemsPorPagina

  const itemsEstaPagina = filteredTodos.slice(primerItemIndex, ultimoItemIndex)

  const paginas = []

  const totalpaginas = Math.ceil(filteredTodos.length / itemsPorPagina);

  for (let i = 1; i <= Math.ceil(filteredTodos.length / itemsPorPagina); i++) {
    paginas.push(i);
  }

  const findChangeGrupo = (event) => {
    setPaginaActual(1)
    setSg(event.target.value.toLowerCase());
  }
  const findChangeUsuario = (event) => {
    setPaginaActual(1)
    setSu(event.target.value.toLowerCase());
  }
  const findChangeNombre = (event) => {
    setPaginaActual(1)
    setSn(event.target.value.toLowerCase());
  }
  const findStatus = (event) => {
    if (GConText.logs) console.log("🚀 ~ event.target.value:", event.target.value)
    setPaginaActual(1)
    setSs(event.target.value);
  }

  //LEER EXCEL
  const [items, setItems] = useState([]);

  //V2
  const readExcel = async (file) => {
    setIsActive(true);
    try {
      const fileReader = new FileReader();

      const bufferArray = await new Promise((resolve, reject) => {
        fileReader.onload = (e) => resolve(e.target.result);
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsArrayBuffer(file);
      });

      const wb = XLSX.read(bufferArray, { type: "buffer" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const dataAjustada = data.map(option => {
        const usernameOriginal = option.username ? String(option.username) : '';
        const usernameAjustado = usernameOriginal.toLowerCase().replace(/\s+/g, '');
        return {
          ...option,
          username: usernameAjustado,
          ajusteUsername: usernameOriginal !== usernameAjustado // true si hubo ajuste
        };
      });

      if (GConText.logs) console.log("🚀 ~ data", dataAjustada);
      setItems(dataAjustada);
    } catch (error) {
      console.error("Error leyendo el archivo Excel:", error);
    } finally {
      setIsActive(false);
      if (GConText.logs) console.log("finaly");
    }
  };

  // V4 - API Batch con detalle
  const uploadUsers = async () => {
    setSubiendo(true);
    let nuevaBitacora = [];

    // Mostrar inicio
    nuevaBitacora.push({
      titulo: `🚀 Iniciando carga masiva:`,
      mensaje: `${items.length} usuarios a procesar`,
    });
    setBitacora([...nuevaBitacora]);

    try {
      // Procesar uno por uno PERO mostrar progreso
      for (let i = 0; i < items.length; i++) {
        const option = items[i];

        try {
          await createUserAPI({
            username: option.username.toString(),
            password: option.password.toString(),
            nombre: option.nombre.toString(),
            grupo: option.grupo.toString(),
            type: 'user',
            status: option.status === true || option.status === 'true' ? true : false,
            bookmark: option.bookmark ? option.bookmark.toString() : ''
          });

          nuevaBitacora.push({
            titulo: `🟢 Usuario Nuevo (${i + 1}/${items.length}):`,
            mensaje: `${option.username}, ${option.nombre}, ${option.grupo}`,
          });
          setBitacora([...nuevaBitacora]);

        } catch (error) {
          if (error.message.includes('Usuario ya existe')) {
            nuevaBitacora.push({
              titulo: `🟡 Usuario Existente (${i + 1}/${items.length}):`,
              mensaje: `${option.username} - ${option.grupo}`,
            });
          } else {
            nuevaBitacora.push({
              titulo: `🔴 Error (${i + 1}/${items.length}):`,
              mensaje: `${option.username} - ${error.message}`,
            });
          }
          setBitacora([...nuevaBitacora]);
        }

        // Pequeña pausa para que se vea el progreso
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      nuevaBitacora.push({
        titulo: `🟣 Carga completada:`,
        mensaje: `${items.length} usuarios procesados`,
      });
      setBitacora([...nuevaBitacora]);

    } catch (error) {
      nuevaBitacora.push({
        titulo: `🔴 Error general:`,
        mensaje: error.message,
      });
      setBitacora([...nuevaBitacora]);
    }

    await chkData();
    setIsActive(true);
    setTerminarSubiendo(true);
  };

  //ref del input de file
  const inputRef = useRef();

  const handleClickInputFile = () => {
    // 👇️ open file input box on click of other element
    inputRef.current.click();
  };

  useEffect(() => {
    setRegistros(filteredTodos.length);
  }, [filteredTodos]);


  // En el panel de admin
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now()); // No se usa

  //V3 - API
  const refreshData = async () => {
    if (GConText.logs) console.log("🚀 ~ refreshData (API):");
    try {
      setIsLoading(true);
      // Recargar datos via API
      await chkData();
      setLastRefresh(Date.now());
      if (GConText.logs) console.log('✅ Datos actualizados via API');

    } catch (error) {
      if (GConText.logs) console.error('Error refrescando datos:', error);
      // ✨ Si el error es por token expirado, no mostrar toast adicional
      if (!error.message.includes('Token expirado')) {
        showToast.error('Error actualizando datos');
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Auto-refresh cada 30 segundos
  /* useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []); */

  //1. Agregar estados para el popup:
  // Estados para el popup de edición
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  // Por esto:
  const [editUsername, setEditUsername] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editGrupo, setEditGrupo] = useState('');
  const [editType, setEditType] = useState('user');
  const [editStatus, setEditStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  //2. Funciones para manejar el popup:

  // Abrir popup de edición
  const openEditModal = (user) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditNombre(user.nombre);
    setEditPassword(''); // Campo vacío para nueva contraseña
    setEditGrupo(user.grupo);
    setEditType(user.type);
    /* setEditStatus(user.status); */

  // ✨ Inicializar el select con el estado actual
  const currentStatus = getCourseStatus(user);
  setSelectedStatus(currentStatus);

    setShowEditModal(true);
  };

  // Cerrar popup
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditUsername('');
    setEditNombre('');
    setEditPassword('');
    setEditGrupo('');
    setEditType('user');
    setEditStatus(false);
    setSelectedStatus(''); // ← Limpiar
  };

  // Guardar cambios
  /* const saveUserChanges = async () => {
    try {
      const updates = {
        username: editUsername,
        nombre: editNombre,
        grupo: editGrupo,
        type: editType,
        status: editStatus
      };

      // Solo incluir password si se escribió algo
      if (editPassword.trim() !== '') {
        updates.password = editPassword;
      }

      await updateUserAPI(editingUser.id, updates);
      await chkData();
      closeEditModal();

      showToast.success("Usuario actualizado correctamente");

    } catch (error) {
      console.error('Error actualizando usuario:', error);
      showToast.error("No se pudo actualizar el usuario");
    }
  }; */
// Guardar cambios
/* const saveUserChanges = async () => {
  try {
    const updates = {
      username: editUsername,
      nombre: editNombre,
      grupo: editGrupo,
      type: editType,
      status: editStatus
    };

    // Solo incluir password si se escribió algo
    if (editPassword.trim() !== '') {
      updates.password = editPassword;
    }

    // ✨ LÓGICA FINAL: Completado = 1 lámina, No completado = bookmark vacío
    if (editStatus !== editingUser.status) {
      if (editStatus === true) {
        // Marcar como completado: 1 lámina completada
        const currentBookmark = editingUser.bookmark || '1-0-0-0&&1&&index&&&&esp&&';
        
        try {
          const bookmarkParts = currentBookmark.split('&&');
          bookmarkParts[0] = '3-0-0-0'; // 1 lámina completada
          updates.bookmark = bookmarkParts.join('&&');
        } catch (error) {
          // Bookmark por defecto completado
          updates.bookmark = '3-0-0-0&&1&&index&&&&esp&&';
        }
      } else {
        // Desmarcar como completado: bookmark vacío para mostrar "No Iniciado"
        updates.bookmark = '';
      }
    }

    await updateUserAPI(editingUser.id, updates);
    await chkData();
    closeEditModal();

    showToast.success("Usuario actualizado correctamente");

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    showToast.error("No se pudo actualizar el usuario");
  }
}; */

// Guardar cambios
const saveUserChanges = async () => {
  try {
    // ✨ Variable para cantidad de láminas del curso
    const cant_laminas = 5; // Ajustar según tu curso
    
    const updates = {};

    // Solo incluir campos que realmente cambiaron
    if (editUsername !== editingUser.username) updates.username = editUsername;
    if (editNombre !== editingUser.nombre) updates.nombre = editNombre;
    if (editGrupo !== editingUser.grupo) updates.grupo = editGrupo;
    if (editType !== editingUser.type) updates.type = editType;

    // Solo incluir password si se escribió algo
    if (editPassword.trim() !== '') {
      updates.password = editPassword;
    }

    // ✅ NUEVA LÓGICA:
    const currentStatus = getCourseStatus(editingUser);
    const statusChanged = selectedStatus !== currentStatus;

    if (statusChanged) {
      // Determinar el nuevo editStatus basado en selectedStatus
      const newEditStatus = selectedStatus === 'completado';
      updates.status = newEditStatus;
      
      if (selectedStatus === 'completado') {
        // ✨ Generar láminas completadas según cant_laminas
        const laminasCompletadas = Array(cant_laminas).fill('3-0-0-0').join('|');
        updates.bookmark = `${laminasCompletadas}&&1&&index&&MODIF_BASE&&esp&&`;
        
      } else if (selectedStatus === 'no-iniciado') {
        // Borrar bookmark completamente
        updates.bookmark = '';
      }
      // Si es 'en-progreso', no hacer nada (mantener actual)
    }

    // Si no hay cambios, cerrar modal sin hacer nada
    if (Object.keys(updates).length === 0) {
      closeEditModal();
      showToast.info("No se realizaron cambios");
      return;
    }

    await updateUserAPI(editingUser.id, updates);
    await chkData();
    closeEditModal();

    showToast.success("Usuario actualizado correctamente");

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    showToast.error("No se pudo actualizar el usuario");
  }
};




  //USUARIO NUEVO
  // Estados para crear nuevo usuario
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newNombre, setNewNombre] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newGrupo, setNewGrupo] = useState('');
  const [newType, setNewType] = useState('user');
  const [newStatus, setNewStatus] = useState(false);
  const [passwordValid, setPasswordValid] = useState(true);

  // Abrir popup de nuevo usuario
  const openNewUserModal = () => {
    setNewUsername('');
    setNewNombre('');
    setNewPassword('');
    setNewGrupo('');
    setNewType('user');
    setNewStatus(false);
    setShowNewUserModal(true);
  };

  // Cerrar popup de nuevo usuario
  const closeNewUserModal = () => {
    setShowNewUserModal(false);
    setNewUsername('');
    setNewNombre('');
    setNewPassword('');
    setNewGrupo('');
    setNewType('user');
    setNewStatus(false);
  };

  // Crear nuevo usuario
  const createNewUser = async () => {
    // Validar campos requeridos
    if (!newUsername.trim() || !newPassword.trim() || !newNombre.trim() || !newGrupo.trim()) {
      /* Swal.fire({
        title: "Campos requeridos",
        text: "Por favor completa todos los campos obligatorios",
        icon: "warning"
      }); */
      showToast.warning("Por favor completa todos los campos obligatorios");
      return;
    }

    // ✨ NUEVA VALIDACIÓN: Longitud mínima
    if (newUsername.length < 3) {
      showToast.warning("El username debe tener al menos 3 caracteres");
      return;
    }

    if (newPassword.length < 6) {
      showToast.warning("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {

      // ✨ NUEVA LÓGICA: Aplicar bookmark según el estado
      let bookmarkValue = '';
      if (newStatus === true) {
        // Si se crea como completado, generar bookmark completado
        bookmarkValue = '3-0-0-0&&1&&index&&&&esp&&';
      } else {
        // Si se crea como no completado, bookmark vacío (No Iniciado)
        bookmarkValue = '';
      }

      await createUserAPI({
        username: newUsername,
        password: newPassword,
        nombre: newNombre,
        grupo: newGrupo,
        type: newType,
        status: newStatus,
        bookmark: bookmarkValue // ← Usar el bookmark calculado
      });

      await chkData();
      closeNewUserModal();

      showToast.success("Usuario creado correctamente");

    } catch (error) {
      console.error('Error creando usuario:', error);
      showToast.error(error.message.includes('Usuario ya existe') 
        ? "El username ya existe, elige otro" 
        : "No se pudo crear el usuario");
    }
  };

  useEffect(() => {
    if (showEditModal || showNewUserModal || subiendo) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showEditModal, showNewUserModal, subiendo]);


  // Agregar después de los otros estados
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' o 'desc'


  // Función para ordenar por cualquier campo
  const sortByField = (field) => {
    let newOrder = 'asc';

    // Si ya está ordenado por este campo, cambiar dirección
    if (sortField === field && sortOrder === 'asc') {
      newOrder = 'desc';
    }

    setSortField(field);
    setSortOrder(newOrder);

    const sortedData = [...todos].sort((a, b) => {
      let aValue = a[field];
      let bValue = b[field];

      // Manejar diferentes tipos de datos
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return newOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return newOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setTodos(sortedData);
  };

  // Componente para cabeceras con ordenamiento
  const SortableHeader = ({ field, children, className = "" }) => (
    <th
      scope="col"
      className={`${className} sortable-header`}
      onClick={() => sortByField(field)}
      style={{ cursor: 'pointer', userSelect: 'none' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{children}</span>
        <span style={{ marginLeft: '5px', fontSize: '12px' }}>
          {sortField === field ? (
            sortOrder === 'asc' ? (
              <FontAwesomeIcon icon={faSortUp} />
            ) : (
              <FontAwesomeIcon icon={faSortDown} />
            )
          ) : (
            <FontAwesomeIcon icon={faSort} style={{ opacity: 0.3 }} />
          )}
        </span>
      </div>
    </th>
  );

// Agregar después de los otros estados
const [selectedUsers, setSelectedUsers] = useState([]);
const [selectAll, setSelectAll] = useState(false);

// Agregar después de handleGlobalSearch
const handleSelectUser = (userId, isSelected) => {
  if (isSelected) {
    setSelectedUsers([...selectedUsers, userId]);
  } else {
    setSelectedUsers(selectedUsers.filter(id => id !== userId));
  }
};

const handleSelectAll = (isSelected) => {
  setSelectAll(isSelected);
  if (isSelected) {
    setSelectedUsers(itemsEstaPagina.map(user => user.id));
  } else {
    setSelectedUsers([]);
  }
};

/* const deleteSelectedUsers = async () => {
  if (selectedUsers.length === 0) {
    Swal.fire({
      title: "Sin selección",
      text: "Selecciona al menos un usuario para eliminar",
      icon: "warning"
    });
    return;
  }

  Swal.fire({
    title: `¿Eliminar ${selectedUsers.length} usuarios?`,
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Eliminar usuarios uno por uno
        for (const userId of selectedUsers) {
          await deleteUserAPI(userId);
        }
        
        // Actualizar estado local
        setTodos(todos.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        setSelectAll(false);
        
        Swal.fire({
          title: "¡Eliminados!",
          text: `${selectedUsers.length} usuarios eliminados correctamente`,
          icon: "success"
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "No se pudieron eliminar algunos usuarios",
          icon: "error"
        });
      }
    }
  });
}; */

// También actualizar deleteSelectedUsers:
const deleteSelectedUsers = async () => {
  if (selectedUsers.length === 0) {
    /* Swal.fire({
      title: "Sin selección",
      text: "Selecciona al menos un usuario para eliminar",
      icon: "warning"
    }); */
    showToast.warning("Selecciona al menos un usuario para eliminar");
    return;
  }

  // Obtener detalles de usuarios seleccionados
  const selectedUsersData = todos.filter(user => selectedUsers.includes(user.id));
  const usersList = selectedUsersData.map(user => 
    `• <i class="fas fa-user"></i> ${user.username} (${user.nombre}) - <i class="fas fa-building"></i> ${user.grupo}`
  ).join('<br>');

  Swal.fire({
    title: `<i class="fas fa-trash"></i> ¿Eliminar ${selectedUsers.length} usuarios?`,
    html: `
      <div style="text-align: left; max-height: 200px; overflow-y: auto; padding: 10px; background: #f8f9fa; border-radius: 8px; margin: 10px 0;">
        ${usersList}
      </div>
      <p style="color: #dc3545; font-weight: bold;"><i class="fas fa-exclamation-triangle"></i> Esta acción no se puede deshacer</p>
    `,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: `<i class="fas fa-trash"></i> Sí, eliminar ${selectedUsers.length} usuarios`,
    cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
    width: '600px'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        for (const userId of selectedUsers) {
          await deleteUserAPI(userId);
        }
        
        setTodos(todos.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
        setSelectAll(false);
        
        /* Swal.fire({
          title: "¡Eliminados!",
          html: `<strong>${selectedUsers.length} usuarios</strong> eliminados correctamente`,
          icon: "success",
          timer: 3000
        }); */

        showToast.success(`${selectedUsers.length} usuarios eliminados correctamente`);
      } catch (error) {
        /* Swal.fire({
          title: "Error",
          text: "No se pudieron eliminar algunos usuarios",
          icon: "error"
        }); */
        showToast.error("No se pudo eliminar el usuario");
      }
    }
  });
};

const exportSelectedUsers = () => {
  if (selectedUsers.length === 0) {
    /* Swal.fire({
      title: "Sin selección",
      text: "Selecciona al menos un usuario para exportar",
      icon: "warning"
    }); */
    showToast.warning("Selecciona al menos un usuario para exportar");
    return;
  }

    const selectedData = todos.filter(user => selectedUsers.includes(user.id));

    // ✨ Calcular estadísticas de los usuarios seleccionados
    const estadisticasSeleccionados = {
      'completado': 0,
      'en-progreso': 0,
      'no-iniciado': 0
    };

    selectedData.forEach(user => {
      const status = getCourseStatus(user);
      estadisticasSeleccionados[status]++;
    });

    const totalSeleccionados = selectedData.length;
    const porcentajeCompletado = totalSeleccionados > 0 ? Math.round((estadisticasSeleccionados['completado'] / totalSeleccionados) * 100) : 0;
    const porcentajeEnProgreso = totalSeleccionados > 0 ? Math.round((estadisticasSeleccionados['en-progreso'] / totalSeleccionados) * 100) : 0;
    const porcentajeNoIniciado = totalSeleccionados > 0 ? Math.round((estadisticasSeleccionados['no-iniciado'] / totalSeleccionados) * 100) : 0;

  // Datos de usuarios
  const datosLimpios = selectedData.map((obj, i) => ({
    No: i + 1,
    grupo: obj.grupo,
    username: obj.username,
    nombre: obj.nombre,
    status: (() => {
      const status = getCourseStatus(obj);
      return status === 'completado' ? 'Completado' :
        status === 'en-progreso' ? 'En Progreso' : 'No Iniciado';
    })(),
    //status: obj.status ? 'completado' : 'no completado',
  }));

  // ✨ Agregar estadísticas al final
  const estadisticasData = [
    { No: '', grupo: '', username: '', nombre: '', status: '' }, // Fila vacía
    { No: 'ESTADÍSTICAS', grupo: '', username: '', nombre: '', status: '' },
    { No: 'Total usuarios:', grupo: totalSeleccionados, username: '', nombre: '', status: '' },
    { No: 'Completados:', grupo: estadisticasSeleccionados['completado'], username: `${porcentajeCompletado}%`, nombre: '', status: '' },
    { No: 'En Progreso:', grupo: estadisticasSeleccionados['en-progreso'], username: `${porcentajeEnProgreso}%`, nombre: '', status: '' },
    { No: 'No Iniciados:', grupo: estadisticasSeleccionados['no-iniciado'], username: `${porcentajeNoIniciado}%`, nombre: '', status: '' }
  ];

  // Combinar datos de usuarios con estadísticas
  const datosCompletos = [...datosLimpios, ...estadisticasData];

  //const worksheet = XLSX.utils.json_to_sheet(datosLimpios);
  const worksheet = XLSX.utils.json_to_sheet(datosCompletos);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios Seleccionados');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});

  const fecha = new Date().toISOString().split('T')[0];
  saveAs(blob, `usuarios-seleccionados-${fecha}.xlsx`);
  
  /* Swal.fire({
    title: "¡Exportado!",
    text: `${selectedUsers.length} usuarios exportados correctamente`,
    icon: "success"
  }); */

  showToast.success(`${selectedUsers.length} usuarios exportados correctamente`);
};

  return (
    <>
      {showEditModal && (
        <div className="pop_up" style={{ zIndex: 1000 }}>
          <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className='modal-content' style={{
              width: '50vw',
              maxWidth: '90vw',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: 'none'
            }}>
              <div className="modal-header" style={{
                /* background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', */
                background: '#F7A11E',
                color: 'white',
                borderRadius: '12px 12px 0 0',
                padding: '15px 20px',
                borderBottom: 'none'
              }}>
                <h4 style={{ margin: 0, fontSize: '26px' }}>
                  <FontAwesomeIcon icon={faEdit} /> {/* Editar Usuario: */} <strong>{editingUser?.username}</strong>
                </h4>
              </div>

              <div className="modal-body" style={{ padding: '20px' }}>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Username:</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        style={{ borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Nombre:</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        style={{ borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mb-3 text-left">
                  <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
                    <FontAwesomeIcon icon={faLock} /> Nueva Contraseña <small style={{ color: '#888' }}>(vacío = no cambiar)</small>:
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={editPassword}
                    placeholder="Dejar vacío para mantener actual"
                    onChange={(e) => setEditPassword(e.target.value)}
                    style={{ borderRadius: '6px', border: '1px solid #ddd' }}

                  />
                  {/* // Agregar texto informativo debajo: */}
                  <small style={{ color: '#666', fontSize: '14px' }}>
                    * La contraseña debe tener al menos 6 caracteres
                  </small>

                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Grupo:</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editGrupo}
                        onChange={(e) => setEditGrupo(e.target.value)}
                        style={{ borderRadius: '6px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Tipo:</label>
                      <select
                        className="form-control form-control-sm"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          backgroundColor: editType === 'admin' ? '#ffd93d' : '#2857f2',
                          color: editType === 'admin' ? '#1a1611' : '#ffffff',
                          fontWeight: 'bold'
                        }}
                      >
                        <option value="user"> User</option>
                        <option value="admin"> Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Estado del Curso:</label>
                        <select
                          className="form-control form-control-sm"
                          value={selectedStatus} // ← Usar selectedStatus en lugar de getCourseStatus
                          onChange={(e) => {
                            setSelectedStatus(e.target.value); // ← Actualizar selectedStatus
                            
                            if (e.target.value === 'completado') {
                              setEditStatus(true);
                            } else if (e.target.value === 'no-iniciado') {
                              setEditStatus(false);
                            }
                          }}
                          style={{
                            borderRadius: '6px',
                            border: '1px solid #ddd',
                            backgroundColor: (() => {
                              if (selectedStatus === 'completado') return '#80e30f';
                              if (selectedStatus === 'en-progreso') return '#eda200';
                              return '#d2d1d1';
                            })(),
                            color: '#000',
                            fontWeight: 'bold'
                          }}
                        >
                          <option value="no-iniciado">No Iniciado</option>
                          <option value="en-progreso" disabled>En Progreso (solo lectura)</option>
                          <option value="completado">Completado</option>
                        </select>

                      {/* Indicador visual - Estado ACTUAL del usuario */}
                      <div className="mt-2">
                        {(() => {
                          const currentStatus = getCourseStatus(editingUser);
                          const currentConfig = getStatusConfig(currentStatus);
                          const currentProgress = getProgressDetails(editingUser);
                          
                          return (
                            <div>
                              <div style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>
                                Estado actual:
                              </div>
                              <span className={`badge badge-status ${currentConfig.className}`}>
                                <FontAwesomeIcon icon={currentConfig.icon} /> {currentConfig.label}
                              </span>
                              {currentProgress.total > 0 && (
                                <div style={{fontSize: '10px', marginTop: '2px', color: '#666'}}>
                                  {currentProgress.completadas}/{currentProgress.total} ({currentProgress.porcentaje}%)
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* ✨ MENSAJE DE ADVERTENCIA cuando hay cambios */}
                      {(() => {
                        const currentStatus = getCourseStatus(editingUser);
                        const willChange = selectedStatus !== currentStatus;
                        
                        return willChange && (
                          <div className="alert alert-warning mt-2" style={{fontSize: '12px', padding: '8px'}}>
                            <FontAwesomeIcon icon={faExclamationTriangle} /> 
                            {selectedStatus === 'completado' && ' Al marcar como completado, el progreso se actualizará automáticamente'}
                            {selectedStatus === 'no-iniciado' && ' Al marcar como no iniciado, el progreso se reiniciará por completo'}
                            {selectedStatus === 'en-progreso' && ' El estado en progreso se mantendrá sin cambios'}
                          </div>
                        );
                      })()}



                      {/* ✨ NUEVA NOTA: Comportamiento de campos */}
                      {/* <div className="mt-2" style={{
                        background: '#f8f9fa', 
                        border: '1px solid #dee2e6', 
                        borderRadius: '6px', 
                        padding: '8px',
                        fontSize: '14px',
                        color: '#6c757d'
                      }}>
                        <FontAwesomeIcon icon={faInfoCircle} style={{color: '#17a2b8'}} />
                        <strong> Nota:</strong> Solo se guardarán los campos que realmente cambies. 
                        Si no modificas el estado del curso, se mantendrá el progreso actual del usuario.
                      </div> */}

                    </div>
                  </div>
                </div>
                      {/* Versión más pequeña de la nota */}
                      <small className="text-muted mt-1 d-block" style={{
                        fontSize: '18px',
                        fontStyle: 'italic',
                        background: '#f8f9fa',
                        padding: '4px 6px',
                        borderRadius: '4px',
                        border: '1px solid #e9ecef'
                      }}>
                        <FontAwesomeIcon icon={faLightbulb} style={{color: '#ffc107'}} /> Solo se actualizan los campos modificados
                      </small>
              </div>

              <div className="modal-footer" style={{
                padding: '15px 20px',
                borderTop: '1px solid #eee',
                borderRadius: '0 0 12px 12px',
                background: '#f8f9fa'
              }}>
                <span
                  className="btn bg-secundario c-blanco me-2"
                  onClick={closeEditModal}
                >
                  <FontAwesomeIcon icon={faCancel} /> Cancelar
                </span>
                <span
                  className="btn bg-mint c-negro"
                  onClick={saveUserChanges}
                >
                  <FontAwesomeIcon icon={faSave} /> Guardar
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showNewUserModal && (
        <div className="pop_up" style={{ zIndex: 1000 }}>
          <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className='modal-content' style={{
              width: '50vw',
              maxWidth: '90vw',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: 'none'
            }}>
              <div className="modal-header" style={{
                background: '#28a745',
                color: 'white',
                borderRadius: '12px 12px 0 0',
                padding: '15px 20px',
                borderBottom: 'none'
              }}>
                <h4 style={{ margin: 0, fontSize: '20px' }}>
                  <FontAwesomeIcon icon={faPlus} /> Crear Nuevo Usuario
                </h4>
              </div>

              <div className="modal-body" style={{ padding: '20px' }}>
                <div className="row">
                  <div className="col-6">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
                        Username <span style={{ color: 'red' }}>*</span>:
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        style={{ borderRadius: '6px', border: '1px solid #ddd' }}
                        placeholder="Ingresa username"
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
                        Nombre <span style={{ color: 'red' }}>*</span>:
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={newNombre}
                        onChange={(e) => setNewNombre(e.target.value)}
                        style={{ borderRadius: '6px', border: '1px solid #ddd' }}
                        placeholder="Nombre completo"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mb-3 text-left">
                  <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
                    <FontAwesomeIcon icon={faLock} /> Contraseña <span style={{ color: 'red' }}>*</span>:
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-sm"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordValid(e.target.value.length >= 6);
                    }}
                    style={{ 
                      borderRadius: '6px', 
                      border: `2px solid ${passwordValid ? '#ddd' : '#dc3545'}` // Rojo si inválido
                      }}
                    placeholder="Mínimo 6 caracteres" // ← Agregar esta línea
                  />
                  {/* // Agregar texto informativo debajo: */}
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    * La contraseña debe tener al menos 6 caracteres
                  </small>
                </div>

                <div className="row">
                  <div className="col-4">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>
                        Grupo <span style={{ color: 'red' }}>*</span>:
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm text-left"
                        value={newGrupo}
                        onChange={(e) => setNewGrupo(e.target.value)}
                        style={{ borderRadius: '6px', border: '1px solid #ddd' }}
                        placeholder="Grupo del usuario"
                      />
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Tipo:</label>
                      <select
                        className="form-control form-control-sm"
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          backgroundColor: newType === 'admin' ? '#ffd93d' : '#2857f2',
                          color: newType === 'admin' ? '#1a1611' : '#ffffff',
                          fontWeight: 'bold'
                        }}
                      >
                        <option value="user"> User</option>
                        <option value="admin"> Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-group mb-3 text-left">
                      <label style={{ fontSize: '20px', fontWeight: 'bold', color: '#555' }}>Estado del Curso:</label>
                      <select
                        className="form-control form-control-sm"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value === 'true')}
                        style={{
                          borderRadius: '6px',
                          border: '1px solid #ddd',
                          backgroundColor: newStatus ? '#80e30f' : '#d2d1d1', // Verde si completado, gris si no
                          color: '#000',
                          fontWeight: 'bold'
                        }}
                      >
                        <option value={false}>No Iniciado</option>
                        <option value={true}>Completado</option>
                      </select>
                      
                      {/* Indicador visual */}
                      <div className="mt-2">
                        <span className={`badge badge-status ${newStatus ? 'badge-completado' : 'badge-no-iniciado'}`}>
                          <FontAwesomeIcon icon={newStatus ? faCheckCircle : faTimesCircle} />
                          {newStatus ? ' Completado' : ' No Iniciado'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer" style={{
                padding: '15px 20px',
                borderTop: '1px solid #eee',
                borderRadius: '0 0 12px 12px',
                background: '#f8f9fa'
              }}>
                <span
                  className="btn bg-secundario c-blanco me-2"
                  onClick={closeNewUserModal}
                >
                  <FontAwesomeIcon icon={faCancel} /> Cancelar
                </span>
                <span
                  className="btn bg-mint c-negro"
                  onClick={createNewUser}
                >
                  <FontAwesomeIcon icon={faPlus} /> Crear Usuario
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {subiendo && (
        <div className="pop_up" style={{ zIndex: 1000 }}>
          <div className="modal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className='modal-content' style={{
              width: '60vw',
              maxWidth: '90vw',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              border: 'none'
            }}>
              <div className="modal-header" style={{
                background: terminarSubiendo ? '#28a745' : '#007bff',
                color: 'white',
                borderRadius: '12px 12px 0 0',
                padding: '15px 20px',
                borderBottom: 'none'
              }}>
                <h4 style={{ margin: 0, fontSize: '24px' }}>
                  {terminarSubiendo ? (
                    <>
                      <FontAwesomeIcon icon={faCheck} /> Carga Completa
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Cargando Usuarios
                    </>
                  )}
                </h4>
              </div>

              <div className="modal-body" style={{
                padding: '20px',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                <div style={{ fontSize: '16px' }}>
                  {bitacora.map((bita, i) => (
                    <div key={i} style={{
                      padding: '8px 12px',
                      margin: '4px 0',
                      borderRadius: '6px',
                      textAlign: 'left', // ← Agregar esta línea
                      backgroundColor: bita.titulo.includes('🟢') ? '#d4edda' :
                        bita.titulo.includes('🔴') ? '#f8d7da' :
                          bita.titulo.includes('🟡') ? '#fff3cd' : '#f8f9fa',
                      borderLeft: `4px solid ${bita.titulo.includes('🟢') ? '#28a745' :
                        bita.titulo.includes('🔴') ? '#dc3545' :
                          bita.titulo.includes('🟡') ? '#ffc107' : '#6c757d'
                        }`
                    }}>
                      <strong>{bita.titulo}</strong> {bita.mensaje}
                    </div>
                  ))}
                </div>
              </div>

              {terminarSubiendo && (
                <div className="modal-footer" style={{
                  padding: '15px 20px',
                  borderTop: '1px solid #eee',
                  borderRadius: '0 0 12px 12px',
                  background: '#f8f9fa'
                }}>
                  <span
                    className="btn bg-mint c-negro"
                    onClick={() => {
                      setSubiendo(false);
                      setBitacora([]);
                    }}
                  >
                    <FontAwesomeIcon icon={faCheck} /> Cerrar
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className='container-fluid admin-background'>
        <Nav titulo={'Panel Administrador:'} curso={false} base={filteredTodos} btn_admin={true}></Nav>

        <div className='container pt-2 pb-2'>
          <div className='row pt-1 pb-2'>
            <div className='col-12 col-md-12 text-left'>
              {/*//24sep2025*/}
              <Link className='btn_ch bg-naranja me-1' onClick={logout} to='/' ><FontAwesomeIcon icon={faPowerOff} /> Logout</Link>
              {/*Botón de refresh manual*/}
              <span
                className={`btn_ch  me-1 ${isLoading ? 'bg-primario c-blanco' : 'bg-info'}`}
                onClick={isLoading ? null : refreshData}
                disabled={isLoading}
              >
                {isLoading ? (<>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Actualizando...
                </>) : (
                  <>
                    <FontAwesomeIcon icon={faSync} />  Actualizar
                  </>

                )}
              </span>

              <span className='btn_ch bg-mint me-1' onClick={openNewUserModal}> <FontAwesomeIcon icon={faPlus} /> Usuario</span>

              {/*//18sep2025*/}
              {/* <span className="btn_ch bg-rojo me-1'" onClick={migrarPasswords}>Migrar contraseñas a bcrypt</span> */}
              <span className='btn_ch bg-mint me-1' onClick={handleClickInputFile}> <FontAwesomeIcon icon={faUpload} /> Cargar Usuarios</span>

              <input type="file" style={{ display: 'none' }} ref={inputRef} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => {

                //const file = e.target.files[0];

                const file = e.target.files && e.target.files[0];
                if (!file) {
                  return;
                }
                readExcel(file);
                if (GConText.logs) console.log('file is', file);

                // 👇️ reset file input
                e.target.value = null;

                // 👇️ is now empty
                if (GConText.logs) console.log(e.target.files);

                // 👇️ can still access file object here
                if (GConText.logs) console.log(file);
                if (GConText.logs) console.log(file.name);

              }} />

              {/* <ExportarExcelFiltrado /> */}
              <ExportarExcelTodos />
              
              <span className='btn_ch bg-naranja me-1' onClick={() => handleId()} >{verId ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />} Id</span>
              <span className='btn_ch bg-naranja me-1' onClick={() => handleFechaAlta()}>{verFechaAlta ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />} Fecha de alta</span>
              <span className='btn_ch bg-naranja me-1' onClick={() => handleUltimaActualizacion()}>{verUltimaActualizacion ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />} Última actualización</span>
              <span className='btn_ch bg-naranja me-1' onClick={() => handleBookmark()}>{verBookmark ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />} Bookmark</span>
              <span className='btn_ch bg-naranja me-1' onClick={() => handlePassword()}>{verPassword ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />} Password</span>
              <span className='btn_ch bg-indigo c-blanco me-1' onClick={() => handleER()}>{verER? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />} ER</span>

            </div>
            <div className='col-12 col-md-12 text-left mt-3'>
              {GConText.logs && (<>
                <span className="fs-24 bold c-blanco">Debug: </span>
                <span className='btn_ch bg-indigo c-blanco me-1' onClick={debugTokenInfo}>
                  <FontAwesomeIcon icon={faCog} /> Debug Token
                </span>
                </>
              )}
            </div>
          </div>

          {/* <!-- COLUMNA 1--> */}
          <div className="col-md-12 admin-form mt-2 mb-2" >
            <div style={{ display: isActive ? 'block' : 'none' }}>

              <div className="row" >
                <div className="col-md-4 text-left">
                  <strong>🔍 Búsqueda Global:</strong>
                  <input
                    className='input-search p-2 w-100'
                    type="text"
                    placeholder="Buscar en todos los campos..."
                    value={globalSearch}
                    onChange={handleGlobalSearch}
                    style={{
                      borderRadius: '6px',
                      border: '2px solid #007bff',
                      fontSize: '16px'
                    }}
                  />
                </div>

                <div className="col-md-6 text-left">
                  <strong>Filtros específicos:</strong>
                  <div className="row">
                    <div className="col-4">
                      {/* Nombre:  */}<input className='input-search p-2 w-100' style={{
                      borderRadius: '6px',
                      border: '2px solid #007bff',
                      fontSize: '16px'
                    }}type="text" placeholder="Nombre..." onChange={findChangeNombre} />
                    </div>
                    <div className="col-4">
                      {/* Usuario:  */}<input className='input-search p-2 w-100' style={{
                      borderRadius: '6px',
                      border: '2px solid #007bff',
                      fontSize: '16px'
                    }}type="text" placeholder="Usuario..." onChange={findChangeUsuario} />
                    </div>
                    <div className="col-4">
                      {/* Grupo:  */}<input className='input-search p-2 w-100' style={{
                      borderRadius: '6px',
                      border: '2px solid #007bff',
                      fontSize: '16px'
                    }}type="text" placeholder="Grupo..." onChange={findChangeGrupo} />
                    </div>
                  </div>
                </div>
                <div className="col-md-2 text-left">
                  <strong>Filtros Status:</strong>
                  <div className="row">
                    <div className="col-12">
                      {/* Status: */}
                      {/* <select className='fs-14 p-2 b-none w-100' onChange={findStatus}>
                        <option value="">Todos</option>
                        <option value="true">Completado</option>
                        <option value="false">No completado</option>
                      </select> */}
                      {/* <select className='fs-14 p-2 b-none w-100' onChange={findStatus}>
                        <option value="">Todos los estados</option>
                        <option value="completado">Completado</option>
                        <option value="en-progreso">En Progreso</option>
                        <option value="iniciado">Iniciado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="no-iniciado">No Iniciado</option>
                      </select> */}
                      <select className='fs-14 p-2 b-none w-100' onChange={findStatus}>
                        <option value="">Todos los estados</option>
                        <option value="completado">Completado</option>
                        <option value="en-progreso">En Progreso</option>
                        <option value="no-iniciado">No Iniciado</option>
                      </select>

                    </div>
                  </div>
                </div>
              </div>

              {/* Panel de Estadísticas - Agregar después de los filtros y antes de la paginación */}
              {/* {verER ? 
              <div className="col-md-12 my-2">
                <div className="row">
                  <div className="col-md-12">
                    <div className="stats-panel" style={{
                      background: '#764ba2',
                      borderRadius: '12px',
                      padding: '15px',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <h5 style={{margin: '0 0 10px 0', textAlign: 'center'}}>
                        <FontAwesomeIcon icon={faChartBar} /> Estadísticas Rápidas
                      </h5>
                      <div className="row text-center">
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas.total}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faList} /> Total (100%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas.completados}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faCheckCircle} /> Completados ({estadisticas.porcentajeCompletados}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas.noCompletados}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faTimesCircle} /> Pendientes ({estadisticas.porcentajePendientes}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas.grupos}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faBuilding} /> Grupos
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : ''} */}

              {/* Reemplazar el panel de estadísticas existente por: */}
              {verER ? 
              <div className="col-md-12 my-2">
                <div className="row">
                  <div className="col-md-12">
                    <div className="stats-panel" style={{
                      background: '#764ba2',
                      borderRadius: '12px',
                      padding: '15px',
                      color: 'white',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                    }}>
                      <h5 style={{margin: '0 0 10px 0', textAlign: 'center'}}>
                        <FontAwesomeIcon icon={faChartBar} /> Estadísticas Rápidas
                      </h5>
                      <div className="row text-center">
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas.total}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faList} /> Total (100%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas.completado}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faCheckCircle} /> Completados ({estadisticas.porcentajeCompletados}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas['en-progreso']}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faSpinner} /> En Progreso ({estadisticas.porcentajeEnProgreso}%)
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-3">
                          <div style={{
                            background: 'rgba(255,255,255,0.2)',
                            borderRadius: '8px',
                            padding: '10px',
                            margin: '5px'
                          }}>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                              {estadisticas['no-iniciado']}
                            </div>
                            <div style={{fontSize: '16px', opacity: 1}}>
                              <FontAwesomeIcon icon={faTimesCircle} /> No Iniciados ({estadisticas.porcentajeNoIniciado}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              : null}


              {/* ✅ AGREGAR AQUÍ LA PAGINACIÓN: */}
              <div className="col-md-12 text-center my-2 flex" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <select onChange={(e) => {
                  setPaginaActual(1)
                  setItemsPorPagina(Number(e.target.value))
                }}>
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={1000}>1000</option>
                  <option value={10000}>Todos</option>
                </select>

                <div className="pagination-wrapper">
                  <ResponsivePagination
                    current={paginaActual}
                    total={totalpaginas}
                    onPageChange={setPaginaActual}
                  />
                </div>

                <span className='fs-20 c-negro'> Registros: <b>{registros}</b></span>
              </div>

              {/* Agregar después de la paginación */}
              {selectedUsers.length > 0 && (
                <div className="col-md-12 text-center mb-2">
                  <div className="alert alert-info p-3" style={{
                     
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <strong className='px-2'>{selectedUsers.length} usuarios seleccionados</strong>
                    <div className="">
                      <span 
                        className='btn_ch bg-rojo c-blanco me-2' 
                        onClick={deleteSelectedUsers}
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar seleccionados
                      </span>
                      <span 
                        className='btn_ch bg-mint c-negro' 
                        onClick={exportSelectedUsers}
                      >
                        <FontAwesomeIcon icon={faFileExport} /> Exportar seleccionados
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className='table-responsive' style={{ display: isActive ? 'block' : 'none' }} >
                <table className="table table-sm table-hover table-bordered table-striped table-responsive" ref={tableRef}>

                  <thead>
                    <tr>
                      <th scope="col">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          style={{ transform: 'scale(1.2)' }}
                        />
                      </th>
                      <th scope="col">No</th>
                      {verId ? <SortableHeader field="id">ID</SortableHeader> : ''}
                      <SortableHeader field="nombre" className="text-left">Nombre</SortableHeader>
                      <SortableHeader field="username" className="text-left">Usuario</SortableHeader>
                      <SortableHeader field="grupo" className="text-center">Grupo</SortableHeader>
                      {verPassword ? <SortableHeader field="password" className="text-left">Password</SortableHeader> : ''}
                      <SortableHeader field="type" className="text-center">Tipo</SortableHeader>
                      <SortableHeader field="status">Status</SortableHeader>
                      {verFechaAlta ? <SortableHeader field="createdAt">Fecha de alta</SortableHeader> : ''}
                      {verUltimaActualizacion ? <SortableHeader field="updatedAt">Última actualización</SortableHeader> : ''}
                      {verBookmark ? <SortableHeader field="bookmark">Bookmark</SortableHeader> : ''}
                      <th scope="col" className='w100'>Editar</th>
                      <th scope="col" className='w100'>Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>

                    {

                      itemsEstaPagina.map((option, i) => {

                        return (

                          <tr key={option.Ranking}>
                            <td className='text-center' data-label="Seleccionar">
                              <input
                                type="checkbox"
                                checked={selectedUsers.includes(option.id)}
                                onChange={(e) => handleSelectUser(option.id, e.target.checked)}
                                style={{ transform: 'scale(1.2)' }}
                              />
                            </td>
                            <th scope="row" data-label="No">{i + 1}</th>
                            {verId ? <td className='fs-14 c-negro' data-label="ID">{option.id}</td> : ''}
                            <td className='fs-14 c-negro text-left' data-label="Nombre"><span>{option.nombre}</span></td>
                            <td className='fs-14 c-negro text-left' data-label="Usuario"><span>{option.username}</span></td>
                            <td className='fs-14 c-negro text-center' data-label="Grupo"><span>{option.grupo}</span></td>
                            {verPassword ? <td className='fs-14 c-negro text-left' data-label="Password"><span>{option.password}</span></td> : ''}
                            <td className='fs-14 c-negro text-center' data-label="Tipo">
                              {option.type === 'user' ? (
                                <span className="badge bg-primary">
                                  <FontAwesomeIcon icon={faUser} /> User
                                </span>
                              ) : (
                                <span className="badge bg-warning text-dark">
                                  <FontAwesomeIcon icon={faUserShield} /> Admin
                                </span>
                              )}
                            </td>
                            <td className='fs-14 c-negro text-center' data-label="Status">
                              {(() => {
                                const status = getCourseStatus(option);
                                const config = getStatusConfig(status);
                                const progress = getProgressDetails(option);
                                
                                return (
                                  <div>
                                    <span className={`badge badge-status ${config.className}`}>
                                      <FontAwesomeIcon icon={config.icon} /> {config.label}
                                    </span>
                                    {progress.total > 0 && (
                                      <div style={{fontSize: '12px', marginTop: '1px', color: '#000'}}>
                                        {progress.completadas}/{progress.total} ({progress.porcentaje}%)
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                            {verFechaAlta ? <td className='fs-14 c-negro' data-label="Fecha de alta">{formatearFechaSimple(option.createdAt)}</td> : ''}
                            {verUltimaActualizacion ? <td className='fs-14 c-negro' data-label="Última actualización">{formatearFechaSimple(option.updatedAt)}</td> : ''}
                            {verBookmark ? <td className='fs-14 c-negro' data-label="Bookmark">{option.bookmark}</td> : ''}
                            <td className='text-center' data-label="Editar">
                              <button
                                className='btn_ch btn-warning'
                                onClick={() => openEditModal(option)}
                              >
                                <FontAwesomeIcon icon={faEdit} /> Editar
                              </button>
                            </td>

                            {/* Celda Eliminar */}
                            <td className='text-center' data-label="Eliminar">
                              <button
                                className='btn_ch btn-danger'
                                onClick={() => submitDelete(option.id, option.username, option)}
                              >
                                <FontAwesomeIcon icon={faTrash} /> Eliminar
                              </button>
                            </td>
                          </tr>


                        )
                      })
                    }
                  </tbody>

                </table>

                {/* tabla oculta para la descarga del .xlsx donde se omiten los botones de borrar y editar y las imagenes en la columna status */}
                <table className="table table-striped hide" ref={tableRef2}>

                  <thead>
                    <tr>
                      <th scope="col">No</th>
                      <th className='text-center' scope="col">Grupo</th>
                      <th className='text-left' scope="col">Nombre</th>
                      <th className='text-left' scope="col">Usuario</th>
                      <th className='text-left' scope="col">Password</th>
                      <th scope="col">Status</th>

                    </tr>
                  </thead>
                  <tbody>

                    {
                      itemsEstaPagina.map((option, i) => {
                        return (
                          <tr key={i + 1}>
                            <th scope="row">{i + 1}</th>
                            {/* <td className='fs-14 c-negro'>{option.grupo}</td> */}
                            <td className='fs-14 c-negro text-left'><span>{option.grupo}</span></td>
                            <td className='fs-14 c-negro py-2 text-left'><span>{option.nombre}</span></td>
                            <td className='fs-14 c-negro text-left'><span>{option.username}</span></td>
                            <td className='fs-14 c-negro text-left'><span>{option.password}</span></td>
                            <td className='fs-14 c-negro'>
                              <span>{option.status === true ? 'completado' : 'no completado'}</span>
                            </td>

                          </tr>

                        )
                      })
                    }

                  </tbody>
                </table>
              </div>
            </div>

            <div className='table-responsive py-2' style={{ display: isActive ? 'none' : 'block' }}>
              <table className="table table-striped" >
                <thead>
                  <tr>
                    <th scope="col">Grupo</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Username</th>
                    <th scope="col">Password</th>

                  </tr>
                </thead>
                <tbody>
                  {items.map((d, i) => (
                    <tr key={i}>
                      <th>{d.grupo}</th>
                      <td>{d.nombre}</td>
                      <td className={d.ajusteUsername ? 'bg-amarillo' : ''}>{d.username}</td>
                      <td>{d.password}</td>

                    </tr>
                  ))}
                </tbody>
              </table>

              <span className='btn bg-mint c-negro me-2 ' onClick={() => submitUpload()} ><FontAwesomeIcon icon={faUpload} /> Subir</span>
              <span className='btn bg-secundario c-blanco me-2 ' onClick={() => setIsActive(true)} ><FontAwesomeIcon icon={faCancel} /> Cancelar</span>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Admin