import { createConnection } from "typeorm";
// import Redis from "ioredis";
import axios from "axios";

import { User } from "../src/entity/User";

// let user: User;
const email: string = "AUTH@TEST.COM";
const password: string = "Testing123!";
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

describe("Auth Status", () => {
    test("User not logged in", async () => {
        // not finished
    });

    const loginMutation = (eml: string, pwd: string) => `mutation {login(email: "${eml}" password: "${pwd}")}`;
    const userQuery = "query {authStatus}";
    test("Authorization true but session cookie false", async () => {
        await axios.post("http://localhost:4000/", {query: loginMutation(email, password)}, {withCredentials: true});
        const result = await axios.post("http://localhost:4000/", {query: userQuery}, {withCredentials: true, headers: {"Authorization": "pass"}});
        console.log(result.data);
    });
});