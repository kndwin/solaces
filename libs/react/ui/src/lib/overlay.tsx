import { Fragment, ReactNode } from 'react';
import cx from 'clsx';
import { styled } from 'classname-variants/react';
import { atom, useAtom } from 'jotai';
import { Transition } from '@headlessui/react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as ToastPrimitive from '@radix-ui/react-toast';
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

// TOOLTIP
const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const StyledTooltipContent = styled(TooltipPrimitive.Content, {
  base: cx(
    'animate-in',
    'radix-side-top:fade-in-25',
    'radix-side-right:fade-in-25',
    'radix-side-bottom:fade-in-25',
    'radix-side-left:fade-in-25',
    'inline-flex items-center rounded-md px-2 py-1',
    'bg-stone-700 text-stone-100',
    'border border-stone-600'
  ),
  variants: {},
});

export let Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
  Trigger: TooltipTrigger,
  Content: StyledTooltipContent,
});

const DialogRoot = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;

const StyledDialogOverlay = styled(DialogPrimitive.Overlay, {
  base: 'fixed inset-0 z-20 bg-[#101010]/25',
  variants: {},
});

const StyledDialogContent = styled(DialogPrimitive.Content, {
  base: cx(
    'fixed z-50 drop-shadow-lg bg-[#282828] border border-stone-500',
    'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
    'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {},
});

export const dialogTransitionProps = {
  overlay: {
    enter: 'ease-out duration-200',
    enterFrom: 'opacity-0',
    enterTo: 'opacity-100',
    leave: 'ease-in duration-200',
    leaveFrom: 'opacity-100',
    leaveTo: 'opacity-0',
  },
  content: {
    enter: 'ease-out duration-100',
    enterFrom: 'opacity-0 scale-95',
    enterTo: 'opacity-100 scale-100',
    leave: 'ease-in duration-100',
    leaveFrom: 'opacity-100 scale-100',
    leaveTo: 'opacity-0 scale-95',
  },
};

// DIALOG
export let Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: StyledDialogContent,
  Overlay: StyledDialogOverlay,
});

type DialogContentControlledProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DialogContentControlled = (
  props: DialogContentControlledProps
) => (
  <DialogPrimitive.Root open={props.open} onOpenChange={props.onOpenChange}>
    <Transition.Root show={props.open}>
      <Transition.Child as={Fragment} {...dialogTransitionProps.overlay}>
        <StyledDialogOverlay forceMount />
      </Transition.Child>
      <Transition.Child as={Fragment} {...dialogTransitionProps.content}>
        <StyledDialogContent forceMount>{props.children}</StyledDialogContent>
      </Transition.Child>
    </Transition.Root>
  </DialogPrimitive.Root>
);

// DRAWER
const DrawerRoot = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const StyledDrawerContent = styled(DialogPrimitive.Content, {
  base: cx(
    'fixed z-50 bg-[#282828] shadow-lg',
    'w-[95vw] max-w-md p-4 rounded-lg  ',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {
    side: {
      left: 'left-2 top-2 bottom-2',
      right: 'right-2 top-2 bottom-2',
    },
  },
});

export const drawerTransitionProps = {
  content: {
    left: {
      enter: 'ease-out duration-200',
      enterFrom: 'translate-x-full opacity-0 scale-95',
      enterTo: 'translate-0 opacity-100 scale-100',
      leave: 'ease-in duration-100',
      leaveFrom: 'translate-0 opacity-100 scale-100',
      leaveTo: 'translate-x-full opacity-0 scale-95',
    },
    right: {
      enter: 'ease-out duration-200',
      enterFrom: 'translate-x-full opacity-0 ',
      enterTo: 'translate-0 opacity-100',
      leave: 'ease-in duration-100',
      leaveFrom: 'translate-0 opacity-100 ',
      leaveTo: 'translate-x-full opacity-0 ',
    },
  },
};

export let Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: StyledDrawerContent,
  Overlay: StyledDialogOverlay,
});

export const DrawerContentControlled = ({
  children,
  open,
  onOpenChange,
  side = 'right',
}: {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: 'left' | 'right';
}) => (
  <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
    <Transition.Root show={open}>
      <Transition.Child as={Fragment} {...dialogTransitionProps.overlay}>
        <StyledDialogOverlay forceMount />
      </Transition.Child>
      <Transition.Child as={Fragment} {...drawerTransitionProps.content[side]}>
        <StyledDrawerContent side="right" forceMount>
          {children}
        </StyledDrawerContent>
      </Transition.Child>
    </Transition.Root>
  </DialogPrimitive.Root>
);

// TOAST
const ToastProvider = ToastPrimitive.ToastProvider;
const ToastRoot = styled(ToastPrimitive.Root, {
  base: cx(
    'z-50 fixed bottom-4 right-4  w-60 p-2',
    'shadow-lg rounded-sm bg-[#333333] text-stone-100',
    'radix-state-open:animate-in radix-state-open:slide-in-from-bottom',
    'radix-state-closed:animate-out radix-state-closed:slide-out-from-top',
    'radix-swipe-end:animate-out radix-swipe-end:slide-out-from-left',
    'translate-x-radix-toast-swipe-move-x',
    'radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200',
    'radix-swipe-cancel:ease-[ease]',
    'focus:outline-none focus-visible:ring',
    'focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
  ),
  variants: {},
});
const ToastTitle = ToastPrimitive.Title;
const ToastDescription = ToastPrimitive.Description;
const ToastAction = ToastPrimitive.Action;
const ToastClose = ToastPrimitive.Close;

