import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';


import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy, JwtStrategy } from './strategies';
import { JwtAuthGuard, LocalAuthGuard } from './auth.guards';

@Module({
  imports: [
    PassportModule,
    ConfigModule, 
    JwtModule.registerAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '60m' },
    }),
    inject: [ConfigService], 
  }),
  TypeOrmModule.forFeature([User]),
  ],
  providers: [
    AuthService, 
    JwtStrategy, 
    LocalStrategy,
    JwtAuthGuard, 
    LocalAuthGuard,
  ],
  controllers: [AuthController], 
})
export class AuthModule {}