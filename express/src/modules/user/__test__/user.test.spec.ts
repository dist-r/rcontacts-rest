import { beforeEach, describe, expect, it, vi } from "vitest";
import ILogger from "../../../config/log/ilogger";
import BcyrptUtil from "../../../utils/bcrypt.util";
import JwtUtils from "../../../utils/jwt.util";
import UserService from "../user.service";
import { User } from "../user";
import IUserRepository from "../user.repository";

class InMemoryUserRepository implements IUserRepository {
  users: User[] = [];

  async createUser(username: string, name: string, email: string, hashedPassword: string): Promise<User> {
    const user: User = {
      id: crypto.randomUUID(),
      username,
      name,
      email,
      password: hashedPassword,
    };

    this.users.push(user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }
}

describe("UserService Unit Tests", () => {
  let userRepo: InMemoryUserRepository;
  let userService: UserService;

  const logger: ILogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key";
    vi.clearAllMocks();

    userRepo = new InMemoryUserRepository();
    userService = new UserService(userRepo, logger);
  });

  it("registerUser should create a new user and hide password from response", async () => {
    const result = await userService.registerUser("bayu123", "Bayu", "bayu@mail.com", "123456");
    const savedUser = await userRepo.getUserByEmail("bayu@mail.com");

    expect(result).toEqual({
      id: savedUser?.id,
      username: "bayu123",
      name: "Bayu",
      email: "bayu@mail.com",
    });
    expect(result).not.toHaveProperty("password");
  });

  it("registerUser should save hashed password", async () => {
    await userService.registerUser("bayu123", "Bayu", "bayu@mail.com", "123456");

    const savedUser = await userRepo.getUserByEmail("bayu@mail.com");

    expect(savedUser?.password).not.toBe("123456");
    expect(await BcyrptUtil.comparePassword("123456", savedUser!.password)).toBe(true);
  });

  it("registerUser should throw AppError when email already exists", async () => {
    await userService.registerUser("bayu123", "Bayu", "bayu@mail.com", "123456");

    await expect(userService.registerUser("bayu456", "Bayu2", "bayu@mail.com", "abcdef"))
      .rejects.toThrow("Email already exists");
  });

  it("loginUser should return a valid token for valid credentials", async () => {
    const hashedPassword = await BcyrptUtil.hashPassword("123456");
    const user = await userRepo.createUser("bayu123", "Bayu", "bayu@mail.com", hashedPassword);

    const token = await userService.loginUser("bayu@mail.com", "123456");
    const payload = JwtUtils.verifyAccessToken(token) as { userId: string; email: string };

    expect(token).toBeTypeOf("string");
    expect(token.split(".")).toHaveLength(3);
    expect(payload.userId).toBe(user.id);
    expect(payload.email).toBe("bayu@mail.com");
  });

  it("loginUser should throw AppError when email is not found", async () => {
    await expect(userService.loginUser("unknown@mail.com", "123456"))
      .rejects.toThrow("User not found");
  });

  it("loginUser should throw AppError when password is invalid", async () => {
    const hashedPassword = await BcyrptUtil.hashPassword("123456");
    await userRepo.createUser("bayu123", "Bayu", "bayu@mail.com", hashedPassword);

    await expect(userService.loginUser("bayu@mail.com", "wrongpass"))
      .rejects.toThrow("Password invalid");
  });

  it("userProfile should return profile and hide password", async () => {
    const hashedPassword = await BcyrptUtil.hashPassword("123456");
    const user = await userRepo.createUser("bayu123", "Bayu", "bayu@mail.com", hashedPassword);

    const result = await userService.userProfile(user.id);

    expect(result).toEqual({
      id: user.id,
      username: "bayu123",
      name: "Bayu",
      email: "bayu@mail.com",
    });
    expect(result).not.toHaveProperty("password");
  });

  it("userProfile should throw AppError when user is not found", async () => {
    await expect(userService.userProfile("missing-id"))
      .rejects.toThrow("User not found");
  });
});
