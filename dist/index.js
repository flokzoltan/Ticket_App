"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const PostgresTicketRepository_1 = require("./infrastructure/database/PostgresTicketRepository");
const CloudinaryImageService_1 = require("./infrastructure/services/CloudinaryImageService");
const CreateTicket_1 = require("./use-cases/CreateTicket");
const GetStatistics_1 = require("./use-cases/GetStatistics");
const TicketController_1 = require("./presentation/controllers/TicketController");
const ticketRoutes_1 = require("./presentation/routes/ticketRoutes");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware-ek és EJS beállítása
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'presentation/views'));
// Clean Architecture komponensek összefűzése (Dependency Injection)
const ticketRepo = new PostgresTicketRepository_1.PostgresTicketRepository();
const imageService = new CloudinaryImageService_1.CloudinaryImageService();
const createTicketUseCase = new CreateTicket_1.CreateTicketUseCase(ticketRepo, imageService);
const getStatisticsUseCase = new GetStatistics_1.GetStatisticsUseCase(ticketRepo);
const ticketController = new TicketController_1.TicketController(createTicketUseCase, ticketRepo);
// Útvonalak regisztrálása
app.use('/tickets', (0, ticketRoutes_1.createTicketRouter)(ticketController));
app.get('/', (req, res) => {
    res.redirect('/tickets');
});
// Szerver indítása
app.listen(port, () => {
    console.log(`🚀 A szerviz backend fut a http://localhost:${port} címen`);
});
