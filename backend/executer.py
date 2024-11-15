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
    n = len(parse)
    if n == 3:
        funname = parse[0]
        param1 = parse[1]
        param2 = parse[2]
        if len(param1) == 3:
            param1 = execute(param1, stock)
        if len(param2) == 3:
            param2 = execute(param2, stock)
    if param1 == "close":
        param1 = list(stock["close"])
    expr = eval(funname + "(" + str(param1) + "," + str(param2) + ")")
    return expr

def execute_exampler(parse_buy, parse_sell, stock, tradePoint):
    param = []
    param_name = []
    parse_buy = parse_buy.asList()
    parse_sell = parse_sell.asList()
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