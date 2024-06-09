import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReportDto {
    @ApiProperty({
        example: 10,
        description: '주차 대수 - 10 (1대 이상), 7 (0.7대 이상), 5 (0.5대 이상), 3 (0.5대 미만)',
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    space: number;

    @ApiProperty({
        example: 10,
        description: '중학교 - 10 (95점 이상), 7 (90점 이상), 5 (85점 이상), 3 (85점 미만)',
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    middle: number;

    @ApiProperty({
        example: 10,
        description: '초등학교 - 10 (초품아), 5 (초등학교 인접), 0 (주변에 없음)',
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    elementary: number;

    @ApiProperty({ example: 2, description: '유치원/어린이집 - 2 (단지 내), 0 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    kindergarten: number;

    @ApiProperty({ example: 1, description: '입구 차단기 - 1 (있음), 0 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    barrier: number;

    @ApiProperty({ example: 2, description: '언덕 여부 - 2 (평지), 1 (약간 언덕), 0 (가파름)', required: true })
    @IsNotEmpty()
    @IsNumber()
    hill: number;

    @ApiProperty({ example: 2, description: '동간 배치 - 2 (우수), 1 (보통), 0 (복잡)', required: true })
    @IsNotEmpty()
    @IsNumber()
    layout: number;

    @ApiProperty({ example: 2, description: '동간 거리 - 2 (우수), 1 (보통), 0 (복잡)', required: true })
    @IsNotEmpty()
    @IsNumber()
    distance: number;

    @ApiProperty({ example: 1, description: '소음여부 여부 - 1 (없음), 0 (있음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    sound: number;

    @ApiProperty({ example: 1, description: '지하주차장 여부 - 1 (있음), 0 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    underground: number;

    @ApiProperty({ example: 2, description: '주차 상태 - 2 (우수), 1 (보통), 0 (복잡)', required: true })
    @IsNotEmpty()
    @IsNumber()
    parking: number;

    @ApiProperty({ example: 2, description: '단지 청결도 - 2 (우수), 1 (보통), 0 (지저분)', required: true })
    @IsNotEmpty()
    @IsNumber()
    clean: number;

    @ApiProperty({ example: 2, description: '놀이터 상태 - 2 (우수), 1 (보통), 0 (지저분)', required: true })
    @IsNotEmpty()
    @IsNumber()
    playground: number;

    @ApiProperty({ example: 2, description: '상가 상태 - 2 (관리 우수), 1 (보통), 0 (공실 많음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    store: number;

    @ApiProperty({ example: 1, description: 'ATM 유무 - 1 (있음), 2 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    atm: number;

    @ApiProperty({
        example: '이 아파트는 주변에는 병원, 학원 등이 주로 들어와있습니다.',
        description: '단지 특징',
        required: false,
    })
    @IsOptional()
    @IsString()
    memo: string;
}

export class UpdateReportDto extends CreateReportDto {}
