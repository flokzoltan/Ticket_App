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