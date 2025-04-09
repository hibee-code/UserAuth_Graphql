// src/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    findByBiometricKey: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(() => 'test-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should throw if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser('test@test.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw if password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUser('test@test.com', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        password: 'hashedPassword',
      };
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      expect(await service.validateUser('test@test.com', 'password')).toEqual(mockUser);
    });
  });

  describe('validateBiometric', () => {
    it('should throw if biometric key is invalid', async () => {
      mockUsersService.findByBiometricKey.mockResolvedValue(null);

      await expect(service.validateBiometric('invalid-key')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user if biometric key is valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        biometricKey: 'valid-key',
      };
      mockUsersService.findByBiometricKey.mockResolvedValue(mockUser);

      expect(await service.validateBiometric('valid-key')).toEqual(mockUser);
    });
  });

  describe('generateToken', () => {
    it('should return an access token', () => {
      const result = service.generateToken('user-id');
      expect(result).toEqual({ access_token: 'test-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({ sub: 'user-id' });
    });
  });
});