// 表示用の整形（YAML の日付文字列・SNS の URL）

/** "2025-08-10" / "2025-08-10T20:00" → "2025.08.10" */
export function formatYmd(value: string) {
	return value.slice(0, 10).replaceAll('-', '.');
}

/** "2025-08-10T20:00" → "2025.08.10 20:00"（時刻がなければ日付のみ） */
export function formatDateTime(value: string) {
	const time = value.slice(11, 16);
	return time ? `${formatYmd(value)} ${time}` : formatYmd(value);
}

/** SNS の URL からサービス名を判定（アイコン・ラベル用） */
export function snsLabel(url: string) {
	const host = new URL(url).hostname.replace(/^www\./, '');
	if (host === 'x.com' || host === 'twitter.com') return 'X';
	if (host.endsWith('youtube.com') || host === 'youtu.be') return 'YouTube';
	if (host.endsWith('twitch.tv')) return 'Twitch';
	if (host.endsWith('tiktok.com')) return 'TikTok';
	if (host.endsWith('instagram.com')) return 'Instagram';
	return 'Link';
}
