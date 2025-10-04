import { useEffect, useState } from 'react';
import { DisciplineModel } from '../models/tableDisciplineModel';
import LoadingContainer from '@/components/ui/loadingContainer';

export function DisciplineTable() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  var disciplines: DisciplineModel[] = [
    {
      discipline: 'Matemática',
      grades: [
        { key: 'Nota 1', value: 8.0 },
        { key: 'Nota 2', value: 7.5 },
        { key: 'Nota 3', value: 9.0 },
        { key: 'Nota 4', value: 8.5 },
        { key: 'Recu', value: 8.4 },
        { key: 'Média', value: 8.25 },
      ],
    },
    {
      discipline: 'Português',
      grades: [
        { key: 'Nota 1', value: 9.0 },
        { key: 'Nota 2', value: 8.5 },
        { key: 'Nota 3', value: 9.5 },
        { key: 'Nota 4', value: 9.0 },
        { key: 'Recu', value: 8.4 },
        { key: 'Média', value: 9.0 },
      ],
    },
    {
      discipline: 'Ciências',
      grades: [
        { key: 'Nota 1', value: 8.0 },
        { key: 'Nota 2', value: 7.5 },
        { key: 'Nota 3', value: 9.75 },
        { key: 'Nota 4', value: 8.5 },
        { key: 'Recu', value: 8.4 },
        { key: 'Média', value: 8.25 },
      ],
    },
    {
      discipline: 'Inglês',
      grades: [
        { key: 'Nota 1', value: 9.0 },
        { key: 'Nota 2', value: 8.5 },
        { key: 'Nota 3', value: 9.5 },
        { key: 'Nota 4', value: 9.0 },
        { key: 'Recu', value: 8.4 },
        { key: 'Média', value: 9.0 },
      ],
    },
    {
      discipline: 'wwww',
      grades: [
        { key: 'Nota 1', value: 9.0 },
        { key: 'Nota 2', value: 8.5 },
        { key: 'Nota 3', value: 9.5 },
        { key: 'Nota 4', value: 9.0 },
        { key: 'Recu', value: 8.4 },
        { key: 'Média', value: 9.0 },
      ],
    },
    {
      discipline: 'oooooo',
      grades: [
        { key: 'Nota 1', value: 9.0 },
        { key: 'Nota 2', value: 8.5 },
        { key: 'Nota 3', value: 9.5 },
        { key: 'Nota 4', value: 9.0 },
        { key: 'Recu', value: 8.4 },
        { key: 'Média', value: 9.0 },
      ],
    },
  ];
  const headers = [...disciplines[0].grades.map(grade => grade.key)];

  return (
    <LoadingContainer loading={loading}>
      {
        <div className='w-full'>
          {!loading && (
            <table className='table-auto min-w-max border-collapse w-full'>
              <thead className='sticky top-0 z-20 bg-gray-500'>
                <tr className='border-b border-dark-line'>
                  <th className='sticky top-0 left-0 z-30 bg-gray-500 text-left p-3 w-32'>
                    Disciplina
                  </th>
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
                  <tr key={discipline.discipline} className='border-b border-dark-line'>
                    <td className='sticky left-0 z-10 bg-gray-500 text-left p-3 w-32'>
                      {discipline.discipline}
                    </td>
                    {discipline.grades.map(grade => (
                      <td key={grade.key} className='text-center p-3 min-w-[80px]'>
                        {grade.value.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      }
    </LoadingContainer>
  );
}
