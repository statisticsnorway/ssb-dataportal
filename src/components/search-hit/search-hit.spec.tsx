import React from 'react';
import { render } from '@testing-library/react';
import { SearchHit } from '.';
import { Tag } from '@digdir/designsystemet-react';

describe('SearchHit', () => {
  it('should render SearchHit successfully', () => {
    const { baseElement } = render(
      <SearchHit
        title={'Search hit title'}
        content={'Search hit content'}
        tags={[<Tag key='tag1'>Search hit status tag</Tag>]}
        titleHref={'Search hit title href'}
        labels={'Search hit labels'}
      />,
    );
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });

  it('should render SearchHit with empty title successfully', () => {
    const { baseElement } = render(<SearchHit title={''} />);
    expect(baseElement).toBeTruthy();
    expect(baseElement).toMatchSnapshot();
  });
});
