import numpy as np

def SMA(price, days):
    n = len(price)
    sma = []
    for i in range(n):
        if i < days:
            sma.append(0)
            continue
        else:
            t = 0
            for j in range(days):
                t += price[i-j]
            sma.append(round(t/days,2))
    return sma

def EMA(price, days):
    ema = []
    for i in range(days-1):
        ema.append(0)
    ema.append(sum(price[:days]) / days)
    alpha = 2 / (days + 1)
    for p in price[days:]:
        ema.append(alpha * p + (1 - alpha) * ema[-1])
    return ema

def WMA(price, days):
    wma = []
    n = len(price)
    for i in range(days):
        wma.append(0)
    weights = np.arange(1, days + 1)
    total = weights.sum()
    for i in range(days,n):
        p = price[i-days:i]
        wma.append(np.dot(p,weights)/total)
    return wma

def SMMA(price, days):
    smma = []
    for i in range(days-1):
        smma.append(0)
    smma.append(sum(price[:days]) / days)
    for i in range(days,len(price)):
        smma.append((smma[-1] * (days-1) + price[i]) / days)
    return smma

def VWMA(price, volume, days):
    n = len(price)
    vwma = []
    for i in range(n):
        if i < days:
            vwma.append(0)
            continue
        else:
            t = 0
            d = 0
            for j in range(days):
                t += price[i-j] * volume[i-j]
                d += volume[i-j]
            vwma.append(round(t/d,2))
    return vwma

def bolling(price, days):
    n = len(price)
    mid = MA(price, days)
    std = np.zeros(n)
    for i in range(n-days):
        if i < days:
            continue
        w = price[i:i+days]
        std[i:i+days] = np.std(w)
    up = mid + 2 * std
    down = mid - 2 * std
    for i in range(days):
        up[i] = 0
        down[i] = 0
    return up, down