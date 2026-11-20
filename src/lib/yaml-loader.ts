// src/data/ の YAML をコンテンツコレクションとして読み込むローダー
// Astro 標準の file() ローダーは「id 付きの配列」か「id をキーにしたオブジェクト」しか扱えないため、
// 仕様書どおりの書き方（1件だけのオブジェクト / id のない配列）をそのまま読めるようにする。
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Loader, LoaderContext } from 'astro/loaders';
import { parse } from 'yaml';

interface Options {
	/**
	 * single：ファイル全体を1件として読む（id は "main"）
	 * list：配列の各要素を1件として読む（id は要素の id、なければ並び順の番号）
	 */
	mode: 'single' | 'list';
}

export function yamlLoader(path: string, { mode }: Options): Loader {
	return {
		name: 'yaml-loader',
		load: async (context: LoaderContext) => {
			const filePath = resolve(fileURLToPath(context.config.root), path);

			const sync = async () => {
				const raw = parse(await readFile(filePath, 'utf-8')) ?? (mode === 'list' ? [] : {});
				const items: [string, Record<string, unknown>][] =
					mode === 'single'
						? [['main', raw]]
						: (raw as Record<string, unknown>[]).map((item, i) => [String(item.id ?? i), item]);

				context.store.clear();
				for (const [id, rawData] of items) {
					const data = await context.parseData({ id, data: rawData, filePath });
					context.store.set({ id, data, digest: context.generateDigest(rawData) });
				}
			};

			await sync();

			// 開発中はファイルの変更を監視して読み直す
			context.watcher?.add(filePath);
			context.watcher?.on('change', async (changed) => {
				if (resolve(changed) === filePath) await sync();
			});
		},
	};
}
