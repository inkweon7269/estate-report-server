import { Controller, Get } from '@nestjs/common';
import { ApartService } from '@root/resource/apart/apart.service';

@Controller('v1/apart')
export class ApartController {
    constructor(private apartService: ApartService) {}
}
