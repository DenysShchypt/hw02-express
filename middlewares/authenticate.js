const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers");
const { SECRET_KEY } = process.env;
const { User } = require("../models/user");

// Middleware для перевірки авторізації
const authenticate = async (req, res, next) => {
    // Перевірка наявності bearer,token
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        next(HttpError(401, "Not authorized"))
    };
    // Перевірка наявності user i діючим token у нього з домомогою методу jwt.verify. Метод jwt.verify викидає помилку, тому ми огортаємо його в tryCatch
    try {
        // payloud з якого ми беремо id
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) {
            next(HttpError(401, "Not authorized"))
        };
        // Записуємо інформацію в object req про user яка буде в req controllers
        req.user = user;
        next();
    } catch {
        next(HttpError(401, "Not authorized"))
    };
};

module.exports = authenticate;
