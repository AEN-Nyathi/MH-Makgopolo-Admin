'use client';

import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  return user;
}
