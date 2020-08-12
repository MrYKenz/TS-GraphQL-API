import { request } from "graphql-request";
import { User } from "../src/entity/User";
import { createConnection } from "typeorm";

const email: string = "REGISTER@TEST.COM"; // SQL: delete from users;
const password: string = "Testing123!";

const registerMutationValid: string = `mutation {
    register(email: "${email}" password: "${password}")
}`
const registerMutationInvalidEmail: string = `mutation {
    register(email: "IN@VALID" password: "${password}")
}`
const registerMutationInvalidPW_TooShort: string = `mutation {
    register(email: "${email}" password: "Aa123!")
}`
const registerMutationInvalidPW_TooShort_NoNums_NoSpec: string = `mutation {
    register(email: "${email}" password: "Testing")
}`
const registerMutationInvalidPW_TooShort_NoNums_NoSpec_NoCaps: string = `mutation {
    register(email: "${email}" password: "testing")
}`
const registerMutationInvalidPW_NoNums_NoSpec_NoCaps: string = `mutation {
    register(email: "${email}" password: "password")
}`

// other invalid pwd combinations 

const registerMutationInvalidAll: string = `mutation {
    register(email: "" password: "")
}`

describe("register user", () => {
    // use graphql-request to run GQL against endpoint
    
    test("invalid email", async () => {
        const res = await request("http://localhost:4000", registerMutationInvalidEmail);
        expect(res).toEqual({ register: "Error: Invalid email address" });
    });
    
    test("invalid password too short", async () => {
        const res = await request("http://localhost:4000", registerMutationInvalidPW_TooShort);
        expect(res).toEqual({ register: "Error: Password must be 8 characters or longer" });
    });
    
    test("invalid password too short & no nums & no special", async () => {
        const res = await request("http://localhost:4000", registerMutationInvalidPW_TooShort_NoNums_NoSpec);
        expect(res).toEqual({ register: "Error: Password must be 8 characters or longer\nPassword does not contain any numbers\nPassword does not contain any special characters" });
    });

    test("invalid password too short & no nums & no special & no caps", async () => {
        const res = await request("http://localhost:4000", registerMutationInvalidPW_TooShort_NoNums_NoSpec_NoCaps);
        expect(res).toEqual({ register: "Error: Password must be 8 characters or longer\nPassword does not contain any numbers\nPassword does not contain any special characters\nPassword must contain at least one uppercase letter" });
    });

    test("invalid password ", async () => {
        const res = await request("http://localhost:4000", registerMutationInvalidPW_NoNums_NoSpec_NoCaps);
        expect(res).toEqual({ register: "Error: Password does not contain any numbers\nPassword does not contain any special characters\nPassword must contain at least one uppercase letter" });
    });

    test("invalid email", async () => {
        const res = await request("http://localhost:4000", registerMutationInvalidAll);
        expect(res).toEqual({ register: "Error: Invalid email address\nPassword must be 8 characters or longer\nPassword does not contain any numbers\nPassword does not contain any special characters\nPassword must contain at least one lowercase letter\nPassword must contain at least one uppercase letter" });
    });

    test("register user function works", async () => {
        const res = await request("http://localhost:4000", registerMutationValid);
        expect(res).toEqual({ register: `Created user ${email} Successfully` });
    });

    test("prevents duplicate user", async () => {
        const res = await request("http://localhost:4000", registerMutationValid);
        expect(res).toEqual({ register: `Error: User already exists ${email}` });
    });

    test("no duplicate user in db & hashed pw", async () => {
        await createConnection();
        const users = await User.find({ where: { email } });
        expect(users).toHaveLength(1);
        expect(users[0].password).not.toEqual(password);
    });
});
