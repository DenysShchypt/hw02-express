// . Написати unit-тести для контролера входу (логін)

// відповідь повина мати статус-код 200
// у відповіді повинен повертатися токен
// у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String

const request = require("supertest");
const mongoose = require("mongoose");
const app = require('../app');
const { DB_HOST, PORT = 3000 } = process.env;

describe("login test", () => {
    let server = null;

    beforeEach(() => {
        mongoose.connect(DB_HOST).then(
            server = app.listen(PORT)
        ).catch(error => {
            console.log(error.message);
        });
    });

    afterEach(() => {
        mongoose.connection.close().then(server.close()).catch(error => {
            console.log(error.message);
        });;
    });

    it("login test", async () => {
        const checkLogin = {
            "password": "denys@mail.com",
            "email": "denys@mail.com",
        }
        const response = await request(app).post("/api/users/login").send(checkLogin);
        // Use .toBe to compare primitive values or to check referential identity of object instances. It calls Object.is to compare values, which is even better for testing than === strict equality operator.
        expect(response.status).toBe(200);
        // Висористовуйте .toBeDefined(), щоб переірити, що змінна визначена. 
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.user.email).toBe('string');
        expect(typeof response.body.user.subscription).toBe('string');
        // у відповіді повинен повертатися об'єкт user з 2 полями email и subscription з типом даних String
    })
})
