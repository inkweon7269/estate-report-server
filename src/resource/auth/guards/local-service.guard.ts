import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalServiceAuthGuard extends AuthGuard('local-service') {}
