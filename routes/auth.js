const router = require('express').Router();
const User = require('../models/user');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { route } = require('express/lib/application');
const user = require('../models/user');

const schemaRegister = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(20).required(),
})

router.post('/register', async(req, res) => {
    
    // Validaciones
    const {error} = schemaRegister.validate(req.body);

    if (error)
    {
        return res.status(400).json({ error: true, mensaje: error.details[0].message });
    }

    const emailExiste = await User.findOne({email: req.body.email});
    if (emailExiste) 
    {
        return res.status(400).json({ error: true, mensaje: 'Email ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncrypt = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: passwordEncrypt
    });

    try 
    {
        const userDB = await user.save();

        res.json({
            error: null,
            data: userDB
        })

    } 
    catch (error) 
    {
        res.status(400).json(error);
    }
})

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(100).required().email(),
    password: Joi.string().min(6).max(20).required(),
})

router.post('/login', async (req, res) => {
    // Validaciones
    const {error} = schemaLogin.validate(req.body);

    if (error)
    {
        return res.status(400).json({ error: true, mensaje: error.details[0].message });
    }

    const userDB = await User.findOne( {email: req.body.email } );

    if (!userDB)
    {
        return res.status(400).json({ error: true, mensaje: 'Usuario no encontrado' });
    }

    const validatePass = await bcrypt.compare(req.body.password, userDB.password);
    if (!validatePass)
    {
        return res.status(400).json({ error: true, mensaje: 'contraseña invalido' });
    }

    const token = jwt.sign({
        name: userDB.name,
        id: userDB._id
    }, process.env.TOKEN_SECRET)

    res.header('auth-token', token).json({
        error: null,
        data: {token}
    })

})

module.exports = router;