import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { CommonWithUpdateAndDeleteEntity } from '../../../common/common.entity';
import { ReportEntity } from '../../report/entity/report.entity';
import { AuthEntity } from './auth.entity';

@Entity({ name: 'user' })
export class UserEntity extends CommonWithUpdateAndDeleteEntity {
    @Column({ unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @OneToOne(() => AuthEntity, (auth) => auth.user, { cascade: true })
    auth: AuthEntity;

    @OneToMany(() => ReportEntity, (report) => report.user, {
        cascade: ['remove', 'soft-remove'],
    })
    reports: ReportEntity[];
}
