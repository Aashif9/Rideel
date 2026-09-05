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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbTestService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let DbTestService = class DbTestService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async testConnection() {
        const metaResult = await this.dataSource.query('SELECT current_database() AS db_name, current_user AS db_user;');
        const tablesResult = await this.dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
        const tableNames = tablesResult.map((r) => r.table_name);
        return {
            success: true,
            message: 'RIDEEL NestJS backend successfully connected to PostgreSQL!',
            connection: {
                database: metaResult[0]?.db_name,
                user: metaResult[0]?.db_user,
            },
            tables: tableNames,
            tableCount: tableNames.length,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.DbTestService = DbTestService;
exports.DbTestService = DbTestService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], DbTestService);
//# sourceMappingURL=db-test.service.js.map