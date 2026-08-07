"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
class TicketController {
    constructor(createTicketUseCase, ticketRepo) {
        this.createTicketUseCase = createTicketUseCase;
        this.ticketRepo = ticketRepo;
    }
    async renderCreateForm(req, res) {
        res.render('create-ticket');
    }
    async renderTicketList(req, res) {
        const tickets = await this.ticketRepo.findAll();
        res.render('ticket-list', { tickets });
    }
    async create(req, res) {
        try {
            await this.createTicketUseCase.execute(req.body);
            res.redirect('/tickets');
        }
        catch (error) {
            res.status(500).send('Hiba történt a ticket létrehozása során.');
        }
    }
}
exports.TicketController = TicketController;
