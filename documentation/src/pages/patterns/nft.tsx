import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import PatternPreview, { Pattern } from '@site/src/components/PatternPreview';
import styles from '../index.module.css';
import React from 'react';

const nftPatterns: Pattern[] = [
  {
    id: '1',
    contractName: 'nft_contract',
    description: 'Non-fungible token contract with mint, transfer, and metadata support.',
    tag: '#nft',
    category: 'nft',
    difficulty: 'intermediate',
    popularity: 82,
    code: `pub fn mint_nft(env: Env, to: Address, token_id: u64, metadata: String) {
    // NFT minting logic
}`,
    href: '/docs/patterns/nft-contract',
    icon: '🎨',
  },
  {
    id: '2',
    contractName: 'nft_marketplace',
    description: 'Marketplace for buying and selling NFTs with royalty support.',
    tag: '#nft',
    category: 'nft',
    difficulty: 'advanced',
    popularity: 69,
    code: `pub fn list_nft(env: Env, nft_id: u64, price: i128) {
    // Listing logic
}`,
    href: '/docs/patterns/nft-marketplace',
    icon: '🏪',
  },
  {
    id: '3',
    contractName: 'nft_collection',
    description: 'Collection management system for grouped NFTs with batch operations.',
    tag: '#nft',
    category: 'nft',
    difficulty: 'advanced',
    popularity: 64,
    code: `pub fn create_collection(env: Env, name: String, symbol: String) {
    // Collection creation logic
}`,
    href: '/docs/patterns/nft-collection',
    icon: '🖼️',
  },
];

export default function NftPage() {
  return (
    <Layout
      title="NFT Patterns - Soroban Cookbook"
      description="Non-fungible tokens, marketplaces, and collections for Soroban smart contracts.">
      <header className={styles.hero}>
        <div className={styles.glowOne}></div>
        <div className={styles.glowTwo}></div>

        <div className={styles.container}>
          <h1 className={styles.title}>NFT Patterns & Standards</h1>

          <p className={styles.subtitle}>
            Create and manage non-fungible tokens with marketplaces and collection systems.
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
          patterns={nftPatterns}
          title="NFT Patterns"
          subtitle="Explore production-ready NFT contract implementations"
          showViewAll={false}
          maxVisible={6}
          enableCarousel={false}
        />
      </div>
    </Layout>
  );
}
