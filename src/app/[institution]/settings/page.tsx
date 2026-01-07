'use client';

import Toggle from '@/components/ui/toggle';
import React, { useState } from 'react';

export default function SettingsPage() {
  const [showProfile, setShowProfile] = useState(false);
  const [enableLightMode, setEnableLightMode] = useState(false);

  return (
    <div className='p-8 space-y-6'>
      <h2 className='text-xl font-semibold'>Configurações da Instituição</h2>
      <Toggle
        id='showProfile'
        checked={showProfile}
        label='Exibir informações de perfil'
        onToggle={setShowProfile}
      />
      <Toggle
        id='enableDarkMode'
        checked={enableLightMode}
        label='Permitir modo claro'
        onToggle={setEnableLightMode}
      />

      <section>
        <h2 className='font-medium'>Permissões do usuário</h2>
      </section>
    </div>
  );
}
