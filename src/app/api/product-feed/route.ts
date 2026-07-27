import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category'; // Register Category model
import { ProductImage } from '@/models/ProductImage';

export async function GET() {
  try {
    await connectToDatabase();

    // Query active products and populate their category
    const products = await Product.find({ status: 'active' })
      .populate('category', 'name slug')
      .lean();

    // Get all primary images for the products
    const productIds = products.map((p) => p._id);
    const images = await ProductImage.find({
      product: { $in: productIds },
      isPrimary: true,
    }).lean();

    const imageMap = new Map(images.map((img) => [String(img.product), img.url]));

    const xmlItems = products.map((p) => {
      const imageUrl = imageMap.get(String(p._id)) || '';
      const categorySlug = (p.category as any)?.slug || 'equipment';
      const title = p.name;
      const description = p.shortDescription || p.fullDescription || `High-quality industrial equipment from Bala Enterprise`;
      const price = p.priceMin || 0;

      return `
    <item>
      <g:id>${p._id}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>https://www.balaenterprise.in/products/${p.slug}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${price} INR</g:price>
      <g:brand>Bala Enterprise</g:brand>
      <g:condition>new</g:condition>
    </item>`;
    }).join('');

    const xml = `<?xml version="1.0"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Bala Enterprise Products</title>
    <link>https://www.balaenterprise.in</link>
    <description>Heavy lifting industrial cranes and equipment product feed</description>
    ${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating product feed:', error);
    return new NextResponse('<error>Failed to generate product feed</error>', {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
