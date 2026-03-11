import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate real-time premium rate for QDII funds (cross-timezone)
 *
 * Estimated NAV priority:
 *   1. estimate_value          — Jisilu's real-time estimated NAV (most accurate)
 *   2. fund_nav × (1 + ref_increase_rt / 100) — index-based estimation (fallback)
 *   3. fund_nav                — previous day NAV (last resort, labelled as T-1)
 *
 * Formula: (price - estimatedNav) / estimatedNav × 100%
 */
export type PremiumRateSource = 'estimate_value' | 'ref_increase_rt' | 't1_nav';

export interface PremiumRateResult {
  /** Real-time premium rate using best available estimated NAV */
  realtime_premium_rate: string;
  /** Which data source was used for realtime_premium_rate */
  premium_rate_source: PremiumRateSource | '-';
}

function isValidNumber(value: string | undefined | null): boolean {
  if (!value || value === '-' || value.trim() === '') return false;
  const n = parseFloat(value);
  return !isNaN(n) && isFinite(n);
}

export function calculatePremiumRates(
  price: string,
  fundNav: string,
  refIncreaseRt: string,
  estimateValue: string,
): PremiumRateResult {
  const priceNum = parseFloat(price);

  if (!isValidNumber(price) || isNaN(priceNum)) {
    return { realtime_premium_rate: '-', premium_rate_source: '-' };
  }

  // ── Real-time premium rate: pick best estimated NAV ──────────────────
  // Priority 1: estimate_value
  if (isValidNumber(estimateValue)) {
    const estNav = parseFloat(estimateValue);
    if (estNav !== 0) {
      const rate = ((priceNum - estNav) / estNav) * 100;
      return {
        realtime_premium_rate: `${rate.toFixed(2)}%`,
        premium_rate_source: 'estimate_value',
      };
    }
  }

  // Priority 2: fund_nav × (1 + ref_increase_rt / 100)
  if (isValidNumber(fundNav) && isValidNumber(refIncreaseRt)) {
    const navNum = parseFloat(fundNav);
    const refNum = parseFloat(refIncreaseRt.replace('%', ''));
    if (!isNaN(refNum) && navNum !== 0) {
      const estNav = navNum * (1 + refNum / 100);
      if (estNav !== 0) {
        const rate = ((priceNum - estNav) / estNav) * 100;
        return {
          realtime_premium_rate: `${rate.toFixed(2)}%`,
          premium_rate_source: 'ref_increase_rt',
        };
      }
    }
  }

  // Priority 3: fall back to T-1 NAV itself
  if (isValidNumber(fundNav)) {
    const navNum = parseFloat(fundNav);
    if (navNum !== 0) {
      const rate = ((priceNum - navNum) / navNum) * 100;
      return {
        realtime_premium_rate: `${rate.toFixed(2)}%`,
        premium_rate_source: 't1_nav',
      };
    }
  }
  return { realtime_premium_rate: '-', premium_rate_source: '-' };
}

/**
 * Format number with comma separators
 */
export function formatNumber(value: string | number): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '-';
  return num.toLocaleString('en-US', {maximumFractionDigits: 2});
}

/**
 * Get color class based on percentage value
 */
export function getPercentageColor(value: string): string {
  if (value === '-' || value === '') return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  if (num < 0) return 'text-green-600';
  if (num > 0) return 'text-red-600';
  return '';
}
