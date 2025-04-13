import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; // Import CloudinaryService
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService, // Inject CloudinaryService
  ) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    // If profile picture is uploaded
    if (dto.profilePic) {
      // Upload the new profile picture to Cloudinary
      const profilePicUrl = await this.cloudinaryService.uploadImage(
        dto.profilePic,
        'users',
      );
      dto.profilePic = profilePicUrl; // Set the profile picture URL in the DTO
    }

    // Update user profile
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { ...dto },
    });

    return { message: 'Profile updated successfully', user };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({ where: { id: userId } });
    return { message: 'User account deleted successfully' };
  }
}
