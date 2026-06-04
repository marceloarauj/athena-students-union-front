'use client';

import { DisciplineModel } from '../models/tableDisciplineModel';

type DisciplineTypeProps = {
  disciplines: DisciplineModel[];
};

export function DisciplineTable({ disciplines }: DisciplineTypeProps) {
  const safeDiscs = disciplines ?? [];
  const headers = safeDiscs[0]?.grades?.map(g => g.key) ?? [];

  return (
    <table className='w-full text-sm border-collapse'>
      <thead>
        <tr className='bg-muted border-b border-border'>
          <th className='sticky left-0 z-10 bg-muted text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-36'>
            Disciplina
          </th>
          {headers.map(h => (
            <th
              key={h}
              className='text-center px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide min-w-[72px]'
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {safeDiscs.map((disc, i) => (
          <tr
            key={disc.name}
            className={`border-b border-border transition-colors hover:bg-primary/5 ${
              i % 2 !== 0 ? 'bg-muted/30' : ''
            }`}
          >
            <td className='sticky left-0 z-10 bg-card px-4 py-2.5 font-semibold text-foreground text-sm border-r border-border'>
              {disc.name}
            </td>
            {disc.grades.map(grade => (
              <td key={grade.key} className='text-center px-3 py-2.5 text-sm text-foreground tabular-nums'>
                {grade.value.toFixed(2)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
