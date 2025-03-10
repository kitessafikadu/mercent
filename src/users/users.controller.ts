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
import { UsersService } from './users.service'; // Fix here
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {} // Fix here

  @Get('profile')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  getProfile(@Req() req: Request & { user: any }) {
    // Fix here
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated' })
  updateProfile(
    @Req() req: Request & { user: any },
    @Body() dto: UpdateProfileDto,
  ) {
    // Fix here
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Delete('delete-account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User account deleted' })
  deleteAccount(@Req() req: Request & { user: any }) {
    // Fix here
    return this.usersService.deleteAccount(req.user.userId);
  }
}
