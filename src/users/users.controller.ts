import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  Param,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Request } from 'express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get logged-in user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved' })
  async getProfile(@Req() req: Request & { user: any }) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('update-profile')
  @ApiOperation({ summary: 'Update profile with optional image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fullName: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', example: 'jane@example.com' },
        phoneNumber: { type: 'string', example: '+251911223344' },
        address: { type: 'string', example: 'Addis Ababa' },
        image: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multer.memoryStorage(),
    }),
  )
  async updateProfileWithImage(
    @Req() req: Request & { user: any },
    @Body() dto: UpdateProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let profilePicUrl: string | undefined = undefined;

    if (file) {
      profilePicUrl = await this.cloudinaryService.uploadImage(file, 'users');
    }

    return this.usersService.updateProfile(req.user.userId, {
      ...dto,
      ...(profilePicUrl ? { profilePic: profilePicUrl } : {}),
    });
  }

  @Delete('delete-account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User account deleted' })
  async deleteAccount(@Req() req: Request & { user: any }) {
    return this.usersService.deleteAccount(req.user.userId);
  }
}
