const jwt = require('jsonwebtoken');

//=====================================
//   Verifica Token
//==================================

let verificaToken = (req, resp, next) => {
    let token = req.get('token'); //viene del header

    jwt.verify(token, process.env.Semilla, (err, decoded) => {
        if (err) {
            return resp.status(401).json({
                ok: false,
                err: {
                    message: 'Token no es Válido'
                }
            })
        }

        req.tokenUsuario = decoded.usuario;
        next();
    });
};


let verificaAdmin_Role = (req, resp, next) => {
    let rol = req.tokenUsuario.rol;

    if (rol === "ADMIN_ROLE") {
        next();
        return;
    } else {
        return resp.json({
            ok: false,
            err: {
                message: 'Sin Privilegios de Administrador'
            }
        });
    }


};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}