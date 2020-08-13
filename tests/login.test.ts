import { request } from "graphql-request";
import { createConnection } from "typeorm";
import { User } from "../src/entity/User";
import Redis from 'ioredis';

const redis = new Redis();
const email: string = "LOGIN@TEST.COM"; // replace with email
const password: string = "Testing123!";
const registerMutation = `mutation {register(email: "${email}" password: "${password}")}`;

beforeAll(async () => {
    await request("http://localhost:4000", registerMutation);
});

describe("Login User", () => {
    const loginMutationInvalid = `mutation {login(email: "" password: "")}`;
    test("empty fields fails validation", async () => {
        const res = await request("http://localhost:4000", loginMutationInvalid);
        expect(res).toEqual({ login: "Error: Username can not be empty\nPassword can not be empty" });
    });

    const loginMutationInvalid2 = `mutation {login(email: "" password: "Testing123!")}`;
    test("empty email fails validation", async () => {
        const res = await request("http://localhost:4000", loginMutationInvalid2);
        expect(res).toEqual({ login: "Error: Username can not be empty" });
    });

    const loginMutationInvalid3 = `mutation {login(email: "LOGIN@TEST.COM" password: "")}`;
    test("empty password fails validation", async () => {
        const res = await request("http://localhost:4000", loginMutationInvalid3);
        expect(res).toEqual({ login: "Error: Password can not be empty" });
    });

    const loginMutation1 = `mutation {login(email: "invalid" password: "${password}")}`;
    test("invalid user", async () => {
        const res = await request("http://localhost:4000", loginMutation1);
        expect(res).toEqual({ login: "Error: User invalid does not exist!" });
    });

    const loginMutation2 = `mutation {login(email: "${email}" password: "incorrect")}`;
    test("incorrect password", async () => {
        const res = await request("http://localhost:4000", loginMutation2);
        expect(res).toEqual({ login: "Error: Password incorrect!" });
    });

    const loginMutation3 = `mutation {login(email: "${email}" password: "${password}")}`;
    test("user not verified", async () => {
        const res = await request("http://localhost:4000", loginMutation3);
        expect(res).toEqual({ login: `Error: Email ${email} not verified, check your inbox!` });
    });

    const loginMutation4 = `mutation {login(email: "${email}" password: "${password}")}`;
    test("succesful login", async () => {
        await createConnection();
        await User.update({email: email}, {approved: true});
        await redis.flushall();
        const res = await request("http://localhost:4000", loginMutation4);
        expect(res).toEqual({ login: `Logged in ${email} Successfully!` });
    });
});
