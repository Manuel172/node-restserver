//============================================
// Configuracion del Puerto
//============================================

process.env.PORT = process.env.PORT || 3000;

//=================== Entorno =======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=================== Base de Datos =======================
let urlDB;

if (process.env.NODE_ENV = 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe_dj';
} else {
    urlDB = 'mongodb+srv://administradorcafe:caffeCaribe@cluster0-hsccs.mongodb.net/cafe_dj';
}
urlDB = 'mongodb+srv://administradorcafe:caffeCaribe@cluster0-hsccs.mongodb.net/cafe_dj';
process.env.urlDB = urlDB;