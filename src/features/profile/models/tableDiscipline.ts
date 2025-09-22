export type DisciplineModel = {
  discipline: string;
  grades: GradeModel[];
};

export type GradeModel = {
  key: string;
  value: number;
};
