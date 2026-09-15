import { Field, Label, Search } from '@digdir/designsystemet-react';
import { localization } from '@/libs/language';

interface CodeSearchProps {
  searchId: string;
  filterTerm: string;
  setFilterTerm: (value: string) => void;
}
const CodeSearch = ({ searchId, filterTerm, setFilterTerm }: CodeSearchProps) => {
  return (
    <Field>
      <Label weight={'semibold'}>{localization.codeTree.filterPlaceholder}</Label>
      <Search>
        <Search.Input
          id={searchId}
          aria-label={localization.codeTree.filterLabel}
          value={filterTerm}
          onChange={(event) => setFilterTerm(event.target.value)}
        />
        <Search.Clear aria-label={localization.codeTree.clearFilter} onClick={() => setFilterTerm('')} />
      </Search>
    </Field>
  );
};

export { CodeSearch };
