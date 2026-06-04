'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function GradeEntryRedirect() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    router.replace(`/${params.institution}/class-setup`);
  }, [router, params.institution]);

  return null;
}
