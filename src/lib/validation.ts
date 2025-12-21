/**
 * URLにプロトコルがない場合は https:// を追加する
 */
export const normalizeUrl = (url: string): string => {
    if (url.length === 0) return "";

    const trimmed = url.trim();

    // 既にプロトコルがある場合はそのまま返す
    if (/^https?:\/\//i.test(trimmed)) {
        return trimmed;
    }

    // プロトコルがない場合は https:// を追加
    return `https://${trimmed}`;
};

/**
 * URLが有効かどうかを検証する
 * 空文字の場合は有効とみなす（任意入力の場合）
 * @returns エラーメッセージ。有効な場合は空文字を返す
 */
export const validateUrl = (url: string): string => {
    if (url.length === 0) return "";

    const trimmed = url.trim();
    if (trimmed.length === 0) return "";

    const normalized = normalizeUrl(trimmed);

    try {
        const parsed = new URL(normalized);
        if (!["http:", "https:"].includes(parsed.protocol)) {
            return "URLは http:// または https:// で始まる必要があります";
        }
        // ホスト名が存在するか確認
        if (!parsed.hostname || parsed.hostname.length === 0) {
            return "有効なURLを入力してください";
        }
        // ドメイン形式の簡易チェック（少なくとも1つのドットを含む、またはlocalhost）
        if (!parsed.hostname.includes(".") && parsed.hostname !== "localhost") {
            return "有効なURLを入力してください";
        }
        return "";
    } catch {
        return "有効なURLを入力してください";
    }
};

/**
 * URLが有効かどうかをbooleanで返す
 */
export const isValidUrl = (url: string): boolean => {
    return validateUrl(url) === "";
};
