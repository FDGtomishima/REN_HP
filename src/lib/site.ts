// src/data/ の YAML（1件だけのもの）を取得する
import { getEntry } from 'astro:content';

/** サイト共通設定（src/data/site.yaml） */
export async function getSite() {
	const entry = await getEntry('site', 'main');
	if (!entry) throw new Error('src/data/site.yaml を読み込めません');
	return entry.data;
}

/** ライバーのプロフィール（src/data/profile.yaml） */
export async function getProfile() {
	const entry = await getEntry('profile', 'main');
	if (!entry) throw new Error('src/data/profile.yaml を読み込めません');
	return entry.data;
}
