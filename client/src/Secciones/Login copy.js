import React, { useContext, useState, useEffect, useInput } from 'react';
import { VarContext } from '../Context/VarContext';
import { Link, Navigate, useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
//import { faEdit, faTrash, faSave, faUpload, faDownload, faFileArrowDown, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { faEyeSlash, faEye,  } from '@fortawesome/free-solid-svg-icons'


import '../fonts/fonts.css'
import './Login.css';

import * as Img from '../Components/Imagenes'
//import Nav from '../Components/Nav'

// Encriptar contraseñas
//import bcrypt from 'bcryptjs';

const Login = ({ props }) => {
	const GConText = useContext(VarContext);
	const navigate = useNavigate();

	// ✨ Estado para evitar flash de login
	const [isCheckingAuth, setIsCheckingAuth] = useState(true);

	// ✨ Optimización 6: Log helper para producción
	const log = GConText.logs ? console.log : () => { };
	const logError = GConText.logs ? console.error : () => { };

	// ✨ Función centralizada para redirección
	const redirectUser = (userType) => {
		const routes = {
			'admin': '/admin',
			'user': '/introduccion'
		};

		//const route = routes[userType] || '/introduccion'; // Default a usuario normal
		//navigate(route, { replace: true }); // replace: true evita volver atrás

		//mas eficiente
		navigate(routes[userType] || '/introduccion', { replace: true });

	};

	const [loginAttempts, setLoginAttempts] = useState(0);

	const [errorLogin, setErrorLogin] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const [isBlocked, setIsBlocked] = useState(false);
	const [blockMessage, setBlockMessage] = useState('');
	const MAX_ATTEMPTS = 5;

	const userInput = React.useRef();
	const passInput = React.useRef();
	const clearPass = () => (passInput.current.value = "");

	const [todos, setTodos] = useState([])


	/* const UserChange = (event) => {
		log(event.target.value);
		//setNombre(event.target.value);
		GConText.setUsername(event.target.value.toLowerCase());
	} */

	/* const PassChange = (event) => {
		log(event.target.value);
		//setNombre(event.target.value);
		GConText.setPassword(event.target.value);
	} */

	// ✨ Usar estado local para validación inmediata
	const [formData, setFormData] = useState({ username: '', password: '' });
	const [isFormValid, setIsFormValid] = useState(false);

	const UserChange = (event) => {
		const username = event.target.value.toLowerCase();
		const newFormData = { ...formData, username };

		setFormData(newFormData);
		GConText.setUsername(username);

		// Validación inmediata con datos locales
		const isValid = username.length >= 3 && newFormData.password.length >= 6;
		setIsFormValid(isValid);
	};

	const PassChange = (event) => {
		const password = event.target.value;
		const newFormData = { ...formData, password };

		setFormData(newFormData);
		GConText.setPassword(password);

		// Validación inmediata con datos locales
		const isValid = newFormData.username.length >= 3 && password.length >= 6;
		setIsFormValid(isValid);
	};

	const setTimeoutImg = () => {
		//setVerImg(true)
		setTimeout(() => {
			//setVerImg(false)
			//setPass(false)
			//setUser(false)
			setErrorLogin(false)

		}, 4000);
	}

	const handleKeyDown = (event) => {
		if (event.key === 'Enter') {
			chkLogin();
			log('do validate')
		}
	}

	// Validación de entrada para prevenir XSS
	const validateInput = (input) => {
		return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
	};


	const API_BASE = process.env.REACT_APP_API_BASE;
	log(API_BASE); // Debe mostrar la URL correcta

	//PRODUCTIVO
	// Refresca el accessToken usando el refreshToken (cookie httpOnly)
	const refreshAccessToken = async () => {
		try {
			const res = await fetch(`${API_BASE}/refresh`, {
				method: 'POST',
				credentials: 'include'
			});
			if (!res.ok) return false;
			const data = await res.json();
			if (data.accessToken) {
				sessionStorage.setItem('accessToken', data.accessToken);
				return true;
			}
			return false;
		} catch (err) {
			return false;
		}
	};

	// Debug
	/* const refreshAccessToken = async () => {
	try {
		// Obtener refreshToken del localStorage
		const refreshToken = localStorage.getItem('refreshToken');
		if (!refreshToken) return false;

		const res = await fetch(`${API_BASE}/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ refreshToken }), // Enviar en el body
		credentials: 'include'
		});
		
		if (!res.ok) return false;
		const data = await res.json();
		if (data.accessToken) {
		sessionStorage.setItem('accessToken', data.accessToken);
		return true;
		}
		return false;
	} catch (err) {
		return false;
	}
	}; */



	// Wrapper para llamadas protegidas que renueva el accessToken si expira
	const apiFetch = async (path, opts = {}) => {
		const token = sessionStorage.getItem('accessToken');
		const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
		if (token) headers['Authorization'] = `Bearer ${token}`;

		let res = await fetch(`${API_BASE}${path}`, {
			...opts,
			headers,
			credentials: 'include'
		});

		if (res.status === 401) {
			const ok = await refreshAccessToken();
			if (!ok) throw new Error('Not authenticated');
			const newToken = sessionStorage.getItem('accessToken');
			headers['Authorization'] = `Bearer ${newToken}`;
			res = await fetch(`${API_BASE}${path}`, {
				...opts,
				headers,
				credentials: 'include'
			});
		}

		return res;
	};

	/* const obtenerPerfil = async () => {
	const token = sessionStorage.getItem('accessToken');
	const res = await fetch(`${API_BASE}/perfil`, {
		method: 'GET',
		headers: { 'Authorization': `Bearer ${token}` },
		credentials: 'include'
	});
	if (!res.ok) throw new Error('No autenticado');
	return await res.json();
	}; */

	const obtenerPerfil = async () => {
		const res = await apiFetch('/perfil', { method: 'GET' });
		if (!res.ok) throw new Error('No autenticado');
		return await res.json();
	};

	const [isLoading, setIsLoading] = useState(false);

	const chkLogin = async () => {

		// Prevenir múltiples ejecuciones
		if (isLoading) {
			log('Login ya en progreso, ignorando...');
			return;
		}

		if (loginAttempts >= MAX_ATTEMPTS) {
			//alert('Has superado el número máximo de intentos. Intenta más tarde.');
			//setTimeout(() => setLoginAttempts(0), 300000); // 5 minutos
			setIsBlocked(true);
			setBlockMessage('Has superado el número máximo de intentos. Intenta más tarde.');
			setTimeout(() => {
				setLoginAttempts(0);
				setIsBlocked(false);
				setBlockMessage('');
			}, 300000); // 5 minutos
			return;
		}

		log('=== INICIANDO LOGIN ===', new Date().toISOString());
		setIsLoading(true); // ← Activar loading


		// Sanitizar los datos antes de usarlos
		const usernameSanitized = validateInput(GConText.username);
		//const passwordSanitized = validateInput(GConText.password);
		const passwordSanitized = GConText.password; // No sanitizar la contraseña

		log("🚀 ~ usernameSanitized:", usernameSanitized)
		log("🚀 ~ passwordSanitized", passwordSanitized)

		// ✨ Crear AbortController para timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => {
			controller.abort();
			log('⏰ Login timeout - cancelando petición');
		}, 10000); // 10 segundos timeout


		  //console.time('⏱️ Login total');
  		  //console.time('🌐 Fetch request');

		try {
			const res = await fetch(`${API_BASE}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					username: usernameSanitized,
					password: passwordSanitized,
					includeProfile: true // ✨ Pedir perfil en la misma llamada
				}),
				credentials: 'include',
				signal: controller.signal // ✨ Agregar signal para timeout
			});

			// ✨ Limpiar timeout si la petición fue exitosa
			clearTimeout(timeoutId);

			if (!res.ok) {
				setErrorLogin(true);
				setErrorMessage('No se puede iniciar sesión, por favor verifica tu correo electrónico y contraseña.')
				setLoginAttempts(loginAttempts + 1);
				//clearPass();
				setTimeoutImg();
				return;
			}

			//console.timeEnd('🌐 Fetch request');
    		//console.time('📦 JSON parse');
			const data = await res.json();

			//console.timeEnd('📦 JSON parse');
    		//console.timeEnd('⏱️ Login total');

			//log("🚀 ~ data:", data)

			// ✨ Verificar si el backend devuelve el perfil
			if (data.user) {
				log("🚀 ~ si existe user:", data.user);
				// ✅ OPTIMIZADO: Una sola llamada con token Y perfil
				sessionStorage.setItem('accessToken', data.accessToken);

				// Guardar datos directamente sin llamada adicional
				GConText.setUserId(data.user.id);
				GConText.setNombre(data.user.nombre);
				GConText.setType(data.user.type);
				GConText.setBookmark(data.user.bookmark);

				setLoginAttempts(0);
				setErrorLogin(false);

				// Redirección inmediata
				redirectUser(data.user.type);

			} else {
				// ❌ FALLBACK: Si el backend no devuelve perfil, usar método anterior
				sessionStorage.setItem('accessToken', data.accessToken);

				try {
					log('Obteniendo perfil por separado...');
					const perfil = await obtenerPerfil();

					GConText.setUserId(perfil.perfil.id);
					GConText.setNombre(perfil.perfil.nombre);
					GConText.setType(perfil.perfil.type);
					GConText.setBookmark(perfil.perfil.bookmark);

					setLoginAttempts(0);
					setErrorLogin(false);

					redirectUser(perfil.perfil.type);

				} catch (err) {
					console.error('Error obteniendo perfil:', err);
					sessionStorage.removeItem('accessToken');
					setErrorLogin(true);
					setErrorMessage('No se puede iniciar sesión, por favor verifica tu correo electrónico y contraseña.')
				}
			}

		} catch (err) {
			// ✨ Limpiar timeout en caso de error
			clearTimeout(timeoutId);
			console.timeEnd('🌐 Fetch request');
			console.timeEnd('⏱️ Login total');
			// ✨ Manejar error de timeout específicamente
			if (err.name === 'AbortError') {
				log('⏰ Login cancelado por timeout');
				//alert('La conexión está tardando demasiado. Intenta de nuevo.');

				setBlockMessage('La conexión está tardando demasiado. Intenta de nuevo.');
				setIsBlocked(true);
				setTimeout(() => {
					setIsBlocked(false);
					setBlockMessage('');
				}, 5000); // 5 segundos

			} else {
				logError('Error en login:', err);
			}

			setErrorLogin(true);
			setErrorMessage('No se puede iniciar sesión, por favor verifica tu correo electrónico y contraseña.')
			setLoginAttempts(loginAttempts + 1);
			//clearPass();
			setTimeoutImg();
		} finally {
			// ✨ Asegurar que el timeout se limpia siempre
			clearTimeout(timeoutId);
			setIsLoading(false);
		}
	};

// Agregar estado para mostrar/ocultar password
const [showPassword, setShowPassword] = useState(false);

// Función para toggle
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};


	useEffect(() => {
		const checkAuthStatus = async () => {
			const token = sessionStorage.getItem('accessToken');

			if (token) {
				try {
					// Verificar si el token está expirado ANTES de hacer la llamada
					const payload = JSON.parse(atob(token.split('.')[1]));
					const now = Math.floor(Date.now() / 1000);

					if (payload.exp < now) {
						// Token expirado, limpiar
						log('Token expirado, limpiando...');
						sessionStorage.removeItem('accessToken');

						// Intentar refresh si existe
						const refreshToken = localStorage.getItem('refreshToken');
						if (refreshToken) {
							const refreshSuccess = await refreshAccessToken();
							if (refreshSuccess) {
								const perfil = await obtenerPerfil();

								GConText.setUserId(perfil.perfil.id);
								GConText.setNombre(perfil.perfil.nombre);
								GConText.setType(perfil.perfil.type);
								GConText.setBookmark(perfil.perfil.bookmark);

								redirectUser(perfil.perfil.type);
								return;
							}
						}

						localStorage.removeItem('refreshToken');
						// ✨ AGREGAR ESTA LÍNEA - Mostrar login cuando no hay refresh o falló
						setIsCheckingAuth(false);
						return;
					}

					// Token válido, obtener perfil y redirigir
					const perfil = await obtenerPerfil();

					GConText.setUserId(perfil.perfil.id);
					GConText.setNombre(perfil.perfil.nombre);
					GConText.setType(perfil.perfil.type);
					GConText.setBookmark(perfil.perfil.bookmark);

					redirectUser(perfil.perfil.type);

				} catch (err) {
					// Token inválido, limpiar
					sessionStorage.removeItem('accessToken');
					localStorage.removeItem('refreshToken');
					// ✨ AGREGAR ESTA LÍNEA - Mostrar login cuando hay error
					setIsCheckingAuth(false);
				}
			} else {
			  // ✨ No hay token, mostrar login inmediatamente
  			  setIsCheckingAuth(false);
			}
		};
		// ✨ Solo ejecutar UNA VEZ al montar el componente
		checkAuthStatus();
	}, []); // ← Sin dependencias = solo se ejecuta una vez

	if (isCheckingAuth) {
	return (
		<div className="container login-background" style={{
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100vh'
		}}>
		<div style={{ textAlign: 'center', color: 'white' }}>
			<div className="spinner-border mb-3" role="status"></div>
			<div>Verificando sesión...</div>
		</div>
		</div>
	);
	}
	return (
		<>
			{/* <div className="container fondo-rosa" style={{ backgroundImage: `url(${background})` }}> */}
			<div className="container login-background">

				{/* <Nav titulo={"login"}></Nav> */}

				<span className='oro fs-10 position-absolute bottom-0 end-0 p-1'>{GConText.version}</span>

				<div className="LoginForm">
					<div className="col-12 col-lg-8 offset-lg-2 col-md-8 offset-md-2 col-sm-8 offset-sm-2">
						<div className='login-form'>

							<div className="col-12">
								<div className="d-flex justify-content-around pt-4">
									<img src={Img.Logo_rojo} alt="" width="100"></img>
								</div>
							</div>

							{/* <div className="col-6">
								<div className="pt-4 pb-2">
								</div>
							</div> */}

							<div className="col-12 top-login">
								<div className="mt-5 c-brown txt-bld fs-32 lh-35 p-2">
									<img src={Img.Logo} alt="" width="200"></img>
								</div>
							</div>

							<div className="col-12 c-brown txt-reg fs-24">
								<div className="mt-4 text-login">
									Iniciar sesión
								</div>
							</div>

							<div className="mt-3">
								<div className="container">
									<div className="row">
										<div className="col-6 offset-1 col-md-6 offset-md-1 col-sm-6 offset-sm-1 text-left ">
											<label className="c-brown txt-bld fs-12">Correo Electrónico:</label>
										</div>
										<div className="col-4 col-md-4 col-sm-4 text-right align-self-center ">
											{/* <span style={{ display: user === false && verImg === true ? 'block' : 'none' }} className="fs-10 c-rojo">Usuario no existe</span> */}
										</div>

										<div className='col-10 offset-1 align-self-center border-vino text-center'>
											<div className='row'>
												<div className="col-12 col-sm-10 col-md-10 align-self-center text-center ">
													<input type="text" onChange={UserChange} ref={userInput} onKeyDown={handleKeyDown} className="fs-16 form-control-login" placeholder="Usuario"></input>
												</div>
												<div className="d-none d-sm-block col-sm-2 col-md-2 align-self-center text-center ">
													{/* <img src={user === false ? Img.mal : Img.bien} style={{ display: verImg === true ? 'block' : 'none' }} alt="retro" width="30"></img> */}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>


							<div className="mt-3">
								<div className="container">
									<div className="row">
										<div className="col-6 offset-1 col-md-6 offset-md-1 col-sm-6 offset-sm-1 text-left ">
											<label className="c-brown txt-bld fs-12">Contraseña:</label>
										</div>
										<div className="col-4 col-md-4 col-sm-4 text-right align-self-center ">
											{/* <span style={{ display: pass === false && verImg === true ? 'block' : 'none' }} className="fs-10 c-rojo">Contraseña incorrecta</span> */}
										</div>

										<div className='col-10 offset-1 align-self-center border-vino text-center'>
										  <div className='row'>
										    <div className="col-10 col-sm-10 col-md-10 align-self-center text-center">
										      <input 
										        type={showPassword ? "text" : "password"} 
										        onChange={PassChange} 
										        ref={passInput} 
										        onKeyDown={handleKeyDown} 
										        className="fs-16 form-control-login" 
										        placeholder="Contraseña"
										      />
										    </div>
										    <div className="col-2 col-sm-2 col-md-2 align-self-center text-center">
										      <button 
										        type="button"
										        onClick={togglePasswordVisibility}
										        className="btn btn-link p-0"
										        style={{ border: 'none', background: 'none', color: '#8B4513' }}
										      >
												<FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
										      </button>
										    </div>
										  </div>
										</div>
										{/* <div className='col-10 offset-1 align-self-center border-vino text-center'>
											<div className='row'>
												<div className="col-12 col-sm-10 col-md-10 align-self-center text-center ">
													<input type="password" onChange={PassChange} ref={passInput} onKeyDown={handleKeyDown} className="fs-16  form-control-login" placeholder="Contraseña"></input>
												</div>
											</div>
										</div> */}
									</div>
								</div>
							</div>

							<div className="py-3">
								{/* ✨ Mensaje de error login */}
								<span style={{ display: errorLogin ? 'block' : 'none' }} className="fs-18 py-3 c-rojo">
									{errorMessage}
								</span>
								{/* ✨ Mensaje de bloqueo/timeout */}
								<div style={{ display: isBlocked ? 'block' : 'none' }} className="fs-18 py-3 c-rojo">
									{blockMessage}
								</div>

								<span
									className={`btn bg-amarillo ${!isFormValid ? 'disabled' : ''}`}
									onClick={isFormValid ? chkLogin : null}
									style={{
										pointerEvents: (isLoading || !isFormValid) ? 'none' : 'auto',
										opacity: !isFormValid ? 0.6 : 1
									}}
									disabled={isLoading || !isFormValid}
								>{isLoading ? (
									<>
										<span className="spinner-border spinner-border-sm me-2" role="status"></span>
										Ingresando...
									</>
								) : (
									'Ingresar'
								)}</span>
							</div>

							{/* <div className="col-12 col-md-12 mt-4">
								<Link  to="/ranking" ><h1 className='fs-18 c-rojo'>Ver Ranking</h1></Link>
							</div>	 */}

						</div>
					</div>
				</div>
			</div>
		</>

	)
}
export default Login