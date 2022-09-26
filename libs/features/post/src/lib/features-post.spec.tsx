import { render } from '@testing-library/react';

import FeaturesPost from './features-post';

describe('FeaturesPost', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FeaturesPost />);
    expect(baseElement).toBeTruthy();
  });
});
