const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_para_testing_local';

// Datos simulados (reemplaza DynamoDB)
const mockUsers = [
  {
    id: 'admin-123',
    username: 'admin',
    password: '$2a$08$03JrvxFLY8ebIi7j/RNGCOGB.YeuI25louF6jEnxTzYvxURxQEiuy',
    nombre: 'Administrador',
    type: 'admin',
    grupo: 'admin',
    status: true,
    bookmark: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-456',
    username: 'user1',
    password: 'user1',
    nombre: 'Usuario Test',
    type: 'user',
    grupo: 'test',
    status: false,
    bookmark: '1-0-0-0|1-0-0-0|1-0-0-0|1-0-0-0|1-0-0-0&&1&&index&&&&esp&&',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'user-789',
    username: 'user2',
    password: 'user2',
    nombre: 'Usuario Completado',
    type: 'user',
    grupo: 'test',
    status: true,
    bookmark: 'completed',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
];

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Helper functions
const getAuthToken = (headers) => {
  const authHeader = headers.authorization || '';
  return authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : '';
};

const buildResponse = (status, bodyObj) => ({
  statusCode: status,
  body: bodyObj,
  headers: { 'Content-Type': 'application/json' }
});

// Routes
/* app.post('/login', async (req, res) => {
  try {
    const { username, password, includeProfile } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username y password requeridos' });
    }

    const user = mockUsers.find(u => u.username === username.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const payload = {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      type: user.type,
      bookmark: user.bookmark
    };
    
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    const responseBody = { accessToken };
    if (includeProfile) {
      responseBody.user = payload;
    }

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.json(responseBody);
  } catch (error) {
    return res.status(500).json({ error: 'Error interno' });
  }
}); */

// En server.js, modifica el login:
app.post('/login', async (req, res) => {
  try {
    console.log('📥 POST /login', req.body);
    const { username, password } = req.body;
    
    console.log('🔍 Username recibido:', username);
    console.log('🔍 Password recibido:', password);
    
    const user = mockUsers.find(u => u.username === username);
    console.log('🔍 Usuario encontrado:', user ? 'SÍ' : 'NO');
    
    if (user) {
      console.log('🔍 Hash en BD:', user.password);
      const match = await bcrypt.compare(password, user.password);
      console.log('🔍 Password match:', match);
      
      if (match) {
        const token = jwt.sign({
          id: user.id,
          username: user.username,
          nombre: user.nombre,
          type: user.type,
          bookmark: user.bookmark
        }, JWT_SECRET, { expiresIn: '30m' });
        
        console.log('✅ Login exitoso para:', username);
        return res.json({ accessToken: token });
      }
    }
    
    return res.status(401).json({ error: 'Credenciales inválidas' });
  } catch (error) {
    console.error('❌ Error en /login:', error);
    return res.status(500).json({ error: 'Error interno' });
  }
});


app.get('/perfil', (req, res) => {
  try {
    const token = getAuthToken(req.headers);
    if (!token) return res.status(401).json({ error: 'No access token' });

    const payload = jwt.verify(token, JWT_SECRET);
    return res.json({ perfil: payload });
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
});

app.get('/get-bookmark', (req, res) => {
  try {
    const token = getAuthToken(req.headers);
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = mockUsers.find(u => u.id === payload.id);
    
    return res.json({ 
      bookmark: user?.bookmark || '', 
      status: user?.status || false 
    });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
});

app.put('/update-bookmark', (req, res) => {
  try {
    const token = getAuthToken(req.headers);
    if (!token) return res.status(401).json({ error: 'Token requerido' });

    const payload = jwt.verify(token, JWT_SECRET);
    const { bookmark, status } = req.body;
    
    const userIndex = mockUsers.findIndex(u => u.id === payload.id);
    if (userIndex !== -1) {
      mockUsers[userIndex].bookmark = bookmark;
      if (status !== undefined) {
        mockUsers[userIndex].status = status === 'true' || status === true;
      }
      mockUsers[userIndex].updatedAt = new Date().toISOString();
    }
    
    return res.json({ message: 'Bookmark actualizado' });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
});

app.get('/get-all-users', (req, res) => {
  try {
    const token = getAuthToken(req.headers);
    if (!token) return res.status(401).json({ error: 'No token' });

    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores' });
    }

    return res.json({ users: mockUsers });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
