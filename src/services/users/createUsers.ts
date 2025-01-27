import { hash } from 'bcryptjs';
import { getCustomRepository, Repository } from 'typeorm';

import UsersEntitie from '../../entities/usersEntitie';
import UsersRepository from '../../repositories/usersRepository';
import { AppError } from '../../utils/appError';

interface IUsers {
  name: string;
  email: string;
  password: string;
}

class CreateUsersService {
  private usersRepository: Repository<UsersEntitie>;

  constructor() {
    this.usersRepository = getCustomRepository(UsersRepository);
  }

  async create({ name, email, password }: IUsers) {
    const usersExists = await this.usersRepository.findOne({ email });

    if (usersExists) {
      throw new AppError('There is already one product with this email', 409);
    }

    const hashedPassword = await hash(password, 8); // Criptografa para substituir a senha do usuário por medidas de segurança

    const createUser = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.usersRepository.save(createUser);

    return createUser;
  }
}

export { CreateUsersService };
