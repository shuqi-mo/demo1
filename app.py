from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from indicator import *
from strategy import *
from parser import *
from executer import *

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

@app.route('/get_single')
def get_single():
    price = data_df["close"]
    res = single(price, 0.05)
    return jsonify(res.tolist())

@app.route('/get_double')
def get_double():
    price = data_df["close"]
    short = MA(price, 12)
    long = MA(price, 26)
    res = longShortTrend(short,long)
    return jsonify(res.tolist())

@app.route('/get_triple')
def get_triple():
    price = data_df["close"]
    up, down = bolling(price, 20)
    res = TBR(price, up, down)
    return jsonify(res.tolist())

@app.route('/receive_code', methods=['POST'])
def receive_code():
    data = request.get_json()
    # print(data["code"])
    parseResult = parseCode(data)
    data_df = pd.read_csv(file_path + data["selectStock"] + ".csv")
    buy = execute(parseResult[0][1], data_df)
    sell = execute(parseResult[1][1], data_df)
    # 数组中1表示买入，-1表示卖出
    res = (buy - sell).tolist()
    return jsonify(res)

@app.route('/cal_exampler_data', methods=['POST'])
def cal_exampler_data():
    data = request.get_json()
    parseResult = parseCode(data)
    data_df = pd.read_csv(file_path + data["selectStock"] + ".csv")
    buy = execute(parseResult[0][1], data_df)
    sell = execute(parseResult[1][1], data_df)
    # 数组中1表示买入，-1表示卖出
    trade = (buy - sell).tolist()
    res = execute_exampler(parseResult[0][1], parseResult[1][1], data_df, trade)
    return jsonify(res)

if __name__ == '__main__':
    app.run()