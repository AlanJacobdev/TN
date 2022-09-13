import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard se basant sur la stratégie refresh 
 */
@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh') {}
