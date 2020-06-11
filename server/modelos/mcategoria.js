const mongoose = require('mongoose');
let Schema = mongoose.Schema;


let categoriasSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerida.']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'musuarios'
    },
});

module.exports = mongoose.model('mcategorias', categoriasSchema);