import Joi from 'joi';
const safeString = Joi.string().trim().min(1).max(100);
const crearUsuarioSchema = Joi.object({
  nombre: safeString.required().messages({
    'any.required': 'El nombre es obligatorio',
    'string.empty': 'El nombre no puede estar vacio'
  }),
  apellido: safeString.required().messages({
    'any.required': 'El apellido es obligatorio',
    'string.empty': 'El apellido no puede estar vacio'
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
  })
  ,
  role: Joi.string().valid('estudiante', 'profesor').optional().messages({
    'any.only': 'El role debe ser "estudiante" o "profesor"',
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
  .fork(['nombre', 'apellido'], () =>
    Joi.forbidden().messages({ 'any.unknown': 'No se permite modificar este campo' })
  )
  .fork(['email', 'password'], (s) => s.optional())
  .or('email', 'password')
  .messages({ 'object.missing': 'Debes enviar al menos "email" o "password"' });
export const validarCrearUsuario = validacionMiddleware(crearUsuarioSchema);
export const validarUpdateProfile = validacionMiddleware(actualizarPerfilSchema);
export { crearUsuarioSchema, actualizarPerfilSchema };