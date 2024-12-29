/**
 * 去年の数値(prevYear) と 今年の数値(currentYear)を引数に取り、
 * 数値(小数第2位まで) か "-" を返す関数
 *
 * @param {number} prevYear - 去年のコミット数や指標となる数値
 * @param {number} currentYear - 今年のコミット数や指標となる数値
 * @returns {number|"-"} - 有効な場合は数値型、無効の場合は "-"
 */
export function calculateChangeRate(
	prevYear: number,
	currentYear: number,
): number | "-" {
	if (typeof prevYear !== "number" || typeof currentYear !== "number") {
		return "-";
	}

	if (prevYear === 0) {
		return "-";
	}

	const ratio = ((currentYear - prevYear) / prevYear) * 100;

	if (!Number.isFinite(ratio)) {
		return "-";
	}

	return Number.parseFloat(ratio.toFixed(2));
}
