import { Controller, Get } from '@nestjs/common';
import { LicenseService } from './license.service';

@Controller('licenses')
export class LicenseController {
  constructor(private readonly licenseService: LicenseService) {}

  @Get()
  async findAll() {
    return await this.licenseService.findAll();
  }
}
