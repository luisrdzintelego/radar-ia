import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VarContext } from '../Context/VarContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRankingStar } from '@fortawesome/free-solid-svg-icons'

import { DataStore, SortDirection } from '@aws-amplify/datastore';
import { Ranking } from '../models';

import './Dashboard.css';

import * as Img from '../Components/Imagenes'
import Nav from '../Components/Nav'

const Dashboard = () => {

	const GConText = useContext(VarContext);
	const [avatar, setAvatar] = useState(0);

	async function updateIntentos(id, dato) {
		console.log("🚀 updateIntentos ~ dato", dato, "🚀 ~ id", id)
		const original = await DataStore.query(Ranking, id);
		console.log("🚀 ~ original", original)
		await DataStore.save(
			Ranking.copyOf(original, updated => {
				updated.intentos = dato
			})
		);
	}

	const chkData = async () => {

		const posts = await DataStore.query(Ranking, c => c.id("eq", GConText.UserId))
			.then((resp) => {

				console.log("🚀 ~ resp_________:", resp)
				console.log("~~~~~~~ Actualiza datos desde DataStore AWS ~~~~~~~")
				console.log("🚀 ~ GConText.UserId", GConText.UserId);

				GConText.setPuntos(resp[0].puntos);
				GConText.setTiempo(resp[0].tiempo);
				GConText.setJoya1(resp[0].gema1);
				GConText.setJoya2(resp[0].gema2);
				GConText.setJoya3(resp[0].gema3);

				console.log("🚀 ~ dB.id", resp[0].id);
				console.log("🚀 ~ dB.puntos", resp[0].puntos)
				console.log("🚀 ~ dB.tiempo", resp[0].tiempo)
				console.log("🚀 ~ dB.gema1", resp[0].gema1)
				console.log("🚀 ~ dB.gema2", resp[0].gema2)
				console.log("🚀 ~ dB.gema3", resp[0].gema3)

				console.log("~~~~~~~ ---------------- ~~~~~~~")

				if (GConText.Avatar === 'uno') {
					setAvatar(Img.avatar1_tumb)
				} else if (GConText.Avatar === 'dos') {
					setAvatar(Img.avatar2_tumb)
				} else if (GConText.Avatar === 'tres') {
					setAvatar(Img.avatar3_tumb)
				}

			}).catch((err) => {
				console.log(err)
			}).finally(() => {
			})

	}

	const chkRanking = async () => {
		return await DataStore.query(Ranking, c => c.grupo("eq", GConText.Grupo), {
			sort: s => s.puntos(SortDirection.DESCENDING).tiempo(SortDirection.ASCENDING)
		}).then((resp) => {
			resp.reduce((empty, option, num) => {
				if (option.id === GConText.UserId) {
					//var svalue = { posicion: num}
					//empty.push(svalue);
					console.log("~~~~~~~ ---------------- ~~~~~~~")
					console.log("🚀 ~ setRanking", num + 1)
					console.log("🚀 ~ GConText.Ranking", num + 1)
					console.log("~~~~~~~ ---------------- ~~~~~~~")

					GConText.setRanking(num + 1)
				}
				return empty;
			}, {});

		}).catch((err) => {
			console.log(err)
		}).finally(() => {
		})
	}

	useEffect(() => {
		//console.log("🚀 ~ vistos", vistos)
		//setLoading(true)
		chkData()
		chkRanking()

	}, [])

	return (
		<>
			<div className="container dashboard-background pb-5">

				<Nav titulo={"Dashboard"} btn_dash={true}></Nav>

				<div className="container">
					<div className="row mt-3 mx-1">
						<div className="col-md-7 mb-3 text-left">
							<img className='img-fluid' src={Img.titulo_curso} alt="" width="300"></img>
						</div>

						<div className="col-md-5 dashboard-form">
							<div className="mb-3">
								<div className="row mt-1">
									<div className="col-md-12 text-center">

										<img className='mb-3' src={avatar} alt="" width="120"></img>

										<h2 className='fs-25 c-black text-left'>¡Hola!</h2>
										<h4 className='fs-25 c-black text-left' id='nombre'>{GConText.Nombre}</h4>
										<h4 className='fs-25 c-black text-left' id='ranking'><span className={`${GConText.Ranking === 1 ? "oro" : ""} ${GConText.Ranking === 2 ? "plata" : ""} ${GConText.Ranking === 3 ? "bronce" : ""}`}><FontAwesomeIcon icon={faRankingStar}></FontAwesomeIcon></span> {GConText.Ranking}</h4>
									</div>
								</div>
								<div className="row mt-1 caja_gris">
									<div className="col-6 col-md-6 pt-2">
										<h2 className='fs-18 c-black text-left'><img src={Img.star} alt="" width="40"></img>{GConText.Puntos} pts</h2>
									</div>
									<div className="col-6 col-md-6 pt-2 text-right">
										{
											GConText.Joya1 === true
												//GConText.Joya1 === false
												? <img src={Img.joya1} alt="" width="40"></img>
												: <img src={Img.joya1_d} alt="" width="40"></img>
										}
										{
											GConText.Joya2 === true
												//GConText.Joya1 === false
												? <img src={Img.joya2} alt="" width="40"></img>
												: <img src={Img.joya2_d} alt="" width="40"></img>
										}
										{
											GConText.Joya3 === true
												//GConText.Joya1 === false
												? <img src={Img.joya3} alt="" width="40"></img>
												: <img src={Img.joya3_d} alt="" width="40"></img>
										}
									</div>
								</div>
								<div className="row mt-5">
									<div className="col-12 col-md-12 p-0">
										<Link className='btn_default me-1' to="/instrucciones"> Instrucciones </Link>
										<Link className='btn_negro' to="/primer_reto" onClick={() => {
											//reiniciamos las variables locales
											GConText.resetAll();
											//le agregamos a la abase 1 intento
											updateIntentos(GConText.UserId, (GConText.Intentos + 1))
										}} > Comenzar </Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Dashboard