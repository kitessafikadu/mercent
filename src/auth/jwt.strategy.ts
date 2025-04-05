import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const secret = configService.get('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });

    this.logger.log('JwtStrategy initialized successfully');
  }

  async validate(payload: { userId: string; email: string; userType: string }) {
    console.log('JwtStrategy validate -> payload:', payload);
    if (!payload || !payload.userId) {
      console.error('JwtStrategy validate -> Invalid payload');
      return null; // Returning null will cause `user: false` in JwtAuthGuard
    }
    const user = {
      userId: payload.userId,
      email: payload.email,
      userType: payload.userType,
    };
    console.log('JwtStrategy validate -> user:', user);
    return user;
  }
}
