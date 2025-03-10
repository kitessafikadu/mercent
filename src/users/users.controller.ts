import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth() // Requires Bearer Token in Swagger
@Controller('users')
@UseGuards(JwtAuthGuard) // Protect routes with JWT Authentication
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  getProfile(@Req() req: Request) {
    return this.userService.getProfile(req.user['userId']);
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  updateProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    return this.userService.updateProfile(req.user['userId'], dto);
  }

  @Delete('delete-account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User account deleted' })
  deleteAccount(@Req() req: Request) {
    return this.userService.deleteAccount(req.user['userId']);
  }
}
