// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from './model/user.model';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
  

  async findByBiometricKey(biometricKey: string) {
    return this.prisma.user.findUnique({ where: { biometricKey } });
  }

  async create(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async setBiometricKey(userId: string, biometricKey: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { biometricKey },
    });
  }


}
