from indicator import *
from strategy import *

def minMaxNormalizeForMultiSeq(li):
    li_onedim = [item for sublist in li for item in sublist]
    minNum = min(li_onedim)
    maxNum = max(li_onedim)
    for i in range(len(li)):
        for j in range(len(li[0])):
            li[i][j] = round((li[i][j] - minNum) / (maxNum - minNum) * 2 - 1,2)
    return li

def execute(parse, stock):
    def process_param(param, stock):
        # 检查是否是关键字
        if param in ["close", "open", "high", "low"]:
            return list(stock[param])
        # 检查是否是子表达式
        elif isinstance(param, list):
            return execute(param, stock)
        else:
            return param

    # 提取函数名
    funname = parse[0]
    # 处理其余的参数
    params = [process_param(param, stock) for param in parse[1:]]
    # 构建参数字符串
    params_str = ', '.join(map(str, params))
    # 使用eval执行函数
    expr = eval(f"{funname}({params_str})")
    return expr

def execute_exampler(parse_buy, parse_sell, stock, tradePoint):
    param = []
    param_name = []
    if len(parse_buy) == 3:
        funname_buy = parse_buy[0]
        if len(parse_buy[1]) == 3:
            param.append(execute(parse_buy[1], stock))
            param_name.append(parse_buy[1])
        if len(parse_buy[2]) == 3:
            param.append(execute(parse_buy[2], stock))
            param_name.append(parse_buy[2])
    if len(parse_sell) == 3:
        funname_sell = parse_sell[0]
        if parse_sell[1] not in parse_buy:
            if len(parse_sell[1]) == 3:
                param.append(execute(parse_sell[1], stock))
                param_name.append(parse_sell[1])
        if parse_sell[2] not in parse_buy:
            if len(parse_sell[2]) == 3:
                param.append(execute(parse_sell[2], stock))
                param_name.append(parse_sell[2])
    tradeSeq = []
    for i in range(len(param)):
        n = len(param[i])
        seq = []
        buyPoint = -1
        sellPoint = -1
        for j in range(n):
            if tradePoint[j] == 0:
                continue
            elif tradePoint[j] == -1:
                if buyPoint != -1:
                    sellPoint = j
                    seq.append(param[i][buyPoint-1:sellPoint+1])
                    buyPoint = -1
                else:
                    continue
            else:
                buyPoint = j
        tradeSeq.append(seq)
    output = []
    for i in range(len(tradeSeq)):
        output.append(tradeSeq[i][len(tradeSeq[0])-1])
    output = minMaxNormalizeForMultiSeq(output)
    return [output,param_name]