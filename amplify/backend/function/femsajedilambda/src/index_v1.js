// ...existing code...
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, ScanCommand, UpdateCommand, GetCommand, DeleteCommand, PutCommand, BatchWriteCommand } = require('@aws-sdk/lib-dynamodb');

// Agregar esta función helper después de las importaciones
const getAuthToken = (headers) => {
  const authHeader = headers.Authorization || headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : '';
};


//const JWT_SECRET = process.env.JWT_SECRET || 'clave_super_secreta'; // Debug
const JWT_SECRET = process.env.JWT_SECRET; // ← Eliminar el fallback
// Debug
//const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_para_testing_local';

// Validar que las variables críticas existan
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no configurada');
}

const TABLE_NAME = process.env.USERS_TABLE_NAME; // definir en Amplify Console
//const USERNAME_GSI = process.env.USERS_TABLE_GSI; // opcional, nombre del GSI por username si existe

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

//para pruebas
//const allowedOrigin = 'http://localhost:3000'; // para desarrollo local

//Para diferentes entornos:
// Configuración más avanzada
/* const isDevelopment = process.env.NODE_ENV === 'development';
const ALLOWED_ORIGINS = isDevelopment 
  ? ['http://localhost:3000', 'http://localhost:3001'] 
  : process.env.ALLOWED_ORIGINS?.split(',') || ['https://www.femsa-jedi.com']; */

// Configurar orígenes permitidos desde variable de entorno
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://www.femsa-jedi.com',
  'https://femsa-jedi.com'
];

//ALLOWED_ORIGINS = http://localhost:3000,https://www.femsa-jedi.com,https://femsa-jedi.com

