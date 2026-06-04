export type Subject = {
  id: string;
  programId: string;
  name: string;
  code: string;
  isActive: boolean;
};

export type CreateSubjectDto = {
  programId: string;
  name: string;
  code: string;
};
