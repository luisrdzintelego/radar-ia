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

const JWT_SECRET = process.env.JWT_SECRET; // ← Eliminar el fallback

// Validar que las variables críticas existan
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no configurada');
}

const TABLE_NAME = process.env.USERS_TABLE_NAME; // definir en Amplify Console

// Configurar cliente DynamoDB con timeouts y reintentos
const ddbClient = new DynamoDBClient({
  maxAttempts: 3,
  requestTimeout: 5000,
  retryMode: 'adaptive'
});
const docClient = DynamoDBDocumentClient.from(ddbClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertEmptyValues: false
  }
});

// Configurar orígenes permitidos desde variable de entorno
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3000',
  'https://www.femsa-jedi.com',
  'https://femsa-jedi.com'
];

// Función para logging de errores mejorado
const logError = (error, context) => {
  console.error(`[${context}] Error:`, {
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
};

// Rate limiting básico
const rateLimitMap = new Map();

const checkRateLimit = (ip) => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 300; // máximo 100 requests por IP cada 15 min
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  const record = rateLimitMap.get(ip);
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// Limpiar registros antiguos cada hora
const cleanupRateLimit = () => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
};


exports.handler = async (event) => {

  const { path, httpMethod, body, headers } = event;

  // Remover /main del path si existe
  const cleanPath = path.replace('/main', '') || '/';

  const origin = event.headers.origin || event.headers.Origin;

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

  // Rate limiting
  const clientIP = event.requestContext?.identity?.sourceIp || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: 'Demasiadas solicitudes. Intenta más tarde.' }),
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '900', // 15 minutos
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
      }
    };
  }
  
  // Limpiar rate limit ocasionalmente
  if (Math.random() < 0.01) { // 1% de probabilidad
    cleanupRateLimit();
  }

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        // Headers de seguridad también en OPTIONS
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY'
      }
    };
  }

  // POST /login

