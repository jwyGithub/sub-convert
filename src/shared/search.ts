export class Search {
    public static omit(searchParams: URLSearchParams, keys: string | string[] = []): URLSearchParams {
        if (keys.length === 0) return searchParams;
        const newSearchParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
            if (!keys.includes(key)) {
                newSearchParams.set(key, value);
            }
        });
        return newSearchParams;
    }

    public static pick(searchParams: URLSearchParams, keys: string | string[] = []): URLSearchParams {
        if (keys.length === 0) return searchParams;
        const newSearchParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
            if (keys.includes(key)) {
                newSearchParams.set(key, value);
            }
        });
        return newSearchParams;
    }

    public static toHeaders(searchParams: URLSearchParams): HeadersInit {
        return Object.fromEntries(searchParams.entries());
    }
}

