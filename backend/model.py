import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np

# 构建神经网络模型
class TradingModel(nn.Module):
    def __init__(self):
        super(TradingModel, self).__init__()
        self.fc1 = nn.Linear(1, 64)  # 第一层，64个神经元
        self.fc2 = nn.Linear(64, 32)         # 第二层，32个神经元
        self.fc3 = nn.Linear(32, 1)          # 输出层，输出label
        self.sigmoid = nn.Sigmoid()          # Sigmoid激活函数
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))  # ReLU激活
        x = torch.relu(self.fc2(x))  # ReLU激活
        x = self.sigmoid(self.fc3(x))  # 输出概率（0到1之间）
        return x

# 简化的模拟利润计算函数
def calculate_profit(prices, strategy):
    profit = 0
    for i in range(0, len(prices)-1):
        if strategy[i] == 1:  # 如果选择多头交易
            profit += prices[i+1] - prices[i]  # 计算简单的利润差
        if strategy[i] == -1:  # 如果选择空头交易
            profit += prices[i] - prices[i+1]  # 计算简单的利润差
    return profit

def profit_loss_function(predictions, strategies, stock_prices):
    profit = []
    for i in range(len(strategies)):
        profit.append(calculate_profit(stock_prices, strategies[i]))
    profit_tensor = torch.tensor(profit)
    return -torch.mean(predictions * profit_tensor)

def train(stock_prices, strategies, labels):
    # 将数据转换为 PyTorch 张量
    stock_prices_tensor = torch.tensor(stock_prices)
    strategies_tensor = torch.tensor(strategies)
    labels = np.array(labels)
    labels = labels.reshape(len(labels),1)
    labels_tensor = torch.tensor(labels.astype(np.float32))
    # 初始化模型
    model = TradingModel()
    # 优化器
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    # 训练过程
    num_epochs = 100
    for epoch in range(num_epochs):
        model.train()
        optimizer.zero_grad()
    
        outputs = model(labels_tensor)  # 获取模型的预测
        loss = profit_loss_function(outputs, strategies, stock_prices)  # 根据利润计算损失
    
        # 向后传播
        loss.backward()
        optimizer.step()
    
        # 打印训练过程中的损失
        if (epoch+1) % 10 == 0:
            print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}')
    outputs_class = (outputs > 0.5).int().reshape(len(labels)).tolist()
    return outputs_class