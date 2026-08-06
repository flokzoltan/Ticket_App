import { Request, Response } from 'express';
import { CreateTicketUseCase } from '../../use-cases/CreateTicket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';

export class TicketController {
  constructor(
    private createTicketUseCase: CreateTicketUseCase,
    private ticketRepo: ITicketRepository
  ) {}

  async renderCreateForm(req: Request, res: Response): Promise<void> {
    res.render('create-ticket');
  }

  async renderTicketList(req: Request, res: Response): Promise<void> {
    const tickets = await this.ticketRepo.findAll();
    res.render('ticket-list', { tickets });
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      await this.createTicketUseCase.execute(req.body);
      res.redirect('/tickets');
    } catch (error) {
      res.status(500).send('Hiba történt a ticket létrehozása során.');
    }
  }
}