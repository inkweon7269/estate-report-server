import { Module } from '@nestjs/common';
import { CommonService } from '@root/common/common.service';

@Module({
    providers: [CommonService],
    exports: [CommonService],
})
export class CommonModule {}
