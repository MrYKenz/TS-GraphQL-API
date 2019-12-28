import { createConnection } from "typeorm";
import * as Redis from "ioredis";
import axios from "axios";

import { confirmEmailLink } from "../src/utils/confirmEmail";
import { User } from "../src/entity/User";

let user: User;
let url: string;
const redis = new Redis;

beforeAll(async () => {
    await createConnection();
    const newUser = await User.create({
        email:"EMAIL_TEST",
        password: "testing"
    }).save();
    user = newUser;
    url = await confirmEmailLink("http://localhost:4000", 
        user.id, redis);
});

describe("confirmation email", () => {

    test("confirmation key created", async () => {
        const paths = url.split("/");
        const key = paths[paths.length-1];
        const id = await redis.get(key);
        expect(id).toEqual(user.id);
    });
    test("confirmation link works", async () => {
        const res = await axios.get(url);
        expect(res.data).toMatch("success");
    });
    test("approved user created", async () => {
        const approvedUser = await User.findOne({ where: { id: user.id }})
        approvedUser && expect(approvedUser.approved).toBe(true)
    });
    test("confirmation key removed", async () => {
        const paths = url.split("/");
        const key = paths[paths.length-1];
        const id = await redis.get(key);
        expect(id).toBeNull();
    });

});
