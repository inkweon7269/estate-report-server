import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAtEntity } from '@root/common/entities/create-at.entity';

export class CommonEntity extends CreateAtEntity {
    @ApiProperty({ name: 'id', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    // 업데이트일
    @ApiProperty({ name: 'updateAt', example: new Date() })
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
    updateAt: Date;

    // 삭제일
    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    deleteAt: Date;
}
