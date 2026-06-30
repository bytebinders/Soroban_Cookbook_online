import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import { useCodeBlockContext } from '@docusaurus/theme-common/internal';
import Button from '@theme/CodeBlock/Buttons/Button';
import IconCopy from '@theme/Icon/Copy';
import IconSuccess from '@theme/Icon/Success';
import styles from './styles.module.css';

type CopyState = 'idle' | 'success' | 'error';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function title() {
  return translate({
    id: 'theme.CodeBlock.copy',
    message: 'Copy',
    description: 'The copy button label on code blocks',
  });
}

function ariaLabel(state: CopyState) {
  switch (state) {
    case 'success':
      return translate({
        id: 'theme.CodeBlock.copied',
        message: 'Copied',
        description: 'The copied button label on code blocks',
      });
    case 'error':
      return translate({
        id: 'theme.CodeBlock.copyFailed',
        message: 'Copy failed',
        description: 'The copy failed button label on code blocks',
      });
    default:
      return translate({
        id: 'theme.CodeBlock.copyButtonAriaLabel',
        message: 'Copy code to clipboard',
        description: 'The ARIA label for copy code blocks button',
      });
  }
}

function labelFor(state: CopyState) {
  switch (state) {
    case 'success':
      return 'Copied!';
    case 'error':
      return 'Failed';
    default:
      return 'Copy';
  }
}

function trackCopy(language: string | undefined) {
  if (typeof window === 'undefined') {
    return;
  }

  const eventData = {
    event_category: 'CodeBlock',
    event_label: language ?? 'unknown',
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'copy_code_block', eventData);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: 'copy_code_block', ...eventData });
  }
}

function useCopyButton() {
  const {
    metadata: { code, language },
  } = useCodeBlockContext();
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const timeoutRef = useRef<number | null>(null);

  const copyCode = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
      setCopyState('error');
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopyState('success');
      trackCopy(language);
    } catch {
      setCopyState('error');
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopyState('idle');
    }, 2000);
  }, [code, language]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { copyCode, copyState };
}

export default function CopyButton({ className }: { className?: string }) {
  const { copyCode, copyState } = useCopyButton();

  return (
    <Button
      aria-label={ariaLabel(copyState)}
      title={title()}
      className={clsx(
        className,
        styles.copyButton,
        copyState !== 'idle' && styles.copyButtonActive,
      )}
      onClick={copyCode}>
      <span className={styles.copyButtonIcons} aria-hidden="true">
        <IconCopy className={styles.copyButtonIcon} />
        <IconSuccess className={styles.copyButtonSuccessIcon} />
      </span>
      <span className={styles.copyButtonLabel} aria-live="polite">
        {labelFor(copyState)}
      </span>
    </Button>
  );
}
