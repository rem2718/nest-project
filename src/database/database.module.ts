// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from '../config/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmAsyncConfig)],
})
export class DatabaseModule {}
