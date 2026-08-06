const fs = require('fs');
const path = require('path');

const projectFiles = {

  // ==========================================
  // 1. DOMAIN LAYER
  // ==========================================

  'src/domain/entities/Ticket.ts': `
export type TicketStatus = 'NEW' | 'IN_PROGRESS' | 'WAITING_FOR_PARTS' | 'READY' | 'CLOSED';

export interface TicketProps {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  deviceName: string;
  serialNumber?: string;
  issueDescription: string;
  damages?: string;
  accessories?: string;
  latitude: number;
  longitude: number;
  signatureBase64: string;
  photoUrls: string[];
  laborCost: number;
  partsCost: number;
  status: TicketStatus;
  isPaid: boolean;
  internalNotes?: string;
  createdAt?: Date;
}

export class Ticket {
  public id: string;
  public props: TicketProps;

  constructor(props: TicketProps, id?: string) {
    this.id = id || crypto.randomUUID();
    this.props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
  }
}
`,

  'src/domain/repositories/ITicketRepository.ts': `
import { Ticket } from '../entities/Ticket';

export interface ITicketRepository {
  save(ticket: Ticket): Promise<void>;
  findById(id: string): Promise<Ticket | null>;
  findAll(): Promise<Ticket[]>;
  getSystemStatistics(): Promise<any>;
}
`,

  // ==========================================
  // 2. USE CASES LAYER
  // ==========================================

  'src/use-cases/CreateTicket.ts': `
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
`,

  'src/use-cases/GeneratePdfReceipt.ts': `
import { Ticket } from '../domain/entities/Ticket';

export class GeneratePdfReceiptUseCase {
  async execute(ticket: Ticket): Promise<Buffer> {
    // PDF generálási logika (pl. PDFKit vagy Puppeteer segítségével)
    const mockPdfContent = \`MUNKALAP IGAZOLÁS - ID: \${ticket.id} - Ügyfél: \${ticket.props.clientName}\`;
    return Buffer.from(mockPdfContent);
  }
}
`,

  'src/use-cases/GetStatistics.ts': `
import { ITicketRepository } from '../domain/repositories/ITicketRepository';

export class GetStatisticsUseCase {
  constructor(private ticketRepo: ITicketRepository) {}

  async execute() {
    return await this.ticketRepo.getSystemStatistics();
  }
}
`,

  // ==========================================
  // 3. INFRASTRUCTURE LAYER
  // ==========================================

  'src/infrastructure/database/PostgresTicketRepository.ts': `
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
`,

  'src/infrastructure/services/CloudinaryImageService.ts': `
import { v2 as cloudinary } from 'cloudinary';

export interface IImageCompressionService {
  compressAndUpload(buffer: Buffer): Promise<string>;
}

export class CloudinaryImageService implements IImageCompressionService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async compressAndUpload(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'szerviz_tickets',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ],
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(buffer);
    });
  }
}
`,

  'src/infrastructure/services/ResendEmailService.ts': `
import { Ticket } from '../../domain/entities/Ticket';

export interface IEmailService {
  sendTicketConfirmation(email: string, ticket: Ticket, pdfBuffer: Buffer): Promise<void>;
}

export class ResendEmailService implements IEmailService {
  async sendTicketConfirmation(email: string, ticket: Ticket, pdfBuffer: Buffer): Promise<void> {
    console.log(\`[Email Service] Visszaigazolás elküldve a(z) \${email} címre.\`);
  }
}
`,

  // ==========================================
  // 4. PRESENTATION LAYER
  // ==========================================

  'src/presentation/controllers/TicketController.ts': `
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
`,

  'src/presentation/routes/ticketRoutes.ts': `
import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';

export function createTicketRouter(ticketController: TicketController): Router {
  const router = Router();

  router.get('/new', (req, res) => ticketController.renderCreateForm(req, res));
  router.get('/', (req, res) => ticketController.renderTicketList(req, res));
  router.post('/', (req, res) => ticketController.create(req, res));

  return router;
}
`,

  'src/presentation/views/create-ticket.ejs': `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Új Munkalap Létrehozása</title>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f4f6f9; }
    .form-box { max-width: 500px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    .field { margin-bottom: 12px; }
    label { display: block; font-weight: bold; margin-bottom: 4px; }
    input, textarea { width: 100%; padding: 8px; box-sizing: border-box; }
    button { background: #2563eb; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <div class="form-box">
    <h2>Új Szerviz Munkalap</h2>
    <form action="/tickets" method="POST">
      <div class="field"><label>Ügyfél neve</label><input type="text" name="clientName" required /></div>
      <div class="field"><label>Telefonszám</label><input type="text" name="clientPhone" required /></div>
      <div class="field"><label>Eszköz típusa</label><input type="text" name="deviceName" required /></div>
      <div class="field"><label>Hiba leírása</label><textarea name="issueDescription" required></textarea></div>
      <button type="submit">Munkalap Mentése</button>
    </form>
  </div>
</body>
</html>
`,

  'src/presentation/views/ticket-list.ejs': `
<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="UTF-8">
  <title>Munkalapok Listája</title>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
    table { width: 100%; border-collapse: collapse; background: white; }
    th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
    th { background: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Munkalapok</h1>
  <a href="/tickets/new">+ Új Ticket</a>
  <br><br>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Ügyfél</th>
        <th>Eszköz</th>
        <th>Státusz</th>
        <th>Fizetve</th>
      </tr>
    </thead>
    <tbody>
      <% tickets.forEach(ticket => { %>
        <tr>
          <td><%= ticket.id.slice(0, 8) %></td>
          <td><%= ticket.props.clientName %></td>
          <td><%= ticket.props.deviceName %></td>
          <td><%= ticket.props.status %></td>
          <td><%= ticket.props.isPaid ? 'Igen' : 'Nem' %></td>
        </tr>
      <% }) %>
    </tbody>
  </table>
</body>
</html>
`
};

// Generálás végrehajtása
console.log('🚀 Fájlok és struktúra generálása elindult...\n');

Object.entries(projectFiles).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Létrehozva: ${filePath}`);
});

console.log('\n🎉 Minden fájl sikeresen legyártva a pontos mappastruktúrában!');