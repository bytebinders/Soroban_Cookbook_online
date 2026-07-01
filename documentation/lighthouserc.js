/**
 * Lighthouse CI Configuration
 * ROADMAP-122 / Issue #189: Mobile-First Indexing Verification
 * 
 * Runs Lighthouse audits on mobile viewport to verify:
 * - SEO score >= 90
 * - Accessibility score >= 90
 * - Best Practices score >= 90
 * - No mobile usability issues
 */

module.exports = {
  ci: {
    collect: {
      // Mobile viewport settings
      settings: {
        preset: 'desktop', // We'll override with mobile emulation
        emulatedFormFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 390,
          height: 844,
          deviceScaleFactor: 3,
          disabled: false,
        },
        // Categories to audit
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
      },
      // URLs to test (update after deployment)
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/docs/',
      ],
      startServerCommand: 'cd documentation && npm run serve',
      startServerReadyPattern: 'Serving',
      startServerReadyTimeout: 60000,
    },
    assert: {
      assertions: {
        // SEO must pass for mobile-first indexing
        'categories:seo': ['error', { minScore: 0.9 }],
        // Accessibility ensures touch targets are readable
        'categories:accessibility': ['error', { minScore: 0.9 }],
        // Best practices checks viewport, font-size, etc.
        'categories:best-practices': ['error', { minScore: 0.9 }],
        // Performance impacts mobile ranking
        'categories:performance': ['warn', { minScore: 0.8 }],

        // Specific mobile audits
        'viewport': 'error',
        'font-size': 'error',
        'tap-targets': 'error',
        'content-width': 'error',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};