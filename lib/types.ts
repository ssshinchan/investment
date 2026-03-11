export interface QDIIFundCell {
  /** 基金代码 */
  fund_id: string;
  /** 基金名称 */
  fund_nm: string;
  qtype: string;
  /** 基金公司 */
  issuer_nm: string;
  urls: string;
  /** 实时价格 */
  price: string;
  pre_close: string;
  price_dt: string;
  /** 涨跌幅 */
  increase_rt: string;
  /** 成交量(万元) */
  volume: string;
  stock_volume: string;
  last_time: string;
  /** 份额(万份) */
  amount: string;
  /** 份额增长(万份) */
  amount_incr: string;
  amount_increase_rt: string;
  amount_dt: string;
  /** 基金净值 */
  fund_nav: string;
  /** 净值日期 */
  nav_dt: string;
  estimate_value: string;
  discount_rt: string;
  last_est_time: string;
  est_val_increase_rt: string;
  index_id: string;
  /** 跟踪指数名称 */
  index_nm: string;
  /** 申购费率 */
  apply_fee: string;
  /** 申购状态 */
  apply_status: string;
  /** 赎回费率 */
  redeem_fee: string;
  /** 赎回状态 */
  redeem_status: string;
  redeem_fee_tips: string;
  discount_rt2: string;
  est_val_dt2: string;
  est_val_increase_rt2: string;
  ref_price: string;
  /** 参考涨跌幅(指数+汇率) */
  ref_increase_rt: string;
  ref_increase_rt2: string;
  /** 管理费+托管费 */
  mt_fee: string;
  cal_tips: string;
}

export interface QDIIFundRow {
  id: string;
  cell: QDIIFundCell;
}

export interface QDIIResponse {
  page: string;
  rows: QDIIFundRow[];
}

import type { PremiumRateSource } from './utils';

export interface QDIIFundWithPremium extends QDIIFundCell {
  /** Real-time premium rate using best available estimated NAV */
  realtime_premium_rate: string;
  /** Indicates which data source backed realtime_premium_rate */
  premium_rate_source: PremiumRateSource | '-';
}
