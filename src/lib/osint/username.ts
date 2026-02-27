type PlatformResult = {
  platform: string;
  url: string;
  exists: boolean | null;
  responseTime: number;
};

type UsernameResult = {
  username: string;
  platforms: PlatformResult[];
  riskSignals: string[];
};

const PLATFORMS = [
  { name: 'X/Twitter', url: (u: string) => `https://x.com/${u}` },
  { name: 'Instagram', url: (u: string) => `https://www.instagram.com/${u}/` },
  { name: 'TikTok', url: (u: string) => `https://www.tiktok.com/@${u}` },
  { name: 'GitHub', url: (u: string) => `https://api.github.com/users/${u}` },
  { name: 'Reddit', url: (u: string) => `https://www.reddit.com/user/${u}/about.json` },
];

export async function checkUsername(username: string): Promise<UsernameResult> {
  try {
    const settled = await Promise.allSettled(
      PLATFORMS.map(async ({ name, url }) => {
        const target = url(username);
        const start = performance.now();
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000);
        try {
          const response = await fetch(target, {
            method: 'HEAD',
            signal: controller.signal,
            redirect: 'manual',
          });
          clearTimeout(timeout);
          const time = Math.round(performance.now() - start);
          let exists: boolean | null = null;
          if (response.status === 200) exists = true;
          else if (response.status === 404 || response.status === 410) exists = false;
          return { platform: name, url: target, exists, responseTime: time };
        } catch {
          clearTimeout(timeout);
          return { platform: name, url: target, exists: null, responseTime: 3000 };
        }
      })
    );

    const results: PlatformResult[] = settled.map((r, i) =>
      r.status === 'fulfilled'
        ? r.value
        : { platform: PLATFORMS[i].name, url: PLATFORMS[i].url(username), exists: null, responseTime: 3000 }
    );

    const existsCount = results.filter((p) => p.exists === true).length;
    const riskSignals: string[] = [];
    if (existsCount === 0) {
      riskSignals.push('No social presence found — common for fake identities');
    }
    if (/\d{4,}$/.test(username)) {
      riskSignals.push('Username pattern common with auto-generated scam accounts');
    }

    return { username, platforms: results, riskSignals };
  } catch {
    return { username, platforms: [], riskSignals: ['Username check failed'] };
  }
}