exports.handler = async (event) => {
  //console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN); 

  // Debug
  //console.log('=== LAMBDA EJECUTADO ===');
  //console.log('Event completo:', JSON.stringify(event, null, 2));

  const { path, httpMethod, body, headers } = event;

  // Remover /main del path si existe
  const cleanPath = path.replace('/main', '') || '/';

  // Debug
  //console.log('=== DEBUG ===');
  //console.log('Path original:', path);
  //console.log('Path limpio:', cleanPath);
  //console.log('Method:', httpMethod);
  //console.log('Origin:', headers.origin);
  
  // Debug
  /* const allowedOrigins = [
    'http://localhost:3000',
    'https://www.femsa-jedi.com',
    'https://femsa-jedi.com', // Sin www
  ]; */

  // Validar que el origen esté permitido
  const origin = event.headers.origin || event.headers.Origin;
  //console.log('Origin recibido:', origin);
  //console.log('Path:', path, 'Method:', httpMethod);

  // Debug
  //const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  // validación simple
  //const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  //console.log('CORS Origin usado:', corsOrigin);

  // validación estricta
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    //console.warn('Origen no permitido:', origin);
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Origen no permitido' }),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }
  const corsOrigin = origin || ALLOWED_ORIGINS[0];

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
      }
    };
  }

  // POST /login
  // Usar cleanPath en lugar de path
  if (cleanPath === '/login' && httpMethod === 'POST') {
    const { username, password } = JSON.parse(body || '{}');

    //console.log('username:',username);
    //console.log('password:',password);
    //console.log('TABLE_NAME:',TABLE_NAME);

    if (!TABLE_NAME) {
      //console.error('Error: USERS_TABLE_NAME no configurada');
      return buildResponse(500, { error: 'USERS_TABLE_NAME no configurada' }, corsOrigin);
    }

    let usuario;
    try {
      // Primero intenta buscar solo por username (sin filtro de tipo)
      /* const sparams = {
        TableName: TABLE_NAME,
        FilterExpression: 'username = :u',
        ExpressionAttributeValues: { ':u': username },
        Limit: 1
      }; */
      //usuarios solo user
      /* const sparams = {
        TableName: TABLE_NAME,
        FilterExpression: 'username = :u AND #type = :t',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':u': username, ':t': 'user' }
      }; */
      //admin y user
      const sparams = {
        TableName: TABLE_NAME,
        FilterExpression: 'username = :u AND (#type = :user OR #type = :admin)',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':u': username, ':user': 'user', ':admin': 'admin' }
      };

      const sres = await docClient.send(new ScanCommand(sparams));
      //console.log('Parámetros de búsqueda:', sparams);
      //console.log('Resultado completo scan:', JSON.stringify(sres, null, 2));
      //console.log('Items encontrados:', sres.Items);
      //console.log('Cantidad de items:', sres.Items ? sres.Items.length : 0);
      usuario = sres.Items && sres.Items[0];
      //console.log('usuario seleccionado:', usuario);
    } catch (err) {
      //console.error('DynamoDB error', err);
      return buildResponse(500, { error: 'Error interno', detalle: err.message }, corsOrigin);
    }

    if (!usuario) return buildResponse(401, { error: 'usuario invalido' }, corsOrigin);

    // comparar password (bcrypt)
    //console.log('Contraseña recibida:', password);
    //console.log('Hash en base:', usuario.password);
    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return buildResponse(401, { error: 'password no coincide' }, corsOrigin);

    // payload y tokens
    const payload = {
      id: usuario.id || usuario.pk || usuario.userId,
      username: usuario.username,
      //grupo: usuario.grupo,
      nombre: usuario.nombre,
      type: usuario.type,  // ← Agregar esta línea
      bookmark: usuario.bookmark
    };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return {
      statusCode: 200,
      /* body: JSON.stringify({
        accessToken,
        refreshToken // ← Agregar esto temporalmente para desarrollo
      }), */
      body: JSON.stringify({ accessToken }), // ← Solo accessToken, no refreshToken
      headers: {
        //PRODUCTIVO
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
        // Usa esto para desarrollo:
        //'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
        // En el login, cambia la cookie por:
        //'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`,

        //'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
        //'Access-Control-Allow-Origin': allowedOrigin,
        //'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      }
    };
  }

  // POST /refresh (idéntico a tu código anterior)
  if (cleanPath === '/refresh' && httpMethod === 'POST') {
    //console.log('Headers completos:', JSON.stringify(headers, null, 2)); // Debug

    // Intentar obtener de cookie primero
    const cookieHeader = headers.Cookie || headers.cookie || '';
    //console.log('Cookie header:', cookieHeader); // Debug
    //productivo
    const refreshToken = cookieHeader.split(';').find(c => c.trim().startsWith('refreshToken='))?.split('=')[1];
    //debug
    //let refreshToken = cookieHeader.split(';').find(c => c.trim().startsWith('refreshToken='))?.split('=')[1];

    // Si no hay cookie, intentar del body //debug
    /* if (!refreshToken && body) {
      const bodyData = JSON.parse(body || '{}');
      refreshToken = bodyData.refreshToken;
      console.log('RefreshToken del body:', refreshToken ? 'Token presente' : 'No token');
    } */

    //console.log('RefreshToken extraído:', refreshToken ? 'Token presente' : 'No token'); // Debug
    if (!refreshToken) return buildResponse(401, { error: 'No refresh token' }, corsOrigin);

    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET);
      //console.log('RefreshToken válido, generando nuevo accessToken'); //debug

      // Eliminar propiedades de JWT antes de crear nuevo token
      const { iat, exp, ...cleanPayload } = payload;
      const newAccessToken = jwt.sign(cleanPayload, JWT_SECRET, { expiresIn: '15m' });
      return buildResponse(200, { accessToken: newAccessToken }, corsOrigin);
    } catch (err) {
      //console.log('Error verificando refreshToken:', err.message); //debug
      return buildResponse(403, { error: 'Token inválido' }, corsOrigin);
    }
  }

  // GET /perfil
  if (cleanPath === '/perfil' && httpMethod === 'GET') {
    //console.log('Entrando a endpoint /perfil'); //debug
    const authHeader = headers.Authorization || headers.authorization;
    //console.log('Auth header:', authHeader); //debug
    const token = authHeader && authHeader.split(' ')[1];
    //console.log('Token extraído:', token ? 'Token presente' : 'No token'); //debug
    if (!token) return buildResponse(401, { error: 'No access token' }, corsOrigin);

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      //console.log('Token válido, payload:', payload); //debug
      return buildResponse(200, { perfil: payload }, corsOrigin);
    } catch (err) {
      //console.log('Error verificando token:', err.message); //debug
      return buildResponse(403, { error: 'Token inválido' }, corsOrigin);
    }
  }

