
import Joi from "joi";

const validateBody = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: 400, message: error.details[0].message });
  }
  next();
};

export default validateBody;
