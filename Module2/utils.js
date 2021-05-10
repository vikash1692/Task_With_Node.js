const Joi = require('joi')
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
      isValid : valid,
      message : ''
    }
  } else {
    const { details } = error;
    const message = details.map(i => i.message).join(',');
    console.log("error",message);
    return {
      isValid : valid,
      message
    }
  }
}
module.exports = validator;