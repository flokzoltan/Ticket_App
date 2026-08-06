import express from 'express';
import path from 'path';
import { PostgresTicketRepository } from './infrastructure/database/PostgresTicketRepository';
import { CloudinaryImageService } from './infrastructure/services/CloudinaryImageService';
import { CreateTicketUseCase } from './use-cases/CreateTicket';
import { GetStatisticsUseCase } from './use-cases/GetStatistics';
import { TicketController } from './presentation/controllers/TicketController';
import { createTicketRouter } from './presentation/routes/ticketRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware-ek és EJS beállítása
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'presentation/views'));

// Clean Architecture komponensek összefűzése (Dependency Injection)
const ticketRepo = new PostgresTicketRepository();
const imageService = new CloudinaryImageService();

const createTicketUseCase = new CreateTicketUseCase(ticketRepo, imageService);
const getStatisticsUseCase = new GetStatisticsUseCase(ticketRepo);

const ticketController = new TicketController(createTicketUseCase, ticketRepo);

// Útvonalak regisztrálása
app.use('/tickets', createTicketRouter(ticketController));

app.get('/', (req, res) => {
  res.redirect('/tickets');
});

// Szerver indítása
app.listen(port, () => {
  console.log(`🚀 A szerviz backend fut a http://localhost:${port} címen`);
});