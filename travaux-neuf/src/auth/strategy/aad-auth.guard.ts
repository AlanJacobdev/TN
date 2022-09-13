import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard se basant sur la stratégie aad 
 */

@Injectable()
export class AADAuthGuard extends AuthGuard('aad') {

}