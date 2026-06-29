# Security

This document covers the security posture of the Soroban Cookbook documentation
site and the steps needed to harden it at both the application and infrastructure
levels.

## XSS Prevention

### Application layer (already in place)

| Control | Location | Notes |
|---|---|---|
| No `dangerouslySetInnerHTML` | All components | Confirmed by grep audit (issue #233). |
| No `innerHTML` / `eval` | All components | Confirmed by grep audit. |
| Controlled email input | `NewsletterSignup` | React controlled component; value never injected into DOM. |
| Email regex validation | `NewsletterSignup` | Validates before any fetch. |
| `sanitizeUrl()` on all dynamic `href` values | `PatternPreview` | Blocks `javascript:`, `data:`, `vbscript:` schemes. |
| `sanitizeUrl()` on `window.location.href` | `PatternPreview` | Same guard as above. |
| HTTPS-only newsletter endpoint | `NewsletterSignup` | `isHttpsUrl()` rejects non-HTTPS values at runtime. |
| `rel="noopener noreferrer"` on `target="_blank"` | `Testimonials` | Prevents reverse tab-nabbing. |
| `<meta http-equiv="Content-Security-Policy">` | `docusaurus.config.ts` | Client-side CSP. |

### CSP limitations of meta delivery

A `<meta http-equiv="Content-Security-Policy">` tag cannot enforce:

- `frame-ancestors` (must be an HTTP response header)
- `sandbox`
- `report-uri` / `report-to`

These must be set at the HTTP server or CDN layer.

## Required server-level HTTP headers

### Vercel (vercel.json)

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https:; frame-ancestors 'none'" }
      ]
    }
  ]
}
```

### Netlify (public/_headers)
/*

X-Frame-Options: DENY

X-Content-Type-Options: nosniff

Referrer-Policy: strict-origin-when-cross-origin

Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self' https:; frame-ancestors 'none
## Newsletter endpoint

The `NEWSLETTER_ENDPOINT` env var must be an `https://` URL. Set it at build time:

```bash
NEWSLETTER_ENDPOINT=https://your-api.example.com/subscribe pnpm build
```

## Reporting a vulnerability

Report security issues privately via GitHub Security Advisories rather than opening a public issue.
