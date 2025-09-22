import { useEffect, useState } from 'react';
import { DisciplineModel } from '../models/tableDiscipline';
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
        { key: 'Média', value: 9.0 },
      ],
    },
  ];
  const headers = [...disciplines[0].grades.map(grade => grade.key)];

  return (
    <LoadingContainer loading={loading}>
      <table>
        <thead>
          <tr>
            <th></th>
            {headers.map(header => (
              <th className='p-3' key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {disciplines.map(discipline => (
            <tr className='border-b border-dark-line' key={discipline.discipline}>
              <td className='p-3 text-left'>{discipline.discipline}</td>
              {discipline.grades.map(grade => (
                <td className='p-3 text-center' key={grade.key}>
                  {grade.value.toFixed(2)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </LoadingContainer>
  );
}
