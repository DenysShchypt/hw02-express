const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    HttpError,
    ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    // Переверяємо на унікальність користувача
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use ")
    }
    // Хешуємо пароль і додаємо в базу користувача
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ ...req.body, password: hashPassword });
    // Виводимо статус 201 
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    // Переверяємо чи є такий користувач в системі
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }
    // Перевіряєм паролі
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong")
    }
    // Створюємо токен та відправляємо його
    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "20h" });
    // Записуємо token в базу
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token: token, user: {
            email: user.email,
            subscription: user.subscription
        }
    })
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user
    res.json({ email, subscription })
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });
    res.status(204).json()
};

const updateSubscription = async (req, res) => {
    const { _id } = req.user;
    const isSubscription = "subscription" in req.body;
    if (!isSubscription) {
        throw HttpError(400, "missing field subscription");
    }
    const result = await User.findByIdAndUpdate(_id, req.body, { new: true });
    if (!result) {
        throw HttpError(404, "Not found")
    };
    res.status(200).json(result);
}
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription)
};