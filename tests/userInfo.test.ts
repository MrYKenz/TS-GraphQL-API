import { createConnection } from "typeorm";
// import * as Redis from "ioredis";
import axios from "axios";

import { User } from "../src/entity/User";

// let user: User;
const email: string = "USERINFO_TEST";
const password: string = "testing";
// const redis = new Redis({port: 6379});

beforeAll(async () => {
    await createConnection();
    await User.create({
        email,
        password,
        approved: true
    }).save();
    // user = newUser;
});

describe("userInfo", () => {
    test("User not logged in", async () => {
        // not finished
    });

    const loginMutation = (eml: string, pwd: string) => `mutation {login(email: "${eml}" password: "${pwd}")}`;
    const userQuery = "query {userInfo}";
    test("get current user", async () => {
        await axios.post("http://localhost:4000", {query: loginMutation(email, password)}, {withCredentials: true});
        const result = await axios.post("http://localhost:4000", {query: userQuery}, {withCredentials: true});
        console.log(result);
    });
});