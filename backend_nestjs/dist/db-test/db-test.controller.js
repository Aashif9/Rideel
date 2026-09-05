"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DbTestController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbTestController = void 0;
const common_1 = require("@nestjs/common");
const db_test_service_1 = require("./db-test.service");
let DbTestController = DbTestController_1 = class DbTestController {
    constructor(dbTestService) {
        this.dbTestService = dbTestService;
        this.logger = new common_1.Logger(DbTestController_1.name);
    }
    async test() {
        try {
            return await this.dbTestService.testConnection();
        }
        catch (error) {
            this.logger.error('PostgreSQL connection test failed', error?.message);
            throw new common_1.InternalServerErrorException({
                success: false,
                message: 'Failed to connect to PostgreSQL database.',
                error: error?.message || 'Unknown database connection error',
            });
        }
    }
};
exports.DbTestController = DbTestController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DbTestController.prototype, "test", null);
exports.DbTestController = DbTestController = DbTestController_1 = __decorate([
    (0, common_1.Controller)('db-test'),
    __metadata("design:paramtypes", [db_test_service_1.DbTestService])
], DbTestController);
//# sourceMappingURL=db-test.controller.js.map