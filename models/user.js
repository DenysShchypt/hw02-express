const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");
const versionSubscription = ["starter", "pro", "business"];
const emailRegexp = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
// Схема аутентифікації в базі
const userSchema = new Schema({
  password: {
    type: String,
    minlength: 5,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    match: emailRegexp,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: versionSubscription,
    default: "starter"
  },
  token: {
    type: String,
    default: ""
  },
  avatarURL: {
    type: String,
    required: [true, 'avatarURL is required']
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, 'Verify token is required'],
  }
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

// Схема Регістрація / Логін
const registerLoginSchema = Joi.object({
  password: Joi.string().min(5).required(),
  email: Joi.string().pattern(emailRegexp).required(),
});

// Схема обробки PATCH запиту Subscription
const updatePatchSchemaSubscription = Joi.object({
  subscription: Joi.array().valid(...versionSubscription).required()
});

// Створюємо модель (Клас який працює з колекцією)
const User = model("user", userSchema);

module.exports = {
  User, registerLoginSchema, updatePatchSchemaSubscription
}
