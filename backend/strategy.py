import numpy as np

def cross(short, long):
    # 确保short和long都是numpy数组
    short = np.array(short)
    long = np.array(long)
    
    # 如果short或long是单个数字，将其转换为长度相同的数组
    if short.ndim == 0:  # 如果short是单个数字
        short = np.full_like(long, short)
    if long.ndim == 0:  # 如果long是单个数字
        long = np.full_like(short, long)
    
    n = max(len(short), len(long))  # 确保n是较长数组的长度
    trade = np.zeros(n)
    for i in range(n-1):
        if short[i] == 0 or long[i] == 0 or short[i+1] == 0 or long[i+1] == 0:
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