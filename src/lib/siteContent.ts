import { supabase } from './supabase';

type SiteContentRow<T> = {
  content: T;
};

function readLocalContent<T>(key: string, fallback: T) {
  if (typeof window === 'undefined') return fallback;

  try {
    const saved = window.localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalContent<T>(key: string, content: T) {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(key, JSON.stringify(content));
  } catch {
    // Supabase is the source of truth. Local cache can fail when image data is large.
  }
}

export async function loadSiteContent<T>(
  key: string,
  fallback: T,
  normalize: (content: T) => T = (content) => content,
) {
  if (!supabase) {
    return normalize(readLocalContent(key, fallback));
  }

  const { data, error } = await supabase
    .from('site_content')
    .select('content')
    .eq('key', key)
    .maybeSingle<SiteContentRow<T>>();

  if (error || !data) {
    return normalize(readLocalContent(key, fallback));
  }

  writeLocalContent(key, data.content);
  return normalize(data.content);
}

export async function saveSiteContent<T>(key: string, content: T) {
  if (!supabase) {
    writeLocalContent(key, content);
    console.error('[saveSiteContent] Supabase is not configured. Check VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY env vars on the host.');
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase
    .from('site_content')
    .upsert(
      {
        key,
        content,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' },
    );

  if (error) {
    console.error(`[saveSiteContent] Supabase upsert failed for key "${key}":`, error);
    throw error;
  }

  writeLocalContent(key, content);
}
