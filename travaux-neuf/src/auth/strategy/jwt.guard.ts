import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard se basant sur la stratégie JWT 
 */

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
