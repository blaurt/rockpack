import { UserServiceDIType } from './di.type';
import { UserServiceInterface } from './interface';
import { UserRepositoryDIType, UserRepositoryInterface } from '../../repositories/User';
import { container } from '../../container';

let newuser;
let userRepository;
let userService;

beforeAll(async () => {
  userRepository = container.get<UserRepositoryInterface>(UserRepositoryDIType);
  userService = container.get<UserServiceInterface>(UserServiceDIType);
});

describe('UserService tests', () => {
  test('signup', async () => {
    const { user, token } = await userService.signup('test_user@text.mail', '123456');
    newuser = user;

    expect(typeof token)
      .toBe('string');
    expect(user.get('email'))
      .toBe('test_user@text.mail');
  });

  test('signin', async () => {
    const { user, token } = await userService.signin('test_user@text.mail', '123456');

    expect(typeof token)
      .toBe('string');
    expect(user.get('email'))
      .toBe('test_user@text.mail');
  });

  test('destroy', async () => {
    const id = newuser.get('id');
    await userService.deleteUser(id);
    const u = await userRepository.getUserById(id);

    expect(u)
      .toBeNull();
  });
});
