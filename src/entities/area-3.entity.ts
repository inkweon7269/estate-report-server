import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { Area2Entity } from '@root/entities/area-2.entity';
import { ApartEntity } from '@root/entities/apart.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@Entity({ name: 'area_3' })
export class Area3Entity extends CommonEntity {
    @ApiProperty({ example: 3, description: '시군구 아이디', required: false })
    @IsNumber()
    @Column({ name: 'area2Id', nullable: true })
    area2Id: number;

    @Column({ length: 40 })
    name: string;

    @Column({
        type: 'bigint',
        transformer: {
            to(value) {
                return value;
            },
            from(value) {
                return typeof value === 'string' ? parseInt(value, 10) : value;
            },
        },
    })
    code: number;

    @ManyToOne(() => Area2Entity, (area2) => area2.area3List, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'area2Id', referencedColumnName: 'id' })
    area2: Area2Entity;

    @OneToMany(() => ApartEntity, (apart) => apart.area3)
    apartList: ApartEntity[];
}
