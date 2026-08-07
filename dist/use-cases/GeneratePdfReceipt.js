"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePdfReceiptUseCase = void 0;
class GeneratePdfReceiptUseCase {
    async execute(ticket) {
        // PDF generálási logika (pl. PDFKit vagy Puppeteer segítségével)
        const mockPdfContent = `MUNKALAP IGAZOLÁS - ID: ${ticket.id} - Ügyfél: ${ticket.props.clientName}`;
        return Buffer.from(mockPdfContent);
    }
}
exports.GeneratePdfReceiptUseCase = GeneratePdfReceiptUseCase;
