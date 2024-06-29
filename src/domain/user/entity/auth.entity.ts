import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { CommonEntity } from '../../../common/common.entity';
import { UserEntity } from './user.entity';

@Entity('auth')
export class AuthEntity extends CommonEntity {
    @Column()
    userId: number;

    @Column({ comment: '리프레시 토큰', nullable: true })
    refreshToken?: string;

    @Column({ type: 'timestamp', comment: '리프레시 토큰 유효기간', nullable: true })
    refreshTokenExp?: Date;

    @OneToOne(() => UserEntity, (user) => user.auth)
    @JoinColumn()
    user: UserEntity;
}
