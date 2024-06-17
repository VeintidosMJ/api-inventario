const { Router } = require('express');
const router = Router();
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const bcrypt = require('bcryptjs');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarRolAdmin } = require('../middleware/validar-rol-admin');

// GET method route
router.get('/', validarJWT, validarRolAdmin, async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error');
    }
});

// POST method route
router.post('/', validarJWT, validarRolAdmin, [
    check('nombre', 'Nombre es requerido').not().isEmpty(),
    check('email', 'Email no es válido').isEmail(),
    check('estado', 'Estado no es válido').isIn(['Activo', 'Inactivo']),
    check('password', 'Password es requerido').not().isEmpty(),
    check('rol', 'Rol no es válido').isIn(['Administrador', 'Docente']),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ mensaje: errors.array() });
        }

        const { nombre, email, estado, password, rol } = req.body;

        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).send('El email ya existe');
        }

        const salt = bcrypt.genSaltSync();
        const hashPassword = bcrypt.hashSync(password, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            estado,
            password: hashPassword,
            rol,
            fechaCreacion: new Date(),
            fechaActualizacion: new Date()
        });

        const usuarioGuardado = await nuevoUsuario.save();
        res.json(usuarioGuardado);

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
