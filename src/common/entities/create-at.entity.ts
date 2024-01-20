import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, CreateDateColumn } from 'typeorm';

export class CreateAtEntity extends BaseEntity {
    // 생성일
    @ApiProperty({ name: 'createAt', example: new Date() })
    @CreateDateColumn({ type: 'timestamp without time zone' })
    createAt: Date;
}
