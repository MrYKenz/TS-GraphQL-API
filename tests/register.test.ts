import { request } from "graphql-request";
import { User } from "../src/entity/User";
import { createConnection } from "typeorm";

const email: string = "REGISTER@TEST.COM"; // SQL: delete from users;
const password: string = "Testing123!";

const registerMutation: string = `mutation {
    register(email: "${email}" password: "${password}")
}`

describe("register user", () => {
    // use graphql-request to run GQL against endpoint
    test("register user function works", async () => {
        const res = await request("http://localhost:4000", registerMutation);
        expect(res).toEqual({ register: expect.any(String) }); // if user already create message
    });

    test("no duplicate users & hashed pw", async () => {
        await createConnection();
        const users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
        expect(users[0].password).not.toEqual(password);
    });
});
