import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtServiceAuthGuard extends AuthGuard('jwt-service') {}
