import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area1Entity } from '@root/entities/area-1.entity';
import { AreaController } from '@root/resource/area/area.controller';
import { AreaService } from '@root/resource/area/area.service';
import { Area2Entity } from '@root/entities/area-2.entity';
import { Area3Entity } from '@root/entities/area-3.entity';
import { ApartModule } from '@root/resource/apart/apart.module';
import { CommonModule } from '@root/common/common.module';

@Module({
    imports: [TypeOrmModule.forFeature([Area1Entity, Area2Entity, Area3Entity]), ApartModule, CommonModule],
    controllers: [AreaController],
    providers: [AreaService],
    exports: [AreaService],
})
export class AreaModule {}
