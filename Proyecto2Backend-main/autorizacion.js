const jwt = require('jsonwebtoken');
const { secret } = require('./jwtconfig');

function authenticateToken(req, res, next) {
  // Obtener el encabezado de autorización
  const authHeader = req.headers['authorization'];
  // El token suele venir en el formato "Bearer [token]", por lo que se divide la cadena y se toma la segunda parte
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Acceso denegado' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = user;
    next();
  });
}


module.exports = authenticateToken;