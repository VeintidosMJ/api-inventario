//Lógica para gestionar las marcas

const {Router} = require('express')
const router = Router();
const Marca = require ('../models/Marca');
const {validationResult, check} = require('express-validator');
const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

//GET method route
router.get('/',[validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const marcas = await Marca.find();
        res.send(marcas);    
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error'); 
    }
  });

  
  // POST method route
  router.post('/', [validarJWT,validarRolAdmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),

  ], async function (req, res) {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()});
        }

        let marca = Marca();
        marca.nombre = req.body.nombre;
        marca.estado= req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();
        
        marca = await marca.save();
        res.send(marca);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server Error');
        
    }
  });

  module.exports = router;