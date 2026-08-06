import { Ticket } from '../domain/entities/Ticket';

export class GeneratePdfReceiptUseCase {
  async execute(ticket: Ticket): Promise<Buffer> {
    // PDF generálási logika (pl. PDFKit vagy Puppeteer segítségével)
    const mockPdfContent = `MUNKALAP IGAZOLÁS - ID: ${ticket.id} - Ügyfél: ${ticket.props.clientName}`;
    return Buffer.from(mockPdfContent);
  }
}