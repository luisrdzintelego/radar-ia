import React, {useContext} from 'react';
import { VarContext } from '../Context/VarContext';

import { DataStore } from '@aws-amplify/datastore';
import { Ranking } from '../models';


async function UpdatePuntos(num) {
	const GConText = useContext(VarContext);
	const original = await DataStore.query(Ranking, c => c.username("eq", GConText.Username));
	await DataStore.save(
		Ranking.copyOf(original, updated => {
		updated.puntos = num
	  })
	);
  }


const Validar = (values) => {

    if (values.nombre.length < 5) {
        alert("El nombre es demasiado corto")
        return false
    }
    if (values.tel.length < 8) {
        alert("El teléfono es inválido")
        return false
    }
    if (values.email.length < 7) {
        alert("El email es inválido")
        return false
    }

    return true
}
