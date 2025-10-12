type ToggleProps = {
  id: string;
  checked: boolean;
  label: string;
  onToggle: (checked: boolean) => void;
};

export default function Toggle({ id, checked, label, onToggle }: ToggleProps) {
  return (
    <label className='flex items-center gap-3 cursor-pointer select-none' htmlFor={id}>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={() => onToggle(!checked)}
        className='sr-only'
      />

      <div
        className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${
          checked ? 'bg-primary' : 'bg-gray-300'
        }`}
        aria-hidden
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>

      <span className={`text-sm`}>{label}</span>
    </label>
  );
}
