def calBacktest(price, trade):
    success = []
    profit = []
    profitpent = []
    totalprofit = 0
    for i in range(len(trade)):
        if trade[i] == 0:
            continue
        # 多头进场
        if trade[i] == 1:
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
        # 空头进场
        if trade[i] == -1:
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
    return [success,profit,profitpent]