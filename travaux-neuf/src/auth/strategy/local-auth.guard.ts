import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard bloquant ou non les routes des controllers où il est appellé
 * Utilise la strategy LocalStrategy
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}