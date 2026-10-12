import fs from 'node:fs';
import path from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const root = process.cwd();
const modules = path.join(root, 'node_modules');

const version = (dir) => {
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).version;
  } catch {
    return null;
  }
};

const list = (dir) => {
  try {
    return fs.readdirSync(dir);
  } catch {
    return null;
  }
};

export async function GET() {
  const img = path.join(modules, '@img');

  return Response.json({
    node: process.version,
    cwd: root,
    sharpVersion: version(path.join(modules, 'sharp')),
    imgPackages: list(img),
    versions: {
      'sharp-linux-x64': version(path.join(img, 'sharp-linux-x64')),
      'sharp-libvips-linux-x64': version(path.join(img, 'sharp-libvips-linux-x64')),
    },
    libvipsFiles: list(path.join(img, 'sharp-libvips-linux-x64', 'lib')),
    sharpBinaries: list(path.join(img, 'sharp-linux-x64', 'lib')),
  });
}