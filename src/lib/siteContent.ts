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
  window.localStorage.setItem(key, JSON.stringify(content));
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
  writeLocalContent(key, content);

  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('site_content').upsert({
    key,
    content,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    throw error;
  }
}
