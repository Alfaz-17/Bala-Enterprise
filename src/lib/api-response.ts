import { NextResponse } from 'next/server';

/**
 * Standard API response helpers matching the doc specification.
 */

export function successResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function createdResponse(data: unknown) {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function errorResponse(
  message: string,
  code: string = 'SERVER_ERROR',
  status: number = 500
) {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status }
  );
}

export function validationError(message: string) {
  return errorResponse(message, 'VALIDATION_ERROR', 400);
}

export function notFoundError(message = 'Resource not found') {
  return errorResponse(message, 'NOT_FOUND', 404);
}

export function unauthorizedError(message = 'Unauthorized') {
  return errorResponse(message, 'UNAUTHORIZED', 401);
}
