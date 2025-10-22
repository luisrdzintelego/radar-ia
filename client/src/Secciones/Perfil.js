import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { VarContext } from '../Context/VarContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons'

import './Perfil.css';

import * as Img from '../Components/Imagenes'
import Nav from '../Components/Nav'

const Perfil = () => {

  const GConText = useContext(VarContext);

  async function udpateAvatar(id, dato) {
    console.log("🚀 udpateAvatar ~ dato", dato, "🚀 ~ id", id)
    const original = await DataStore.query(Ranking, id);
    await DataStore.save(
      Ranking.copyOf(original, updated => { updated.avatar = dato })
    );
    const Update = await DataStore.query(Ranking, id);
    console.log("🚀 ~ udpateAvatar", Update)
  }

  const Seleccionar_avatar = (newIndex, id) => {


    console.log("🚀 ~ newIndex", newIndex)
    //setSelecciono(true);
    //setSelecciono(current => !current);
    if (newIndex === 1) {
      GConText.setAvatar('uno')
      udpateAvatar(GConText.UserId, 'uno')
    } else if (newIndex === 2) {
      GConText.setAvatar('dos')
      udpateAvatar(GConText.UserId, 'dos')
    } else if (newIndex === 3) {
      GConText.setAvatar('tres')
      udpateAvatar(GConText.UserId, 'tres')
    }

  };

  useEffect(() => {
    //console.log("🚀 ~ vistos", vistos)
    //setLoading(true)

  }, [])

  return (
    <>
      <div className="container perfil-background pb-5">

        <Nav titulo={"Perfil"}></Nav>

        <div className="row mx-1">
          <div className="col col-md-6 offset-md-3">
            <h2 className='fs-18 lh-25 c-negro text-left'>Para recuperar las Gemas, se ha llamado a un grupo de ninjas, pues su <b>flexibilidad, agilidad y estrategia</b> serán de gran utilidad en esta búsqueda.</h2>

            <div className="mt-4">
              <h3 className='fs-15 lh-25 c-negro text-left'><img src={Img.info} alt="" width="25"></img> Para comenzar, selecciona un personaje para vivir este gran reto.</h3>
            </div>

          </div>
        </div>

        <div className="container">
          <div className="row">

            {/* <!-- COLUMNA 1--> */}
            <div className="col perfil-form mt-3 mx-3">

              <div>
                <img className='img-fluid' src={Img.titulo_curso} alt="" width="100" height=""></img>
              </div>
              <div>
                <img src={Img.avatar1} alt="" width="200" ></img>
              </div>
              <hr></hr>

              <div className="mt-1 mb-5">
                <h1 className='fs-28 lh-25 c-negro text-center' >Avatar 1</h1>
              </div>

              <div className="mt-1 mb-3 text-center">

                {/* <span className={GConText.Avatar === Img.avatar1_tumb  ? 'activo' : 'btn_negro'} onClick={() => {Seleccionar_avatar(1);}}>Escoger</span> */}
                {
                  GConText.Avatar === 'uno'
                    //score === 0
                    ? <><img className='img-fluid ms-2' src={Img.bien} alt="" width="35" height=""></img></>
                    : <><span className='btn_negro' onClick={() => { Seleccionar_avatar(1) }}>Escoger</span></>
                }

              </div>

            </div>
            {/* <!-- COLUMNA 2--> */}
            <div className="col perfil-form mt-3 mx-3">
              <div className=''>

                <div>
                  <img src={Img.titulo_curso} alt="" width="100" height=""></img>
                </div>
                <div>
                  <img src={Img.avatar2} alt="" width="200" ></img>
                </div>
                <hr></hr>
                <div className="mt-1 mb-5">
                  <h1 className='fs-28 lh-25 c-negro text-center' >Avatar 2</h1>
                </div>


                <div className="mt-1 mb-3 text-center">

                  {/* <span className={GConText.Avatar === Img.avatar1_tumb  ? 'activo' : 'btn_negro'} onClick={() => {Seleccionar_avatar(1);}}>Escoger</span> */}
                  {
                    GConText.Avatar === 'dos'
                      //score === 0
                      ? <><img className='img-fluid ms-2' src={Img.bien} alt="" width="35" height=""></img></>
                      : <><span className='btn_negro' onClick={() => { Seleccionar_avatar(2) }}>Escoger</span></>
                  }

                </div>
              </div>
            </div>
            {/* <!-- COLUMNA 3--> */}
            <div className="col perfil-form mt-3 mx-3">
              <div className=''>
                <div>
                  <img src={Img.titulo_curso} alt="" width="100" height=""></img>
                </div>
                <div>
                  <img src={Img.avatar3} alt="" width="200" ></img>
                </div>
                <hr></hr>
                <div className="mt-1 mb-5">
                  <h1 className='fs-28 lh-25 c-negro text-center' >Avatar 3</h1>
                </div>

                <div className="mt-1 mb-3 text-center">

                  {/* <span className={GConText.Avatar === Img.avatar1_tumb  ? 'activo' : 'btn_negro'} onClick={() => {Seleccionar_avatar(1);}}>Escoger</span> */}
                  {
                    GConText.Avatar === 'tres'
                      //score === 0
                      ? <><img className='img-fluid ms-2' src={Img.bien} alt="" width="35" height=""></img></>
                      : <><span className='btn_negro' onClick={() => { Seleccionar_avatar(3) }}>Escoger</span></>
                  }

                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 col-md-12">
            <div className="mt-5">
              <Link className='btn_default mx-1' to="/introduccion"> <FontAwesomeIcon icon={faArrowLeftLong}></FontAwesomeIcon> Regresar</Link>
              <Link className='btn_negro mx-1' to="/instrucciones" style={{ visibility: GConText.Avatar !== "" ? 'visible' : 'hidden' }}>Continuar <FontAwesomeIcon icon={faArrowRightLong}></FontAwesomeIcon></Link>
            </div>
          </div>

        </div>

      </div>

    </>
  )
}

export default Perfil