import { request } from "graphql-request";
import { createConnection } from "typeorm";
import { User } from "../src/entity/User";
import * as Redis from 'ioredis';

const redis = new Redis();
const email: string = "LOGIN_TEST"; // replace with email
const password: string = "testing";
const registerMutation = `mutation {register(email: "${email}" password: "${password}")}`;

beforeAll(async () => {
    await request("http://localhost:4000", registerMutation);
});

describe("Login User", () => {
    const loginMutation1 = `mutation {login(email: "invalid" password: "${password}")}`;
    test("invalid user", async () => {
        const res = await request("http://localhost:4000", loginMutation1);
        expect(res).toEqual({ login: "User invalid does not exist!" });
    });

    const loginMutation2 = `mutation {login(email: "${email}" password: "incorrect")}`;
    test("incorrect password", async () => {
        const res = await request("http://localhost:4000", loginMutation2);
        expect(res).toEqual({ login: "Password incorrect!" });
    });

    const loginMutation3 = `mutation {login(email: "${email}" password: "${password}")}`;
    test("user not verified", async () => {
        const res = await request("http://localhost:4000", loginMutation3);
        expect(res).toEqual({ login: `Email ${email} not verified, check your inbox!` });
    });

    const loginMutation4 = `mutation {login(email: "${email}" password: "${password}")}`;
    test("succesful login", async () => {
        await createConnection();
        await User.update({email: email}, {approved: true});
        await redis.flushall();
        const res = await request("http://localhost:4000", loginMutation4);
        expect(res).toEqual({ login: "Login Successful!" });
    });
});