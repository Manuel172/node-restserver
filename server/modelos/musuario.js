const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

// esto se usa en conjunto con el plugging mongoose-unique-validator para validar opciones posibles de un campo (enum)
let rolesValidos = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol válido'
};

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El Nombre es requerido.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido.']
    },
    clave: {
        type: String,
        required: [true, 'El clave es requerida.']
    },
    img: {
        type: String,
        required: false
    },
    rol: {
        type: String,
        default: 'USER_ROLE',
        required: false,
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true,
        required: false
    },
    google: {
        type: Boolean,
        default: false,
        required: false
    }
});

// el metodo toJason siempre se llama cuando se intenta imprimir/ mostrar el objeto
// lo usamos paar sacr la clave y nunca retornarla.
usuarioSchema.methods.toJSON = function() {
    let userObject = this.toObject();
    delete userObject.clave;
    return userObject;
}

// controlar errores de campos unicos
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('musuarios', usuarioSchema);