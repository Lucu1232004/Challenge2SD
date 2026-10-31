// Hook del perfil del usuario: carga el correo y el avatar desde Supabase,
// crea el perfil si el trigger no lo hizo y sube la foto al bucket avatars.
import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface Profile {
  id: string;
  email: string | null;
  avatar_url: string | null;
}

export function useProfile(user: User | null) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('No se pudo cargar el perfil:', error.message);
      setProfile({ id: user.id, email: user.email ?? null, avatar_url: null });
      setLoading(false);
      return;
    }

    if (data) {
      setProfile(data as Profile);
      setLoading(false);
      return;
    }

    // Respaldo por si el trigger de auth.users no está creado.
    const { data: created, error: createError } = await supabase
      .from('profiles')
      .upsert({ id: user.id, email: user.email ?? null }, { onConflict: 'id' })
      .select('id, email, avatar_url')
      .maybeSingle();

    if (createError) {
      console.error('No se pudo crear el perfil:', createError.message);
      setProfile({ id: user.id, email: user.email ?? null, avatar_url: null });
    } else {
      setProfile((created as Profile) ?? { id: user.id, email: user.email ?? null, avatar_url: null });
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const updateAvatar = useCallback(
    async (file: Blob) => {
      if (!user) throw new Error('No hay una sesión activa.');

      const extension =
        file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `${user.id}/avatar.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, {
          upsert: true,
          contentType: file.type || 'image/jpeg',
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = `${publicUrl.publicUrl}?t=${Date.now()}`;

      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: user.id,
          email: user.email ?? null,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

      if (profileError) throw profileError;

      setProfile({ id: user.id, email: user.email ?? null, avatar_url: avatarUrl });
    },
    [user]
  );

  return { profile, loading, updateAvatar, refreshProfile: loadProfile };
}
