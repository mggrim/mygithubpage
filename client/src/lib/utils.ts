import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function getMetricColor(value: number): string {
  if (value >= 70) return 'text-success';
  if (value >= 40) return 'text-warning';
  return 'text-danger';
}

export function getMetricBgColor(value: number): string {
  if (value >= 70) return 'bg-success';
  if (value >= 40) return 'bg-warning';
  return 'bg-danger';
}

export function getGaugeColor(status: 'GREEN' | 'AMBER' | 'RED'): string {
  switch (status) {
    case 'GREEN':
      return 'bg-success';
    case 'AMBER':
      return 'bg-warning';
    case 'RED':
      return 'bg-danger';
  }
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
