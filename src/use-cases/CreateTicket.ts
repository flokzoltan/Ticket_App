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
      (input.photoBuffers || []).map((buf: Buffer) =>
        this.imageService.compressAndUpload(buf)
      )
    );

    const ticket = new Ticket({
      clientName: input.clientName,
      clientPhone: input.clientPhone,
      clientEmail: input.clientEmail || 'nincs@megadva.hu',
      deviceName: input.deviceName,
      serialNumber: input.serialNumber || undefined,
      issueDescription: input.issueDescription,
      damages: input.damages || undefined,
      accessories: input.accessories || undefined,
      latitude: Number(input.latitude) || 0,
      longitude: Number(input.longitude) || 0,
      signatureBase64: input.signatureBase64 || '',
      photoUrls: photoUrls.length ? photoUrls : [],
      laborCost: Number(input.laborCost) || 0,
      partsCost: Number(input.partsCost) || 0,
      status: 'NEW',
      isPaid: false,
      internalNotes: input.internalNotes || undefined,
    });

    await this.ticketRepo.save(ticket);
    return ticket;
  }
}