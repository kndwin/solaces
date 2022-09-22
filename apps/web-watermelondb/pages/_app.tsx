import 'apps/web-watermelondb/public/global.css';
import 'remirror/styles/all.css';
import { AppProps } from 'next/app';
import {
  Tooltip,
  Toast,
  AlertDialog,
  AlertDialogContentControlled,
  useAlert,
  useToast,
  Box,
} from '@solaces/react-ui';
import { match } from 'ts-pattern';
import {
  ShortcutContext,
  useInterpret,
  shortcutMachine,
} from '@solaces/features/shortcuts';
import {
  HiCheckCircle,
  HiXCircle,
  HiX,
  HiInformationCircle,
} from 'react-icons/hi';

export default function CustomApp({ Component, pageProps }: AppProps) {
  const shortcutService = useInterpret(shortcutMachine);
  return (
    <Tooltip.Provider>
      <Toast.Provider>
        <ShortcutContext.Provider value={{ shortcutService }}>
          <Component {...pageProps} />
          <AlertDialogMessages />
          <ToastMessages />
        </ShortcutContext.Provider>
      </Toast.Provider>
    </Tooltip.Provider>
  );
}

const AlertDialogMessages = () => {
  const { alert, onOpenChange } = useAlert();
  return (
    <AlertDialogContentControlled
      open={alert.open}
      onOpenChange={onOpenChange}
      onConfirm={alert.onConfirm}
    >
      <AlertDialog.Title>{alert.title}</AlertDialog.Title>
      <AlertDialog.Description>{alert.description}</AlertDialog.Description>
      <Box className="flex items-center justify-end mt-4 gap-2">
        <AlertDialog.Cancel onClick={() => onOpenChange(false)}>
          Cancel
        </AlertDialog.Cancel>
        <AlertDialog.Action
          onClick={async () => {
            await alert.onConfirm();
            onOpenChange(false);
          }}
        >
          Confirm
        </AlertDialog.Action>
      </Box>
    </AlertDialogContentControlled>
  );
};
const ToastMessages = () => {
  const { toast, onOpenChange } = useToast();

  const toastDecorators = match(toast.type)
    .with('success', () => ({
      icon: <HiCheckCircle className="fill-green-300" size={14} />,
    }))
    .with('error', () => ({
      icon: <HiXCircle className="fill-red-300" size={14} />,
    }))
    .with('info', () => ({
      icon: <HiInformationCircle className="fill-stone-300" size={14} />,
    }))
    .exhaustive();

  return (
    <>
      <Toast open={toast.open} onOpenChange={onOpenChange}>
        <Box className="flex pr-2 w-60">
          <Toast.Close className="absolute top-2 right-2">
            <HiX />
          </Toast.Close>
          <Box className="pt-1 pr-2">{toastDecorators.icon}</Box>

          <Box className="flex flex-col">
            <Toast.Title className="flex items-center text-sm font-bold gap-2">
              {toast.title}
            </Toast.Title>
            <Toast.Description className="mb-4 text-xs">
              {toast.description}
            </Toast.Description>
          </Box>
        </Box>
      </Toast>
      <Toast.Viewport />
    </>
  );
};
