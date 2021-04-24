import { ConfigService } from '../../config/config.service';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (configService: ConfigService) => {
  return {
    type: configService.get('DB_TYPE'),
    host: configService.get('DB_HOST'),
    port: configService.getNumber('DB_PORT'),
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASS'),
    database: configService.get('DB_NAME'),
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
  } as TypeOrmModuleOptions;
};
