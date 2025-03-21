import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        phoneNumber: dto.phoneNumber,
        address: dto.address,
        userType: 'USER',
        userStatus: 'INACTIVE',
      },
    });

    return { message: 'User registered successfully', user };
  }

  async signin(dto: SigninDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = this.jwtService.sign({
      userId: user.id,
      email: user.email,
    });

    return { message: 'Login successful', token };
  }
}
