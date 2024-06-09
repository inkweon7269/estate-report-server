import { Column, Entity, OneToMany } from 'typeorm';
import { CommonWithUpdateAndDeleteEntity } from '../common/common.entity';
import { ReportEntity } from './report.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity extends CommonWithUpdateAndDeleteEntity {
    @Column({ unique: true })
    email: string;

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
    @Column({ length: 255 })
    password: string;

    @OneToMany(() => ReportEntity, (report) => report.user, {
        cascade: ['remove', 'soft-remove'],
    })
    reports: ReportEntity[];
}
