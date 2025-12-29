import Joi from 'joi';
const safeString = Joi.string().trim().min(1).max(100);
const crearUsuarioSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(255).required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 3 caracteres',
    'string.max': 'El nombre no puede superar los 255 caracteres',
    'string.empty': 'El nombre no puede estar vacío'
  }),
  rut: Joi.string().trim().pattern(/^[0-9]{7,8}-[0-9kK]{1}$/).required().messages({
    'any.required': 'El RUT es obligatorio',
    'string.pattern.base': 'El RUT debe tener el formato 12345678-9',
    'string.empty': 'El RUT no puede estar vacío'
  }),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } })
    .required()
    .messages({
      'any.required': 'El email es obligatorio',
      'string.email': 'El email debe tener un formato valido',
      'string.empty': 'El email no puede estar vacio'
    }),
  password: Joi.string().min(5).required().messages({
    'any.required': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos 5 caracteres',
    'string.empty': 'La contraseña no puede estar vacia'
  }),
  role: Joi.string().valid('estudiante', 'profesor', 'admin').optional().messages({
    'any.only': 'El role debe ser "estudiante", "profesor" o "admin"',
    'string.base': 'El role debe ser una cadena'
  })
}).options({ abortEarly: false, allowUnknown: false });
const validacionMiddleware = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, allowUnknown: false });
  if (error) {
    return res.status(400).json({
      message: 'Error de validacion',
      errors: error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }))
    });
  }
  req.body = value; 
  next();
};
const actualizarPerfilSchema = crearUsuarioSchema
  .fork(['email', 'password'], (s) => s.optional())
  .or('email', 'password')
  .messages({ 'object.missing': 'Debes enviar al menos "email" o "password"' });
export const validarCrearUsuario = validacionMiddleware(crearUsuarioSchema);
export const validarUpdateProfile = validacionMiddleware(actualizarPerfilSchema);
export { crearUsuarioSchema, actualizarPerfilSchema };