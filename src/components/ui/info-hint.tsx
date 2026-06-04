'use client';

import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

type Props = {
  text: string;
};

export function InfoHint({ text }: Props) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className='inline-flex items-center cursor-help text-muted-foreground hover:text-foreground transition-colors ml-1'>
            <HelpCircle size={14} />
          </span>
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-64 text-left leading-relaxed whitespace-normal'>
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
