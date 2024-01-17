import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CommonEntity extends BaseEntity {
    @ApiProperty({ name: 'id', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    // 생성일
    @ApiProperty({ name: 'createAt', example: new Date() })
    @CreateDateColumn({ type: 'timestamp without time zone' })
    createAt: Date;

    // 업데이트일
    @ApiProperty({ name: 'updateAt', example: new Date() })
    @UpdateDateColumn({ type: 'timestamp without time zone', nullable: true })
    updateAt: Date;

    // 삭제일
    @DeleteDateColumn({ type: 'timestamp without time zone', nullable: true })
    deleteAt: Date;
}
