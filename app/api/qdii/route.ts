import { NextResponse } from 'next/server';
import type { QDIIResponse, QDIIFundWithPremium } from '@/lib/types';
import { calculatePremiumRates } from '@/lib/utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const rp = searchParams.get('rp') || '22';
    const cookie = process.env.JISILU_COOKIE;

    const url = `https://www.jisilu.cn/data/qdii/qdii_list/E?___jsl=LST___t=${Date.now()}&rp=${rp}&page=${page}`;

    const headers: HeadersInit = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'Referer': 'https://www.jisilu.cn/data/qdii/',
    };

    if (cookie) {
      headers['Cookie'] = cookie;
    }

    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data: QDIIResponse = await response.json();

    const fundsWithPremium: QDIIFundWithPremium[] = data.rows.map(row => ({
      ...row.cell,
      ...calculatePremiumRates(
        row.cell.price,
        row.cell.fund_nav,
        row.cell.ref_increase_rt,
        row.cell.estimate_value,
      ),
    }));

    return NextResponse.json(fundsWithPremium);
  } catch (error) {
    console.error('Error fetching QDII data:', error);
    return NextResponse.json(
        { error: 'Failed to fetch QDII data' },
        { status: 500 }
    );
  }
}
