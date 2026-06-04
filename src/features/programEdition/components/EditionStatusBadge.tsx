import { EditionStatus, EDITION_STATUS_LABELS } from '../models/programEditionModel';

const STATUS_COLORS: Record<EditionStatus, string> = {
  0: 'bg-muted text-muted-foreground',
  1: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  2: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  3: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
};

export function EditionStatusBadge({ status }: { status: EditionStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {EDITION_STATUS_LABELS[status]}
    </span>
  );
}
