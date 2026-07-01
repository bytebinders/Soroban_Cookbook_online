import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PatternPreview, { Pattern } from '@site/src/components/PatternPreview';
import styles from '../index.module.css';
import React from 'react';

const utilityPatterns: Pattern[] = [
  {
    id: '1',
    contractName: 'multisig_wallet',
    description: 'Multi-signature wallet for secure fund management with threshold requirements.',
    tag: '#utility',
    category: 'utility',
    difficulty: 'advanced',
    popularity: 71,
    code: `pub fn submit_transaction(env: Env, from: Address, to: Address, amount: i128) {
    // Multisig transaction logic
}`,
    href: '/docs/patterns/multisig-wallet',
    icon: '🔐',
  },
  {
    id: '2',
    contractName: 'time_lock',
    description: 'Time-locked contract for delayed fund release with vesting schedules.',
    tag: '#utility',
    category: 'utility',
    difficulty: 'intermediate',
    popularity: 68,
    code: `pub fn lock_funds(env: Env, amount: i128, release_time: u64) {
    // Time lock logic
}`,
    href: '/docs/patterns/time-lock',
    icon: '⏰',
  },
  {
    id: '3',
    contractName: 'escrow_contract',
    description: 'Secure escrow service for conditional fund release between parties.',
    tag: '#utility',
    category: 'utility',
    difficulty: 'intermediate',
    popularity: 74,
    code: `pub fn create_escrow(env: Env, buyer: Address, seller: Address, amount: i128) {
    // Escrow creation logic
}`,
    href: '/docs/patterns/escrow-contract',
    icon: '🤝',
  },
  {
    id: '4',
    contractName: 'registry',
    description: 'Registry contract for storing and managing mappings of addresses and data.',
    tag: '#utility',
    category: 'utility',
    difficulty: 'beginner',
    popularity: 77,
    code: `pub fn register(env: Env, key: String, value: String) {
    // Registration logic
}`,
    href: '/docs/patterns/registry',
    icon: '📑',
  },
];

export default function UtilityPage() {
  return (
    <Layout
      title="Utility Patterns - Soroban Cookbook"
      description="Multisig, escrow, timelock, and utility contracts for Soroban smart contracts.">
      <header className={styles.hero}>
        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.container}>
          <h1 className={styles.title}>Utility & Infrastructure Patterns</h1>

          <p className={styles.subtitle}>
            Build essential utility contracts for multi-signature, escrow, and fund management.
          </p>

          <div className={styles.buttons}>
            <Link to="/docs/patterns/overview" className={styles.secondaryBtn}>
              ← Back to Patterns
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <PatternPreview
          patterns={utilityPatterns}
          title="Utility Patterns"
          subtitle="Explore production-ready utility contract implementations"
          showViewAll={false}
          maxVisible={6}
          enableCarousel={false}
        />
      </div>
    </Layout>
  );
}