type TToast = {
  open: boolean;
  title: string;
  description: string;
  type: 'success' | 'error' | 'info';
};

export type TSendToast = Omit<TToast, 'open'>;

const toastAtom = atom({
  open: false,
  title: '',
  description: '',
  type: 'success',
});

export const useToast = () => {
  const [toast, setToast] = useAtom(toastAtom);

  const send = (toastToSend: TSendToast) => {
    setToast({ ...toastToSend, open: true });
  };

  const onOpenChange = (isOpen: boolean) => {
    setToast({ ...toast, open: isOpen });
  };

  return {
    send,
    toast: toast as TToast,
    onOpenChange,
  };
};

export let Toast = Object.assign(ToastRoot, {
  Provider: ToastProvider,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Viewport: ToastPrimitive.Viewport,
});

// ALERT DIALOG
const AlertDialogRoot = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const StyledAlertDialogOverlay = styled(AlertDialogPrimitive.Overlay, {
  base: 'fixed inset-0 z-20 bg-[#101010]/25',
  variants: {},
});
const StyledAlertDialogContent = styled(AlertDialogPrimitive.Content, {
  base: cx(
    'fixed z-50 drop-shadow-lg bg-[#282828] border border-stone-500',
    'w-[95vw] max-w-md rounded-lg p-4 md:w-full',
    'top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {},
});
const AlertDialogTitle = styled(AlertDialogPrimitive.Title, {
  base: 'text-lg text-stone-300 font-bold',
  variants: {},
});
const AlertDialogDescription = styled(AlertDialogPrimitive.Description, {
  base: 'text-sm text-stone-300',
  variants: {},
});
const AlertDialogCancel = styled(AlertDialogPrimitive.Cancel, {
  base: cx(
    'px-2 py-1 rounded-md text-stone-300 ',
    'bg-stone-800 text-sm',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {},
});
const AlertDialogAction = styled(AlertDialogPrimitive.Action, {
  base: cx(
    'px-2 py-1 rounded-md text-stone-800 border border-stone-500',
    'bg-stone-400 font-bold text-sm',
    'focus:outline-none focus-visible:ring-2',
    'focus-visible:ring-stone-500 focus-visible:ring-opacity-75'
  ),
  variants: {},
});

export let AlertDialog = Object.assign(AlertDialogRoot, {
  Content: StyledAlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Action: AlertDialogAction,
  Cancel: AlertDialogCancel,
});

type TAlert = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => {};
};

export type TSendAlert = Omit<TAlert, 'open'>;

const alertAtom = atom({
  open: false,
  title: '',
  description: '',
  onConfirm: () => {},
});

export const useAlert = () => {
  const [alert, setAlert] = useAtom(alertAtom);

  const send = (alertToSend: TSendAlert) => {
    setAlert({ ...alertToSend, open: true });
  };

  const onOpenChange = (isOpen: boolean) => {
    setAlert({ ...alert, open: isOpen });
  };

  return {
    send,
    alert: alert as TAlert,
    onOpenChange,
  };
};

type AlertDialogContentControlledProps = {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

export const AlertDialogContentControlled = (
  props: AlertDialogContentControlledProps
) => {
  return (
    <AlertDialogRoot>
      <Transition.Root show={props.open}>
        <Transition.Child as={Fragment} {...dialogTransitionProps.overlay}>
          <StyledAlertDialogOverlay forceMount />
        </Transition.Child>
        <Transition.Child as={Fragment} {...dialogTransitionProps.content}>
          <StyledAlertDialogContent forceMount>
            {props.children}
          </StyledAlertDialogContent>
        </Transition.Child>
      </Transition.Root>
    </AlertDialogRoot>
  );
};

// CONTEXT MENU
const ContextMenuRoot = ContextMenuPrimitive.Root;
const ContextMenuTrigger = styled(ContextMenuPrimitive.Trigger, {
  base: 'flex w-full h-fit',
  variants: {},
});
const ContextMenuPortal = ContextMenuPrimitive.Portal;
const ContextMenuContent = styled(ContextMenuPrimitive.Content, {
  base: cx(
    'w-48 rounded-sm shadow-md md:w-56 bg-[#333333] py-1',
    'radix-side-top:animate-in radix-side-top:slide-in-from-top',
    'radix-side-bottom:animate-in radix-side-top:slide-in-from-bottom'
  ),
  variants: {},
});
const ContextMenuItem = styled(ContextMenuPrimitive.Item, {
  base: cx(
    'px-2 py-1 text-stone-300  ',
    'hover:bg-stone-500',
    'flex gap-2 items-center'
  ),
  variants: {},
});
const ContextMenuSeperator = ContextMenuPrimitive.Seperator;
const ContextMenuCheckboxItem = ContextMenuPrimitive.CheckboxItem;
const ContextMenuItemIndicator = ContextMenuPrimitive.ItemIndicator;
const ContextMenuLabel = ContextMenuPrimitive.Label;

export let ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Portal: ContextMenuPortal,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Seperator: ContextMenuSeperator,
  CheckboxItem: ContextMenuCheckboxItem,
  ItemIndicator: ContextMenuItemIndicator,
  Label: ContextMenuLabel,
});

type ContextMenuContentControlledProps = {
  children: ReactNode;
};
export const ContextMenuContentControlled = (
  props: ContextMenuContentControlledProps
) => {
  return (
    <ContextMenuRoot>
      <ContextMenuPortal>
        <ContextMenuContent>{props.children}</ContextMenuContent>
      </ContextMenuPortal>
    </ContextMenuRoot>
  );
};
