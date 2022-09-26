import { Box, Text, Code, Button } from '..';
import { FallbackProps } from 'react-error-boundary';
import clsx from 'clsx';

export const LoadingSplashScreen = () => {
  return (
    <Box center className="min-h-screen min-w-screen bg-[#282828]">
      <Text className="text-2xl">Loading...</Text>
    </Box>
  );
};

export function ErrorFallback({
  error,
  resetErrorBoundary,
  className,
}: FallbackProps & { className?: string }) {
  return (
    <Box
      center
      role="alert"
      className={clsx(className, 'flex p-4 bg-[#303030]')}
    >
      <Box
        center
        className={clsx(
          'bg-[#282828] border-6 border-rose-400',
          'w-full h-full flex flex-col'
        )}
      >
        <Text className="text-lg font-bold">Something went wrong</Text>
        <Code className="p-2">{error.message}</Code>
        <Button onClick={resetErrorBoundary}>Try again</Button>
      </Box>
    </Box>
  );
}
