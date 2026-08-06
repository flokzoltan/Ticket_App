import { Ticket } from '../entities/Ticket';

export interface ITicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  getSystemStatistics(): Promise<any>;
}