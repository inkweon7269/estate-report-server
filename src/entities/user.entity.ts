import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, ValidationArguments } from 'class-validator';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ReportEntity } from '@root/entities/report.entity';
import { ReportUserBridgeEntity } from '@root/entities/report-user-bridge.entity';
import { lengthValidationMessage } from '@root/common/validation-message/length-validation.message';
import { emailValidationMessage } from '@root/common/validation-message/email-validation.message';
import { Exclude, Expose, Transform } from 'class-transformer';
import { join } from 'path';
import { USERS_PUBLIC_IMAGE_PATH } from '@root/common/const/path.const';
import { stringValidationMessage } from '@root/common/validation-message/string-validation.message';

@Entity({ name: 'user' })
export class UserEntity extends CommonEntity {
    @ApiProperty({
        example: 'dev123@gmail.com',
        description: '사용자 이메일',
        required: true,
    })
    @IsEmail({}, { message: emailValidationMessage })
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    @Column({ unique: true })
    email: string;

    @ApiProperty({
        example: 'dev1234567890',
        description: '사용자 비밀번호',
        required: true,
    })
    @IsString({ message: '비밀번호는 String 타입을 입력해야 합니다.' })
    @Length(1, 255, {
        message: lengthValidationMessage,
    })
    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Column({ length: 255 })
    /**
     * Request
     * frontend -> backend
     * plain object (JSON) -> class instance (dto)
     *
     * Response
     * backend -> frontend
     * class instance (dto) -> plain object (JSON)
     *
     * toClassOnly -> class instance로 변환될 때 (요청일 때)
     * toPlainOnly -> plain object로 변환될 때 (응답일 때)
     */
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({ nullable: true })
    currentRefreshToken: string;

    @Column({ type: 'timestamp', nullable: true })
    currentRefreshTokenExp: Date;

    /*
        실제 존재하지 않는 프로퍼티를 노출시키는 방법
     */
    /*
    @Expose()
    get customEmail() {
        return `Custom ${this.email}`;
    }
    */

    @OneToMany(() => ReportEntity, (report) => report.user)
    reportList: ReportEntity[];

    @OneToMany(() => ReportUserBridgeEntity, (bridge) => bridge.report)
    reportUserBridge: ReportUserBridgeEntity[];
}
