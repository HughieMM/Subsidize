# Data Sources and Compliance

## Overview

Subsidize is committed to ethical data collection practices and compliance with all applicable laws and terms of service. This document outlines our data sources, collection methods, and compliance guardrails.

## Data Source Types by Store

### Current Data Sources

| Store | Source Type | Method | Update Frequency | Partnership Status |
|-------|-------------|--------|------------------|-------------------|
| **MarketPlace** | Public Specials | Web scraping (respectful) | Weekly | Seeking partnership |
| **Lindo's Family Foods** | Public Specials | Web scraping (respectful) | Weekly | Seeking partnership |
| **Miles Market** | Public Catalog | Web scraping (respectful) | Daily | Seeking partnership |
| **Supermart** | Public Specials | Web scraping (respectful) | Weekly | Seeking partnership |
| **DropIt** | Public Catalog | Web scraping (respectful) | Daily | Seeking partnership |

### Source Type Definitions

1. **Public Specials**: Weekly flyer prices that stores publicly advertise
2. **Public Catalog**: Publicly accessible product listings and prices on store websites
3. **Partnership Feed**: Direct API or data feed from retailer (preferred method)
4. **Manual/Crowdsourced**: User-submitted prices with verification

## Ethical Scraping Practices

### Rate Limiting

All web scraping adheres to strict rate limits to avoid impacting store websites:

- **Request Rate**: Maximum 1 request per 2 seconds per domain
- **Concurrent Requests**: Maximum 1 concurrent request per domain
- **Daily Limit**: Maximum 1000 requests per domain per day
- **Respect robots.txt**: All scrapers honor robots.txt directives
- **User-Agent**: Clear identification as Subsidize price aggregator

### Respectful Crawling Guidelines

1. **Timing**: Scraping occurs during off-peak hours (2 AM - 6 AM AST)
2. **Caching**: Aggressive caching to minimize repeat requests
3. **Incremental Updates**: Only fetch changed data when possible
4. **Error Handling**: Exponential backoff on errors (2s, 4s, 8s, 16s, 32s max)
5. **Circuit Breaker**: Automatic pause if error rate exceeds 10%

### Technical Implementation

```
Rate Limiter Configuration:
- Algorithm: Token bucket with per-domain tracking
- Tokens: 1 token per 2 seconds
- Burst: Maximum 3 tokens
- Timeout: Request fails after 30 seconds
- Retry: Exponential backoff (2^n seconds, max 32s)
```

## Data Freshness and Accuracy

### Timestamps and Staleness

- **Price Observations**: Each price includes `observedAt` timestamp
- **Staleness Indicator**: Prices older than 7 days marked as "potentially outdated"
- **Display**: All prices show last update time to users
- **Disclaimer**: Clear notice that prices may have changed since last update

### Data Quality

- **Verification**: Cross-reference multiple sources when available
- **Anomaly Detection**: Flag prices that deviate significantly from historical average
- **User Reports**: Allow users to report incorrect prices
- **Manual Review**: Regular spot-checks of data accuracy

## Takedown and Contact Process

### If You're a Store Owner

We respect your rights to control how your data is used. If you would like to:

1. **Request Data Removal**: Email legal@subsidize.bm with store name and reason
2. **Discuss Partnership**: Email partnerships@subsidize.bm for official data feeds
3. **Report Issues**: Email support@subsidize.bm for technical problems

**Response Time**: We commit to responding within 48 hours and acting within 5 business days.

### Takedown Request Process

1. Store owner emails legal@subsidize.bm with:
   - Store name and contact information
   - Specific data to be removed
   - Reason for request
2. Subsidize verifies ownership (domain email, phone verification)
3. Data removed within 5 business days
4. Confirmation sent to requester
5. Store flagged to prevent re-scraping

### Contact Information

- **Legal/Compliance**: legal@subsidize.bm
- **Partnerships**: partnerships@subsidize.bm
- **Technical Support**: support@subsidize.bm
- **General Inquiries**: hello@subsidize.bm

## Migration to Official Partnerships

### Partnership Program

Subsidize strongly prefers official partnerships over web scraping. We offer stores:

1. **Direct API Integration**: Real-time price feeds via REST API
2. **Data Control**: Full control over what data is shared
3. **Analytics Dashboard**: Insights into competitive positioning
4. **Revenue Share**: 15% commission on delivery orders
5. **Promotional Opportunities**: Featured placement for partner stores

### Partnership Benefits

**For Stores:**
- Accurate, real-time pricing
- Control over product presentation
- Customer insights and analytics
- No website performance impact
- Revenue from delivery orders

**For Customers:**
- Always-current prices
- Complete product catalogs
- Stock availability information
- Faster order processing

### Transition Plan

**Phase 1 (Current)**: Respectful public data collection with strict guardrails
**Phase 2 (Q1 2025)**: Launch partnership program, onboard first 2-3 stores
**Phase 3 (Q2 2025)**: 50%+ of data from partnerships
**Phase 4 (Q3 2025)**: Primarily partnership-based with public data as fallback

## Legal Compliance

### Bermuda Laws

- **Copyright**: Only factual price data collected (not copyrightable in Bermuda)
- **Computer Misuse**: Respectful access, no circumvention of security
- **Terms of Service**: Regular review of store ToS, compliance where applicable

### Data Protection

- **Personal Data**: No collection of customer personal information
- **Privacy**: User shopping data encrypted and anonymized
- **Retention**: Price history retained for analytics, no PII stored

### Terms of Service Compliance

While price aggregation is generally legal, we:
1. Review each store's Terms of Service quarterly
2. Cease scraping if explicitly prohibited
3. Reach out to discuss official partnership as alternative
4. Document all compliance decisions

## Technical Guardrails

### Ingestion Run Audit Log

Every scraping/ingestion run is logged with:
- Timestamp and duration
- Store/domain targeted
- Number of requests made
- Success/error rates
- Data points collected
- Any rate limit hits or errors

### Automated Monitoring

- **Error Alerts**: Notification if error rate > 10%
- **Rate Limit Monitoring**: Alert if approaching daily limits
- **Performance Tracking**: Monitor request latency and success rates
- **Compliance Checks**: Automated robots.txt and ToS monitoring

### Manual Review Process

- **Weekly Review**: Review audit logs for anomalies
- **Monthly Compliance**: Check ToS updates for all stores
- **Quarterly Partnership Outreach**: Contact stores to discuss official feeds

## Responsible Disclosure

If you discover a security issue or compliance concern with our data collection:

1. Email security@subsidize.bm with details
2. Do not publicly disclose until we've had time to respond
3. We commit to acknowledging within 24 hours
4. We'll work with you to address the issue promptly

## Changes to This Document

This document may be updated as our practices evolve. Last updated: December 2024

**Version**: 1.0
**Last Review**: December 30, 2024
**Next Review**: March 30, 2025
