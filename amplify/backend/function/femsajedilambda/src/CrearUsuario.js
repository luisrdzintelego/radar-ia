// CreaUsuario.js
const bcrypt = require('bcryptjs');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const TABLE_NAME = 'Ranking-ge3ckcqz7newxmjpq6bp54mhti-main'; // Cambia por el nombre real de tu tabla

async function crearUsuario() {
  const passwordPlano = 'MiContraseñaSegura123'; // Cambia por la contraseña que quieras
  const hash = await bcrypt.hash(passwordPlano, 10);

  const usuario = {
    id: 'usuario-prueba-001', // Usa un UUID o un string único
    username: 'prueba@ejemplo.com',
    password: hash,
    nombre: 'Usuario Prueba',
    grupo: 'GCONTROL',
    type: 'user'
    // Agrega otros campos si tu tabla los requiere
  };

  const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region: 'us-east-1' }));

  await client.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: usuario
  }));

  console.log('Usuario creado:', usuario);
}

crearUsuario();