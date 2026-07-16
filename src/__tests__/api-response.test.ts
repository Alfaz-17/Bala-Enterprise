import { successResponse, errorResponse, validationError, notFoundError, unauthorizedError } from '../lib/api-response';
import { NextRequest } from 'next/server';

// Mock NextResponse to check its return values
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

describe('API Response Helpers', () => {
  it('should format successResponse correctly', async () => {
    const data = { id: 1, name: 'Test' };
    const response = successResponse(data);
    
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ success: true, data });
  });

  it('should format errorResponse correctly', async () => {
    const message = 'Server failure';
    const code = 'INTERNAL_ERROR';
    const response = errorResponse(message, code, 500);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: { code, message },
    });
  });

  it('should format validationError correctly', async () => {
    const message = 'Name is required';
    const response = validationError(message);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: { code: 'VALIDATION_ERROR', message },
    });
  });

  it('should format notFoundError correctly', async () => {
    const message = 'Category not found';
    const response = notFoundError(message);

    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: { code: 'NOT_FOUND', message },
    });
  });

  it('should format unauthorizedError correctly', async () => {
    const message = 'Access denied';
    const response = unauthorizedError(message);

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body).toEqual({
      success: false,
      error: { code: 'UNAUTHORIZED', message },
    });
  });
});
