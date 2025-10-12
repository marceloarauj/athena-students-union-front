'use client';

import Toggle from '@/components/ui/toggle';
import React, { useState } from 'react';

export default function SettingsPage() {
  const [showProfile, setShowProfile] = useState(false);
  const [enableDarkMode, setEnableDarkMode] = useState(false);

  return (
    <div className='p-8 space-y-6'>
      <h2 className='text-xl font-semibold'>Configurações da Instituição</h2>
      <Toggle
        id='showProfile'
        checked={showProfile}
        label='Exibir informações de perfil'
        onToggle={setShowProfile}
      />
      <section>
        <h2 className='font-medium'>Permissões do usuário</h2>
      </section>

      <section>
        <h2 className='font-medium'>Visual</h2>
        <Toggle
          id='enableDarkMode'
          checked={enableDarkMode}
          label='Permitir modo escuro'
          onToggle={setEnableDarkMode}
        />
      </section>
    </div>
  );
}
