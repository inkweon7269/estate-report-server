import { Column, Entity, ManyToOne } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { stringValidationMessage } from '@root/common/validation-message/string-validation.message';
import { UserEntity } from '@root/entities/user.entity';
import { ReportEntity } from '@root/entities/report.entity';

@Entity('comment')
export class CommentEntity extends CommonEntity {
    @ApiProperty({ example: 1, description: '사용자 아이디', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column({ name: 'userId' })
    userId: number;

    @ApiProperty({ example: 1, description: '보고서 아이디', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column({ name: 'reportId' })
    reportId: number;

    @ApiProperty({
        example: '좋은 보고서네요!',
        description: '댓글 내용',
        required: true,
    })
    @IsNotEmpty()
    @IsString({ message: stringValidationMessage })
    @Column()
    comment: string;

    @ApiProperty({ example: 3, description: '좋아요 개수 표기' })
    @IsNotEmpty()
    @IsNumber()
    @Column({ default: 0 })
    likeCount: number;

    @ManyToOne(() => UserEntity, (user) => user.comments)
    user: UserEntity;

    @ManyToOne(() => ReportEntity, (report) => report.comments)
    report: ReportEntity;
}
