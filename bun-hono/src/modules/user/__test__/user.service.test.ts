import { describe, test, expect, beforeEach } from "bun:test";
import UserService from "../user.service";
import InMemoryUserRepository from "../../../repository/inmemo/inMemo.user";
// import AppError from "../../../common/api.error";
import HashUtils from "../../../utils/hash.utils";

describe("UserService Unit Tests", () => {
  let userService: UserService;
  let userRepo: InMemoryUserRepository;

  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key";
    
    userRepo = new InMemoryUserRepository();
    userService = new UserService(userRepo);
  });

  // ----------------------------
  // createUser
  // ----------------------------
  test("createUser should create a new user", async () => {
    await userService.createUser("bayu123", "Bayu", "bayu@mail.com", "123456");
    const user = await userRepo.findByEmail("bayu@mail.com");
    expect(user).toBeDefined();
    expect(user?.username).toBe("bayu123");
  });

  test("createUser should throw AppError if email exists", async () => {
    await userService.createUser("bayu123", "Bayu", "bayu@mail.com", "123456");

    expect(userService.createUser("bayu456", "Bayu2", "bayu@mail.com", "abcdef"))
      .rejects.toThrow("User already exists");
  });

  // ----------------------------
  // loginUser
  // ----------------------------
  test("loginUser should return token for valid credentials", async () => {
    // create user first
    const hashed = await HashUtils.hashedPassword("123456");
    await userRepo.create("bayu123", "Bayu", "bayu@mail.com", hashed);

    const result = await userService.loginUser("bayu@mail.com", "123456");
    expect(result).toHaveProperty("token");
  });

  test("loginUser should throw AppError if email not found", async () => {
    expect(userService.loginUser("unknown@mail.com", "123456"))
      .rejects.toThrow("User not found");
  });

  test("loginUser should throw AppError if password invalid", async () => {
    const hashed = await HashUtils.hashedPassword("123456");
    await userRepo.create("bayu123", "Bayu", "bayu@mail.com", hashed);

    expect(userService.loginUser("bayu@mail.com", "wrongpass"))
      .rejects.toThrow("Invalid credentials");
  });

  // ----------------------------
  // profileUser
  // ----------------------------
  test("profileUser should return user profile if exists", async () => {
    await userRepo.create("bayu123", "Bayu", "bayu@mail.com", "123456");
    const user = await userService.profileUser(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
  });

  test("profileUser should throw AppError if user not found", async () => {
    expect(userService.profileUser(99))
      .rejects.toThrow("User not found");
  });
});
