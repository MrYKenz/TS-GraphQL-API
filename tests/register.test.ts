import { request } from "graphql-request";
import { User } from "../src/entity/User";
import { createConnection } from "typeorm";

const email: string = "JEST_TEST"; // SQL: delete from users;
const password: string = "testing";

const registerMutation: string = `mutation {
    register(email: "${email}" password: "${password}")
}`

test("register user", async () => {
    // use graphql-request to run GQL against endpoint
    const res = await request("http://localhost:4000", registerMutation);
    // check register object with string is returned
    expect(res).toEqual({ register: expect.any(String) });
    // search DB for user & check only 1 exists 
    await createConnection();
    const users = await User.find({ where: { email } });
    expect(users).toHaveLength(1);
    // check password is hashed - not the same as plain string
    expect(users[0].password).not.toEqual(password);
});
