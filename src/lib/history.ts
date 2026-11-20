// HISTORY の周年区切りの計算
// デビュー日を起点に「デビュー～1周年 / 1周年～2周年 / …」に分け、年表の各項目を振り分ける

/** "YYYY-MM-DD" から k 年後の日付文字列 */
function addYears(date: string, years: number) {
	const [y, m, d] = date.split('-');
	return `${Number(y) + years}-${m}-${d}`;
}

/** デビュー日から数えて、その日付が何周年目の期間に入るか（デビュー～1周年 = 0） */
export function periodIndexOf(debut: string, date: string) {
	const years = Number(date.slice(0, 4)) - Number(debut.slice(0, 4));
	// 月日が記念日より前なら、まだその年の周年を迎えていない
	return date.slice(5) < debut.slice(5) ? years - 1 : years;
}

export interface Period<T> {
	index: number;
	label: string;
	/** 期間の開始日（この日を含む） */
	start: string;
	/** 期間の終了日（この日を含まない＝次の周年） */
	end: string;
	items: T[];
}

/**
 * 年表の項目を周年ごとに振り分ける。
 * 現在の期間の次の周年まで作り、まだ来ていない期間は items が空になる（Coming Soon 表示用）。
 */
export function groupByPeriod<T extends { date: string }>(debut: string, items: T[], today: string) {
	const current = Math.max(0, periodIndexOf(debut, today));
	const last = Math.max(current + 1, ...items.map((i) => periodIndexOf(debut, i.date)));

	const periods: Period<T>[] = [];
	for (let k = 0; k <= last; k++) {
		periods.push({
			index: k,
			label: k === 0 ? 'デビュー～1周年' : `${k}周年～${k + 1}周年`,
			start: addYears(debut, k),
			end: addYears(debut, k + 1),
			items: items.filter((i) => periodIndexOf(debut, i.date) === k).sort((a, b) => a.date.localeCompare(b.date)),
		});
	}
	return { periods, current };
}

/** 今日の日付（"YYYY-MM-DD"、日本時間） */
export function todayInJapan() {
	return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Tokyo' }).format(new Date());
}
