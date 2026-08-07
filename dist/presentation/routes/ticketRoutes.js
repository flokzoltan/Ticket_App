"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTicketRouter = createTicketRouter;
const express_1 = require("express");
function createTicketRouter(ticketController) {
    const router = (0, express_1.Router)();
    router.get('/new', (req, res) => ticketController.renderCreateForm(req, res));
    router.get('/', (req, res) => ticketController.renderTicketList(req, res));
    router.post('/', (req, res) => ticketController.create(req, res));
    return router;
}
