import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ProfileNameValidationPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value !== 'string' || value.length < 2 || value.length > 35) {
      throw new BadRequestException('Invalid profile name');
    }
    return value;
  }
}
