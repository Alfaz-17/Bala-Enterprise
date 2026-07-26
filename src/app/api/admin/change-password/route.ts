import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongoose';
import { AdminUser } from '@/models/AdminUser';
import { authOptions } from '../../auth/[...nextauth]/route';
import {
  successResponse,
  unauthorizedError,
  validationError,
  notFoundError,
  errorResponse,
} from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return unauthorizedError('You must be logged in to change your password');
    }

    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return validationError('All fields (current password, new password, and confirm password) are required.');
    }

    if (newPassword.length < 8) {
      return validationError('New password must be at least 8 characters long.');
    }

    if (newPassword !== confirmPassword) {
      return validationError('New password and confirmation password do not match.');
    }

    await connectToDatabase();

    const user = await AdminUser.findOne({ email: session.user.email.toLowerCase() });
    if (!user) {
      return notFoundError('Admin user not found.');
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return validationError('Incorrect current password.');
    }

    // Check if new password is same as current password (good security practice)
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.passwordHash);
    if (isSameAsCurrent) {
      return validationError('New password cannot be the same as the current password.');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = passwordHash;
    await user.save();

    return successResponse({ message: 'Password changed successfully.' });
  } catch (error: any) {
    console.error('POST /api/admin/change-password error:', error);
    return errorResponse(error.message || 'Failed to change password.');
  }
}
