from datetime import datetime, timedelta

def calBacktest(price, trade, ahead = -1):
    success = []
    profit = []
    profitpent = []
    totalprofit = 0
    for i in range(len(trade)):
        if trade[i] == 0:
            continue
        # 多头进场
        if trade[i] == 1:
            if ahead == -1:
                for j in range(i+1,len(trade)):
                    if trade[j] == -1:
                        if price[i] < price[j]:
                            success.append(1)
                        else:
                            success.append(0)
                        totalprofit += price[j] - price[i]
                        profit.append(totalprofit)
                        profitpent.append((price[j]-price[i])/price[i])
                        break
            else:
                if price[i] < price[i+ahead]:
                    success.append(1)
                else:
                    success.append(0)
                totalprofit += price[i+ahead] - price[i]
                profit.append(totalprofit)
                profitpent.append((price[i+ahead]-price[i])/price[i])
        # 空头进场
        if trade[i] == -1:
            if ahead == -1:
                for j in range(i+1,len(trade)):
                    if trade[j] == 1:
                        if price[i] > price[j]:
                            success.append(1)
                        else:
                            success.append(0)
                        totalprofit += price[i] - price[j]
                        profit.append(totalprofit)
                        profitpent.append((price[i]-price[j])/price[i])
                        break
            else:
                if price[i] > price[i+ahead]:
                    success.append(1)
                else:
                    success.append(0)
                totalprofit += price[i] - price[i+ahead]
                profit.append(totalprofit)
                profitpent.append((price[i]-price[i+ahead])/price[i])
    return [success,profit,profitpent]

def evaluation(parse, stock, trade):
    if parse[0] == "period":
        format = "%Y-%m-%d"
        start = datetime.strptime(parse[1][0],format)
        end = datetime.strptime(parse[1][1],format)
        s = 0
        e = len(stock["trade_date"])-1
        current = datetime.strptime(stock["trade_date"][s],format)
        while(current < start):
            s += 1
            current = datetime.strptime(stock["trade_date"][s],format)
        current = datetime.strptime(stock["trade_date"][e],format)
        while(current > end):
            e -= 1
            current = datetime.strptime(stock["trade_date"][e],format)
        return calBacktest(list(stock["close"][s:e+1]), trade[s:e+1])
    elif parse[0] == "lookahead":
        return calBacktest(stock["close"], trade, int(parse[1]))