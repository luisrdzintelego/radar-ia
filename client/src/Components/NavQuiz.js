import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VarContext } from '../Context/VarContext';

import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faQuestion } from '@fortawesome/free-solid-svg-icons'

import './NavQuiz.css';

import * as Img from './Imagenes'

const NavQuiz = ({ props }) => {

	const GConText = useContext(VarContext);

	const [avatar, setAvatar] = useState(0);

	const stopTimer = () => {
		console.log("🚀 ~ GConText.Counter", GConText.Counter)
	};


	useEffect(() => {

		if(GConText.Avatar === 'uno'){
			setAvatar(Img.avatar1_tumb)
		} else if (GConText.Avatar === 'dos'){
			setAvatar(Img.avatar2_tumb)
		} else if (GConText.Avatar === 'tres'){
			setAvatar(Img.avatar3_tumb)
		}

	}, [])



	return (
		<>
			<div className={`container-fluid ${props.colorFondo}`} >


				<BrowserView>
					<div className="row flex ">

						<div className="col-1 py-1 text-left ">
							<img src={avatar} alt="" width="80" ></img>
						</div>

						<div className="col-3 text-left">

							<div className="col-12 text-left mt-3">
								<progress className='barra' max={GConText.TotalAvance} value={GConText.ConteoAvance}></progress>
							</div>

							<div className="col-12 text-center">
								{/* <h2 className='fs-18 c-black text-left'><img src={Img.star} alt="" width="30"></img> {GConText.Puntos} pts - {  Math.floor(GConText.Tiempo / 60)} : { GConText.Tiempo % 60}</h2> */}
								{/* <h2 className='fs-18 c-black text-left'><img src={Img.star} alt="" width="30"></img> {GConText.Puntos}  Pts &nbsp;&nbsp; <img src={Img.reloj} alt="" width="30"></img> { String(Math.floor(GConText.Tiempo / 60)).length === 1 ? `0${Math.floor(GConText.Tiempo / 60)}` : Math.floor(GConText.Tiempo / 60) }:{ String(GConText.Tiempo % 60).length === 1 ? `0${GConText.Tiempo % 60}` : GConText.Tiempo % 60  } Total</h2> */}
								{/* <h2 className='fs-18 c-black text-left'><img src={Img.star} alt="" width="30"></img> {GConText.Puntos}  Pts &nbsp; <img src={Img.reloj} alt="" width="30"></img> {props.hour}:{props.minute}:{props.second}</h2> */}
								<h2 className='fs-18 c-black text-left'><img src={Img.star} alt="" width="30"></img> {GConText.Puntos}  Pts &nbsp; <img src={Img.reloj} alt="" width="30"></img> {(Math.floor(GConText.Tiempo / 3600) < 10) ? `0${Math.floor(GConText.Tiempo / 3600)}` : Math.floor(GConText.Tiempo / 3600)}:{(Math.floor((GConText.Tiempo / 60) % 60) < 10) ? `0${Math.floor((GConText.Tiempo / 60) % 60)}` : Math.floor((GConText.Tiempo / 60) % 60)}:{(GConText.Tiempo % 60 < 10) ? `0${GConText.Tiempo % 60}` : GConText.Tiempo % 60}</h2>

							</div>
						</div>

						<div className="col-1 text-center" style={{ borderLeft: '1px solid black' }}>

							<span className=''>
								{
									GConText.Joya1 === true
										//GConText.Joya1 === false
										? <img src={Img.joya1} alt="" width="45"></img>
										: <img src={Img.joya1_d} alt="" width="45"></img>
								}
							</span>
						</div>
						<div className="col-1 text-center">
							<span className=''>
								{
									GConText.Joya2 === true
										//GConText.Joya1 === false
										? <img src={Img.joya2} alt="" width="45"></img>
										: <img src={Img.joya2_d} alt="" width="45"></img>
								}
							</span>
						</div>
						<div className="col-1 text-center">
							<span className=''>
								{
									GConText.Joya3 === true
										//GConText.Joya1 === false
										? <img src={Img.joya3} alt="" width="45"></img>
										: <img src={Img.joya3_d} alt="" width="45"></img>
								}
							</span>

						</div>

						<div className="col-1 text-center" style={{ borderLeft: '1px solid black', borderRight: '1px solid black' }}>

							{
								props.titulo === 'Quiz1'
									//score === 0
									? <>
										{
											GConText.Bonus1 === true
												//GConText.Joya1 === false
												? <img src={Img.bonus} alt="" width="50"></img>
												: <img src={Img.bonus_d} alt="" width="50"></img>
										}
									</>
									: <></>

							}

							{
								props.titulo === 'Quiz2'
									//score === 0
									? <>
										{
											GConText.Bonus2 === true
												//GConText.Joya1 === false
												? <img src={Img.bonus} alt="" width="50"></img>
												: <img src={Img.bonus_d} alt="" width="50"></img>
										}
									</>
									: <></>
							}

							{
								props.titulo === 'Quiz3'
									//score === 0
									? <>
										{
											GConText.Bonus3 === true
												//GConText.Joya1 === false
												? <img src={Img.bonus} alt="" width="50"></img>
												: <img src={Img.bonus_d} alt="" width="50"></img>
										}
									</>
									: <></>
							}

						</div>

						{/* <div className="col-1 text-center" >
							<h2 className='fs-18 c-black text-center'><img src={Img.reloj} alt="" onClick={() => {stopTimer()}} width="40"></img>{props.minute}:{props.second}</h2>
						</div> */}



						{/* <div className="col-4 text-center" >
						
							<Link className='btn_ch bg-naranja me-1' to="/introduccion"><FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon> Ayuda</Link>
							<Link className='btn_ch bg-naranja me-1' to="/dashboard" ><FontAwesomeIcon icon={faClose}></FontAwesomeIcon> Cerrar</Link>
						
						</div> */}
					</div>
				</BrowserView>
				<MobileView>
					<div className="row text-center ">

						<div className="col-6 py-2 text-center ">
							<img src={avatar} alt="" width="80" ></img>
						</div>

						<div className="col-6 p-2 text-center ">
							<h2 className='fs-22 c-black text-left'
							><img src={Img.star} alt="" width="40"></img> {GConText.Puntos} Pts &nbsp; <br></br>
								<img src={Img.reloj} alt="" width="40"></img> {(Math.floor(GConText.Tiempo / 3600) < 10) ? `0${Math.floor(GConText.Tiempo / 3600)}` : Math.floor(GConText.Tiempo / 3600)}:{(Math.floor((GConText.Tiempo / 60) % 60) < 10) ? `0${Math.floor((GConText.Tiempo / 60) % 60)}` : Math.floor((GConText.Tiempo / 60) % 60)}:{(GConText.Tiempo % 60 < 10) ? `0${GConText.Tiempo % 60}` : GConText.Tiempo % 60}</h2>
						</div>

						<div className="col-3 pt-2 text-center" >

							<span className=''>
								{
									GConText.Joya1 === true
										//GConText.Joya1 === false
										? <img src={Img.joya1} alt="" width="40"></img>
										: <img src={Img.joya1_d} alt="" width="40"></img>
								}
							</span>
						</div>
						<div className="col-3 pt-2 text-center">
							<span className=''>
								{
									GConText.Joya2 === true
										//GConText.Joya1 === false
										? <img src={Img.joya2} alt="" width="40"></img>
										: <img src={Img.joya2_d} alt="" width="40"></img>
								}
							</span>
						</div>
						<div className="col-3 pt-2 text-center">
							<span className=''>
								{
									GConText.Joya3 === true
										//GConText.Joya1 === false
										? <img src={Img.joya3} alt="" width="40"></img>
										: <img src={Img.joya3_d} alt="" width="40"></img>
								}
							</span>

						</div>

						<div className="col-3 text-center pb-2" style={{ borderLeft: '1px solid black' }}>

							{
								props.titulo === 'Quiz1'
									//score === 0
									? <>
										{
											GConText.Bonus1 === true
												//GConText.Joya1 === false
												? <img src={Img.bonus} alt="" width="50"></img>
												: <img src={Img.bonus_d} alt="" width="50"></img>
										}
									</>
									: <></>

							}

							{
								props.titulo === 'Quiz2'
									//score === 0
									? <>
										{
											GConText.Bonus2 === true
												//GConText.Joya1 === false
												? <img src={Img.bonus} alt="" width="50"></img>
												: <img src={Img.bonus_d} alt="" width="50"></img>
										}
									</>
									: <></>
							}

							{
								props.titulo === 'Quiz3'
									//score === 0
									? <>
										{
											GConText.Bonus3 === true
												//GConText.Joya1 === false
												? <img src={Img.bonus} alt="" width="50"></img>
												: <img src={Img.bonus_d} alt="" width="50"></img>
										}
									</>
									: <></>
							}

						</div>

						{/* <div className="col-1 text-center" >
							<h2 className='fs-18 c-black text-center'><img src={Img.reloj} alt="" onClick={() => {stopTimer()}} width="40"></img>{props.minute}:{props.second}</h2>
						</div> */}



						{/* <div className="col-4 text-center" >

							<Link className='btn_ch bg-naranja me-1' to="/introduccion"><FontAwesomeIcon icon={faQuestion}></FontAwesomeIcon> Ayuda</Link>
							<Link className='btn_ch bg-naranja me-1' to="/dashboard" ><FontAwesomeIcon icon={faClose}></FontAwesomeIcon> Cerrar</Link>

						</div> */}
					</div>
				</MobileView>





			</div>

			{/* <div className="row justify-content-center align-items-center g-2">
			<div className="col"></div>
			<div className="col">Column</div>
			<div className="col"></div>
		</div>	 */}
		</>
	)
}

export default NavQuiz