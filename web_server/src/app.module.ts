import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}