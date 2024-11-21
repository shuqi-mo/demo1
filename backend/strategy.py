import numpy as np

def cross(short, long):
    n = len(short)
    trade = np.zeros(n)
    for i in range(n-1):
        if long[i] == 0:
            continue
        if short[i] < long[i] and short[i+1] > long[i+1]:
            trade[i+1] = 1
    return trade

def over(*args, **kwargs):
    n_args = len(args)
    n_trade = len(args[0])
    trade = np.zeros(n_trade)
    for i in range(n_trade):
        cur = args[0][i]
        for j in range(1,n_args):
            if args[j][i] == 0 or args[j][i] > cur:
                break
            else:
                cur = args[j][i]
            if j == n_args - 1:
                trade[i] = 1
    return trade

# def minMaxNormalize(data):
#     n = len(data)
#     res = np.zeros(n)
#     minNum = min(data)
#     maxNum = max(data)
#     for i in range(n):
#         if data[i] == 0:
#             continue
#         if data[i] == 1:
#             res[i] = 1
#         else:
#             res[i] = 1 - round((data[i] - minNum) / (maxNum - minNum),2)
#     return res

# def single(price, thres):
#     n = len(price)
#     trade = np.zeros(n)
#     cur = price[0]
#     for i in range(1,n):
#         flux = abs((price[i] - cur) / cur)
#         if flux >= thres:
#             trade[i] = 1
#             cur = price[i]
#         else:
#             trade[i] = round(flux / thres,2)
#     return trade

# def longShortTrend(short, long):
#     n = len(short)
#     trade = np.zeros(n)
#     for i in range(n-1):
#         if long[i] == 0:
#             continue
#         if (short[i]-long[i])*(short[i+1]-long[i+1]) < 0:
#             trade[i+1] = 1
#         else:
#             trade[i+1] = abs(short[i+1]-long[i+1])
#     return minMaxNormalize(trade)
    
# def TBR(price, up, down):
    n = len(price)
    trade = np.zeros(n)
    for i in range(n):
        if up[i] == 0:
            continue
        if price[i] > up[i] or price[i] < down[i]:
            trade[i] = 1
        else:
            dis = max(abs(price[i]-up[i]),abs(price[i]-down[i]))
            trade[i] = round(dis/(up[i]-down[i]),2)
    return trade