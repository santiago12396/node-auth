import { RegisterUserDto } from './../../dtos/auth/register-user.dto';
import { AuthRepository } from '../../repositories/auth.repository';
import { CustomError } from '../../errors/custom.error';

interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}

interface RegisterUserUseCase {
    execute( registerUserDto: RegisterUserDto ): Promise<UserToken>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
    ) {}

    async execute(registerUserDto: RegisterUserDto): Promise<UserToken> {
        
        const user = await this.authRepository.register(registerUserDto);
        const token = await this.authRepository.generateToken({ id: user.id }, '2h');

        if(!token) throw CustomError.internalServer('Error generating token');

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }

    }

}