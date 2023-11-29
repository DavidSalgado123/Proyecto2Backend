import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Usuario from './usuarios.model';
import { secret } from '../jwtconfig'; 
import twilio from 'twilio';

const twilioClient = twilio('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

function generarCodigo2FA() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Código de 6 dígitos
}

async function verificar2FA(req, res) {
    const { correo, codigo2FA } = req.body;
    const usuario = await Usuario.findOne({ correo });
  
    if (!usuario || !usuario.codigo2FA || usuario.expiracion2FA < new Date()) {
      return res.status(400).json({ mensaje: 'Solicitud inválida o código 2FA expirado' });
    }
  
    if (usuario.codigo2FA === codigo2FA) {
      // Generar y enviar JWT
      const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: '1h' });
      return res.status(200).json({ mensaje: '2FA verificado con éxito', token });
    } else {
      return res.status(400).json({ mensaje: 'Código 2FA incorrecto' });
    }
  }
  

export async function loginUser(req, res) {
    try {
        const { correo, contrasena } = req.body;

        // Buscar usuario por correo electrónico
        const usuario = await Usuario.findOne({ correo }).select('+contrasena');

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!validPassword) {
            return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
        }

        if (usuario.esAdministrador) {
            const codigo2FA = generarCodigo2FA();
            usuario.codigo2FA = codigo2FA;
            usuario.expiracion2FA = new Date(new Date().getTime() + 10*60000); // 10 minutos para la expiración
            await usuario.save();
        
            // Enviar el código 2FA como SMS
            twilioClient.messages.create({
                body: `Tu código de autenticación es: ${codigo2FA}`,
                to: usuario.telefono, 
                from: 'TWILIO_PHONE_NUMBER'
            }).then(message => console.log(message.sid))
              .catch(err => console.error(err));
        
            return res.status(200).json({ mensaje: 'Se requiere verificación 2FA', requiere2FA: true });
          }

        // Generar JWT
        const token = jwt.sign({ id: usuario._id }, secret, { expiresIn: '1h' });

        res.status(200).json({ mensaje: 'Autenticación exitosa', token });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
}
