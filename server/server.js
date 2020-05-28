require('./config/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded // para recibir datos enviados en el post
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


app.get('/usuario/:id', function(req, res) {
    //res.send('Hello World');  // envia html
    let id = req.params.id;
    res.json({
        ok: "get",
        id: id
    }); //envia json
});


app.post('/usuario', function(req, res) {
    //res.send('Hello World');  // envia html
    let body = req.body
    if (body.nombre === undefined || body.nombre === '') {
        ok: false,
        res.status(400).json({
            ok: false,
            mensaje: 'No se ingreso nombre'
        });
    }
    else {
        res.json({
            ok: true,
            body
        }); //envia json    
    }

});

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        ok: "Put",
        id: id
    }); //envia json
});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        ok: "delete",
        id: id
    }); //envia json
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando puerto ${process.env.PORT}`);
});