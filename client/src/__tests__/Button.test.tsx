import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Button from '../components/Button';

describe('button', () => {
  it('should render', () => {
    const onClickEvent = jest.fn();
    const { getByText } = render(<Button onClick={onClickEvent}>Click</Button>);
    expect(getByText(/Click/)).toBeTruthy();
  });

  it('should execute onClick method on button click event', () => {
    const onClickEvent = jest.fn();
    const { getByText } = render(<Button onClick={onClickEvent}>Click</Button>);
    fireEvent.click(getByText('Click'));
    expect(onClickEvent).toHaveBeenCalled();
  });
});
