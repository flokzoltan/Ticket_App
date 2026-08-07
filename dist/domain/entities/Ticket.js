"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
class Ticket {
    constructor(props, id) {
        this.id = id || crypto.randomUUID();
        this.props = {
            ...props,
            createdAt: props.createdAt || new Date(),
        };
    }
}
exports.Ticket = Ticket;
