import { Search } from '@digdir/designsystemet-react';
import { FormEvent } from 'react';

interface TextFilterProps {
  field: string;
  filters: Record<string, string>;
  setFilters: (f: Record<string, string>) => void;
  placeholder?: string;
}

export function TextFilter({ field, filters, setFilters, placeholder }: TextFilterProps) {
  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setFilters({ ...filters, [field]: value });
  };

  return (
    <Search defaultValue={filters[field] || ''} onChange={handleChange}>
      <Search.Input aria-label='Søk' />
      <Search.Clear />
    </Search>
  );
}
