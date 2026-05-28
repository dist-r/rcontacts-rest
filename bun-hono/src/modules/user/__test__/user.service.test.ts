import { beforeEach, describe, expect, mock, test } from "bun:test";
import UserService from "../user.service";
import InMemoryUserRepository from "../../../repository/inmemo/inMemo.user";
import HashUtils from "../../../utils/hash.utils";
import ILogger from "../../../config/logger/ilogger";
import JwtUtils from "../../../utils/jwt.utils";

describe("UserService Unit Tests", () => {
  let userService: UserService;
  let userRepo: InMemoryUserRepository;

  const logger: ILogger = {
    debug: mock(() => {}),
    info: mock(() => {}),
    warn: mock(() => {}),
    error: mock(() => {}),
  };

  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key";

    userRepo = new InMemoryUserRepository();
    userService = new UserService(userRepo, logger);
  });

  test("createUser should create a new user and hide password from response", async () => {
    const result = await userService.createUser("bayu123", "Bayu", "bayu@mail.com", "123456");
    const savedUser = await userRepo.findByEmail("bayu@mail.com");

    expect(result.id).toBeString();
    expect(result).toEqual({
      id: savedUser?.id,
      username: "bayu123",
      name: "Bayu",
      email: "bayu@mail.com",
    });
    expect(result).not.toHaveProperty("password");
  });

  test("createUser should save hashed password", async () => {
    await userService.createUser("bayu123", "Bayu", "bayu@mail.com", "123456");

    const savedUser = await userRepo.findByEmail("bayu@mail.com");

    expect(savedUser?.password).not.toBe("123456");
    expect(await HashUtils.verifyPassword(savedUser!.password, "123456")).toBe(true);
  });

  test("createUser should throw AppError when email already exists", async () => {
    await userService.createUser("bayu123", "Bayu", "bayu@mail.com", "123456");

    expect(userService.createUser("bayu456", "Bayu2", "bayu@mail.com", "abcdef"))
      .rejects.toThrow("Email already in use");
  });

  test("loginUser should return a valid token for valid credentials", async () => {
    const hashed = await HashUtils.hashedPassword("123456");
    await userRepo.create("id123", "bayu123", "Bayu", "bayu@mail.com", hashed);

    const token = await userService.loginUser("bayu@mail.com", "123456");
    const payload = await JwtUtils.verifyToken(token);

    expect(token).toBeString();
    expect(token.split(".")).toHaveLength(3);
    expect(payload.id).toBe("id123");
    expect(payload.email).toBe("bayu@mail.com");
  });

  test("loginUser should throw AppError when email is not found", async () => {
    expect(userService.loginUser("unknown@mail.com", "123456"))
      .rejects.toThrow("User not found");
  });

  test("loginUser should throw AppError when password is invalid", async () => {
    const hashed = await HashUtils.hashedPassword("123456");
    await userRepo.create("id111", "bayu123", "Bayu", "bayu@mail.com", hashed);

    expect(userService.loginUser("bayu@mail.com", "wrongpass"))
      .rejects.toThrow("Invalid credentials");
  });

  test("profileUser should return user profile and hide password", async () => {
    const hashed = await HashUtils.hashedPassword("123456");
    await userRepo.create("id123", "bayu123", "Bayu", "bayu@mail.com", hashed);

    const user = await userService.profileUser("id123");

    expect(user).toEqual({
      id: "id123",
      username: "bayu123",
      name: "Bayu",
      email: "bayu@mail.com",
    });
    expect(user).not.toHaveProperty("password");
  });

  test("profileUser should throw AppError when user is not found", async () => {
    expect(userService.profileUser("99"))
      .rejects.toThrow("User not found");
  });
});
