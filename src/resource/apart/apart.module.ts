import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApartEntity } from '@root/entities/apart.entity';
import { ApartController } from '@root/resource/apart/apart.controller';
import { ApartService } from '@root/resource/apart/apart.service';

@Module({
    imports: [TypeOrmModule.forFeature([ApartEntity])],
    controllers: [ApartController],
    providers: [ApartService],
    exports: [ApartService],
})
export class ApartModule {}
