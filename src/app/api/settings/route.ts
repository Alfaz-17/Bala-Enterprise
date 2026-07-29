import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { SiteSettings } from '@/models/SiteSettings';

export const dynamic = 'force-dynamic';
import { updateSiteSettingsSchema } from '@/lib/validations';
import {
  successResponse,
  validationError,
  errorResponse,
} from '@/lib/api-response';

/**
 * GET /api/settings
 * Returns all site settings as a key-value object.
 */
export async function GET() {
  try {
    await connectToDatabase();
    const settings = await SiteSettings.find().lean();

    // Transform array into a key-value object for easy consumption
    const settingsMap: Record<string, string> = {};
    for (const s of settings) {
      settingsMap[s.settingKey] = s.settingValue;
    }

    return successResponse(settingsMap);
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return errorResponse('Failed to fetch settings');
  }
}

/**
 * PUT /api/settings
 * Upsert a site setting (admin).
 */
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const parsed = updateSiteSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return validationError(parsed.error.issues[0].message);
    }

    const { settingKey, settingValue } = parsed.data;

    const setting = await SiteSettings.findOneAndUpdate(
      { settingKey },
      { settingValue },
      { upsert: true, new: true }
    ).lean();

    return successResponse(setting);
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return errorResponse('Failed to update setting');
  }
}
