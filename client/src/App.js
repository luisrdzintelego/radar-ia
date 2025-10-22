/* eslint-disable react/jsx-pascal-case */
// import logo from './logo.svg';

import React, {useContext, useState} from 'react';
import { VarContext } from './Context/VarContext';
//BrowserRouter: -- puedes usar la barra de direccion para ir a los componentes
//MemoryRouter: -- solo sirven los botones generados en reacj para moverte entre componentes
import {BrowserRouter, Routes,Route, MemoryRouter} from "react-router-dom";

import { CustomVarContext } from './Context/CustomVarContext';

import { ToastContainer } from './Components/Toast';

import './App.css';

import Login from './Secciones/Login';
import Introduccion from "./Secciones/Introduccion";
import Dashboard from "./Secciones/Dashboard";
import AdminAnalytics from "./Components/AdminAnalytics";
/*import Perfil from "./Secciones/Perfil";
 import Instrucciones from "./Secciones/Instrucciones";
import Primer_reto from "./Secciones/Primer_reto";
import Quiz1 from "./Secciones/Quiz1";
import Segundo_reto from "./Secciones/Segundo_reto";
import Quiz2 from "./Secciones/Quiz2";
import Tercer_reto from "./Secciones/Tercer_reto";
import Quiz3 from "./Secciones/Quiz3";
import Retro_final from "./Secciones/Retro_final";
import RankingBoard from "./Secciones/RankingBoard"; */
import Admin from "./Secciones/Admin";
import NotFound from './Secciones/NotFound'; // Crea este componente para el 404

function App() {

  const GConText = useContext(VarContext);
  
  return (

    <>
    {/* <Authenticator /> */}

    {/* <Authenticator
          // formFields={formFields}
          // components={components}

          //oculta el crear una cuenta
          hideSignUp={true}
    >
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator> */}

    <CustomVarContext>
      <MemoryRouter basename="/" >
      {/* <BrowserRouter basename="/cursos_elearning/oxxo/aguile" > */}
      {/* <BrowserRouter basename="/" > */}
        <div className="App">

          <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="introduccion" element={<Introduccion/>}/>
          <Route path="dashboard" element={<Dashboard/>}/>
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          {/* <Route path="perfil" element={<Perfil/>}/>
          <Route path="instrucciones" element={<Instrucciones/>}/>
          
          <Route path="primer_reto" element={<Primer_reto/>}/>
          <Route path="quiz1" element={<Quiz1/>}/>
          <Route path="segundo_reto" element={<Segundo_reto/>}/>
          <Route path="quiz2" element={<Quiz2/>}/>
          <Route path="tercer_reto" element={<Tercer_reto/>}/>
          <Route path="quiz3" element={<Quiz3/>}/>
          <Route path="retro_final" element={<Retro_final/>}/>
          <Route path="ranking" element={<RankingBoard/>}/> */}
          <Route path="admin" element={<Admin/>}/>
          {/* <Route exact path='journey/:itemId' element={<Journey/>} />
          <Route path="Paso2" element={<Paso2/>}/>
          <Route path="Paso3" element={<Paso3/>}/> */}
          {/* <Route
        path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
        /> */}

          {/* <Route path="*" element={<Login />}/> */}


            {/* <Route path='/categoria/:categoriaId' element={<ItemListContainer greeting={'hola Bienvenidos a categorias'} />} />
            <Route path='/detail/:itemId' element={<ItemDetailContainer/>} />
            <Route path='/cart' element={<Cart/>} />
            <Route path='/CheckOut' element={ <CheckOut/> } /> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer />
        </div>
      {/* </BrowserRouter> */}
      </MemoryRouter>
    </CustomVarContext>
    </>
  );
}

 
//export default withAuthenticator(App);
export default App;
