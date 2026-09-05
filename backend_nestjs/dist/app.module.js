"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const health_module_1 = require("./health/health.module");
const db_test_module_1 = require("./db-test/db-test.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const databaseUrl = config.get('DATABASE_URL');
                    const nodeEnv = config.get('NODE_ENV', 'development');
                    const isSecureConnection = nodeEnv === 'production' ||
                        (databaseUrl?.includes('supabase') ?? false) ||
                        (databaseUrl?.includes('neon') ?? false);
                    return {
                        type: 'postgres',
                        url: databaseUrl,
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: false,
                        migrationsRun: false,
                        migrations: [__dirname + '/../database/migrations/*.sql'],
                        logging: nodeEnv === 'development' ? ['query', 'error'] : ['error'],
                        ssl: isSecureConnection ? { rejectUnauthorized: false } : undefined,
                    };
                },
            }),
            health_module_1.HealthModule,
            db_test_module_1.DbTestModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map