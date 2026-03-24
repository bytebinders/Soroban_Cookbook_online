import React, { useCallback, useId, useMemo, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './NewsletterSignup.module.css';

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export type NewsletterSignupProps = {
  className?: string;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterSignup({ className }: NewsletterSignupProps) {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();
  const endpoint = useMemo(() => {
    const raw = customFields?.newsletterEndpoint;
    return typeof raw === 'string' && raw.length > 0 ? raw : undefined;
  }, [customFields]);

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const formId = useId();
  const emailId = `${formId}-email`;
  const errorId = `${formId}-error`;

  const validate = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Enter an email address.';
    }
    if (!EMAIL_RE.test(trimmed)) {
      return 'Enter a valid email address.';
    }
    return null;
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const err = validate(email);
      if (err) {
        setStatus('error');
        setMessage(err);
        return;
      }
      setStatus('loading');
      setMessage(null);

      if (!endpoint) {
        await new Promise((r) => setTimeout(r, 600));
        setStatus('success');
        setMessage('Thanks — you are on the list. We will share Soroban Cookbook updates here.');
        setEmail('');
        return;
      }

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        });
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        setStatus('success');
        setMessage('Thanks — check your inbox to confirm your subscription.');
        setEmail('');
      } catch {
        setStatus('error');
        setMessage('Something went wrong. Try again in a moment.');
      }
    },
    [email, endpoint, validate],
  );

  return (
    <section className={clsx(styles.section, className)} aria-labelledby={`${formId}-title`}>
      <div className={styles.inner}>
        <h2 id={`${formId}-title`} className={styles.title}>
          Stay in the loop
        </h2>
        <p className={styles.lead}>
          Get updates on new patterns, tutorials, and Soroban Cookbook releases. No spam —
          unsubscribe at any time.
        </p>

        <form className={styles.form} onSubmit={onSubmit} noValidate>
          <div className={styles.fieldRow}>
            <label htmlFor={emailId} className={styles.visuallyHidden}>
              Email address
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              className={styles.input}
              value={email}
              disabled={status === 'loading' || status === 'success'}
              aria-invalid={status === 'error'}
              aria-describedby={status === 'error' && message ? errorId : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') {
                  setStatus('idle');
                  setMessage(null);
                }
              }}
            />
            <button
              type="submit"
              className={styles.button}
              disabled={status === 'loading' || status === 'success'}>
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </div>

          <p className={styles.privacy}>
            We use your email only for Soroban Cookbook announcements. See our{' '}
            <a href="https://github.com/Soroban-Cookbook/Soroban_Cookbook_online/blob/main/LICENSE">
              license &amp; privacy
            </a>{' '}
            on GitHub.
          </p>

          {message && (
            <p
              id={status === 'error' ? errorId : undefined}
              role={status === 'error' ? 'alert' : 'status'}
              aria-live={status === 'error' ? 'assertive' : 'polite'}
              className={clsx(styles.feedback, {
                [styles.feedbackError]: status === 'error',
                [styles.feedbackSuccess]: status === 'success',
              })}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
