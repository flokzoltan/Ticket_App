import { Router } from 'express';
import { TicketController } from '../controllers/TicketController';

export function createTicketRouter(ticketController: TicketController): Router {
  const router = Router();

  router.get('/new', (req, res) => ticketController.renderCreateForm(req, res));
  router.get('/', (req, res) => ticketController.renderTicketList(req, res));
  router.post('/', (req, res) => ticketController.create(req, res));

  return router;
}