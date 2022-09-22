import {
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
  useRef,
  Ref,
} from 'react';
import styled from '@emotion/styled';
import {
  BoldExtension,
  CalloutExtension,
  ItalicExtension,
  HeadingExtension,
  MarkdownExtension,
  CodeBlockExtension,
} from 'remirror/extensions';
import {
  Remirror,
  useRemirror,
  ThemeProvider,
  useRemirrorContext,
  UseRemirrorReturn,
  UseRemirrorContextType,
  ReactFrameworkOutput,
} from '@remirror/react';
import colors from 'tailwindcss/colors';
import { EmptyShape, Extension } from 'remirror';

type WysiwygEditorProps = {
  initialContent?: string;
  placeholder?: string;
  onChange?: (markdown: string) => void;
  onBlur?: (markdown: string) => void;
  onFocus?: () => void;
  disableFocus?: boolean;
  disablePadding?: boolean;
};

const extensions = () => [
  new BoldExtension({}),
  new ItalicExtension({}),
  new HeadingExtension({}),
  // new CalloutExtension({ defaultType: 'warn' }),
  new MarkdownExtension({}),
  // new CodeBlockExtension(),
];

// TODO(knd): Find correct typing
type EditorRef = any;

const ImperativeHandle = forwardRef((_: unknown, ref: Ref<EditorRef>) => {
  const mirror = useRemirrorContext({
    autoUpdate: true,
  });

  // Expose content handling to outside
  useImperativeHandle(ref, () => mirror);

  return <></>;
});

export const WysiwygEditor = (props: WysiwygEditorProps) => {
  const editorRef = useRef<EditorRef | null>(null);

  const { manager, state, setState } = useRemirror({
    extensions,
    content: props.initialContent ?? '',
    stringHandler: 'markdown',
  });

  useEffect(
    function initializeInitialMarkdownContent() {
      const text = props?.initialContent;
      if (Boolean(text)) {
        editorRef.current!.setContent({ type: 'doc', content: [] });
        editorRef.current!.commands?.insertMarkdown(text);
      }
    },
    [props?.initialContent]
  );

  return (
    <Container
      disableFocus={Boolean(props.disableFocus)}
      disablePadding={Boolean(props.disablePadding)}
      className="remirror-theme text-stone-100"
    >
      <ThemeProvider
        theme={{
          color: {
            active: {
              text: colors.stone[100],
              primaryText: colors.stone[100],
              secondaryText: colors.stone[100],
            },
            foreground: colors.stone[100],
            outline: colors.stone[500],
          },
        }}
      >
        <Remirror
          onFocus={props.onFocus}
          placeholder={props.placeholder}
          autoRender="start"
          state={state}
          onBlur={(parameter) => {
            if (Boolean(props?.onBlur)) {
              props?.onBlur(parameter.helpers.getMarkdown());
            }
          }}
          manager={manager}
          onChange={(parameter) => {
            if (Boolean(props?.onChange)) {
              props?.onChange(parameter.helpers.getMarkdown());
            }
            setState(parameter.state);
          }}
        >
          <ImperativeHandle ref={editorRef} />
        </Remirror>
      </ThemeProvider>
    </Container>
  );
};

type ContainerProps = {
  disableFocus: boolean;
  disablePadding: boolean;
};

export const Container = styled.div<ContainerProps>((props) => ({
  '.remirror-editor-wrapper': {
    paddingTop: '0px',
  },
  '.remirror-theme .ProseMirror:focus': {
    boxShadow: props?.disableFocus
      ? 'none'
      : 'var(--rmr-color-outline) 0px 0px 0px 1px',
  },
  '.remirror-theme .ProseMirror': {
    padding: props?.disablePadding ? '0px' : 'var(--rmr-space-3);',
  },
  '.remirror-editor': {
    overflowY: 'auto',
    boxShadow: 'none',
  },
}));
