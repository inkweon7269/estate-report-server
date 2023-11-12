import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommonEntity } from '@root/common/entities/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Area3Entity } from '@root/entities/area-3.entity';
import { ReportEntity } from '@root/entities/report.entity';

@Entity({ name: 'apart' })
export class ApartEntity extends CommonEntity {
    @ApiProperty({ example: 364, description: '읍면동 아이디', required: false })
    @IsNumber()
    @Column({ name: 'area3Id', nullable: true })
    area3Id: number;

    @ApiProperty({ example: '주상복합', description: '아파트 유형', required: false })
    @IsString()
    @Column({ nullable: true })
    type: string;

    @ApiProperty({ example: 2023, description: '연식', required: false })
    @IsNumber()
    @Column({ nullable: true })
    year: number;

    @ApiProperty({ example: '신목동파라곤아파트', description: '아파트 이름', required: false })
    @IsString()
    @Column({ nullable: true })
    name: string;

    @ApiProperty({ example: 1134, description: '아파트 호수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    hos: number;

    @ApiProperty({ example: 10, description: '아파트 동수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    dongs: number;

    @ApiProperty({ example: 1134, description: '아파트 세대수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    people: number;

    @ApiProperty({ example: '계단식', description: '아파트 구조', required: false })
    @IsString()
    @Column({ nullable: true })
    corridorType: string;

    @ApiProperty({ example: '지역난방', description: '난방 유형', required: false })
    @IsString()
    @Column({ nullable: true })
    heatType: string;

    @ApiProperty({ example: 'LH', description: '시행사', required: false })
    @IsString()
    @Column({ nullable: true })
    aCompany: string;

    @ApiProperty({ example: '남광건설', description: '시공사', required: false })
    @IsString()
    @Column({ nullable: true })
    bCompany: string;

    @ApiProperty({ example: 48, description: '평형 개수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    size60: number;

    @ApiProperty({ example: 762, description: '평형 개수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    size85: number;

    @ApiProperty({ example: 46, description: '평형 개수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    size135: number;

    @ApiProperty({ example: 100, description: '평형 개수', required: false })
    @IsNumber()
    @Column({ nullable: true })
    size136: number;

    @ApiProperty({ example: 'A10023224', description: '아파트 코드', required: false })
    @IsString()
    @Column({ nullable: true })
    apartCode: string;

    @ApiProperty({ example: 'A10023224', description: '아파트 코드', required: false })
    @IsNumber()
    @Column({
        type: 'bigint',
        transformer: {
            to(value) {
                return value;
            },
            from(value) {
                return typeof value === 'string' ? parseInt(value, 10) : value;
            },
        },
        nullable: true,
    })
    a3Code: number;

    @ApiProperty({
        example: '전라북도 전주덕진구 송천동2가 1313 포레나 전주에코시티 ',
        description: '아파트 지번 주소',
        required: false,
    })
    @IsString()
    @Column({ nullable: true })
    address1: string;

    @ApiProperty({
        example: '전라북도 전주시 덕진구 세병로 21',
        description: '아파트 도로명 주소',
        required: false,
    })
    @IsString()
    @Column({ nullable: true })
    address2: string;

    @ManyToOne(() => Area3Entity, (area3) => area3.apartList, {
        createForeignKeyConstraints: false,
        nullable: false,
    })
    @JoinColumn({ name: 'area3Id', referencedColumnName: 'id' })
    area3: Area3Entity;

    @OneToMany(() => ReportEntity, (report) => report.apart)
    reportList: ReportEntity[];
}
