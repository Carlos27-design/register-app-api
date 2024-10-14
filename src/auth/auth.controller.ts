import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Usuario } from 'src/shared/entity/usuario.entity';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post()
  public create(@Body() createUserDto: CreateUserDto) {
    return this._authService.create(createUserDto);
  }
}
