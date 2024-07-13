import { ApiProperty } from '@nestjs/swagger';
import { ReportEntity } from '../../../domain/report/entity/report.entity';
import { UserResponseDto } from '../../user/dto/user.response.dto';
import * as dayjs from 'dayjs';

export class ReportResponseDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    createdAt: string;

    @ApiProperty()
    space: number;

    @ApiProperty()
    middle: number;

    @ApiProperty()
    elementary: number;

    @ApiProperty()
    kindergarten: number;

    @ApiProperty()
    barrier: number;

    @ApiProperty()
    hill: number;

    @ApiProperty()
    layout: number;

    @ApiProperty()
    distance: number;

    @ApiProperty()
    sound: number;

    @ApiProperty()
    underground: number;

    @ApiProperty()
    parking: number;

    @ApiProperty()
    clean: number;

    @ApiProperty()
    playground: number;

    @ApiProperty()
    store: number;

    @ApiProperty()
    atm: number;

    @ApiProperty()
    memo: string;

    @ApiProperty()
    totalScore: number;

    @ApiProperty()
    user: UserResponseDto;

    static of(report: ReportEntity) {
        const dto = new this();

        dto.id = report.id;
        dto.createdAt = dayjs(report.createdAt).format('YYYY-MM-DD HH:mm:ss');
        dto.space = report.space;
        dto.middle = report.middle;
        dto.elementary = report.elementary;
        dto.kindergarten = report.kindergarten;
        dto.barrier = report.barrier;
        dto.hill = report.hill;
        dto.layout = report.layout;
        dto.distance = report.distance;
        dto.sound = report.sound;
        dto.underground = report.underground;
        dto.parking = report.parking;
        dto.clean = report.clean;
        dto.playground = report.playground;
        dto.store = report.store;
        dto.atm = report.atm;
        dto.memo = report.memo;
        dto.totalScore = report.totalScore;
        dto.user = UserResponseDto.of(report.user);

        return dto;
    }
}
