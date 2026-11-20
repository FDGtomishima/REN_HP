// コンテンツコレクションの定義（NEWS の Markdown と src/data/ の YAML）
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { yamlLoader } from './lib/yaml-loader';

// NEWS のカテゴリ一覧（カテゴリを増やすときはここに追加する）
export const NEWS_CATEGORIES = ['お知らせ', '配信予定', 'グッズ', 'コラボ'] as const;

/** "2024-04-01" 形式の日付 */
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日付は "YYYY-MM-DD" 形式で書いてください');
/** 名前＋SNSリンク（主催者・チームメンバー・絵師など） */
const person = z.object({ name: z.string(), url: z.url().optional() });

// NEWS 記事：src/content/news/ の Markdown（1記事1ファイル、ファイル名が URL になる）
const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		category: z.enum(NEWS_CATEGORIES),
		/** SNS でシェアされたときの説明文（OGP）。省略時はサイトの説明文 */
		description: z.string().optional(),
	}),
});

// サイト共通設定：src/data/site.yaml
const site = defineCollection({
	loader: yamlLoader('src/data/site.yaml', { mode: 'single' }),
	schema: z.object({
		name: z.string(),
		shortName: z.string(),
		description: z.string(),
		disclaimer: z.string(),
		copyright: z.string(),
		contactFormUrl: z.url(),
	}),
});

// ライバーのプロフィール：src/data/profile.yaml
const profile = defineCollection({
	loader: yamlLoader('src/data/profile.yaml', { mode: 'single' }),
	schema: z.object({
		name: z.string(),
		birthday: z.string().regex(/^\d{2}-\d{2}$/, '誕生日は "MM-DD" 形式で書いてください'),
		debut: dateString,
		anniversaries: z.array(z.object({ label: z.string(), date: dateString })).default([]),
		intro: z.string(),
		official_profile: z.url(),
		outfits: z
			.array(
				z.object({
					id: z.string(),
					name: z.string(),
					released: dateString,
					artist: person,
					/** image は src/assets/ からの相対パス（例：outfits/1st-default.png） */
					variants: z.array(z.object({ label: z.string(), image: z.string() })).min(1),
				}),
			)
			.min(1),
		sns: z.array(
			z.object({
				service: z.enum(['youtube', 'twitch', 'x', 'tiktok', 'instagram', 'other']),
				id: z.string(),
				url: z.url(),
			}),
		),
		live_check: z.object({
			youtube_channel_id: z.string().optional(),
			twitch_login: z.string().optional(),
		}),
		tags: z.object({
			stream: z.string(),
			fanart: z.string(),
			fan_name: z.string(),
		}),
		frequent_streams: z
			.array(z.object({ title: z.string(), description: z.string(), example: z.url().optional() }))
			.default([]),
	}),
});

// 年表：src/data/history.yaml
const history = defineCollection({
	loader: yamlLoader('src/data/history.yaml', { mode: 'list' }),
	schema: z.object({
		date: dateString,
		title: z.string(),
		text: z.string(),
		embeds: z
			.array(z.object({ platform: z.enum(['youtube', 'twitch']), id: z.string() }))
			.default([]),
		/** achievements.yaml の id（実績でなければ null） */
		achievement: z.string().nullable().default(null),
	}),
});

// 実績：src/data/achievements.yaml
const achievements = defineCollection({
	loader: yamlLoader('src/data/achievements.yaml', { mode: 'list' }),
	schema: z.object({
		id: z.string().regex(/^[a-z0-9-]+$/, 'id は英小文字・数字・ハイフンで書いてください'),
		title: z.string(),
		datetime: z.string().regex(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?$/, '日時は "YYYY-MM-DDTHH:MM" 形式で書いてください'),
		category: z.string(),
		result: z.string().optional(),
		organizers: z.array(person).min(1),
		team: z.array(person).default([]),
		streams: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
		description: z.string().optional(),
	}),
});

// 制作クレジット：src/data/credits.yaml
const credits = defineCollection({
	loader: yamlLoader('src/data/credits.yaml', { mode: 'list' }),
	schema: z.object({
		name: z.string(),
		role: z.string(),
		url: z.url().optional(),
	}),
});

export const collections = { news, site, profile, history, achievements, credits };
