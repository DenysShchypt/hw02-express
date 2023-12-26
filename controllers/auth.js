const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const Jimp = require("jimp");
const fs = require("fs/promises");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const {
    HttpError,
    ctrlWrapper, sendEmail } = require("../helpers");
const { User } = require("../models/user");
const { SECRET_KEY, BASE_URL } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
    const { email, password } = req.body;
    // Переверяємо на унікальність користувача
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already in use ")
    };
    // Хешуємо пароль і додаємо в базу користувача
    const hashPassword = await bcrypt.hash(password, 10)
    // Cтворюємо тимчасову аватар
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
    };
    await sendEmail(verifyEmail)
    // Виводимо статус 201 
    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription
    });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    // Переверяємо чи є в базі користувач з токеном verificationToken
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
    res.status(200).json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    // Перевіряємо чи є такий користувач в базі
    const user = await User.findOne({ email });
    // Якщо користувача немає в базі
    if (!user) {
        throw HttpError(400, "missing required field email")
    };
    // Якщо користувач вже верифікований
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    };
    // Якщо користувач не підтвердив верифікацію
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
    };
    await sendEmail(verifyEmail);
    res.json({
        message: `Verify ${user.email} send success`,
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    // Переверяємо чи є такий користувач в системі
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong")
    }
    // Перевірка verify користувача
    if (!user.verify) {
        throw HttpError(401, "Email is not verify")
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
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar)

};