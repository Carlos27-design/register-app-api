import { Usuario } from './../shared/entity/usuario.entity';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/shared/dto/create-user.dto';
import * as bcryptjs from 'bcryptjs';
import { Rol } from 'src/shared/entity/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Usuario.name)
    private UsuarioModel: Model<Usuario>,
    @InjectModel(Rol.name)
    private RolModel: Model<Rol>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<Usuario> {
    try {
      const { password, roles, ...userData } = createUserDto;

      const roleExists = await this.RolModel.findById(roles);
      if (!roleExists) {
        throw new BadRequestException(
          `El rol ${roles} no existe en la base de datos`,
        );
      }

      const newUser = new this.UsuarioModel({
        password: bcryptjs.hashSync(password, 10),
        roles,
        ...userData,
      });

      await newUser.save();

      const { password: _, ...user } = newUser.toJSON();

      return user;
    } catch (err) {
      if (err.code === 11000) {
        throw new BadRequestException(`${createUserDto.email} ya existe!`);
      }

      throw new InternalServerErrorException(
        'Algo valio sal al crear el usuario',
      );
    }
  }
}
