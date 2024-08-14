import { CustomError, RegisterUserDto, UserEntity } from '../../domain';
import { LoginUserDto } from '../../domain/dtos/auth/login-user.dto';
import { BcryptAdapter } from '../adapters/bcrypt.adapter';
import { UserModel } from '../database/mongodb';
import { UserMapper } from '../mappers/user.mapper';

type hashFunction = (password: string) => string;
type compareFunction = (password: string, hashed: string) => boolean;

export abstract class AuthDataSource {
    abstract register(registerUserDto: RegisterUserDto): Promise<UserEntity>
    abstract login(loginUserDto: LoginUserDto): Promise<UserEntity>
}

export class AuthDataSourceImpl implements AuthDataSource {

    constructor(
        private hashPassword: hashFunction = BcryptAdapter.hash, 
        private compareFunction: compareFunction = BcryptAdapter.compare
    ) {}
    
    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        
        const { name, email, password } = registerUserDto;

        try {
            const userExist = await UserModel.findOne({ email });
            if(userExist) throw CustomError.badRequest('User already exist');


            const user = await UserModel.create({
                name,
                email,
                password: this.hashPassword(password),
            });

            await user.save();

            return UserMapper.userEntityFromObject(user);

        } catch (error) {

            if(error instanceof CustomError) throw error;

            throw CustomError.internalServer();

        }
    
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        
        const { email, password } = loginUserDto;

        try {
            const user = await UserModel.findOne({ email });
            if(!user) throw CustomError.badRequest('User not exist');

            const correctPassw = this.compareFunction(password, user.password);
            if(!correctPassw) throw CustomError.badRequest('Email or password incorrect');

            return UserMapper.userEntityFromObject(user);

        } catch (error) {

            if(error instanceof CustomError) throw error;

            throw CustomError.internalServer();

        }
    
    }

}