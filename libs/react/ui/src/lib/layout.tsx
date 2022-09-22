import cx from 'clsx';
import { styled } from 'classname-variants/react';

export const Box = styled('div', {
  base: '',
  variants: {
		center: { true: "flex items-center justify-center"},
	},
})

const PageRoot = styled('div', {
  base: 'container mx-auto',
  variants: {},
});

const Header = styled('header', {
  base: 'flex items-center p-4 justify-between w-full',
  variants: {},
});

const Main = styled('main', {
  base: 'flex flex-col flex-1',
  variants: {},
});

export let Page = Object.assign(PageRoot, {
  Header,
  Main,
});

const DashboardRoot = styled('div', {
  base: 'flex min-w-screen min-h-screen bg-[#282828]',
  variants: {},
});

const DashboardHeader = styled(Header, {
  base: 'border-b border-stone-700',
  variants: {},
});

const DashboardSidebar = styled('nav', {
  base: cx(
    'flex flex-col h-screen w-40 p-4 bg-[#333]',
    'border-r border-stone-700'
  ),
  variants: {},
});

export let Dashboard = Object.assign(DashboardRoot, {
  Sidebar: DashboardSidebar,
  Header: DashboardHeader,
  Main,
});