// PUT /update-bookmark
if (cleanPath === '/update-bookmark' && httpMethod === 'PUT') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'Token requerido' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { bookmark, status } = JSON.parse(body || '{}');

    // Actualizar usuario en DynamoDB
    const updateParams = {
      TableName: TABLE_NAME,
      Key: { id: payload.id },
      UpdateExpression: 'SET bookmark = :bookmark',
      ExpressionAttributeValues: { ':bookmark': bookmark }
    };

    // Si se incluye status, también actualizarlo
    if (status !== undefined) {
      updateParams.UpdateExpression += ', #status = :status';
      updateParams.ExpressionAttributeNames = { '#status': 'status' };
      updateParams.ExpressionAttributeValues[':status'] = status === 'true';
    }

    await docClient.send(new UpdateCommand(updateParams));
    
    return buildResponse(200, { message: 'Bookmark actualizado' }, corsOrigin);
  } catch (err) {
    //console.error('Error actualizando bookmark:', err);
    return buildResponse(500, { error: 'Error interno' }, corsOrigin);
  }
}
// GET /get-bookmark
if (cleanPath === '/get-bookmark' && httpMethod === 'GET') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'Token requerido' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
    // Obtener usuario de DynamoDB
    const getParams = {
      TableName: TABLE_NAME,
      Key: { id: payload.id }
    };

    const result = await docClient.send(new GetCommand(getParams));
    
    if (!result.Item) {
      return buildResponse(404, { error: 'Usuario no encontrado' }, corsOrigin);
    }

    return buildResponse(200, { 
      bookmark: result.Item.bookmark || '',
      status: result.Item.status || false 
    }, corsOrigin);
  } catch (err) {
    console.error('Error obteniendo bookmark:', err);
    return buildResponse(500, { error: 'Error interno' }, corsOrigin);
  }
}

  //Agrega este bloque temporal en tu Lambda (solo para pruebas):
  /* if (cleanPath === '/listar' && httpMethod === 'GET') {
    try {
      const sparams = {
        TableName: TABLE_NAME,
        Limit: 20 // puedes ajustar el límite
      };
      const sres = await docClient.send(new ScanCommand(sparams));
      //console.log('Listado completo:', sres.Items); //debug
      return buildResponse(200, { items: sres.Items }, corsOrigin);
    } catch (err) {
      console.error('DynamoDB error', err);
      return buildResponse(500, { error: 'Error interno', detalle: err.message }, corsOrigin);
    }
  } */

  // POST /logout
  /* if (path === '/logout' && httpMethod === 'POST') {
    // Aquí podrías agregar el refreshToken a una blacklist
    // Por ahora solo confirmamos el logout
    return buildResponse(200, { message: 'Logout exitoso' }, corsOrigin);
  } */

  // POST /logout
  if (cleanPath === '/logout' && httpMethod === 'POST') {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Logout exitoso' }),
      headers: {
      'Set-Cookie': [
        'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
        'refreshToken=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0',
        'refreshToken=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0'
      ],
        // Eliminar la cookie
        //'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      }
    };
  }
  // POST /update-password (solo para desarrollo/admin)
  if (cleanPath === '/update-password' && httpMethod === 'POST') {
    const { username, newPassword } = JSON.parse(body || '{}');

    if (!username || !newPassword) {
      return buildResponse(400, { error: 'Username y newPassword requeridos' }, corsOrigin);
    }

    try {
      // Generar nuevo hash
      const saltRounds = 10;
      const newHash = await bcrypt.hash(newPassword, saltRounds);

      // Actualizar en DynamoDB
      const updateParams = {
        TableName: TABLE_NAME,
        Key: { id: 'ID_DEL_USUARIO' }, // Necesitas el ID específico
        UpdateExpression: 'SET password = :newPassword',
        ExpressionAttributeValues: {
          ':newPassword': newHash
        }
      };

      await docClient.send(new UpdateCommand(updateParams));

      return buildResponse(200, { message: 'Contraseña actualizada' }, corsOrigin);
    } catch (err) {
      //console.error('Error actualizando contraseña:', err);
      return buildResponse(500, { error: 'Error interno' }, corsOrigin);
    }
  }

  //admin.js

  // GET /get-all-users - Obtener todos los usuarios (solo admin)
