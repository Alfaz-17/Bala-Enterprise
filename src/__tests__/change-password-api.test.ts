// Mock next-auth before importing the route
jest.mock('next-auth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      GET: jest.fn(),
      POST: jest.fn(),
    })),
  };
});

// Mock next-auth/next
jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}));

import { POST } from '../app/api/admin/change-password/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { AdminUser } from '../models/AdminUser';

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status ?? 200,
          json: async () => body,
        };
      }),
    },
  };
});

jest.mock('../lib/mongoose', () => ({
  connectToDatabase: jest.fn(),
}));

jest.mock('../models/AdminUser', () => ({
  AdminUser: {
    findOne: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('POST /api/admin/change-password', () => {
  let mockRequest: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockRequest = (body: any) => {
    return {
      json: async () => body,
    } as unknown as NextRequest;
  };

  it('should return 401 if user is not authenticated', async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    mockRequest = createMockRequest({});

    const res = await POST(mockRequest);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('UNAUTHORIZED');
  });

  it('should return 400 if fields are missing', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    mockRequest = createMockRequest({ currentPassword: 'password123' });

    const res = await POST(mockRequest);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('required');
  });

  it('should return 400 if new password is too short', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    mockRequest = createMockRequest({
      currentPassword: 'password123',
      newPassword: 'short',
      confirmPassword: 'short',
    });

    const res = await POST(mockRequest);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('at least 8 characters');
  });

  it('should return 400 if passwords do not match', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    mockRequest = createMockRequest({
      currentPassword: 'password123',
      newPassword: 'newpassword123',
      confirmPassword: 'differentpassword',
    });

    const res = await POST(mockRequest);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('do not match');
  });

  it('should return 404 if user not found in database', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    (AdminUser.findOne as jest.Mock).mockResolvedValue(null);
    mockRequest = createMockRequest({
      currentPassword: 'password123',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    const res = await POST(mockRequest);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('not found');
  });

  it('should return 400 if current password is incorrect', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    const mockUser = {
      email: 'admin@test.com',
      passwordHash: 'hashedpassword',
      save: jest.fn(),
    };
    (AdminUser.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    mockRequest = createMockRequest({
      currentPassword: 'wrongpassword',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    const res = await POST(mockRequest);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('Incorrect current password');
  });

  it('should return 400 if new password is same as current password', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    const mockUser = {
      email: 'admin@test.com',
      passwordHash: 'hashedpassword',
      save: jest.fn(),
    };
    (AdminUser.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    mockRequest = createMockRequest({
      currentPassword: 'password123',
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    const res = await POST(mockRequest);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.success).toBe(false);
    expect(body.error.message).toContain('cannot be the same');
  });

  it('should successfully update password and return 200', async () => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { email: 'admin@test.com' },
    });
    const mockUser = {
      email: 'admin@test.com',
      passwordHash: 'hashedpassword',
      save: jest.fn().mockResolvedValue(true),
    };
    (AdminUser.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);
    (bcrypt.hash as jest.Mock).mockResolvedValue('newhashedpassword');

    mockRequest = createMockRequest({
      currentPassword: 'password123',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    const res = await POST(mockRequest);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(mockUser.passwordHash).toBe('newhashedpassword');
    expect(mockUser.save).toHaveBeenCalled();
  });
});
