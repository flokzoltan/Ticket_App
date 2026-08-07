"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendEmailService = void 0;
class ResendEmailService {
    async sendTicketConfirmation(email, ticket, pdfBuffer) {
        console.log(`[Email Service] Visszaigazolás elküldve a(z) ${email} címre.`);
    }
}
exports.ResendEmailService = ResendEmailService;
