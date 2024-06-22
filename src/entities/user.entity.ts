import { Column, Entity, OneToMany } from 'typeorm';
import { CommonWithUpdateAndDeleteEntity } from '../common/common.entity';
import { ReportEntity } from './report.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonWithUpdateAndDeleteEntity {
    @Column({ unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ nullable: true })
    refreshToken: string;

    @Column({ type: 'timestamp', nullable: true })
    refreshTokenExp: Date;

    @OneToMany(() => ReportEntity, (report) => report.user, {
        cascade: ['remove', 'soft-remove'],
    })
    reports: ReportEntity[];
}
