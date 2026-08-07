"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetStatisticsUseCase = void 0;
class GetStatisticsUseCase {
    constructor(ticketRepo) {
        this.ticketRepo = ticketRepo;
    }
    async execute() {
        return await this.ticketRepo.getSystemStatistics();
    }
}
exports.GetStatisticsUseCase = GetStatisticsUseCase;
