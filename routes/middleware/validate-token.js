const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')

    if (!token) return res.status(401).json({ error: true, mensaje: 'Acceso Denegado' });

    try 
    {
        const verify = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verify;
        next();
    }
    catch (error) 
    {
        res.status(401).json({ error: true, mensaje: error });
    }
}

module.exports = verifyToken;