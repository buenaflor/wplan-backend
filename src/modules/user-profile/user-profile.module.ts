import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './user-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile])],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
