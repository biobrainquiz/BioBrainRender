const { Resend } = require('resend');

class Mailer {
    constructor() {
        this.client = new Resend(process.env.RESEND_API_KEY);
    }

    /**
     * @param {Object} options
     * @param {string} options.from
     * @param {string[]} options.to
     * @param {string} options.subject
     * @param {string} options.html
     * @param {Array} [options.attachments]
     */
    async send(options) {
        try {
            const response = await this.client.emails.send({
                from: options.from ,
                to: options.to,
                subject: options.subject,
                html: options.html,
                attachments: options.attachments || [],
            });

            if (response.error) {
                throw new Error(`Resend Error: ${JSON.stringify(response.error)}`);
            }

            return response.data;
        } catch (error) {
            // Log it here and re-throw for the controller
            console.error("Mailer Service Error:", error);
            throw error;
        }
    }
}

module.exports = new Mailer();