if (cleanPath === '/get-all-users' && httpMethod === 'GET') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: '#type = :user OR #type = :admin',
      ExpressionAttributeNames: { '#type': 'type' },
      ExpressionAttributeValues: { ':user': 'user', ':admin': 'admin' }
    };

    const result = await docClient.send(new ScanCommand(params));
    return buildResponse(200, { users: result.Items }, corsOrigin);
  } catch (err) {
    return buildResponse(401, { error: 'Token inválido' }, corsOrigin);
  }
}

// PUT /update-user - Actualizar usuario (solo admin)
/* if (cleanPath === '/update-user' && httpMethod === 'PUT') {
  const token = headers.Authorization?.replace('Bearer ', '');
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const { userId, updates } = JSON.parse(body || '{}');
    
    const params = {
      TableName: TABLE_NAME,
      Key: { id: userId },
      UpdateExpression: 'SET',
      ExpressionAttributeValues: {},
      ReturnValues: 'ALL_NEW'
    };

    // Construir UpdateExpression dinámicamente
    const updateParts = [];
    Object.keys(updates).forEach((key, index) => {
      updateParts.push(`${key} = :val${index}`);
      params.ExpressionAttributeValues[`:val${index}`] = updates[key];
    });
    params.UpdateExpression += ' ' + updateParts.join(', ');

    const result = await docClient.send(new UpdateCommand(params));
    return buildResponse(200, { user: result.Attributes }, corsOrigin);
  } catch (err) {
    return buildResponse(500, { error: 'Error actualizando usuario' }, corsOrigin);
  }
}
 */
// PUT /update-user - Actualizar usuario (solo admin)
if (cleanPath === '/update-user' && httpMethod === 'PUT') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const { userId, updates } = JSON.parse(body || '{}');
    
    const params = {
      TableName: TABLE_NAME,
      Key: { id: userId },
      UpdateExpression: 'SET',
      ExpressionAttributeValues: {},
      ExpressionAttributeNames: {},
      ReturnValues: 'ALL_NEW'
    };

    // Construir UpdateExpression dinámicamente
    const updateParts = [];
    let index = 0;
    
    for (const [key, value] of Object.entries(updates)) {
      if (key === 'password' && value) {
        // Encriptar contraseña si se está actualizando
        const hashedPassword = await bcrypt.hash(value, 10);
        updateParts.push(`#${key} = :val${index}`);
        params.ExpressionAttributeNames[`#${key}`] = key;
        params.ExpressionAttributeValues[`:val${index}`] = hashedPassword;
      } else if (key === 'status') {
        // Manejar status como booleano
        updateParts.push(`#${key} = :val${index}`);
        params.ExpressionAttributeNames[`#${key}`] = key;
        params.ExpressionAttributeValues[`:val${index}`] = value === 'true' || value === true;
      } else {
        // Otros campos normales
        updateParts.push(`#${key} = :val${index}`);
        params.ExpressionAttributeNames[`#${key}`] = key;
        params.ExpressionAttributeValues[`:val${index}`] = value;
      }
      index++;
    }
    
    // Agregar updatedAt
    updateParts.push(`#updatedAt = :updatedAt`);
    params.ExpressionAttributeNames['#updatedAt'] = 'updatedAt';
    params.ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();
    
    params.UpdateExpression += ' ' + updateParts.join(', ');

    const result = await docClient.send(new UpdateCommand(params));
    return buildResponse(200, { user: result.Attributes }, corsOrigin);
  } catch (err) {
    console.error('Error en update-user:', err);
    return buildResponse(500, { error: 'Error actualizando usuario', details: err.message }, corsOrigin);
  }
}



// DELETE /delete-user - Eliminar usuario (solo admin)
if (cleanPath === '/delete-user' && httpMethod === 'DELETE') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const { userId } = JSON.parse(body || '{}');
    
    const params = {
      TableName: TABLE_NAME,
      Key: { id: userId }
    };

    await docClient.send(new DeleteCommand(params));
    return buildResponse(200, { message: 'Usuario eliminado' }, corsOrigin);
  } catch (err) {
    return buildResponse(500, { error: 'Error eliminando usuario' }, corsOrigin);
  }
}

// GET /get-completed-users - Obtener usuarios completados (solo admin)
if (cleanPath === '/get-completed-users' && httpMethod === 'GET') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const params = {
      TableName: TABLE_NAME,
      FilterExpression: '#status = :status',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': true },
      Limit: 10
    };

    const result = await docClient.send(new ScanCommand(params));
    
    // Ordenar por updatedAt descendente (más recientes primero)
    const sortedUsers = result.Items.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    return buildResponse(200, { users: sortedUsers }, corsOrigin);
  } catch (err) {
    return buildResponse(500, { error: 'Error obteniendo usuarios completados' }, corsOrigin);
  }
}

