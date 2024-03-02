import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommonService } from '@root/common/common.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtServiceAuthGuard } from '@root/auth/guards/jwt-service.guard';

@UseGuards(JwtServiceAuthGuard)
@Controller('v1/common')
export class CommonController {
    constructor(private readonly commonService: CommonService) {}

    @Post('image')
    @UseInterceptors(FileInterceptor('image'))
    postImage(@UploadedFile() file: Express.Multer.File) {
        return {
            fileName: file.filename,
        };
    }
}
