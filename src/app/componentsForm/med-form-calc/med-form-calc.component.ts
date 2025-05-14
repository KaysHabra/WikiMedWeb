import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-form-calc',
  templateUrl: './med-form-calc.component.html',
  styleUrls: ['./med-form-calc.component.scss'],
})
export class MedFormCalcComponent implements OnInit {
  @Input() IsPrinting = false;
  // @Input() tblItems = [];
  @Input() item = {
    "ID": 444,
    "IDForm": 1,
    "IDNature": 1,
    "IsDefault": 1,
    "Visible": 1,
    "SingleForm": 0,
    "FieldsGroupE": "General Form",
    "FieldsGroupA": "النموذج العام",
    "NameE": "NURSE’S FORM",
    "NameA": "نموذج التمريض",
    "FieldDataType": "Text",
    "FieldDataSize": 0,
    "FieldIsRequired": 0,
    "CharsInLine": 0,
    "LinesInHeight": 1,
    "DefaultColor": 12895487,
    "UserUnAllow": "",
    "Permissions": "",
    "AnswerTypes": "",
    "AnswerDegrees": 0,
    "HeaderDescriptions": "",
    "FooterDescriptions": "",
    "ListValues": "",
    "ListDefaultValue": -1,
    "GroupFields": "",
    "GroupColumns": 0,
    "GroupLines": 0,
    "Image": "",
    "DefaultDoc": "",
    "CalcName": "",
    ReportVal: ""
  };

  tblVariables = [];
  Result = ``;
  @Input()
  set tblItems(data: any) {
    // this.tblVariables = data.filter(x => x.CalcName != "");
    // // alert(this.tblVariables);

    // let variables = {
    //   H: 170,
    //   W: 100,
    // };

    // console.log(`this.tblVariables= `, this.tblVariables);

    // let tblVals = this.item.ListValues.split(/\r?\n/)         // تقسيم بناءً على \n أو \r\n
    //   .map(line => line.trim()) // حذف الفراغات و \r إن وجدت
    //   .filter(line => line !== '');

    // console.log(`calc tblVals= `, tblVals);
    // let res = this.calculateNamedFormula(tblVals[0], variables);
    // alert(JSON.stringify(res));

    const input = {
      H: 170,
      W: 100
    };

    // const formulas = [
    //   "BMI = W / ((H / 100) ^ 2)",
    //   `WhightCase = CASE [BMI < 18.5: "Underweight", AND(BMI >= 18.5, BMI <= 24.9): "Normal", AND(BMI >= 25, BMI <= 29.9): "Overweight", AND(BMI >= 30, BMI <= 34.9): "Obese", AND(BMI >= 35, BMI <= 39.9): "Severely Obese", BMI >= 40: "Morbidly Obese"]`,
    //   `Perfect = CASE [BMI >= 25: TRUNC(24.9 * (H / 100)^2, -1), BMI < 18.5: TRUNC(18.5 * (H / 100)^2, -1), TRUE: W]`,
    //   `Result = CONCAT[" ", "BMI=", TRUNC(BMI,1), " ", WhightCase, " Perfect=", Perfect, "Kg"]`
    // ];



    // أمثلة الاستخدام مع تصحيح الخطأ في فاصلة AND:
    const variables = { H: 170, W: 100, BMI: 34.6 }; // نضيف BMI للمثال الثاني

    let result = this.evaluateExcelFormula("BMI=W/((H/100)^2)", variables);
    console.log(result);

    result = this.evaluateExcelFormula("WhightCase=case [BMI<18.5:\"Underweight\",AND(BMI>=18.5,BMI<=24.9):\"Normal\",AND(BMI>=25,BMI<=29.9):\"Overweight\",AND(BMI>=30,BMI<=34.9):\"Obese\",AND(BMI>=35,BMI<=39.9):\"Severely Obese\",BMI>=40:\"Morbidly Obese\"]", variables);
    console.log(result);

    result = this.evaluateExcelFormula("Perfect=case [BMI>=25:Trunc(24.9*(H/100)^2,-1),BMI<18.5:Trunc(18.5*(H/100)^2,-1),True:W]", variables);
    console.log(result);

    result = this.evaluateExcelFormula("Result=Concat[\" \",\"BMI=\",Trunc(BMI,1),WhightCase,\"Perfect=\",Perfect,\"Kg\"]", { ...variables, WhightCase: 'Obese', Perfect: 72 });
    console.log(result);

    result = this.evaluateExcelFormula("Perfect=case [BMI>=25:Trunc(24.9*(H/100)^2,-1),BMI<18.5:Trunc(18.5*(H/100)^2,-1),True:W]", variables);
    console.log(result);

    // let res = { Name: ``, Value: `` };
    // for (let line of tblVals) {
    //   res = this.calculateNamedFormula(tblVals, variables);
    //   variables[res.Name] = res.Value;
    //   alert(JSON.stringify(res));
    // }
    // alert(JSON.stringify(res));
    // this.Result = this.excelToJS(this.item.ListValues, variables)
  }

