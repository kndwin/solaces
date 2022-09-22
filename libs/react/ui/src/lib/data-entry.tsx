import cx from 'clsx';
import { styled } from 'classname-variants/react';
import TextareaAutosize from 'react-textarea-autosize';

export const Button = styled('button', {
  base: cx(
    'font-sans flex items-center justify-center',
    'rounded-sm',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {
    size: {
      xs: 'p-1 text-[12px]',
      sm: 'p-1 text-sm',
      base: 'px-2 py-1 text-sm rounded-sm',
      lg: 'p-2 text-base',
      icon: 'p-1 rounded-sm',
    },
    color: {
      primary: 'bg-stone-500 text-stone-100',
    },
  },
  defaultVariants: {
    size: 'base',
    color: 'primary',
  },
});

export const TextField = styled('input', {
  base: cx(
    'font-sans flex items-center justify-center',
    'focus:outline-none py-2',
    'bg-[#282828] text-stone-100'
  ),
  variants: {},
});

export const TextArea = styled(TextareaAutosize, {
  base: cx(
    'font-sans flex items-center justify-center',
    'focus:outline-none py-2 w-full',
    'bg-[#282828] text-stone-100 resize-none',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {},
});

export const Form = styled('form', { variants: {} });
