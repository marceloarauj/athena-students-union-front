export type DisciplineModel = {
  name: string;
  grades: GradeModel[];
};

export type GradeModel = {
  key: string;
  value: number;
};
