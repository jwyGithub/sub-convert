export function getShortServeConfig(req: Request, env: Env): { label: string; value: string }[] {
    if (!env.SHORT_URL_ENABLED) {
        return [];
    }
    const { origin } = new URL(req.url);
    return [{ label: origin, value: origin }];
}
