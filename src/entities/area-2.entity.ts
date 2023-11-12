import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { Area1Entity } from '@root/entities/area-1.entity';
import { Area3Entity } from '@root/entities/area-3.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@Entity({ name: 'area_2' })
export class Area2Entity extends CommonEntity {
    @ApiProperty({ example: 3, description: '시도 아이디', required: false })
    @IsNumber()
    @Column({ name: 'area1Id', nullable: true })
    area1Id: number;

    @Column({ length: 40 })
    name: string;

    @Column()
    code: number;

    @ManyToOne(() => Area1Entity, (area1) => area1.area2List, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'area1Id', referencedColumnName: 'id' })
    area1: Area1Entity;

    @OneToMany(() => Area3Entity, (area3) => area3.area2)
    area3List: Area3Entity[];
}
