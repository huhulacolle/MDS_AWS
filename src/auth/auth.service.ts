import {
  ConflictException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { TokenPayload } from 'src/interfaces/TokenPayload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(user: CreateUserDTO): Promise<any> {
    const userExist = await this.userExist(user.email);
    if (userExist) {
      throw new ConflictException('Cet email est déjà associé à un compte');
    }
    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(user.password, salt);
    await this.prisma.user.create({
      data: {
        email: user.email,
        password: hashpwd,
      },
    });

    return this.login(user);
  }

  async login(user: CreateUserDTO): Promise<string> {
    const result = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    if (!result) {
      throw new ForbiddenException("ce compte n'existe pas");
    }
    const pwd = await bcrypt.compare(user.password, result.password);
    if (!pwd) {
      throw new ForbiddenException('Mot de passe incorrect');
    }
    const payload: TokenPayload = {
      sub: result.id,
      email: user.email,
    };
    return await this.jwtService.signAsync(payload);
  }

  private async userExist(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      return true;
    }
    return false;
  }
}
