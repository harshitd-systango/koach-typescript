import Sendgrid from 'sendgrid';
import * as helper from 'sendgrid/lib/helpers/mail/mail';
export class SendMail {
    constructor() {}
    async sendMail(from: string, to: string, esubject: string, html: string) {
        // Create a mailer
        const mailer = Sendgrid('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');
        // Create the email object
        const email = new helper.Mail();
        // Set the from address
        const fromEmail = new helper.Email(from);
        email.setFrom(fromEmail);
        // Set the email subject
        email.setSubject(esubject);
        // Set the content - even if your template doesn't use content, the API requires at least one character to be sent
        const content = new helper.Content('text/html', html);
        email.addContent(content);
        // Create some personalization for the email
        const personalization = new helper.Personalization();
        // Add a to address
        const toEmail = new helper.Email(to);
        personalization.addTo(toEmail);
        // Add all of these personalizations to the email
        email.addPersonalization(personalization);
        // Put everything together into an email request object
        const request = mailer.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: email.toJSON()
        });
        // Send the email!
        try {
            await new Promise(function (resolve, reject) {
                mailer.API(request, (error, response) => {
                    if (error) {
                        console.log('Error', error);
                        reject();
                    }
                    else {
                        console.log(response.statusCode);
                        console.log(response.body);
                        console.log(response.headers);
                        resolve();
                    }
                });
            });
            return 1;
        }
        catch (e) {
            return 0;
        }
    }
    
}