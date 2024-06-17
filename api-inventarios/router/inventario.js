//Lógica para gestionar los usuarios

const {Router} = require('express')
const router = Router();
const Inventario = require ('../models/Inventario');
const {validationResult, check} = require('express-validator');
const bycript = require('bcryptjs');
const {validarJWT} = require('../middleware/validar-jwt');
const {validarRolAdmin} = require('../middleware/validar-rol-admin');

//GET method route
router.get('/', [validarJWT, validarRolAdmin], async function (req, res) {
    try {
        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado'
            },
            {
                path: 'marca', select: 'nombre estado'
            },
            {
                path: 'estadoEquipo', select: 'nombre estado'
            },
            {
                path: 'tipoEquipo', select: 'nombre, estado'
            }
        ]);
        res.send(inventarios);    
    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrió un error'); 
    }
  });

  
  // POST method route
  router.post('/', [validarJWT],  [
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmpty(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('fotoEquipo', 'invalid.fotoEquipo').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().isEmpty(),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty()

  ], async function (req, res) {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({mensaje: errors.array()});
        }
        
        const existeInventarioPorSerial = await Inventario.findOne({serial: req.body.serial });
        if(existeInventarioPorSerial){
            return res.status(400).send('Ya existe el serial para otro equipo');
        }

        let inventario = Inventario();
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion= req.body.descripcion;
        inventario.fotoEquipo= req.body.fotoEquipo;
        inventario.color= req.body.color;
        inventario.fechaCompra= req.body.fechaCompra;
        inventario.precio= req.body.precio;
        inventario.usuario= req.body.usuario;
        inventario.estadoEquipo= req.body.estadoEquipo;
        inventario.tipoEquipo= req.body.tipoEquipo;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();    
        
        inventario = await inventario.save();
        res.send(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server Error');
        
    }
  });

  module.exports = router;