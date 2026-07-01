import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PatternPreview, { Pattern } from '@site/src/components/PatternPreview';
import styles from '../index.module.css';
import React from 'react';

const governancePatterns: Pattern[] = [
  {
    id: '1',
    contractName: 'voting_contract',
    description: 'Decentralized voting system with proposal creation and voting mechanisms.',
    tag: '#governance',
    category: 'governance',
    difficulty: 'advanced',
    popularity: 76,
    code: `pub fn vote(env: Env, voter: Address, proposal_id: u64, choice: bool) {
    require_auth(voter);
    // Voting logic here
}`,
    href: '/docs/patterns/voting-contract',
    icon: '🗳️',
  },
  {
    id: '2',
    contractName: 'dao_token',
    description: 'DAO governance token with delegation and voting power mechanisms.',
    tag: '#governance',
    category: 'governance',
    difficulty: 'advanced',
    popularity: 71,
    code: `pub fn delegate(env: Env, from: Address, to: Address) {
    // Delegation logic
}`,
    href: '/docs/patterns/dao-token',
    icon: '🤝',
  },
  {
    id: '3',
    contractName: 'proposal_factory',
    description: 'Factory for creating governance proposals with custom execution logic.',
    tag: '#governance',
    category: 'governance',
    difficulty: 'advanced',
    popularity: 63,
    code: `pub fn create_proposal(env: Env, title: String, description: String) -> u64 {
    // Proposal creation logic
}`,
    href: '/docs/patterns/proposal-factory',
    icon: '📋',
  },
];

export default function GovernancePage() {
  return (
    <Layout
      title="Governance Patterns - Soroban Cookbook"
      description="DAO governance, voting systems, and proposal mechanisms for Soroban smart contracts.">
      <header className={styles.hero}>
        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.container}>
          <h1 className={styles.title}>Governance & DAO Patterns</h1>

          <p className={styles.subtitle}>
            Implement decentralized governance with voting systems, proposals, and delegation
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
          patterns={governancePatterns}
          title="Governance Patterns"
          subtitle="Explore production-ready governance contract implementations"
          showViewAll={false}
          maxVisible={6}
          enableCarousel={false}
        />
      </div>
    </Layout>
  );
}
