class Strategy {
  constructor(data) {
    this.name = data.name;
    this.type = data.type;
    this.long = data.long;
    this.short = data.short;

    // 存储中间变量（除了name, type, long, short以外的所有元素）
    this.variables = {};

    // 预处理变量：首先处理所有的中间变量
    for (let key in data) {
      if (!["name", "type", "long", "short"].includes(key)) {
        // 对变量的表达式进行预替换，确保它们能正确展开
        this.variables[key] = this.preprocessVariable(data[key]);
      }
    }
  }

  // 预替换函数，递归展开变量
  preprocessVariable(expression) {
    let newExpression = expression;
    if (typeof newExpression === "string") {
      // 替换所有中间变量
      for (let key in this.variables) {
        // 递归替换，直到替换完成
        newExpression = newExpression.replace(
          new RegExp(`\\b${key}\\b`, "g"),
          `${this.variables[key]}`
        );
      }
    }
    return newExpression;
  }

  // 计算 long 和 short 的方法
  computeLong() {
    // 根据类中存储的变量来动态计算long
    return this.long.replace(/(\w+)/g, (match) => {
      // 替换变量为对应的值
      if (this.variables[match]) {
        return this.variables[match];
      }
      return match;
    });
  }

  computeShort() {
    // 根据类中存储的变量来动态计算short
    return this.short.replace(/(\w+)/g, (match) => {
      // 替换变量为对应的值
      if (this.variables[match]) {
        return this.variables[match];
      }
      return match;
    });
  }
}

export { Strategy };
