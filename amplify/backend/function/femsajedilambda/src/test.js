

const bcrypt = require('bcryptjs');
const hash = '$2b$10$qs1kF4sVhiQBPsQhifAd3OHvaF0eEHZDPWSBbehAPZb1l7hFSrF1O'; // copia el hash de DynamoDB

async function testPassword() {
  const match = await bcrypt.compare('user7', hash);
  console.log(match); // debe ser true si la contraseña es correcta
}

//testPassword();

async function generateNewHash() {
  const password = 'user'; // La contraseña que quieres
  const saltRounds = 10;
  
  const newHash = await bcrypt.hash(password, saltRounds);
  console.log('Nuevo hash para user7:', newHash);
  
  // Verificar que funciona
  const match = await bcrypt.compare('user', newHash);
  console.log('Verificación:', match); // Debe ser true
}

generateNewHash();


// Verificar múltiples contraseñas
/* const passwords = ['user7', '123456', 'password', 'admin'];
const hash = '$2b$10$qs1kF4sVhiQBPsQhifAd3OHvaF0eEHZDPWSBbehAPZb1l7hFSrF1O';

async function testMultiplePasswords() {
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, hash);
    console.log(`${pwd}: ${match}`);
  }
}

testMultiplePasswords(); */