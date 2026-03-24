# Contributing to Soroban Cookbook

Thank you for your interest in contributing to the Soroban Cookbook! This project aims to be the most comprehensive resource for Soroban smart contract development, and community contributions are essential to achieving that goal.

## 🌟 Ways to Contribute

### 1. Add New Contract Examples

Share your Soroban contract patterns with the community:

- Token standards
- DeFi protocols
- NFT implementations
- Governance systems
- Any innovative use cases

### 2. Improve Documentation

- Fix typos or clarify explanations
- Add diagrams or visualizations
- Translate content to other languages
- Write tutorials or guides

### 3. Enhance the Website

- Improve UI/UX components
- Add interactive features
- Optimize performance
- Fix bugs

### 4. Review & Discuss

- Review pull requests
- Answer questions in discussions
- Share feedback on patterns
- Report bugs or suggest improvements

## 📋 Contribution Guidelines

### Before You Start

1. **Check existing issues**: Browse [open issues](https://github.com/Soroban-Cookbook/Soroban-Cookbook-/issues) to see if someone is already working on what you have in mind
2. **Discuss major changes**: Open an issue first for significant changes to discuss the approach
3. **Follow the code of conduct**: Be respectful and constructive in all interactions

### Setting Up Your Development Environment

```bash
# Clone the repository
git clone https://github.com/Soroban-Cookbook/Soroban-Cookbook-.git
cd Soroban-Cookbook-

# Install dependencies
cd documentation
npm install

# Start development server
npm start
```

### Documentation site (SEO, newsletter, search, patterns)

#### SEO and social preview metadata

- Global defaults live in `documentation/docusaurus.config.ts` (`themeConfig.image` and `headTags` for Open Graph and Twitter).
- Per-page overrides: add frontmatter to any doc page:

```yaml
---
description: Short summary for link previews
image: /img/soroban-social-card.png
---
```

- After deployment, validate sharing cards with tools such as [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [opengraph.xyz](https://www.opengraph.xyz/).

#### Newsletter signup

- The homepage form uses `customFields.newsletterEndpoint`, set from the `NEWSLETTER_ENDPOINT` environment variable at build time.
- Configure any HTTPS endpoint that accepts `POST` with JSON `{ "email": string }`. If unset, the form still validates email client-side and completes with a demo-friendly success state.

#### Search

- Site search uses `@easyops-cn/docusaurus-search-local` (Lunr index, `/search` page). Styles for results and the query field are in `documentation/src/css/search-experience.css`.

#### Pattern page template

- Reusable MDX components: `PatternMeta`, `PatternSection`, and `PatternCallout` (see `documentation/src/theme/MDXComponents.tsx`).
- Canonical example: `documentation/docs/patterns/hello-world.mdx` — copy its structure for new patterns.

### Adding a New Pattern

Each pattern should follow this structure:

```
documentation/docs/[category]/[pattern-name].mdx
```

Use this template:

````mdx
---
sidebar_position: [number]
title: [Pattern Name]
description: [Brief description]
---

## Overview

[What this pattern does and why it's useful]

## Use Cases

[When to use this pattern]

## Implementation

```rust
// Your Soroban contract code here
```
````

## Testing

[Test cases demonstrating usage]

## Deployment

[How to deploy and interact with the contract]

## Security Considerations

[Important security notes]

````

### Code Quality Standards

All contract examples must:

1. ✅ **Compile successfully** with the latest stable Soroban SDK
2. ✅ **Include comprehensive tests** with >80% coverage
3. ✅ **Follow Rust best practices** (use clippy and rustfmt)
4. ✅ **Have inline documentation** explaining key concepts
5. ✅ **Include deployment instructions**
6. ✅ **Pass automated CI checks**

### Code Style

**Rust Code:**

```bash
# Format code
cargo fmt

# Check lints
cargo clippy -- -D warnings

# Run tests
cargo test
````

**TypeScript/React:**

```bash
# Format code
npm run format

# Lint
npm run lint
```

### Commit Message Convention

Use clear, descriptive commit messages:

```
type(scope): Brief description

- Detailed explanation of changes
- Why the change was necessary
- Any breaking changes or migrations needed

Types: feat, fix, docs, style, refactor, test, chore
```

Examples:

```
feat(patterns): Add atomic swap contract example
fix(docs): Correct deployment instructions for testnet
docs(getting-started): Clarify environment setup for Windows
```

## 📝 Pull Request Process

1. **Fork the repository** and create a new branch from `main`

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the guidelines above

3. **Test thoroughly**

   ```bash
   # For contract changes
   cargo test

   # For website changes
   cd documentation && npm run build
   ```

4. **Commit your changes** with clear messages

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** with:
   - Clear title describing the change
   - Description of what changed and why
   - Screenshots for UI changes
   - Link to related issues

7. **Respond to feedback** - Be open to suggestions and iterate on your PR

### Pull Request Checklist

- [ ] My code follows the project's code style
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
- [ ] I have checked my code runs on the latest Soroban SDK

## 🐛 Reporting Bugs

Found a bug? Please open an issue with:

1. **Clear title**: Summarize the problem
2. **Description**: What happened vs. what you expected
3. **Steps to reproduce**: How to trigger the bug
4. **Environment**: OS, Rust version, Soroban CLI version
5. **Screenshots**: If applicable

## 💡 Suggesting Enhancements

Have an idea? Open an issue with:

1. **Use case**: What problem does this solve?
2. **Proposed solution**: How should it work?
3. **Alternatives**: Other approaches you considered
4. **Examples**: Similar features in other projects

## 📚 Documentation Style Guide

- Use **clear, concise language** - Avoid jargon where possible
- **Explain the "why"** - Don't just show code, explain reasoning
- **Include examples** - Show practical usage
- **Add diagrams** - Visual aids help understanding (use Mermaid)
- **Link related content** - Help readers discover more
- **Test code snippets** - Ensure all examples actually work

## 🏷️ Issue Labels

We use labels to organize issues:

- `good first issue` - Great for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `question` - Further information requested
- `wontfix` - This will not be worked on

## 🎉 Recognition

Contributors will be:

- Listed in our README
- Mentioned in release notes
- Invited to community calls
- Eligible for Stellar Community Fund grants

## 📞 Getting Help

- **Discord**: Join [Stellar Dev Discord](https://discord.gg/stellardev) #soroban channel
- **Discussions**: Use [GitHub Discussions](https://github.com/Soroban-Cookbook/Soroban-Cookbook-/discussions)
- **Office Hours**: Join our monthly community calls (announced in Discord)

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

**Thank you for making Soroban Cookbook better for everyone! 🚀**