// POST /batch-create-users - Crear múltiples usuarios (solo admin)
if (cleanPath === '/batch-create-users' && httpMethod === 'POST') {
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const { users } = JSON.parse(body || '{}'); // Array de usuarios
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return buildResponse(400, { error: 'Array de usuarios requerido' }, corsOrigin);
    }

    const results = { created: 0, errors: [] };
    
    // Procesar en lotes de 25 (límite de BatchWriteItem)
    for (let i = 0; i < users.length; i += 25) {
      const batch = users.slice(i, i + 25);
      
      // Preparar items para el batch
      const putRequests = [];
      
      for (const user of batch) {
        const { username, password, nombre, grupo, type = 'user', status = false, bookmark = '' } = user;
        
        // Validar campos requeridos
        if (!username || !password || !nombre || !grupo) {
          results.errors.push({ username, error: 'Campos requeridos faltantes' });
          continue;
        }

        // Encriptar contraseña
        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        
        const newUser = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          username: username.toString(),
          password: hashedPassword,
          nombre: nombre.toString(),
          grupo: grupo.toString(),
          type: type.toString(),
          status: status === true || status === 'true',
          bookmark: bookmark.toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        putRequests.push({
          PutRequest: {
            Item: newUser
          }
        });
      }

      // Ejecutar batch write
      if (putRequests.length > 0) {
        const batchParams = {
          RequestItems: {
            [TABLE_NAME]: putRequests
          }
        };

        try {
          await docClient.send(new BatchWriteCommand(batchParams));
          results.created += putRequests.length;
        } catch (batchError) {
          console.error('Error en batch:', batchError);
          results.errors.push({ batch: i, error: batchError.message });
        }
      }
    }

    return buildResponse(200, { 
      message: `Procesados ${users.length} usuarios`,
      results 
    }, corsOrigin);
    
  } catch (err) {
    console.error('Error en batch-create-users:', err);
    return buildResponse(500, { error: 'Error creando usuarios', details: err.message }, corsOrigin);
  }
}


// POST /create-user - Crear usuario (solo admin)
if (cleanPath === '/create-user' && httpMethod === 'POST') {
  //const token = headers.Authorization?.replace('Bearer ', '');
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'No token' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return buildResponse(403, { error: 'Solo administradores' }, corsOrigin);
    }

    const { username, password, nombre, grupo, type = 'user', status = false, bookmark = '' } = JSON.parse(body || '{}');
    
    // Validar campos requeridos
    if (!username || !password || !nombre || !grupo) {
      return buildResponse(400, { error: 'Campos requeridos: username, password, nombre, grupo' }, corsOrigin);
    }

    // Verificar si el usuario ya existe
    const existingUser = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: { ':username': username }
    }));

    if (existingUser.Items && existingUser.Items.length > 0) {
      return buildResponse(409, { error: 'Usuario ya existe' }, corsOrigin);
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      username: username.toString(),
      password: hashedPassword,
      nombre: nombre.toString(),
      grupo: grupo.toString(),
      type: type.toString(),
      status: status === true || status === 'true',
      bookmark: bookmark.toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: newUser
    }));

    // No devolver la contraseña hasheada
    const { password: _, ...userResponse } = newUser;
    return buildResponse(201, { user: userResponse }, corsOrigin);
    
  } catch (err) {
    console.error('Error en create-user:', err);
    return buildResponse(500, { error: 'Error creando usuario', details: err.message }, corsOrigin);
  }
}


  return buildResponse(404, { error: 'Ruta no encontrada' }, corsOrigin);
};



function buildResponse(status, bodyObj, corsOrigin) {

  // Solo loggear errores reales del servidor (500+), no errores de autenticación
  if (status >= 500) {
    console.error('Error del servidor:', status, bodyObj);
  }

  return {
    statusCode: status,
    body: JSON.stringify(bodyObj),
    headers: {
      //'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || '*',
      //'Access-Control-Allow-Origin': allowedOrigin,
      //'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'http://localhost:3000',
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
      // Headers de seguridad adicionales PRODUCTIVO
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'

    }
  };
}