import * as SparkPost from "sparkpost";

const client = new SparkPost();

export const sendEmail = async (
    userEmail: string,
    verificationLink: string
    ) => {
    let outcome: string;
    try {
        const emailSent = await client.transmissions.send({
            options: {sandbox: true},
            content: {
            from: 'sandbox@sparkpostbox.com',
            subject: 'Confirm Email',
            html:`<html>
                    <body>
                        <p>Confirm your email address by 
                        <a href="${verificationLink}">
                        clicking here!</a></p>
                    </body>
                </html>`
            },
            recipients: [{address: userEmail}]
        });
        outcome = "Emails Sent: " + emailSent.results.total_accepted_recipients.toString();
    }
    catch(err) {
        outcome = err.name + ": " + err.errors[0].message;
    }
    return outcome;
}