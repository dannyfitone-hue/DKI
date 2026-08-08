'use client';
import {useEffect, useRef} from 'react';
import {createClient} from '@supabase/supabase-js';

export default function useLiveRefresh(onChange, {tables=['emergencies','job_updates'], pollMs=3500}={}) {
  const cb = useRef(onChange);
  useEffect(()=>{ cb.current=onChange }, [onChange]);

  useEffect(()=>{
    let interval;
    let supabase;
    const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (url && anon) {
      supabase=createClient(url,anon);
      const channel=supabase.channel('dki-restotech-live');
      tables.forEach(table=>{
        channel.on('postgres_changes',{event:'*',schema:'public',table},()=>cb.current?.());
      });
      channel.subscribe();
      interval=setInterval(()=>cb.current?.(), pollMs*4);
      return ()=>{ clearInterval(interval); supabase.removeChannel(channel); };
    }

    interval=setInterval(()=>cb.current?.(),pollMs);
    return ()=>clearInterval(interval);
  }, [tables.join('|'),pollMs]);
}
