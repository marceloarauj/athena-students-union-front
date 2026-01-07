'use client';

import { DisciplineModel } from '../models/tableDisciplineModel';

type DisciplineTypeProps = {
  disciplines: DisciplineModel[];
};

export function DisciplineTable(prop: DisciplineTypeProps) {
  const disciplines = prop.disciplines ?? [];
  const headers = disciplines[0]?.grades?.map(grade => grade.key) ?? [];

  return (
    <div className='w-full'>
      <table className='table-auto min-w-max border-collapse w-full'>
        <thead className='sticky top-0 z-20 bg-gray-500'>
          <tr className='border-b border-dark-line'>
            <th className='sticky top-0 left-0 z-30 bg-gray-500 text-left p-3 w-32'>Disciplina</th>
            {headers.map(header => (
              <th
                key={header}
                className='sticky top-0 z-20 bg-gray-500 text-center p-3 min-w-[80px]'
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disciplines.map(discipline => (
            <tr key={discipline.name} className='border-b border-dark-line'>
              <td className='sticky left-0 z-10 bg-gray-500 text-left p-3 w-32'>
                <span className='font-bold'>{discipline.name}</span>
              </td>
              {discipline.grades.map(grade => (
                <td key={grade.key} className='text-center p-3 min-w-[80px]'>
                  <span className='font-bold'>{grade.value.toFixed(2)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
