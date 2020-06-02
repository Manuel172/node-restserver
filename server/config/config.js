//============================================
// Expiración del Token // 60 seg * 60 min * 24horas * 30dias
//============================================
process.env.Caducidad = 60 * 60 * 24 * 30;

//============================================
// Seed / Semilla del token
//============================================
process.env.Semilla = process.env.Semilla || 'Este-es-el-seed-de-desarrollo';



//============================================
// Configuracion del Puerto
//============================================
process.env.PORT = process.env.PORT || 3000;

//=================== Entorno =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================== Base de Datos =======================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe_dj';
} else {
    // el string de conección lo entrega mongo en atlas como el siguiente ejemplo
    //"mongodb+srv://<usuario>:<clave>@cluster0-hsccs.mongodb.net/<Base de Datos>"
    // este se crea en heroku  como variable de entorno para que no queden publicas las credenciales en GitHub
    urlDB = process.env.DireccionMongo;
}
process.env.urlDB = urlDB;