import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApartEntity } from '@root/entities/apart.entity';
import { UserEntity } from '@root/entities/user.entity';
import { ReportUserBridgeEntity } from '@root/entities/report-user-bridge.entity';
import { stringValidationMessage } from '@root/common/validation-message/string-validation.message';
import { ImageEntity } from '@root/common/entities/image.entity';
import { CommentEntity } from '@root/entities/comment.entity';

@Entity({ name: 'report' })
export class ReportEntity extends CommonEntity {
    @ApiProperty({ example: 1, description: '사용자 아이디', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column({ name: 'userId' })
    userId: number;

    @ApiProperty({ example: 18972, description: '아파트 아이디', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column({ name: 'apartId' })
    apartId: number;

    @ApiProperty({
        example: 10,
        description: '주차 대수 - 10 (1대 이상), 7 (0.7대 이상), 5 (0.5대 이상), 3 (0.5대 미만)',
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    space: number;

    @ApiProperty({
        example: 10,
        description: '중학교 - 10 (95점 이상), 7 (90점 이상), 5 (85점 이상), 3 (85점 미만)',
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    middle: number;

    @ApiProperty({
        example: 10,
        description: '초등학교 - 10 (초품아), 5 (초등학교 인접), 0 (주변에 없음)',
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    elementary: number;

    @ApiProperty({ example: 2, description: '유치원/어린이집 - 2 (단지 내), 0 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    kindergarten: number;

    @ApiProperty({ example: 1, description: '입구 차단기 - 1 (있음), 0 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    barrier: number;

    @ApiProperty({ example: 2, description: '언덕 여부 - 2 (평지), 1 (약간 언덕), 0 (가파름)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    hill: number;

    @ApiProperty({ example: 2, description: '동간 배치 - 2 (우수), 1 (보통), 0 (복잡)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    layout: number;

    @ApiProperty({ example: 2, description: '동간 거리 - 2 (우수), 1 (보통), 0 (복잡)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    distance: number;

    @ApiProperty({ example: 1, description: '소음여부 여부 - 1 (없음), 0 (있음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    sound: number;

    @ApiProperty({ example: 1, description: '지하주차장 여부 - 1 (있음), 0 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    underground: number;

    @ApiProperty({ example: 2, description: '주차 상태 - 2 (우수), 1 (보통), 0 (복잡)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    parking: number;

    @ApiProperty({ example: 2, description: '단지 청결도 - 2 (우수), 1 (보통), 0 (지저분)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    clean: number;

    @ApiProperty({ example: 2, description: '놀이터 상태 - 2 (우수), 1 (보통), 0 (지저분)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    playground: number;

    @ApiProperty({ example: 2, description: '상가 상태 - 2 (관리 우수), 1 (보통), 0 (공실 많음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    store: number;

    @ApiProperty({ example: 1, description: 'ATM 유무 - 1 (있음), 2 (없음)', required: true })
    @IsNotEmpty()
    @IsNumber()
    @Column()
    atm: number;

    @ApiProperty({
        example: '이 아파트는 주변에는 병원, 학원 등이 주로 들어와있습니다.',
        description: '단지 특징',
        required: false,
    })
    @IsOptional()
    @IsString({ message: stringValidationMessage })
    @Column({ nullable: true })
    memo: string;

    @ManyToOne(() => UserEntity, (user) => user.reportList, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: UserEntity;

    @ManyToOne(() => ApartEntity, (apart) => apart.reportList, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'apartId', referencedColumnName: 'id' })
    apart: ApartEntity;

    @OneToMany(() => ReportUserBridgeEntity, (bridge) => bridge.report)
    reportUserBridge: ReportUserBridgeEntity[];

    @OneToMany((type) => ImageEntity, (image) => image.report)
    images: ImageEntity[];

    @OneToMany(() => CommentEntity, (comment) => comment.user)
    comments: CommentEntity[];
}
