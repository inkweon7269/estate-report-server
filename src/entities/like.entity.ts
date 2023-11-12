import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { UserEntity } from '@root/entities/user.entity';
import { ReportEntity } from '@root/entities/report.entity';

@Entity({ name: 'like' })
export class LikeEntity extends CommonEntity {
    @ApiProperty({ example: 1, description: '사용자 아이디', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column({ name: 'userId' })
    userId!: number;

    @ApiProperty({ example: 10, description: '보고서 아이디', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column({ name: 'reportId' })
    reportId!: number;

    @ManyToOne(() => UserEntity, (user) => user.likeList, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: UserEntity;

    @ManyToOne(() => ReportEntity, (report) => report.likeList, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'reportId', referencedColumnName: 'id' })
    report: ReportEntity;
}
