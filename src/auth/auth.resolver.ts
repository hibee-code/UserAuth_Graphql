// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { BiometricLoginInput, LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { User } from '../users/model/user.model';
import { GqlAuthGuard } from './guard/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './current_user.decorator';



@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Mutation(() => User)
  async register(@Args('input') registerInput: RegisterInput) {
    const { email, password } = registerInput;
    return this.usersService.create(email, password);
  }

  @Mutation(() => String)
  async login(@Args('input') loginInput: LoginInput) {
    const { email, password } = loginInput;
    const user = await this.authService.validateUser(email, password);
    const token = this.authService.generateToken(user.id);
    return token.access_token;
  }

  @Mutation(() => String)
  async biometricLogin(@Args('input') biometricInput: BiometricLoginInput) {
    const { biometricKey } = biometricInput;
    const user = await this.authService.validateBiometric(biometricKey);
    const token = this.authService.generateToken(user.id);
    return token.access_token;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => User)
  async setBiometricKey(
    @CurrentUser() user: User,
    @Args('biometricKey') biometricKey: string,
  ) {
    return this.usersService.setBiometricKey(user.id, biometricKey);
  }
  

}