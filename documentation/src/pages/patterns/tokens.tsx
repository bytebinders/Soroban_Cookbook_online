import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PatternPreview, { Pattern } from '@site/src/components/PatternPreview';
import styles from '../index.module.css';
import React from 'react';

const tokenPatterns: Pattern[] = [
  {
    id: '1',
    contractName: 'token_contract',
    description:
      'Implementation of a fungible token with mint, transfer, and balance functionality.',
    tag: '#tokens',
    category: 'tokens',
    difficulty: 'intermediate',
    popularity: 88,
    code: `pub fn mint(env: Env, to: Address, amount: i128) {
    env.storage().instance().extend_ttl(100, 100);
    // Mint logic here
}`,
    href: '/docs/patterns/token-contract',
    icon: '🪙',
  },
  {
    id: '2',
    contractName: 'token_wrapper',
    description: 'Wrapper contract for bridging external tokens to Soroban.',
    tag: '#tokens',
    category: 'tokens',
    difficulty: 'intermediate',
    popularity: 72,
    code: `pub fn wrap_token(env: Env, amount: i128) {
    // Token wrapping logic
}`,
    href: '/docs/patterns/token-wrapper',
    icon: '📦',
  },
  {
    id: '3',
    contractName: 'token_vault',
    description: 'Secure token vault for holding and managing multiple token types.',
    tag: '#tokens',
    category: 'tokens',
    difficulty: 'advanced',
    popularity: 65,
    code: `pub fn deposit(env: Env, token: Address, amount: i128) {
    // Vault deposit logic
}`,
    href: '/docs/patterns/token-vault',
    icon: '🏦',
  },
];

export default function TokensPage() {
  return (
    <Layout
      title="Token Patterns - Soroban Cookbook"
      description="Fungible token standards, wrappers, and vaults for Soroban smart contracts.">
      <header className={styles.hero}>
        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.container}>
          <h1 className={styles.title}>Token Standards & Patterns</h1>

          <p className={styles.subtitle}>
            Master fungible token implementation, wrappers, and vault mechanisms for Soroban.
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
          patterns={tokenPatterns}
          title="Token Patterns"
          subtitle="Explore production-ready token contract implementations"
          showViewAll={false}
          maxVisible={6}
          enableCarousel={false}
        />
      </div>
    </Layout>
  );
}
