import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PatternPreview, { Pattern } from '@site/src/components/PatternPreview';
import styles from '../index.module.css';
import React from 'react';

const defiPatterns: Pattern[] = [
  {
    id: '1',
    contractName: 'liquidity_pool',
    description: 'Automated market maker with liquidity provision and swap functionality.',
    tag: '#defi',
    category: 'defi',
    difficulty: 'advanced',
    popularity: 79,
    code: `pub fn swap(env: Env, token_a: Address, token_b: Address, amount_in: i128) -> i128 {
    // AMM swap logic
}`,
    href: '/docs/patterns/liquidity-pool',
    icon: '💧',
  },
  {
    id: '2',
    contractName: 'staking',
    description: 'Token staking with pro-rata reward distribution over fixed-length epochs.',
    tag: '#defi',
    category: 'defi',
    difficulty: 'intermediate',
    popularity: 82,
    code: `pub fn stake(env: Env, amount: i128) {
    // Staking logic
}`,
    href: '/docs/patterns/staking',
    icon: '📈',
  },
  {
    id: '3',
    contractName: 'atomic_swap',
    description: 'Trustless atomic swap mechanism for direct token exchanges.',
    tag: '#defi',
    category: 'defi',
    difficulty: 'advanced',
    popularity: 75,
    code: `pub fn initiate_swap(env: Env, token_a: Address, token_b: Address, amount_a: i128) {
    // Swap initiation logic
}`,
    href: '/docs/patterns/atomic-swap',
    icon: '⚡',
  },
  {
    id: '4',
    contractName: 'lending_protocol',
    description: 'Lending and borrowing protocol with collateralization and interest accrual.',
    tag: '#defi',
    category: 'defi',
    difficulty: 'advanced',
    popularity: 68,
    code: `pub fn borrow(env: Env, asset: Address, amount: i128) {
    // Borrowing logic
}`,
    href: '/docs/patterns/lending-protocol',
    icon: '🏦',
  },
];

export default function DefiPage() {
  return (
    <Layout
      title="DeFi Patterns - Soroban Cookbook"
      description="Liquidity pools, staking, swaps, and lending protocols for Soroban smart contracts.">
      <header className={styles.hero}>
        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.container}>
          <h1 className={styles.title}>DeFi Patterns & Protocols</h1>

          <p className={styles.subtitle}>
            Build decentralized finance applications with liquidity pools, staking, and swap
            mechanisms.
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
          patterns={defiPatterns}
          title="DeFi Patterns"
          subtitle="Explore production-ready DeFi contract implementations"
          showViewAll={false}
          maxVisible={6}
          enableCarousel={false}
        />
      </div>
    </Layout>
  );
}