  constructor() { }

  ngOnInit() { }


  evaluateExcelFormula(formula, variables) {
    try {
      // دالة مساعدة لتقييم التعبيرات الرياضية والمنطقية
      function evaluateExpression(expression) {
        const functionRegex = /(\w+)\(([^)]*)\)/g;
        let match;
        let evaluatedExpression = expression;
  
        // تقييم الدوال (بما في ذلك AND)
        while ((match = functionRegex.exec(expression)) !== null) {
          const funcName = match[1].toLowerCase();
          const args = match[2].split(',').map(arg => arg.trim());
          let result;
  
          if (funcName === 'trunc') {
            const number = parseFloat(evaluateExpression(args[0]));
            const decimals = parseInt(args[1]);
            if (!isNaN(number) && !isNaN(decimals)) {
              const factor = Math.pow(10, Math.abs(decimals));
              result = decimals >= 0 ? Math.trunc(number * factor) / factor : Math.trunc(number / factor) * factor;
            } else {
              throw new Error(`Invalid arguments for TRUNC: ${match[0]}`);
            }
          } else if (funcName === 'and') {
            result = args.every(arg => evaluateComparison(arg));
          } else if (funcName === 'concat') {
            result = args.map(arg => evaluateExpression(arg)).join('');
          }
          // يمكنك إضافة المزيد من الدوال هنا
  
          if (result !== undefined) {
            evaluatedExpression = evaluatedExpression.replace(match[0], result);
            functionRegex.lastIndex = 0; // إعادة البحث من البداية بعد التبديل
          }
        }
  
        // استبدال المتغيرات بقيمها
        let expressionWithValues = evaluatedExpression;
        for (const varName in variables) {
          const regex = new RegExp(varName, 'g');
          expressionWithValues = expressionWithValues.replace(regex, variables[varName]);
        }
  
        try {
          return eval(expressionWithValues);
        } catch (error) {
          // إذا كان التقييم الرياضي بسيطًا فشل، فقد يكون تعبيرًا منطقيًا
          return evaluateComparison(expressionWithValues);
        }
      }
  
      // دالة مساعدة لتقييم المقارنات المنطقية
      function evaluateComparison(comparison) {
        const operators = ['>=', '<=', '>', '<', '=', '!='];
        let operatorFound = null;
        for (const op of operators) {
          if (comparison.includes(op)) {
            operatorFound = op;
            break;
          }
        }
  
        if (operatorFound) {
          const [left, right] = comparison.split(operatorFound).map(part => part.trim());
          const leftValue = evaluateExpression(left);
          const rightValue = evaluateExpression(right);
  
          switch (operatorFound) {
            case '>=': return leftValue >= rightValue;
            case '<=': return leftValue <= rightValue;
            case '>': return leftValue > rightValue;
            case '<': return leftValue < rightValue;
            case '=': return leftValue == rightValue;
            case '!=': return leftValue != rightValue;
            default: return false;
          }
        }
        // إذا لم يكن هناك عامل مقارنة، قم بتقييمه كتعبير بسيط
        return evaluateExpression(comparison);
      }
  
      // تحليل المعادلة الرئيسية
      const parts = formula.split('=');
      const name = parts[0].trim();
      const expression = parts[1].trim();
  
      if (expression.toLowerCase().startsWith('case [')) {
        // معالجة تعبير CASE
        const casesString = expression.substring(expression.indexOf('[') + 1, expression.lastIndexOf(']'));
        const casePairs = casesString.split(',').map(pair => pair.trim());
  
        for (const casePair of casePairs) {
          const conditionSeparatorIndex = casePair.indexOf(':');
          if (conditionSeparatorIndex === -1) {
            // الحالة الافتراضية (True)
            return { Name: name, Value: evaluateExpression(casePair) };
          } else {
            const condition = casePair.substring(0, conditionSeparatorIndex).trim();
            const result = casePair.substring(conditionSeparatorIndex + 1).trim();
            if (evaluateExpression(condition)) {
              return { Name: name, Value: evaluateExpression(result) };
            }
          }
        }
        return { Name: name, Value: null }; // لم يتم استيفاء أي حالة
      } else if (expression.toLowerCase().startsWith('concat[')) {
        // معالجة دالة CONCAT
        const argsString = expression.substring(expression.indexOf('[') + 1, expression.lastIndexOf(']'));
        const args = argsString.split(',').map(arg => arg.trim());
        const evaluatedArgs = args.map(arg => evaluateExpression(arg));
        return { Name: name, Value: evaluatedArgs.join('') };
      } else {
        // معالجة المعادلات الرياضية البسيطة
        return { Name: name, Value: evaluateExpression(expression) };
      }
  
    } catch (error) {
      console.error(`Error evaluating formula "${formula}":`, error);
      return { Name: null, Value: null, Error: error.message };
    }
  }




}
