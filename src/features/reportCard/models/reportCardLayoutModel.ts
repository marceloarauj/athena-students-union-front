export type ReportCardComponentType =
  | 'logo'
  | 'institution_name'
  | 'student_name'
  | 'class_info'
  | 'grades_table'
  | 'responsible_name'
  | 'phone_number'
  | 'custom_text';

export interface ReportCardLayoutComponent {
  id: string;
  type: ReportCardComponentType;
  label: string;
  x: number;
  y: number;
  color: string;
  content?: string;
  visible: boolean;
  fontSize: number;
  fontWeight: 'normal' | 'bold';
}

export interface ReportCardLayoutConfig {
  id?: string;
  components: ReportCardLayoutComponent[];
  pageBackground: string;
}
