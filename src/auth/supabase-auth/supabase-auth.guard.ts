import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import * as jwt from 'jsonwebtoken'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor (private configService: ConfigService) {}
  canActivate (
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const authHeader = request.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header is missing or invalid',
      )
    }
    const token = authHeader.split(' ')[1] // first index value sy split kry ga
    const jwtSecret = this.configService.get<string>('SUPABASE_JWT_SECRET')
    if (!jwtSecret) {
      throw new UnauthorizedException('JWT secret is not configured')
    }
    try {
      const decodedToken = jwt.verify(token, jwtSecret)
      request['user'] = decodedToken
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid token')
    }
  }
}
