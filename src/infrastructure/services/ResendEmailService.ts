import { Ticket } from '../../domain/entities/Ticket';

export interface IEmailService {
  sendTicketConfirmation(email: string, ticket: Ticket, pdfBuffer: Buffer): Promise<void>;
}

export class ResendEmailService implements IEmailService {
  async sendTicketConfirmation(email: string, ticket: Ticket, pdfBuffer: Buffer): Promise<void> {
    console.log(`[Email Service] Visszaigazolás elküldve a(z) ${email} címre.`);
  }
}