import cx from 'clsx';
import { styled } from 'classname-variants/react';

export const Text = styled('p', {
  base: 'text-stone-100 font-sans leading-snug',
  variants: {},
});

export const Code = styled('code', {
  base: 'text-stone-100 leading-snug',
  variants: {},
});

export const Kbd = styled('kbd', {
  base: cx(
    'bg-stone-500 text-stone-100 font-sans text-xs',
    'leading-none pt-[2px] px-[3px] pb-[1px] rounded-sm ',
    'capitalize min-w-[16px] inline-block text-center',
    'w-fit h-fit'
  ),
  variants: {},
});
