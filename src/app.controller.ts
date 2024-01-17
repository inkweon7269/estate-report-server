import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from '@root/app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}
    @Get()
    hello(@Query('name') name: string = 'World') {
        return { message: this.appService.getHello(name) };
    }
}
