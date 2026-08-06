import { PrismaClient } from '@prisma/client';
import { Ticket, TicketStatus } from '../../domain/entities/Ticket';
import { ITicketRepository } from '../../domain/repositories/ITicketRepository';

export class PostgresTicketRepository implements ITicketRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async save(ticket: Ticket): Promise<void> {
    await this.prisma.ticket.upsert({
      where: { id: ticket.id },
      update: {
        clientName: ticket.props.clientName,
        clientPhone: ticket.props.clientPhone,
        clientEmail: ticket.props.clientEmail,
        deviceName: ticket.props.deviceName,
        serialNumber: ticket.props.serialNumber,
        issueDescription: ticket.props.issueDescription,
        damages: ticket.props.damages,
        accessories: ticket.props.accessories,
        latitude: ticket.props.latitude,
        longitude: ticket.props.longitude,
        signatureBase64: ticket.props.signatureBase64,
        photoUrls: ticket.props.photoUrls,
        laborCost: ticket.props.laborCost,
        partsCost: ticket.props.partsCost,
        status: ticket.props.status as TicketStatus,
        isPaid: ticket.props.isPaid,
        internalNotes: ticket.props.internalNotes,
      },
      create: {
        id: ticket.id,
        clientName: ticket.props.clientName,
        clientPhone: ticket.props.clientPhone,
        clientEmail: ticket.props.clientEmail,
        deviceName: ticket.props.deviceName,
        serialNumber: ticket.props.serialNumber,
        issueDescription: ticket.props.issueDescription,
        damages: ticket.props.damages,
        accessories: ticket.props.accessories,
        latitude: ticket.props.latitude,
        longitude: ticket.props.longitude,
        signatureBase64: ticket.props.signatureBase64,
        photoUrls: ticket.props.photoUrls,
        laborCost: ticket.props.laborCost,
        partsCost: ticket.props.partsCost,
        status: ticket.props.status as TicketStatus,
        isPaid: ticket.props.isPaid,
        internalNotes: ticket.props.internalNotes,
        createdAt: ticket.props.createdAt,
      },
    });
  }

  async findById(id: string): Promise<Ticket | null> {
    const raw = await this.prisma.ticket.findUnique({ where: { id } });
    if (!raw) return null;
    return new Ticket({ ...raw, status: raw.status as TicketStatus }, raw.id);
  }

  async findAll(): Promise<Ticket[]> {
    const records = await this.prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
    return records.map((raw) => new Ticket({ ...raw, status: raw.status as TicketStatus }, raw.id));
  }

  async getSystemStatistics(): Promise<any> {
    const count = await this.prisma.ticket.count();
    return { totalTickets: count };
  }
}