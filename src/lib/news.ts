// NEWS 記事の取得と日付の整形
import { getCollection } from 'astro:content';

/** NEWS 記事を新しい順で取得する */
export async function getSortedNews() {
	const posts = await getCollection('news');
	return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 日付を「2026.11.10」の形式にする（前書きの日付は UTC で解釈されるため UTC で取り出す） */
export function formatDate(date: Date) {
	const y = date.getUTCFullYear();
	const m = String(date.getUTCMonth() + 1).padStart(2, '0');
	const d = String(date.getUTCDate()).padStart(2, '0');
	return `${y}.${m}.${d}`;
}

/** <time datetime> 用の「2026-11-10」形式 */
export function isoDate(date: Date) {
	return formatDate(date).replaceAll('.', '-');
}
