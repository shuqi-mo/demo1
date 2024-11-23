from pyparsing import Word, alphas, alphanums, Group, Suppress, Forward, nums, ZeroOrMore, OneOrMore, Regex, Keyword

def parseCode(text):
    # 定义关键字
    must = Keyword("must")
    maybe = Keyword("maybe")
    no = Keyword("no")
    
    # 定义数字和标识符
    number = Word(nums)
    identifier = Word(alphas, alphanums + "_")
    action = Word(alphas)
    colon = Suppress(":")
    date = Regex(r"\d\d\d\d-\d\d-\d\d")
    connect = Suppress("&&")

    # 使用 Forward 声明一个前瞻性解析表达式
    expr = Forward()

    # 定义函数调用和表达式列表
    func_call = Group(
        ZeroOrMore(must | maybe | no) +
        identifier("func_name") +
        Suppress("(") +
        ZeroOrMore(expr + Suppress(",")) +  # 允许多个参数，用逗号分隔
        expr +  # 最后一个参数后不加逗号
        Suppress(")")
    )

    expr <<= func_call | Group(date + Suppress(",") + date) | number | identifier
    complex_expr = OneOrMore(Group(action + colon + expr + ZeroOrMore(connect + func_call)))
    result = complex_expr.parseString(text['code'])
    return(result)