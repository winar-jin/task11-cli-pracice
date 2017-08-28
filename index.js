const readlineSync = require('readline-sync');
const stuScoreList = [];

(function main() {
  try {
    while (true) {
      const choice = showMenu();
      assignTask(choice);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

function showMenu() {
  console.log(`1. 添加学生
2. 生成成绩单
3. 退出
`);
  let choice = readlineSync.question(`请输入你的选择（1～3）：`, {
    defaultInput: 3
  });
  while (![1, 2, 3].includes(parseInt(choice, 10))) {
    choice = readlineSync.question(`输入错误，请正确输入你的选择（1～3）：`, {
      defaultInput: 3
    });
  }
  return choice;
}

function assignTask(choice) {
  const taskList = {
    1: addStudent,
    2: printscoreList,
    3: exitProgram
  };
  return taskList[choice]();
}

function addStudent() {
  let studentInfo = readlineSync.question(`请输入学生信息（格式：姓名, 学号, 班级, 学科: 成绩, ...），按回车提交：`).split(',');
  let isPromtRight = checkpromt(studentInfo);
  while (!isPromtRight) {
    studentInfo = readlineSync.question(`请按正确的格式输入（格式：姓名, 学号, 班级, 学科: 成绩, ...）：`).split(',');
    isPromtRight = checkpromt(studentInfo);
  }
  const totalScore = parseInt(studentInfo[3].split(':')[1], 10) + parseInt(studentInfo[4].split(':')[1], 10) + parseInt(studentInfo[5].split(':')[1], 10) + parseInt(studentInfo[6].split(':')[1], 10);
  const stuObj = {
    stuName: studentInfo[0],
    stuNo: studentInfo[1],
    stuClass: studentInfo[2],
    totalScore: totalScore,
    avageSocre: (totalScore / 4).toFixed(2)
  };
  stuObj[studentInfo[3].split(':')[0]] = parseInt(studentInfo[3].split(':')[1], 10);
  stuObj[studentInfo[4].split(':')[0]] = parseInt(studentInfo[4].split(':')[1], 10);
  stuObj[studentInfo[5].split(':')[0]] = parseInt(studentInfo[5].split(':')[1], 10);
  stuObj[studentInfo[6].split(':')[0]] = parseInt(studentInfo[6].split(':')[1], 10);
  if (!isStuExist(stuObj)) {
    stuScoreList.push(stuObj);
    console.log(`学生${stuObj.stuName}的成绩被添加!`)
  } else {
    console.log(`该学生信息已经存在！`);
  }
}

function printscoreList() {
  let studentList = readlineSync.question(`请输入要打印的学生的学号（格式： 学号, 学号,...），按回车提交：`).split(',');
  let isPromtRight = studentList.every(ele => isNumber(ele));
  while (!isPromtRight) {
    studentList = readlineSync.question(`请按正确的格式输入要打印的学生的学号（格式： 学号, 学号,...），按回车提交：`).split(',');
    isPromtRight = studentList.every(ele => isNumber(ele));
  }
  consoleOutScores(studentList);
}

function consoleOutScores(studentList) {
  const scoreInventory = [];
  studentList.forEach(stuNo => {
    let tempStu = stuScoreList.find(stu => stu.stuNo === stuNo);
    if (tempStu) {
      scoreInventory.push(`${tempStu.stuName}|${tempStu['数学']}|${tempStu['语文']}|${tempStu['英语']}|${tempStu['编程']}|${tempStu.avageSocre}|${tempStu.totalScore}`);
    }
  });
  const classScore = [];
  stuScoreList.forEach(stuInfo => {
    classScore.push(stuInfo['数学'], stuInfo['语文'], stuInfo['英语'], stuInfo['编程']);
  });
  console.log(`成绩单
姓名|数学|语文|英语|编程|平均分|总分 
========================
${scoreInventory.join('\n')}
========================
全班总分平均数：${(classScore.reduce((a, b) => a + b) / classScore.length).toFixed(2)}
全班总分中位数：${findMiddleNum(classScore)}
  `);
}

function findMiddleNum(numberArr) {
  numberArr.sort((a, b) => a - b);
  let lowMiddle = Math.floor((numberArr.length - 1) / 2);
  let highMiddle = Math.ceil((numberArr.length - 1) / 2);
  let median = (numberArr[lowMiddle] + numberArr[highMiddle]) / 2;
  return median.toFixed(2);
}

function isStuExist(stuObj) {
  return stuScoreList.some(stuInfo => stuInfo.stuNo === stuObj.stuNo);
}

function checkpromt(studentInfo) {
  return studentInfo.length === 7 &&
    isNumber(studentInfo[1]) &&
    isScoreRight(studentInfo[3]) &&
    isScoreRight(studentInfo[4]) &&
    isScoreRight(studentInfo[5]) &&
    isScoreRight(studentInfo[6]);
}

function isNumber(ele) {
  return /^[0-9]*$/g.test(ele);
}

function isScoreRight(course) {
  return ['数学', '语文', '英语', '编程'].includes(course.split(':')[0]) && isNumber(course.split(':')[1]);
}

function exitProgram() {
  console.log('exiting...');
  process.exit(1);
}