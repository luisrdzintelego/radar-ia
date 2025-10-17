import React, { useContext } from 'react';
//v2025-01
import { VarContext } from '../Context/VarContext';
import { Link } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faQuestion, faFileArrowDown, faPlus, faTimes, faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faCheckCircle, faSpinner, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import './Nav.css';
import * as Img from '../Components/Imagenes'

import Logo_femsa from "../Img/femsa/logo_femsa_bco.png"
import Logo_universidad from "../Img/femsa/logo_universidad.png"
import logo_universidad_movil from "../Img/femsa/logo_universidad_movil.png"

//para logout
import { logout } from '../utils/auth';

const Nav = ({ titulo, btn_admin, btn_dash, curso, userStatus }) => {

	const GConText = useContext(VarContext);

	const getSimpleStatus = () => {
		if (!userStatus?.bookmark || userStatus.bookmark === '' || userStatus.bookmark === 'empty') {
			return {
				label: 'No Iniciado',
				className: 'badge-no-iniciado',
				icon: faTimesCircle
			};
		}

		if (userStatus.status === true) {
			return {
				label: 'Completado',
				className: 'badge-completado',
				icon: faCheckCircle
			};
		}

		return {
			label: 'En Progreso',
			className: 'badge-en-progreso',
			icon: faSpinner
		};
	};

	return (
		<>
			{/* <nav className="navbar navbar-expand-lg navbar-light bg-light"> */}
			<div className="container Nav-bar" >
				<div className="row">
					<div style={{ display: btn_admin === true ? 'block' : 'none' }} className="col-12">
						<div className="row hr" style={{ padding: '10px' }}>

							<div className="col-6 col-md-6 text-left">
								<img src={Logo_femsa} alt="" className='logo'></img>
							</div>
							<div className="col-6 col-md-6 text-right">
								<img src={Logo_universidad} alt="" className='logo_universidad'></img>
							</div>

						</div>
					</div>

					<div style={{ display: curso === true ? 'block' : 'none' }} className={`col-12 col-md-12 text-left`}>

						<div className="row" style={{ padding: '10px' }}>

							<div className="col-3 col-md-3 align-self-center text-left">
								<img src={Logo_femsa} alt="" className='logo'></img>
							</div>

							<div className={`col-7 col-md-7 align-self-center text-center flex justify-content-around`}>
								
								<Link className='btn_ch bg-naranja me-1' onClick={logout} to='/' ><FontAwesomeIcon icon={faPowerOff} /> Logout</Link>

								{/* <h1 className='status  c-blanco'>{GConText.status ? '🟢 Completado' : '🟣 Cursando'}</h1> */}
								<h2 className='fs-15 texto-mobil pt-2 c-blanco'><b>{GConText.nombre}</b> 
								{userStatus && curso && (
									<span className={`badge ${getSimpleStatus().className} ms-2`} style={{
										fontSize: '12px',
										padding: '4px 8px'
									}}>
										<FontAwesomeIcon icon={getSimpleStatus().icon} /> {getSimpleStatus().label}
									</span>
								)}
								</h2>
							</div>

							<div className="col-2 col-md-2 align-self-center text-right">

								<picture>
									<source media="(max-width: 479px)" srcSet={logo_universidad_movil} width={'50'} />
									<img src={Logo_universidad} alt="cclogo" width={'90'} />
								</picture>

								{/* <img src={Logo_universidad} alt="" className='logo_universidad'></img> */}
							</div>
						</div>
					</div>

					{/*d-none d-sm-block ---- estos estilos se usan para ocultar cosas en vistas mobiles*/
						/*align-self-center  --- alinear enm horizontal dentro del div*/
					}
					<div style={{ display: GConText.pruebas === true ? 'block' : 'none' }} className={` col-12 col-md-12 text-left`}>

						<div className="row hr" style={{ padding: '10px' }}>

							<div className={`col-3 col-md-2 text-center align-self-center`}>
								{/* <h1 className='status  c-blanco'>{GConText.status ? '🟢 Completado' : '🟣 Cursando'}</h1> */}
								{userStatus && curso && (
									<span className={`badge ${getSimpleStatus().className} ms-2`} style={{
										fontSize: '12px',
										padding: '4px 8px'
									}}>
										<FontAwesomeIcon icon={getSimpleStatus().icon} /> {getSimpleStatus().label}
									</span>
								)}
							</div>

							<div className={`col-9 col-md-10 text-left align-self-center`}>
								<h2 className='bookmark c-blanco'>Nombre: {GConText.username}, ID: {GConText.userId} - BOOKMARK: {GConText.bookmark} - STATUS: {userStatus && curso && (
									<span className={`badge ${getSimpleStatus().className} ms-2`} style={{
										fontSize: '12px',
										padding: '4px 8px'
									}}>
										<FontAwesomeIcon icon={getSimpleStatus().icon} /> {getSimpleStatus().label}
									</span>
								)}</h2>
							</div>

						</div>
					</div>
				</div>
			</div>
			{/* </nav> */}
		</>
	)
}

export default Nav