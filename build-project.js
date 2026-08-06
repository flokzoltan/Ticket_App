const fs = require('fs');
const path = require('path');

const files = {
  'package.json': JSON.stringify({
    "name": "szerviz-backend",
    "version": "1.0.0",
    "main": "dist/index.js",
    "scripts": {
      "build": "tsc",
      "start": "node dist/index.js",
      "dev": "ts-node-dev src/index.ts"
    },
    "dependencies": {
      "@prisma/client": "^5.0.0",
      "cloudinary": "^1.41.0",
      "express": "^4.18.2",
      "ejs": "^3.1.9"
    },
    "devDependencies": {
      "typescript": "^5.0.0",
      "prisma": "^5.0.0",
      "ts-node-dev": "^2.0.0",
      "@types/express": "^4.17.17",
      "@types/node": "^20.0.0"
    }
  }, null, 2),

  'prisma/schema.prisma': `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum TicketStatus {
  NEW
  IN_PROGRESS
  WAITING_FOR_PARTS
  READY
  CLOSED
}

model Ticket {
  id               String       @id @default(uuid())
  clientName       String
  clientPhone      String
  clientEmail      String
  deviceName       String
  serialNumber     String?
  issueDescription String
  damages          String?
  accessories      String?
  latitude         Float
  longitude        Float
  signatureBase64  String       @db.Text
  photoUrls        String[]
  laborCost        Float        @default(0)
  partsCost        Float        @default(0)
  status           TicketStatus @default(NEW)
  isPaid           Boolean      @default(false)
  internalNotes    String?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt
}
`,

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

  'src/use-cases/GetStatistics.ts': `
export class GetStatisticsUseCase {
  constructor(private ticketRepo: any) {}

  async execute() {
    return await this.ticketRepo.getSystemStatistics();
  }
}
`,

  '.env.example': `
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/szervizdb?schema=public"
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
`
};

// Generálás futtatása
Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim());
  console.log(`✅ Létrehozva: ${filePath}`);
});

console.log('\n🚀 Projektstruktúra sikeresen felépítve!');