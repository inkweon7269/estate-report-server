import { Column, Entity, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { Area2Entity } from '@root/entities/area-2.entity';

@Entity({ name: 'area_1' })
export class Area1Entity extends CommonEntity {
    @ApiProperty({ example: '서울특별시', description: '지역명', required: true })
    @IsNotEmpty()
    @IsString()
    @Length(1, 40)
    @Column()
    name: string;

    @ApiProperty({ example: 11000, description: '지역코드', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    code: number;

    @OneToMany(() => Area2Entity, (area2) => area2.area1)
    area2List: Area2Entity[];
}
