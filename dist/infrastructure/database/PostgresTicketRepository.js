"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresTicketRepository = void 0;
const client_1 = require("@prisma/client");
const Ticket_1 = require("../../domain/entities/Ticket");
class PostgresTicketRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async save(ticket) {
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
                status: ticket.props.status,
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
                status: ticket.props.status,
                isPaid: ticket.props.isPaid,
                internalNotes: ticket.props.internalNotes,
                createdAt: ticket.props.createdAt,
            },
        });
    }
    async findById(id) {
        const raw = await this.prisma.ticket.findUnique({ where: { id } });
        if (!raw)
            return null;
        return new Ticket_1.Ticket({
            clientName: raw.clientName,
            clientPhone: raw.clientPhone,
            clientEmail: raw.clientEmail,
            deviceName: raw.deviceName,
            serialNumber: raw.serialNumber ?? undefined,
            issueDescription: raw.issueDescription,
            damages: raw.damages ?? undefined,
            accessories: raw.accessories ?? undefined,
            latitude: raw.latitude,
            longitude: raw.longitude,
            signatureBase64: raw.signatureBase64,
            photoUrls: raw.photoUrls,
            laborCost: raw.laborCost,
            partsCost: raw.partsCost,
            status: raw.status,
            isPaid: raw.isPaid,
            internalNotes: raw.internalNotes ?? undefined,
            createdAt: raw.createdAt,
        }, raw.id);
    }
    async findAll() {
        const records = await this.prisma.ticket.findMany({ orderBy: { createdAt: 'desc' } });
        return records.map((raw) => new Ticket_1.Ticket({
            clientName: raw.clientName,
            clientPhone: raw.clientPhone,
            clientEmail: raw.clientEmail,
            deviceName: raw.deviceName,
            serialNumber: raw.serialNumber ?? undefined,
            issueDescription: raw.issueDescription,
            damages: raw.damages ?? undefined,
            accessories: raw.accessories ?? undefined,
            latitude: raw.latitude,
            longitude: raw.longitude,
            signatureBase64: raw.signatureBase64,
            photoUrls: raw.photoUrls,
            laborCost: raw.laborCost,
            partsCost: raw.partsCost,
            status: raw.status,
            isPaid: raw.isPaid,
            internalNotes: raw.internalNotes ?? undefined,
            createdAt: raw.createdAt,
        }, raw.id));
    }
    async getSystemStatistics() {
        const count = await this.prisma.ticket.count();
        return { totalTickets: count };
    }
}
exports.PostgresTicketRepository = PostgresTicketRepository;
