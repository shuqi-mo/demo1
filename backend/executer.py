from indicator import *
from strategy import *
import re

def execute_expr(expr, stock):
    # 处理表达式的函数
    def preprocess_expression(expression, stock_df):
        # 替换关键字为stock中的列名
        def replace_keywords(match):
            keyword = match.group(0)
            if keyword in stock_df.columns:
                return f"stock['{keyword}']"
            return keyword
        
        # 替换表达式中的close, open, high, low等为stock["close"], stock["open"]等
        processed_expression = re.sub(r'\b(close|open|high|low)\b', replace_keywords, expression)

        # 处理带索引的关键字（[n]）
        def replace_indexed_keywords(match):
            n = int(match.group(1)) if match.group(1) else 0  # 提取n值
            return f".shift({n}, fill_value=-1)"
    
        # 匹配 [n] 格式并替换
        processed_expression = re.sub(r'\[(\d+)\]', replace_indexed_keywords, processed_expression)
        
        return processed_expression

    processed_expression = preprocess_expression(expr, stock)
    res = eval(processed_expression)
    return np.array(res)