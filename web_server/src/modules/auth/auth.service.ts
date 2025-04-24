import { JwtService } from '@nestjs/jwt';
import { InjectRepository} from '@nestjs/typeorm';
import { Injectable, ConflictException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { User } from '../user/user.entity'; 
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<User | null> {
    const isEmail = identifier.includes('@');
    const user = await this.userRepository.findOne({
        where: isEmail ? { email: identifier } : { username: identifier },
      });
    
    if (!user) {
      return null;
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }

  async signup(createUserDto: CreateUserDto): Promise<{ access_token: string; user: Omit<User, 'password'> }> {
    const existing = await this.userRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });
    
    if (existing) {
      if (existing.email === createUserDto.email) {
        throw new ConflictException('Email is already in use');
      } else if (existing.username === createUserDto.username) {
        throw new ConflictException('Username is already in use');
      }
    }    

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = this.userRepository.create({
      ...createUserDto,  
      password: hashedPassword,  
    }); 

    await this.userRepository.save(newUser);
    const { password, ...sanitized } = newUser;
    const payload: JwtPayload = { sub: newUser.id, username: newUser.username };

    return {
      access_token: this.jwtService.sign(payload),
      user: sanitized
    }; 
  }

  async login(user): Promise<{ access_token: string }> {
    const payload: JwtPayload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
