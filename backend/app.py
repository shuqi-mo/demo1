from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
from indicator import *
from process import *
from evaluation import *

app = Flask(__name__)
CORS(app)

file_path = "static/data/"
file_name = "600893.SH.csv"

data_df = pd.read_csv(file_path + file_name)
app.secret_key = 'secret_key'

@app.route('/get_stock_list')
def get_stock_list():
    csv_files = []
    # 遍历data文件夹中的文件
    for file_name in os.listdir(file_path):
        # 检查文件是否以.csv结尾
        if file_name.endswith('.csv'):
            csv_files.append(file_name[:9])
    return jsonify(csv_files)

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

@app.route('/process_indicator', methods=['POST'])
def process_indicator():
    data = request.get_json()
    data_df = pd.read_csv(file_path + data["stock"] + ".csv")
    long = execute_expr(data["exprLong"], data_df)
    short = execute_expr(data["exprShort"], data_df)
    long = CustomList(long)
    short = CustomList(short)
    trade = process_trades(long, short)
    float_trade = [float(x) for x in trade]
    return jsonify(float_trade)

@app.route('/process_evaluation', methods=['POST'])
def process_evaluation():
    data = request.get_json()
    data_df = pd.read_csv(file_path + data["stock"] + ".csv")
    price, trade = updatePeriod(data_df, data["singleTrade"], data["startDate"], data["endDate"])
    res = calBacktest(price, trade, data["getAheadStopTime"])
    return jsonify(res)

if __name__ == '__main__':
    app.run()