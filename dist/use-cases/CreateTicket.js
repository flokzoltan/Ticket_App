"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicketUseCase = void 0;
const Ticket_1 = require("../domain/entities/Ticket");
class CreateTicketUseCase {
    constructor(ticketRepo, imageService) {
        this.ticketRepo = ticketRepo;
        this.imageService = imageService;
    }
    async execute(input) {
        const photoUrls = await Promise.all((input.photoBuffers || []).map((buf) => this.imageService.compressAndUpload(buf)));
        const ticket = new Ticket_1.Ticket({
            ...input,
            photoUrls,
            status: 'NEW',
            isPaid: false,
        });
        await this.ticketRepo.save(ticket);
        return ticket;
    }
}
exports.CreateTicketUseCase = CreateTicketUseCase;
