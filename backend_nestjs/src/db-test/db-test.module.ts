import { Module } from '@nestjs/common';
import { DbTestController } from './db-test.controller';
import { DbTestService } from './db-test.service';

@Module({
    controllers: [DbTestController],
    providers: [DbTestService],
})
export class DbTestModule { }
