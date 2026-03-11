'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatNumber, getPercentageColor } from '@/lib/utils';
import type { QDIIFundWithPremium } from '@/lib/types';

type SortKey = keyof QDIIFundWithPremium;
type SortDirection = 'asc' | 'desc' | null;

export default function QDIIPage() {
  const [data, setData] = useState<QDIIFundWithPremium[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
          `/api/qdii?page=1&rp=100`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const fundsWithPremium: QDIIFundWithPremium[] = await response.json();

      setData(fundsWithPremium);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';

    if (sortKey === key) {
      if (sortDirection === 'asc') {
        direction = 'desc';
      } else if (sortDirection === 'desc') {
        direction = null;
      }
    }

    setSortKey(direction === null ? null : key);
    setSortDirection(direction);
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0;

    const aValue = a[sortKey];
    const bValue = b[sortKey];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    // Parse percentage strings (e.g., "1.23%")
    const parseValue = (val: any): number | string => {
      if (typeof val === 'string' && val.includes('%')) {
        return parseFloat(val.replace('%', ''));
      }
      return val;
    };

    const parsedA = parseValue(aValue);
    const parsedB = parseValue(bValue);

    // Compare numbers
    if (typeof parsedA === 'number' && typeof parsedB === 'number') {
      return sortDirection === 'asc' ? parsedA - parsedB : parsedB - parsedA;
    }

    // Compare strings
    const strA = String(parsedA);
    const strB = String(parsedB);

    return sortDirection === 'asc'
        ? strA.localeCompare(strB, 'zh-CN')
        : strB.localeCompare(strA, 'zh-CN');
  });

  const getSortIndicator = (key: SortKey) => {
    if (sortKey !== key) return ' ⇅';
    if (sortDirection === 'asc') return ' ↑';
    if (sortDirection === 'desc') return ' ↓';
    return ' ⇅';
  };

  if (loading) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">加载中...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg text-red-600">错误: {error}</div>
        </div>
    );
  }

  return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">欧美指数</h1>

        <div className="mb-6 flex gap-4 items-end">
          <button
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '加载中...' : '获取数据'}
          </button>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('fund_id')}>
                  代码{getSortIndicator('fund_id')}
                </TableHead>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('fund_nm')}>
                  名称{getSortIndicator('fund_nm')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('price')}>
                  现价{getSortIndicator('price')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('increase_rt')}>
                  涨幅{getSortIndicator('increase_rt')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
           onClick={() => handleSort('realtime_premium_rate')}>
  实时溢价率{getSortIndicator('realtime_premium_rate')}
</TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('volume')}>
                  成交(万元){getSortIndicator('volume')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('amount')}>
                  场内份额(万份){getSortIndicator('amount')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('amount_incr')}>
                  场内新增(万份){getSortIndicator('amount_incr')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('fund_nav')}>
                  T-2净值{getSortIndicator('fund_nav')}
                </TableHead>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('nav_dt')}>
                  净值日期{getSortIndicator('nav_dt')}
                </TableHead>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('index_nm')}>
                  相关标的{getSortIndicator('index_nm')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('ref_increase_rt')}>
                  T-1指数涨幅{getSortIndicator('ref_increase_rt')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('apply_fee')}>
                  申购费{getSortIndicator('apply_fee')}
                </TableHead>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('apply_status')}>
                  申购状态{getSortIndicator('apply_status')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('redeem_fee')}>
                  赎回费{getSortIndicator('redeem_fee')}
                </TableHead>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('redeem_status')}>
                  赎回状态{getSortIndicator('redeem_status')}
                </TableHead>
                <TableHead className="whitespace-nowrap text-right cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('mt_fee')}>
                  管托费{getSortIndicator('mt_fee')}
                </TableHead>
                <TableHead className="whitespace-nowrap cursor-pointer hover:bg-gray-100"
                           onClick={() => handleSort('issuer_nm')}>
                  基金公司{getSortIndicator('issuer_nm')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={18} className="text-center py-8">
                      暂无数据
                    </TableCell>
                  </TableRow>
              ) : (
                  sortedData.map((fund) => (
                      <TableRow key={fund.fund_id}>
                        <TableCell className="font-medium">{fund.fund_id}</TableCell>
                        <TableCell className="whitespace-nowrap">{fund.fund_nm}</TableCell>
                        <TableCell className="text-right">{fund.price}</TableCell>
                        <TableCell className={`text-right ${getPercentageColor(fund.increase_rt)}`}>
                          {fund.increase_rt}
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${getPercentageColor(fund.realtime_premium_rate)}`}>
  {fund.realtime_premium_rate}
</TableCell>
                        <TableCell className="text-right">{formatNumber(fund.volume)}</TableCell>
                        <TableCell className="text-right">{formatNumber(fund.amount)}</TableCell>
                        <TableCell className={`text-right ${getPercentageColor(fund.amount_incr)}`}>
                          {fund.amount_incr}
                        </TableCell>
                        <TableCell className="text-right">{fund.fund_nav}</TableCell>
                        <TableCell className="whitespace-nowrap">{fund.nav_dt}</TableCell>
                        <TableCell className="whitespace-nowrap">{fund.index_nm}</TableCell>
                        <TableCell className={`text-right ${getPercentageColor(fund.ref_increase_rt)}`}>
                          {fund.ref_increase_rt || '-'}
                        </TableCell>
                        <TableCell className="text-right">{fund.apply_fee}</TableCell>
                        <TableCell className="whitespace-nowrap">{fund.apply_status}</TableCell>
                        <TableCell className="text-right">{fund.redeem_fee}</TableCell>
                        <TableCell className="whitespace-nowrap">{fund.redeem_status}</TableCell>
                        <TableCell className="text-right">{fund.mt_fee || '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">{fund.issuer_nm}</TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-gray-600">
<p className="mt-2">
  <span className="font-semibold">实时溢价率计算公式:</span> ((现价 - 实时预估净值) / 实时预估净值) × 100%
</p>
<p className="mt-1 text-xs">
  实时预估净值优先使用T-1指数实时涨幅估算，其次使用T-1指数日涨幅，最后回退至T-2净值
</p>
        </div>
      </div>
  );
}
