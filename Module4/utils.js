const Joi = require('joi');

const allowedPermissions = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];
const userSchema = Joi.object().keys({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().min(4).max(130).required()
})
const validator = (req) => {
  const { error } = userSchema.validate(req);
  const valid = error == null;

  if (valid) {
    return {
      isValid: valid,
      message: ''
    }
  } else {
    const { details } = error;
    const message = details.map(i => i.message).join(',');
    console.log("error", message);
    return {
      isValid: valid,
      message
    }
  }
}

const permissionValidator = (permissions) => {
  if (!Array.isArray(permissions)) return { isValid: false, message: 'Permissions must be an array' }
  const res = permissions.map(p => allowedPermissions.includes(p))
    .every(v => v === true);
  return res ? {
    isValid: true,
    message: ''
  } : {
    isValid: false,
    message: `Permission must be one of ${allowedPermissions.join(', ')}`
  }
}
module.exports = { validator, permissionValidator };