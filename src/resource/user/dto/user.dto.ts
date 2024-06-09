import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({
        example: 'dev123@gmail.com',
        description: '사용자 이메일',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
    email: string;

    @ApiProperty({
        example: 'dev1234567890',
        description: '사용자 비밀번호',
        required: true,
    })
    @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
    @Length(1, 255)
    @IsString({ message: '비밀번호는 String 타입을 입력해야 합니다.' })
    password: string;
}
