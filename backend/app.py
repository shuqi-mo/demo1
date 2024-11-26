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

@app.route('/process_code', methods=['POST'])
def process_code():
    data = request.get_json()
    # print(data["code"])
    parseResult = parseCode(data)
    data_df = pd.read_csv(file_path + data["selectStock"] + ".csv")
    longStrategyList = parseResult[0].asList()
    shortStrategyList = parseResult[1].asList()
    longlist = []
    shortlist = []
    longcondition = []    
    shortcondition = []
    for i in range(1,len(longStrategyList)):
        longcondition.append(longStrategyList[i][0])
        longlist.append(execute(longStrategyList[i][1:], data_df))
        must_arrays, maybe_arrays, no_arrays = generate_event(longlist, longcondition)
        long = calculate_event_result(must_arrays, maybe_arrays, no_arrays)
    for i in range(1,len(shortStrategyList)):
        shortcondition.append(shortStrategyList[i][0])
        shortlist.append(execute(shortStrategyList[i][1:], data_df))
        must_arrays, maybe_arrays, no_arrays = generate_event(shortlist, shortcondition)
        short = calculate_event_result(must_arrays, maybe_arrays, no_arrays)
    # 数组中1表示买入，-1表示卖出
    trade = [a - b for a, b in zip(long, short)]
    evalRes = evaluation(parseResult[2][1].asList(), data_df, trade)
    return jsonify([trade,evalRes])

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

if __name__ == '__main__':
    app.run()