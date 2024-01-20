import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CreateAtEntity } from '@root/common/entities/create-at.entity';
import { ReportEntity } from '@root/entities/report.entity';
import { UserEntity } from '@root/entities/user.entity';

@Entity({ name: 'report_user_bridge' })
export class ReportUserBridgeEntity extends CreateAtEntity {
    @PrimaryColumn()
    reportId!: number;

    @PrimaryColumn()
    userId!: number;

    // 보고서 삭제시 CASCADE 동작하지 않음. 확인필요
    @ManyToOne(() => ReportEntity, (report) => report.reportUserBridge, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'reportId', referencedColumnName: 'id' })
    report: ReportEntity;

    @ManyToOne(() => UserEntity, (user) => user.reportUserBridge, {
        cascade: true,
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
    user: UserEntity;
}
