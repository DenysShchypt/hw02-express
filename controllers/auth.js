const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const jwt = require("jsonwebtoken");
const {
    HttpError,
    ctrlWrapper } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    // Переверяємо на унікальність користувача
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use ")
    }
    // Хешуємо пароль і додаємо в базу користувача
    const hashPassword = await bcrypt.hash(password, 10)
    // Cтворюємо тимчасову аватар
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });
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
    res.status(200).json({
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
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    // Знаходимо де знаходиться файл (path:tempUpload) та його назву (originalname)
    const { path: tempUpload, originalname } = req.file;
    // Робимо унікальну назву аватарки за допомогою _id
    const filename = `${_id}_${originalname}`;
    // Створюємо новий шлях до файлу
    const resultUpload = path.join(avatarsDir, filename)
    // Оброби аватарку пакетом jimp і постав для неї розміри 250 на 250
    Jimp.read(tempUpload).then(image => {
        return image.autocrop()
            .resize(250, 250)
            .write(resultUpload)
    }).catch(err => {
        console.log(err.message);
    });
    // Змінюємо старий шлях на новий
    await fs.rename(tempUpload, resultUpload);
    // Шлях де лишається файл
    const avatarURL = path.join("avatars", filename);
    // Перезаписуємо на user avatarURL
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.json({ avatarURL })

};

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar)
};