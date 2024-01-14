import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ReportEntity } from '@root/entities/report.entity';
import { LikeEntity } from '@root/entities/like.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
    @ApiProperty({
        example: 'dev123@gmail.com',
        description: '사용자 이메일',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    @Column()
    email: string;

    @ApiProperty({
        example: 'dev1234567890',
        description: '사용자 비밀번호',
        required: true,
    })
    @IsString()
    @Length(1, 255)
    @IsNotEmpty()
    @Column({ length: 255 })
    password: string;

    @Column({ nullable: true })
    currentRefreshToken: string;

    @Column({ type: 'timestamp', nullable: true })
    currentRefreshTokenExp: Date;

    @OneToMany(() => ReportEntity, (report) => report.user)
    reportList: ReportEntity[];

    @OneToMany(() => LikeEntity, (like) => like.user)
    likeList: LikeEntity[];
}
