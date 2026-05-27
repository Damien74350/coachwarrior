// Technical indicators implemented from scratch.
// All inputs assume an array of closing prices ordered oldest -> newest.

export function sma(values: number[], period: number): number[] {
  const out: number[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : NaN);
  }
  return out;
}

export function ema(values: number[], period: number): number[] {
  const out: number[] = [];
  const k = 2 / (period + 1);
  let prev = NaN;
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      out.push(NaN);
      continue;
    }
    if (i === period - 1) {
      let sum = 0;
      for (let j = 0; j < period; j++) sum += values[j];
      prev = sum / period;
      out.push(prev);
      continue;
    }
    prev = values[i] * k + prev * (1 - k);
    out.push(prev);
  }
  return out;
}

export function rsi(values: number[], period = 14): number[] {
  const out: number[] = new Array(values.length).fill(NaN);
  if (values.length <= period) return out;
  let gains = 0;
  let losses = 0;
  for (let i = 1; i <= period; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  let avgGain = gains / period;
  let avgLoss = losses / period;
  out[period] = 100 - 100 / (1 + (avgLoss === 0 ? Infinity : avgGain / avgLoss));
  for (let i = period + 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = diff > 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    const rs = avgLoss === 0 ? Infinity : avgGain / avgLoss;
    out[i] = 100 - 100 / (1 + rs);
  }
  return out;
}

export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(values, fast);
  const emaSlow = ema(values, slow);
  const macdLine = values.map((_, i) =>
    isNaN(emaFast[i]) || isNaN(emaSlow[i]) ? NaN : emaFast[i] - emaSlow[i]
  );
  const cleanMacd = macdLine.filter((v) => !isNaN(v));
  const signalRaw = ema(cleanMacd, signal);
  const offset = macdLine.findIndex((v) => !isNaN(v));
  const signalLine = macdLine.map((_, i) =>
    i < offset ? NaN : signalRaw[i - offset]
  );
  const histogram = macdLine.map((v, i) =>
    isNaN(v) || isNaN(signalLine[i]) ? NaN : v - signalLine[i]
  );
  return { macdLine, signalLine, histogram };
}

export function bollinger(values: number[], period = 20, mult = 2) {
  const m = sma(values, period);
  const upper: number[] = [];
  const lower: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
      continue;
    }
    let sumSq = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sumSq += (values[j] - m[i]) ** 2;
    }
    const sd = Math.sqrt(sumSq / period);
    upper.push(m[i] + mult * sd);
    lower.push(m[i] - mult * sd);
  }
  return { middle: m, upper, lower };
}

export function lastValid(arr: number[]): number | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!isNaN(arr[i]) && isFinite(arr[i])) return arr[i];
  }
  return null;
}

export type Signal = "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";

export interface AnalysisResult {
  signal: Signal;
  score: number; // -100 to +100
  confidence: number; // 0 to 100
  reasons: { label: string; impact: "bullish" | "bearish" | "neutral"; detail: string }[];
  metrics: {
    rsi: number | null;
    macdHist: number | null;
    macd: number | null;
    macdSignal: number | null;
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    ema12: number | null;
    ema26: number | null;
    bbUpper: number | null;
    bbLower: number | null;
    bbMiddle: number | null;
    price: number;
    change7d: number | null;
    change30d: number | null;
    volatility30d: number | null;
  };
}

