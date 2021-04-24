import { ConfigService } from '../../config/config.service';
import { JwtModuleOptions } from '@nestjs/jwt';

export const jwtConfig = (configService: ConfigService) => {
  return {
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: configService.get('JWT_EXPIRATION_DURATION') },
  } as JwtModuleOptions;
};