if (cleanPath === '/login' && httpMethod === 'POST') {

  // ✨ Iniciar timing
  //const startTime = Date.now();
  //console.log('🚀 LOGIN INICIADO:', new Date().toISOString());

  try {
    const { username, password, includeProfile } = JSON.parse(body || '{}'); // ✨ Agregar includeProfile

    // Validaciones de entrada
    if (!username || !password) {
      return buildResponse(400, { error: 'Username y password requeridos' }, corsOrigin);
    }
    
    if (typeof username !== 'string' || typeof password !== 'string') {
      return buildResponse(400, { error: 'Formato de credenciales inválido' }, corsOrigin);
    }
    
    if (username.length < 3 || password.length < 6) {
      return buildResponse(400, { error: 'Credenciales inválidas' }, corsOrigin);
    }

    // Sanitizar username
    const sanitizedUsername = username.trim().toLowerCase();
    //console.log('⏱️ Validaciones completadas en:', Date.now() - startTime, 'ms');

    if (!TABLE_NAME) {
      logError(new Error('USERS_TABLE_NAME no configurada'), 'LOGIN');
      return buildResponse(500, { error: 'Error de configuración' }, corsOrigin);
    }

    let usuario;
    try {
      // ✨ Timing para DynamoDB
      //const dbStartTime = Date.now();

      // Tu Lambda usa SCAN (lento):
      /* const sparams = {
        TableName: TABLE_NAME,
        FilterExpression: 'username = :u AND (#type = :user OR #type = :admin)',
        ExpressionAttributeNames: { '#type': 'type' },
        ExpressionAttributeValues: { ':u': sanitizedUsername, ':user': 'user', ':admin': 'admin' }
      };
      const sres = await docClient.send(new ScanCommand(sparams)); 
      usuario = sres.Items && sres.Items[0];*/

      // Cambiar por QUERY (rápido) y Crear GSI (Recomendado - Rápido)
      const queryParams = {
        TableName: TABLE_NAME,
        IndexName: 'username-index',
        KeyConditionExpression: 'username = :u',
        ExpressionAttributeValues: { ':u': sanitizedUsername }
      };
      const result = await docClient.send(new QueryCommand(queryParams));
      usuario = result.Items && result.Items[0];

      //console.log('⏱️ DynamoDB Query completado en:', Date.now() - dbStartTime, 'ms');
      
    } catch (err) {
      //console.log('❌ DynamoDB falló en:', Date.now() - startTime, 'ms');
      logError(err, 'LOGIN_DYNAMODB');
      return buildResponse(500, { error: 'Error interno del servidor' }, corsOrigin);
    }

    if (!usuario) {
      //console.log('❌ Usuario no encontrado en:', Date.now() - startTime, 'ms');
      return buildResponse(401, { error: 'Credenciales inválidas' }, corsOrigin);
    }

    // Comparar password (bcrypt)
    let match;
    try {
      // ✨ Timing para bcrypt
      //const bcryptStartTime = Date.now();

      match = await bcrypt.compare(password, usuario.password);

      //console.log('⏱️ Bcrypt completado en:', Date.now() - bcryptStartTime, 'ms');

    } catch (err) {
      //console.log('❌ Bcrypt falló en:', Date.now() - startTime, 'ms');
      logError(err, 'LOGIN_BCRYPT');
      return buildResponse(500, { error: 'Error interno del servidor' }, corsOrigin);
    }

    if (!match) {
      //console.log('❌ Password incorrecto en:', Date.now() - startTime, 'ms');
      return buildResponse(401, { error: 'Credenciales inválidas' }, corsOrigin);
    }

    // Generar tokens
    try {
      // ✨ Timing para JWT
      //const jwtStartTime = Date.now();

      const payload = {
        id: usuario.id || usuario.pk || usuario.userId,
        username: usuario.username,
        nombre: usuario.nombre,
        type: usuario.type,
        bookmark: usuario.bookmark
      };
      
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' });
      const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

      //console.log('⏱️ JWT generado en:', Date.now() - jwtStartTime, 'ms');

      // ✨ Preparar respuesta base
      const responseBody = { accessToken };

      // ✨ Si se solicita incluir perfil, agregarlo a la respuesta
      if (includeProfile) {
        responseBody.user = {
          id: usuario.id || usuario.pk || usuario.userId,
          nombre: usuario.nombre,
          username: usuario.username,
          type: usuario.type,
          bookmark: usuario.bookmark || ''
        };
      }

      // ✨ Log final de éxito
      //console.log('✅ LOGIN EXITOSO - Tiempo total:', Date.now() - startTime, 'ms');

      return {
        statusCode: 200,
        body: JSON.stringify(responseBody), // ✨ Respuesta con o sin perfil
        headers: {
          'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Credentials': 'true',
          'Content-Type': 'application/json'
        }
      };
    } catch (err) {
      //console.log('❌ JWT falló en:', Date.now() - startTime, 'ms');
      logError(err, 'LOGIN_JWT');
      return buildResponse(500, { error: 'Error interno del servidor' }, corsOrigin);
    }
  } catch (err) {
    //console.log('❌ LOGIN falló en:', Date.now() - startTime, 'ms');
    logError(err, 'LOGIN_PARSE');
    return buildResponse(400, { error: 'Formato de solicitud inválido' }, corsOrigin);
  }
}

  // POST /refresh
  if (cleanPath === '/refresh' && httpMethod === 'POST') {
    const cookieHeader = headers.Cookie || headers.cookie || '';
    const refreshToken = cookieHeader.split(';').find(c => c.trim().startsWith('refreshToken='))?.split('=')[1];
    
    if (!refreshToken) return buildResponse(401, { error: 'No refresh token' }, corsOrigin);

    try {
      const payload = jwt.verify(refreshToken, JWT_SECRET);
      const { iat, exp, ...cleanPayload } = payload;
      const newAccessToken = jwt.sign(cleanPayload, JWT_SECRET, { expiresIn: '15m' });
      return buildResponse(200, { accessToken: newAccessToken }, corsOrigin);
    } catch (err) {
      logError(err, 'REFRESH_TOKEN');
      return buildResponse(403, { error: 'Token inválido' }, corsOrigin);
    }
  }

  // GET /perfil
  if (cleanPath === '/perfil' && httpMethod === 'GET') {
    const authHeader = headers.Authorization || headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return buildResponse(401, { error: 'No access token' }, corsOrigin);

    try {
      const payload = jwt.verify(token, JWT_SECRET);
      return buildResponse(200, { perfil: payload }, corsOrigin);
    } catch (err) {
      logError(err, 'PERFIL_TOKEN');
      return buildResponse(403, { error: 'Token inválido' }, corsOrigin);
    }
  }

