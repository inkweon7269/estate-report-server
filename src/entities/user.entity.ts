import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ReportEntity } from '@root/entities/report.entity';
import { ReportUserBridgeEntity } from '@root/entities/report-user-bridge.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
    @ApiProperty({
        example: 'dev123@gmail.com',
        description: '사용자 이메일',
        required: true,
    })
    @IsEmail({}, { message: '이메일 양식으로 입력해야 합니다.' })
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        example: 'dev1234567890',
        description: '사용자 비밀번호',
        required: true,
    })
    @IsString({ message: '비밀번호는 String 타입을 입력해야 합니다.' })
    @Length(1, 255)
    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Column({ length: 255 })
    password: string;

    @Column({ nullable: true })
    currentRefreshToken: string;

    @Column({ type: 'timestamp', nullable: true })
    currentRefreshTokenExp: Date;

    @OneToMany(() => ReportEntity, (report) => report.user)
    reportList: ReportEntity[];

    @OneToMany(() => ReportUserBridgeEntity, (bridge) => bridge.report)
    reportUserBridge: ReportUserBridgeEntity[];
}
