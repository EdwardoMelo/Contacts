const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({ //schema to home 
    titulo: {type: String, required: true},
    decricao: String
});
const homeModel = mongoose.model('Home', HomeSchema);
module.exports = homeModel;