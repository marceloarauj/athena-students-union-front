export type DisciplineTopic = {
  id: number;
  title: string;
};

export type Discipline = {
  id: number;
  name: string;
  code: string;
  description: string;
  teacherCount: number;
  classes: number;
  color: string;
  formulaId?: number;
  topics: DisciplineTopic[];
};
