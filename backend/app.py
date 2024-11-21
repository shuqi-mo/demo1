from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from indicator import *
from strategy import *
from parser import *
from executer import *
from evaluation import *

app = Flask(__name__)
CORS(app)

file_path = "static/data/"
file_name = "600893.SH.csv"

data_df = pd.read_csv(file_path + file_name)
app.secret_key = 'secret_key'

@app.route('/get_stock_data')
def get_stock_data():
    data = {}
    data["name"] = file_name[:9]
    stock = []
    for index, rows in data_df.iterrows():
        stock.append([rows["trade_date"],rows["open"],rows["close"],rows["high"],rows["low"],rows["vol"]])
    data["data"] = stock
    return jsonify(data)

@app.route('/update_single_stock_data', methods=['POST'])
def update_single_stock_data():
    data = request.get_json()
    res = {}
    res["name"] = data["item"]
    stock = []
    data_df = pd.read_csv(file_path + data["item"] + ".csv")
    for index, rows in data_df.iterrows():
        stock.append([rows["trade_date"],rows["open"],rows["close"],rows["high"],rows["low"],rows["vol"]])
    res["data"] = stock
    return jsonify(res)

@app.route('/receive_code', methods=['POST'])
def receive_code():
    data = request.get_json()
    # print(data["code"])
    parseResult = parseCode(data)
    data_df = pd.read_csv(file_path + data["selectStock"] + ".csv")
    buy = execute(parseResult[0][1].asList(), data_df)
    sell = execute(parseResult[1][1].asList(), data_df)
    # 数组中1表示买入，-1表示卖出
    res = (buy - sell).tolist()
    return jsonify(res)

@app.route('/cal_exampler_data', methods=['POST'])
def cal_exampler_data():
    res = []
    data = request.get_json()
    parseResult = parseCode(data)
    data_df = pd.read_csv(file_path + data["selectStock"] + ".csv")
    buy = execute(parseResult[0][1].asList(), data_df)
    sell = execute(parseResult[1][1].asList(), data_df)
    # 数组中1表示买入，-1表示卖出
    trade = (buy - sell).tolist()
    exampler = execute_exampler(parseResult[0][1].asList(), parseResult[1][1].asList(), data_df, trade)
    res.append(exampler)
    res.append(parseResult.asList())
    return jsonify(res)

@app.route('/backtest', methods=['POST'])
def backtest():
    data = request.get_json()
    res = calBacktest(data["price"],data["tradepoint"])
    return jsonify(res)

if __name__ == '__main__':
    app.run()