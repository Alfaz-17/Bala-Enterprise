import fs from 'fs';
import path from 'path';
import Image from 'next/image';

export default function TempGalleryPage() {
  const imagesDir = path.resolve(process.cwd(), 'public/Images_Factory');
  let files: string[] = [];

  if (fs.existsSync(imagesDir)) {
    files = fs.readdirSync(imagesDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
      })
      .sort();
  }

  return (
    <div className="bg-[#1A1A18] text-white min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-[#D85A30]">Temporary Factory Images Gallery</h1>
        <p className="text-sm text-[#888780] mb-8">
          This is a temporary page used to inspect converted factory images in public/Images_Factory.
          Total files: {files.length}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {files.map(file => (
            <div key={file} className="bg-zinc-900 border border-white/10 p-4 rounded flex flex-col space-y-4">
              <div className="relative h-64 w-full overflow-hidden border border-white/5 bg-black">
                <Image
                  src={`/Images_Factory/${file}`}
                  alt={file}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-xs font-mono text-white select-all bg-black/40 p-2 rounded truncate">
                  {file}
                </p>
                <p className="text-[10px] text-[#888780] mt-1">
                  Path: /Images_Factory/{file}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