// PUT /update-bookmark
if (cleanPath === '/update-bookmark' && httpMethod === 'PUT') {
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'Token requerido' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const { bookmark, status } = JSON.parse(body || '{}');

    const updateParams = {
      TableName: TABLE_NAME,
      Key: { id: payload.id },
      UpdateExpression: 'SET bookmark = :bookmark',
      ExpressionAttributeValues: { ':bookmark': bookmark }
    };

    if (status !== undefined) {
      updateParams.UpdateExpression += ', #status = :status';
      updateParams.ExpressionAttributeNames = { '#status': 'status' };
      updateParams.ExpressionAttributeValues[':status'] = status === 'true';
    }

    await docClient.send(new UpdateCommand(updateParams));
    
    return buildResponse(200, { message: 'Bookmark actualizado' }, corsOrigin);
  } catch (err) {
    logError(err, 'UPDATE_BOOKMARK'); 
    return buildResponse(500, { error: 'Error interno' }, corsOrigin);
  }
}
// GET /get-bookmark
if (cleanPath === '/get-bookmark' && httpMethod === 'GET') {
  const token = getAuthToken(headers);
  if (!token) return buildResponse(401, { error: 'Token requerido' }, corsOrigin);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    
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
    logError(err, 'GET_BOOKMARK');
    return buildResponse(500, { error: 'Error interno' }, corsOrigin);
  }
}


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
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json'
      }
    };
  }

  // GET /get-all-users 
if (cleanPath === '/get-all-users' && httpMethod === 'GET') {
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
    logError(err, 'GET_ALL_USERS');
    return buildResponse(401, { error: 'Token inválido' }, corsOrigin);
  }
}

// PUT /update-user - Actualizar usuario (solo admin)
if (cleanPath === '/update-user' && httpMethod === 'PUT') {
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
        const hashedPassword = await bcrypt.hash(value, 8); // ← Era 10, ahora 8 para optimizar
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
    logError(err, 'UPDATE_USER');
    return buildResponse(500, { error: 'Error actualizando usuario', details: err.message }, corsOrigin);
  }
}



// DELETE /delete-user
if (cleanPath === '/delete-user' && httpMethod === 'DELETE') {
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
    logError(err, 'DELETE_USER');
    return buildResponse(500, { error: 'Error eliminando usuario' }, corsOrigin);
  }
}

// POST /create-user
if (cleanPath === '/create-user' && httpMethod === 'POST') {
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
    const hashedPassword = await bcrypt.hash(password.toString(), 8); // ← Era 10, ahora 8 para optimizar

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
    logError(err, 'CREATE_USER');
    return buildResponse(500, { error: 'Error creando usuario', details: err.message }, corsOrigin);
  }
}

// GET /health - Para mantener Lambda caliente
if (cleanPath === '/health' && httpMethod === 'GET') {
  return buildResponse(200, { status: 'ok', timestamp: Date.now() }, corsOrigin);
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
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Credentials': 'true',
      'Content-Type': 'application/json',
      // Headers de seguridad adicionales PRODUCTIVO
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  };
}