/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';

//v2025-01
import useInactivity from '../Components/checarinteractividad';

import { useNavigate } from 'react-router-dom';
import { VarContext } from '../Context/VarContext';

import { useCookies } from 'react-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'

import { useSwipeable } from "react-swipeable";
import Swal from 'sweetalert2'

import { showToast } from '../Components/Toast';
import toast from 'react-hot-toast'; // Para toast.dismiss()

import './Introduccion.css';

import * as Img from '../Components/Imagenes'
import Nav from '../Components/Nav'

//para logout
import { logout } from '../utils/auth';


const Introduccion = () => {

	const GConText = useContext(VarContext);

	useEffect(() => {
	// ✨ Precargar el contenido del iframe
	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.href = APP_CONTENT;
	document.head.appendChild(link);
	
	return () => document.head.removeChild(link);
	}, []);

	// Agregar al inicio de Introduccion.js
	//if (GConText.logs) console.log('Content URL:', process.env.REACT_APP_CONTENT);
	if (GConText.logs) console.log('Todas las variables:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

	const contentUrl = process.env.NODE_ENV === 'development'
		? '/sco01_SCORM_plataforma/index.html'  // ← Cuando ejecutas npm start
		: process.env.REACT_APP_CONTENT;  // ← Cuando haces npm run build

	if (GConText.logs) console.log('Modo actual:', process.env.NODE_ENV);
	if (GConText.logs) console.log('URL del curso:', contentUrl);

	//if (GConText.logs) console.log(process.env.REACT_APP_CONTENT)
	const APP_CONTENT = contentUrl;
	//const navigate = useNavigate();


	const ref2 = useRef();
	const [estado, setEstado] = useState(true);

	function refreshPage() {
		window.location.reload(false);
	}

	// Función para manejar tokens expirados
	const handleTokenExpiration = (response) => {
	if (GConText.logs) console.log('🔍 [Usuario] Verificando token - Status:', response.status);
	
	if (response.status === 401 || response.status === 403) {
		if (GConText.logs) console.log('🔒 [Usuario] Token expirado detectado - Ejecutando logout');
		
		showToast.error("⚠️ SESIÓN EXPIRADA - Redirigiendo al login...", {
		duration: 2000
		});
		
		// Limpiar almacenamiento
		if (GConText.logs) console.log('🧹 [Usuario] Limpiando almacenamiento...');
		sessionStorage.clear();
		localStorage.clear();
		
		// Limpiar contexto si está disponible
		if (typeof GConText !== 'undefined' && GConText.resetAll) {
		GConText.resetAll();
		}
		
		// Logout inmediato
		if (GConText.logs) console.log('🚪 [Usuario] Ejecutando logout inmediato...');
		logout();
		
		return true;
	}
	return false;
	};

	// Wrapper para llamadas API
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


	const udpatesUser = async (userId, bookmark, status, mensaje) => {
		if (GConText.logs) console.log('----> ✅ ~ ⭐udpatesUser (API):', userId);

		try {
			// Actualizar en la base de datos via API
			const token = sessionStorage.getItem('accessToken');
			/* const response = await fetch(`${process.env.REACT_APP_API_BASE}/update-bookmark`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				credentials: 'include',
				body: JSON.stringify({
					bookmark,
					status: mensaje === 'Completar!' || mensaje === 'Restart!' ? status : undefined
				})
			}); */
			// ✨ Usar apiCall en lugar de fetch directo
			const response = await apiCall(`${process.env.REACT_APP_API_BASE}/update-bookmark`, {
			method: 'PUT',
			body: JSON.stringify({ 
				bookmark, 
				status: mensaje === 'Completar!' || mensaje === 'Restart!' ? status : undefined 
			})
			});

			if (response.ok) {
				if (GConText.logs) console.log('----> ✅ Bookmark actualizado en base de datos');

			} else {
				if (GConText.logs) console.error('❌ Error actualizando bookmark:', response.status);
			}
		} catch (error) {
			if (GConText.logs) console.error('❌ Error en API:', error);
			if (!error.message.includes('Token expirado')) {
			showToast.error('Error actualizando progreso');
			}
		}

		// Actualizar contexto local siempre
		GConText.setBookmark(bookmark);
		if (mensaje === 'Completar!' || mensaje === 'Restart!') {
			GConText.setStatus(status === 'true');
		}

		if (GConText.logs) console.log('----> ✅ Contexto actualizado');
	};

	function minutos(m) {
		return m * 60 * 1000;
	}

	//const isUserInactive = useInactivity(10000); // 10 seconds
	//const [isUserInactive, resetTimer] = useInactivity(10000);
	const [isUserInactive, resetTimer] = useInactivity(minutos(60));

	const completionMessageShown = useRef(false);

	useEffect(() => {

		if (isUserInactive) {
			//removeAuth('idUser');
			logout()
			// Puedes mostrar un mensaje o redirigir si lo deseas
			//navigate('/'); // Cambia '/login' por la ruta de tu login si es diferente
		}
	}, [isUserInactive]);


	// This hook is listening an event that came from the Iframe
	useEffect(() => {

		const handler = (ev) => {

			try {
				JSON.parse(ev.data);
			} catch (e) {
				return false;
			}

			const data = JSON.parse(ev.data)

			if (data && data.tipo === 'actividad-iframe') {
				resetTimer({ type: 'iframe' });
			}

			if (data && data.message) {
				if (GConText.logs) console.log("🟣↩︎ ~Datos que llegan desde el Curso! ----->")
				//if (GConText.logs) console.log("🟣↩︎ ~Datos que llegan desde el Curso! ----->", data)
				if (GConText.logs) console.log("🟣↩︎ ~ data.message:", data.message)
				//if (GConText.logs) console.log("🟣↩︎ ~ data.completado:", data.completado)
				if (GConText.logs) console.log("🟣↩︎ ~ data.bookmark:", data.bookmark)
				if (GConText.logs) console.log("~ ------------------------")
				if (GConText.logs) console.log("🟠↩︎ ~Datos que estaban almacenados en la BaseDeDatos! ----->")
				if (GConText.logs) console.log("🟠 ~ GConText.status:", GConText.status)
				//if (GConText.logs) console.log("🟠 ~ GConText.bookmark:", GConText.bookmark)
				//if (GConText.logs) console.log("🟠 ~ GConText.bookmark:", userBookmark)
				//if (GConText.logs) console.log("🟠 ~ GConText.userId:", GConText.userId)
				if (GConText.logs) console.log("~ ------------------------")

				//if (GConText.logs) console.log(data.completado, " -- ", GConText.userId, " -- ", data.bookmark)
				//if (GConText.logs) console.log("terminoLamina--- ", terminoLamina)

				if (GConText.logs) console.log('GConText.userId:', GConText.userId); // ← Verificar que no sea undefined

				if (!GConText.userId) {
					if (GConText.logs) console.error('❌ No hay userId en el contexto');
					return;
				}

				// Ignorar el mensaje de confirmación BookmarkApplied
				if (data.message === 'BookmarkApplied') {
					if (GConText.logs) console.log("----> ✅ Confirmación de bookmark aplicado - curso listo");
					setCourseReady(true); // ✨ Marcar curso como listo
					return; // ← No procesar este mensaje
				}

				if (data.message === 'Completar!') {

					udpatesUser(GConText.userId, data.bookmark, 'true', 'Completar!')
					setEstado(true)

					// ✨ Solo mostrar una vez por sesión
					if (!completionMessageShown.current) {
						Swal.fire({
							title: '<strong>Curso Completado!</strong>',
							html: `<i> ${GConText.nombre}, haz completado completado el curso</i>`,
							icon: "success",
							showConfirmButton: false,
							timer: 4000
						});

						completionMessageShown.current = true;
						if (GConText.logs) console.log('Mensaje mostrado, estado cambiado a true');
					} else {
						if (GConText.logs) console.log('Mensaje ya mostrado anteriormente');
					}

				} else if (data.message === 'Avance!') {

					udpatesUser(GConText.userId, data.bookmark, 'false', 'Avance!')
					setEstado(true)

					/* Swal.fire({
						title: '<strong>Avance Guardado!</strong>',
						html: `<i> ${GConText.nombre}, Se guardo tu avance en el curso</i>`,
						icon: "success",
						showConfirmButton: false,
						timer: 4000
					}); */

				} else if (data.message === 'Error!') {

					setEstado(false)

					Swal.fire({
						title: '<strong>Error de comunicación con el servidor!</strong>',
						html: `<i> ${GConText.nombre}, intenta mas tarde</i>`,
						icon: "error",
						showConfirmButton: true
					});

				} else if (data.message === 'Restart!') {

					udpatesUser(GConText.userId, data.bookmark, 'false', 'Restart!')

					/* setEstado(false)
	
					Swal.fire({
						title: '<strong>Error de comunicación con el servidor!</strong>',
						html: `<i> ${GConText.nombre}, intenta mas tarde</i>`,
						icon: "error",
						showConfirmButton: true
					}); */

					refreshPage();

				}
			}

			return true;
		}


		window.addEventListener('message', handler)
		// Don't forget to remove addEventListener

		return () => {
			window.removeEventListener('message', handler);
		}

		//return () => window.removeEventListener('message', handler)

	}, [resetTimer/* CookieId.idUser, GConText.bookmark, GConText.nombre, GConText.status, GConText.userId, chkUser, udpatesUser */])


	const [dataRedy, setdataRedy] = useState(false);
	const [userBookmark, setUserBookmark] = useState(null);
	const [courseReady, setCourseReady] = useState(false); // ✨ Nuevo estado

	// 🔒 SEGURIDAD: Cargar bookmark via API, NO DataStore
	useEffect(() => {
		const loadBookmarkFromAPI = async () => {
			if (!GConText.userId) {
				if (GConText.logs) console.log('----> ⏳ Esperando userId...');
				return;
			}

			try {
				if (GConText.logs) console.log('----> 🔄 Cargando bookmark via API...');

				const token = sessionStorage.getItem('accessToken');
				/* const response = await fetch(`${process.env.REACT_APP_API_BASE}/get-bookmark`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${token}`
					},
					credentials: 'include'
				}); */
				/* const response = await apiCall(`${process.env.REACT_APP_API_BASE}/get-bookmark`, {
				  method: 'GET'
				}); */
				
				// ✨ Usar Promise.race para timeout
				const response = await Promise.race([
					apiCall(`${process.env.REACT_APP_API_BASE}/get-bookmark`, {
					method: 'GET'
					}),
					new Promise((_, reject) => 
					setTimeout(() => reject(new Error('Timeout')), 3000)
					)
				]);

				if (response.ok) {
					const data = await response.json();
					if (GConText.logs) console.log('----> ✅ Bookmark cargado via API:', data.bookmark);

					// Actualizar contexto y estado local
					GConText.setBookmark(data.bookmark || 'empty');
					GConText.setStatus(data.status || false);
					setUserBookmark(data.bookmark || 'empty');
				} else {
					if (GConText.logs) console.log('⚠️ Error cargando bookmark, usando contexto');
					//setUserBookmark(GConText.bookmark || 'empty');
				}

				setdataRedy(true);

			} catch (error) {
				if (GConText.logs) console.error('❌ Error cargando bookmark:', error);
				// ✨ Usar bookmark del contexto inmediatamente
				setUserBookmark(GConText.bookmark || 'empty');
				//setdataRedy(true);
			} finally {
				setdataRedy(true); // ✨ Siempre marcar como listo
			}
		};

		loadBookmarkFromAPI();
	}, [GConText.userId]);


	useEffect(() => {
		if (GConText.logs) console.log('----> 🟡 useEffect ejecutándose:', { dataRedy, iframe: !!ref2.current, userId: GConText.userId });

		if (!dataRedy || !ref2.current) {
			if (GConText.logs) console.log('----> ⏳ Esperando datos o iframe...', { dataRedy, iframe: !!ref2.current });
			return;
		}

		const iframe = ref2.current;
		let messageSent = false;

		const handleLoad = () => {
			if (messageSent) return;

			const sendData = () => {
				if (messageSent) return;
				messageSent = true;
				if (GConText.logs) console.log('----> 📤 Enviando datos al curso');

				const dataToSend = {
				userId: GConText.userId,
				message: "FromPlatform!",
				bookmark: userBookmark || GConText.bookmark || 'empty'
				};

				if (GConText.logs) console.log('----> 📦 Datos enviados:', dataToSend);
				iframe.contentWindow.postMessage(JSON.stringify(dataToSend), '*');
			};

			// ✨ Esperar un poco después del load para que Angular se inicialice
			if (GConText.logs) console.log('----> 🎯 Iframe cargado, esperando inicialización...');

			// ✨ Simplificado: sabemos que siempre es cross-origin
			if (GConText.logs) console.log('----> ⚠️ Cross-origin detectado, enviando en 1200ms');
			setTimeout(sendData, 1200); // ✨ 1 segundo después del load
		};

		iframe.addEventListener('load', handleLoad);

		// Si el iframe ya está cargado
		/* if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
			handleLoad();
		} */

		return () => {
			iframe.removeEventListener('load', handleLoad);
		};

	}, [dataRedy, userBookmark, GConText.userId]);

	return (
		<>
			{/* <p>User is active.</p> */}
			<div className="container-fluid introduccion-background" style={{
				//maxWidth: 640,
				margin: '0px',
				//minHeight: '100vh',
				padding: '0px'
				//overflow: "hidden",
			}}>
				{/* <Nav titulo={"Introduccion"} curso={true}></Nav> */}
				<Nav
					titulo={"Introduccion"}
					curso={true}
					userStatus={{
						bookmark: GConText.bookmark,
						status: GConText.status
					}}
				></Nav>

				{/* <span className='fs-10 position-absolute bottom-0 end-0 p-1'>{GConText.version}</span> */}

				{/* <div style={{ width: "100%" }}> */}
				<div className='container-fluid' style={{
					//maxWidth: 640,
					margin: '0px',
					//minHeight: '100vh',
					padding: '0px'
					//overflow: "hidden",
				}}>
					<div className='row'>
						<div className='col-12 col-md-12 text-center'>

							{!dataRedy ? (
							  // Spinner inicial: cargando datos
							  <div style={{
							    display: 'flex',
							    flexDirection: 'column',
							    justifyContent: 'center',
							    alignItems: 'center',
							    height: 'calc(100vh - 50px)',
							    color: 'white'
							  }}>
							    <span className="spinner-border spinner-border-lg mb-3" role="status"></span>
							    <div>Cargando datos...</div>
							  </div>
							) : (
							  <>
							    {/* ✨ Mostrar spinner sobre el iframe hasta que el curso esté listo */}
							    {!courseReady && (
							      <div style={{
						    		display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									height: 'calc(100vh - 50px)',

							        color: 'white',
							        zIndex: 1000
							      }}>
							        <span className="spinner-border spinner-border-lg mb-3" role="status"></span>
							        <div>Inicializando curso...</div>
							      </div>
							    )}
							    
							    {/* ✨ Iframe siempre renderizado cuando dataRedy es true */}
							    <iframe
							      className={`${estado ? '' : 'disabled'} col-12 col-md-12 text-left`}
							      ref={ref2}
							      autoFocus={true}
							      id="myFrame3"
							      src={APP_CONTENT}
							      scrolling="yes"
							      frameBorder="0"
							      loading='eager'
							      onLoad={() => {
							        if (GConText.logs) console.log('📱 Iframe cargado completamente');
							      }}
							      style={{
							        width: '100%',
							        height: (GConText.pruebas ? ' calc(100vh - 110px)' : 'calc(100vh - 50px)'),
							        willChange: 'transform',
							        backfaceVisibility: 'hidden'
							      }}
							    />
							  </>
							)}

							{/* {terminoLamina ? <h1><button onClick={onClick}>🔜 Siguiente Lamina </button></h1> : <></>} */}
							{/* <button onClick={onClick}>{paused ? "Unpause" : "Pause"}</button> */}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Introduccion