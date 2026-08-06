import { Ticket } from '../domain/entities/Ticket';
import { ITicketRepository } from '../domain/repositories/ITicketRepository';
import { IImageCompressionService } from '../infrastructure/services/CloudinaryImageService';

export class CreateTicketUseCase {
  constructor(
    private ticketRepo: ITicketRepository,
    private imageService: IImageCompressionService
  ) {}

  async execute(input: any): Promise<Ticket> {
    const photoUrls = await Promise.all(
      (input.photoBuffers || []).map((buf: Buffer) => this.imageService.compressAndUpload(buf))
    );

    const ticket = new Ticket({
      ...input,
      photoUrls,
      status: 'NEW',
      isPaid: false,
    });

    await this.ticketRepo.save(ticket);
    return ticket;
  }
}