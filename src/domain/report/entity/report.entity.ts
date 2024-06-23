import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonWithUpdateAndDeleteEntity } from '../../../common/common.entity';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'report' })
export class ReportEntity extends CommonWithUpdateAndDeleteEntity {
    @Column()
    userId: number;

    @Column({ comment: '주차 대수 - 10 (1대 이상), 7 (0.7대 이상), 5 (0.5대 이상), 3 (0.5대 미만)1' })
    space: number;

    @Column({ comment: '중학교 - 10 (95점 이상), 7 (90점 이상), 5 (85점 이상), 3 (85점 미만)' })
    middle: number;

    @Column({ comment: '초등학교 - 10 (초품아), 5 (초등학교 인접), 0 (주변에 없음)' })
    elementary: number;

    @Column({ comment: '유치원/어린이집 - 2 (단지 내), 0 (없음)' })
    kindergarten: number;

    @Column({ comment: '입구 차단기 - 1 (있음), 0 (없음)' })
    barrier: number;

    @Column({ comment: '언덕 여부 - 2 (평지), 1 (약간 언덕), 0 (가파름)' })
    hill: number;

    @Column({ comment: '동간 배치 - 2 (우수), 1 (보통), 0 (복잡)' })
    layout: number;

    @Column({ comment: '동간 거리 - 2 (우수), 1 (보통), 0 (복잡)' })
    distance: number;

    @Column({ comment: '소음여부 여부 - 1 (없음), 0 (있음)' })
    sound: number;

    @Column({ comment: '지하주차장 여부 - 1 (있음), 0 (없음)' })
    underground: number;

    @Column({ comment: '주차 상태 - 2 (우수), 1 (보통), 0 (복잡)' })
    parking: number;

    @Column({ comment: '단지 청결도 - 2 (우수), 1 (보통), 0 (지저분)' })
    clean: number;

    @Column({ comment: '놀이터 상태 - 2 (우수), 1 (보통), 0 (지저분)' })
    playground: number;

    @Column({ comment: '상가 상태 - 2 (관리 우수), 1 (보통), 0 (공실 많음)' })
    store: number;

    @Column({ comment: 'ATM 유무 - 1 (있음), 2 (없음)' })
    atm: number;

    @Column({ comment: '이 아파트는 주변에는 병원, 학원 등이 주로 들어와있습니다.', nullable: true })
    memo: string;

    @ApiProperty({
        description: '점수 합계',
        example: 45,
    })
    @Expose()
    get totalScore(): number {
        return (
            this.space +
            this.middle +
            this.elementary +
            this.kindergarten +
            this.barrier +
            this.hill +
            this.layout +
            this.distance +
            this.sound +
            this.underground +
            this.parking +
            this.clean +
            this.playground +
            this.store +
            this.atm
        );
    }

    @ManyToOne(() => UserEntity, (user) => user.reports, {
        createForeignKeyConstraints: false,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: UserEntity;
}
