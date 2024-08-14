import { RegisterUserDto, LoginUserDto, UserEntity } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthDataSource } from '../datasources/auth.datasource.impl';
import { JwtAdapter } from '../adapters';



export class AuthRepositoryImpl implements AuthRepository {

    constructor(private readonly authDatasource: AuthDataSource) {}

    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.authDatasource.register(registerUserDto);
    }

    login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        return this.authDatasource.login(loginUserDto);
    }
    
    generateToken(payload: Object, duration?: string): Promise<string | null> {
        return JwtAdapter.generateToken(payload, duration);
    }
}