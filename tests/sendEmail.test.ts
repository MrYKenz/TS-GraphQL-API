import { sendEmail } from "../src/utils/sendEmail";

const validEmail = "fennec.cathan@owee.org"; // temp email
const invalidEmail = "fakeEMAIL";
const testLink = "test.com";

describe("Confirmation Email", () => {

    test("valid email works", async () => {
        const result = await sendEmail(validEmail, testLink);
        expect(result).toBe("Emails Sent: 1");
    });

    test("invalid email error picked-up", async () => {
        const result = await sendEmail(invalidEmail, testLink);
        expect(result).toBe("SparkPostError At least one valid recipient is required");
    });

});