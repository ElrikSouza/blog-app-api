import { Module } from '@nestjs/common';
import { CrpytService } from './crpyt.service';

/**
 * Simple Bcrypt wrapper
 */
@Module({
  providers: [CrpytService],
  exports: [CrpytService],
})
export class CrpytModule {}
