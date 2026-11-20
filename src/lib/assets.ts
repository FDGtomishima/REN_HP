// YAML に書いた画像パス（src/assets/ からの相対パス）を、Astro の Image で使える画像データに変換する
import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>(
	'/src/assets/**/*.{png,jpg,jpeg,webp,avif,svg}',
	{ eager: true },
);

/** 例：getAsset('outfits/1st-default.png') */
export function getAsset(path: string): ImageMetadata {
	const image = images[`/src/assets/${path}`];
	if (!image) throw new Error(`画像が見つかりません：src/assets/${path}`);
	return image.default;
}
