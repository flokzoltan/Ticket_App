import { ITicketRepository } from '../domain/repositories/ITicketRepository';

export class GetStatisticsUseCase {
  constructor(private ticketRepo: ITicketRepository) {}

  async execute() {
    return await this.ticketRepo.getSystemStatistics();
  }
}