export function analyze(prices: number[]): AnalysisResult {
  const price = prices[prices.length - 1];
  const rsiVals = rsi(prices, 14);
  const macdVals = macd(prices);
  const sma20 = sma(prices, 20);
  const sma50 = sma(prices, 50);
  const sma200 = sma(prices, 200);
  const ema12 = ema(prices, 12);
  const ema26 = ema(prices, 26);
  const bb = bollinger(prices, 20, 2);

  const rsiNow = lastValid(rsiVals);
  const macdLast = lastValid(macdVals.macdLine);
  const macdSig = lastValid(macdVals.signalLine);
  const macdHist = lastValid(macdVals.histogram);
  const s20 = lastValid(sma20);
  const s50 = lastValid(sma50);
  const s200 = lastValid(sma200);
  const e12 = lastValid(ema12);
  const e26 = lastValid(ema26);
  const bbU = lastValid(bb.upper);
  const bbL = lastValid(bb.lower);
  const bbM = lastValid(bb.middle);

  const change7d =
    prices.length > 7 ? ((price - prices[prices.length - 8]) / prices[prices.length - 8]) * 100 : null;
  const change30d =
    prices.length > 30 ? ((price - prices[prices.length - 31]) / prices[prices.length - 31]) * 100 : null;

  // Volatility (30d std of daily returns, annualized in %)
  let volatility30d: number | null = null;
  if (prices.length > 31) {
    const returns: number[] = [];
    for (let i = prices.length - 30; i < prices.length; i++) {
      returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
    }
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + (b - mean) ** 2, 0) / returns.length;
    volatility30d = Math.sqrt(variance) * Math.sqrt(365) * 100;
  }

  let score = 0;
  let weights = 0;
  const reasons: AnalysisResult["reasons"] = [];

  if (rsiNow !== null) {
    weights += 25;
    if (rsiNow < 30) {
      score += 25;
      reasons.push({
        label: "RSI en zone de survente",
        impact: "bullish",
        detail: `RSI(14) = ${rsiNow.toFixed(1)} → l'actif est potentiellement survendu, rebond probable.`,
      });
    } else if (rsiNow < 45) {
      score += 10;
      reasons.push({
        label: "RSI bas",
        impact: "bullish",
        detail: `RSI(14) = ${rsiNow.toFixed(1)} → momentum faible mais pas de signal de surchauffe.`,
      });
    } else if (rsiNow > 70) {
      score -= 25;
      reasons.push({
        label: "RSI en surachat",
        impact: "bearish",
        detail: `RSI(14) = ${rsiNow.toFixed(1)} → l'actif est potentiellement suracheté, correction possible.`,
      });
    } else if (rsiNow > 55) {
      score -= 5;
      reasons.push({
        label: "RSI élevé",
        impact: "bearish",
        detail: `RSI(14) = ${rsiNow.toFixed(1)} → momentum haussier mais attention au surachat.`,
      });
    } else {
      reasons.push({
        label: "RSI neutre",
        impact: "neutral",
        detail: `RSI(14) = ${rsiNow.toFixed(1)} → zone neutre.`,
      });
    }
  }

  if (macdHist !== null && macdLast !== null && macdSig !== null) {
    weights += 20;
    if (macdHist > 0 && macdLast > macdSig) {
      score += 20;
      reasons.push({
        label: "MACD haussier",
        impact: "bullish",
        detail: `La ligne MACD (${macdLast.toFixed(4)}) est au-dessus de sa signal (${macdSig.toFixed(4)}) → momentum haussier confirmé.`,
      });
    } else if (macdHist < 0 && macdLast < macdSig) {
      score -= 20;
      reasons.push({
        label: "MACD baissier",
        impact: "bearish",
        detail: `La ligne MACD (${macdLast.toFixed(4)}) est sous sa signal (${macdSig.toFixed(4)}) → momentum baissier.`,
      });
    } else {
      reasons.push({
        label: "MACD ambigu",
        impact: "neutral",
        detail: `Histogramme MACD = ${macdHist.toFixed(4)} → signal en transition.`,
      });
    }
  }

  if (s50 !== null && s200 !== null) {
    weights += 25;
    if (s50 > s200 && price > s50) {
      score += 25;
      reasons.push({
        label: "Tendance long terme haussière (Golden Cross zone)",
        impact: "bullish",
        detail: `Prix au-dessus de la SMA50 et la SMA50 au-dessus de la SMA200 → tendance long terme positive.`,
      });
    } else if (s50 < s200 && price < s50) {
      score -= 25;
      reasons.push({
        label: "Tendance long terme baissière (Death Cross zone)",
        impact: "bearish",
        detail: `Prix sous la SMA50 et SMA50 sous la SMA200 → tendance long terme négative.`,
      });
    } else if (price > s200) {
      score += 10;
      reasons.push({
        label: "Au-dessus de la SMA200",
        impact: "bullish",
        detail: `Prix > SMA200 (${s200.toFixed(2)}) → contexte long terme acceptable.`,
      });
    } else {
      score -= 10;
      reasons.push({
        label: "Sous la SMA200",
        impact: "bearish",
        detail: `Prix < SMA200 (${s200.toFixed(2)}) → vigilance sur le long terme.`,
      });
    }
  } else if (s50 !== null) {
    weights += 15;
    if (price > s50) {
      score += 10;
      reasons.push({
        label: "Au-dessus de la SMA50",
        impact: "bullish",
        detail: `Prix > SMA50 → court/moyen terme haussier.`,
      });
    } else {
      score -= 10;
      reasons.push({
        label: "Sous la SMA50",
        impact: "bearish",
        detail: `Prix < SMA50 → court/moyen terme baissier.`,
      });
    }
  }

  if (bbU !== null && bbL !== null) {
    weights += 10;
    if (price <= bbL * 1.005) {
      score += 10;
      reasons.push({
        label: "Sous la bande de Bollinger basse",
        impact: "bullish",
        detail: `Prix proche/sous la bande basse (${bbL.toFixed(2)}) → écart-type étiré, rebond statistiquement probable.`,
      });
    } else if (price >= bbU * 0.995) {
      score -= 10;
      reasons.push({
        label: "Au-dessus de la bande de Bollinger haute",
        impact: "bearish",
        detail: `Prix proche/au-dessus de la bande haute (${bbU.toFixed(2)}) → tension acheteuse extrême.`,
      });
    }
  }

  if (change7d !== null) {
    weights += 10;
    if (change7d > 10) {
      score -= 5;
      reasons.push({
        label: "Forte hausse récente",
        impact: "bearish",
        detail: `+${change7d.toFixed(1)}% sur 7j → prise de bénéfice possible à court terme.`,
      });
    } else if (change7d < -10) {
      score += 5;
      reasons.push({
        label: "Forte baisse récente",
        impact: "bullish",
        detail: `${change7d.toFixed(1)}% sur 7j → opportunité de rebond à court terme.`,
      });
    }
  }

  if (volatility30d !== null) {
    weights += 10;
    if (volatility30d > 100) {
      reasons.push({
        label: "Volatilité très élevée",
        impact: "neutral",
        detail: `Volatilité annualisée ~${volatility30d.toFixed(0)}% → risque important, dimensionnez la position en conséquence.`,
      });
    } else if (volatility30d < 20) {
      reasons.push({
        label: "Volatilité faible",
        impact: "neutral",
        detail: `Volatilité annualisée ~${volatility30d.toFixed(0)}% → mouvements modérés attendus.`,
      });
    }
  }

  const normalized = weights > 0 ? (score / weights) * 100 : 0;
  let signal: Signal = "HOLD";
  if (normalized >= 50) signal = "STRONG_BUY";
  else if (normalized >= 20) signal = "BUY";
  else if (normalized <= -50) signal = "STRONG_SELL";
  else if (normalized <= -20) signal = "SELL";

  const confidence = Math.min(100, Math.max(20, Math.abs(normalized) + 30));

  return {
    signal,
    score: Math.round(normalized),
    confidence: Math.round(confidence),
    reasons,
    metrics: {
      rsi: rsiNow,
      macd: macdLast,
      macdSignal: macdSig,
      macdHist,
      sma20: s20,
      sma50: s50,
      sma200: s200,
      ema12: e12,
      ema26: e26,
      bbUpper: bbU,
      bbLower: bbL,
      bbMiddle: bbM,
      price,
      change7d,
      change30d,
      volatility30d,
    },
  };
}
