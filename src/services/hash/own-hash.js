module.exports = {
  crypt: getHash,
  compare: comparePassword,
};

/* eslint-disable */

function getHash(pass) {
  // for use import this file and hash password like that = hash(user.password)

  let s1 = '01101011101010100100011010101001';
  let s2 = '11101110111011101000101110001001';
  let s3 = '10011000111110101101110011101110';
  let s4 = '00010011101100100101010001110110';
  let s5 = '11000010110100101110000110110100';

  if (pass.length % 2 === 1) {
    s1 = s1.split('').reverse();
    s2 = s2.split('').reverse();
    s3 = s3.split('').reverse();
    s4 = s4.split('').reverse();
    s5 = s5.split('').reverse();
  }

  const array = [];

  const temp = [];

  let hash;
  let hashUp;

  const salt = '6^y@#5!&';

  let finalRow1 = [];
  let finalRow2 = [];
  let finalRow3 = [];
  let finalRow4 = [];
  let finalRow5 = [];


  const start = '$%*h';

  let intermediateResult = [];
  let res = [];

  let finalPassword = [];
  let hashedPassword;

  (function () {
    const passSplit = pass.split('');
    for (let i = 0; i < passSplit.length; i++) {
      array.push(passSplit[i]
        .charCodeAt() // to ascii
        .toString(2)); // to binary
    }

    return array;
  }());

  let joinedArray = array.join('') + 1;

  (function () {
    for (let i = joinedArray.length; i < 468; i++) {
      joinedArray += 0;
    }
    joinedArray += 11011100110;

    return joinedArray;
  }());

  (function () {
    const toPush = [];
    for (let i = 0; i < joinedArray.length; i++) {
      toPush.push(joinedArray[i]);
    }

    let i;
    let j;
    let temparray;
    const chunk = 32;

    for (i = 0, j = toPush.length; i < j; i += chunk) {
      temparray = toPush.slice(i, i + chunk);
      temp.push(temparray);
    }

    return temp;
  }());

  async function devideSection() {
    let row1 = temp[0];
    let row5 = temp[4];
    let row9 = temp[8];

    for (let i = 0; i < 32; i++) {
      if (row1[i] == 1 || row5[i] == 1 || row9[i] == 1 || s5[i] == 1) {
        finalRow1[i] = 1;
      } else finalRow1[i] = 0;
    }

    for (let i = 0; i < finalRow1.length; i++) {
      if (row1[i] == 0 || row9[i] == 0) {
        finalRow1[i] = 0;
      } else finalRow1[i] = 1;
    }

    for (let i = 0; i < finalRow1.length; i++) {
      if (row5[i] == 1 || s5[i] == 0) {
        finalRow1[i] = 1;
      } else finalRow1[i] = 0;
    }

    let row13 = temp[12];
    let row15 = temp[14];

    for (let i = 0; i < 32; i++) {
      if (row13[i] == 1 || row15[i] == 1 || s3[i] == 1) {
        finalRow2[i] = 1;
      } else finalRow2[i] = 0;
    }

    for (let i = 0; i < 15; i++) {
      if (row13[i] == 0 || s3[i] == 1) {
        finalRow2[i] = 1;
      } else finalRow2[i] = 0;
    }

    let row2 = temp[1];
    let row10 = temp[9];
    let row14 = temp[13];

    for (let i = 0; i < 31; i++) {
      if (row2[i] == 1 || row10[i] == 1 || row14[i] == 1 || s2[i] == 1) {
        finalRow3[i] = 1;
      } else finalRow3[i] = 0;
    }

    for (let i = 0; i < 31; i++) {
      if (row2[i] == 1 || row14[i] == 1 || s2[i] == 1) {
        finalRow3[i] = 0;
      } else finalRow3[i] = 1;
    }

    let row4 = temp[3];
    let row12 = temp[11];

    for (let i = 0; i < 31; i++) {
      if (row4[i] == 1 || row12[i] == 1 || s4[i] == 1) {
        finalRow4[i] = 1;
      } else finalRow4[i] = 0;
    }

    for (let i = 20; i < 31; i++) {
      if (row12[i] == 0 || s4[i] == 1) {
        finalRow4[i] = 1;
      } else finalRow4[i] = 0;
    }

    let row3 = temp[2];
    let row11 = temp[10];

    for (let i = 0; i < 32; i++) {
      if (row3[i] == 1 || row11[i] == 1 || s1[i] == 1) {
        finalRow5[i] = 1;
      } else finalRow5[i] = 0;
    }

    for (let i = 0; i < 32; i += 4) {
      if (finalRow5[i] == 0) {
        finalRow5[i] = 1;
      } else {
        finalRow5[i] = 0;
      }
    }

    for (let i = 0; i < 32; i += 7) {
      if (finalRow5[i] == 1) {
        finalRow5[i] = 0;
      } else {
        finalRow5[i] = 1;
      }
    }
  }
  devideSection();

  async function mostImportantDigit() {
    function shiftZero(row) {
      let count = 0;
      for (let i = 0; i < 32; i++) {
        if (row[i] === 0) {
          count++;
        } else {
          break;
        }
      }
      row = row.slice(count);
      for (let i = count; i !== 0; i--) {
        row.push(0);
      }

      return row;
    }

    finalRow1 = shiftZero(finalRow1);
    finalRow2 = shiftZero(finalRow2);
    finalRow3 = shiftZero(finalRow3);
    finalRow4 = shiftZero(finalRow4);
    finalRow5 = shiftZero(finalRow5);
  }
  mostImportantDigit();

  (function () {
    let semi1 = finalRow1;
    semi1 = semi1.reverse();
    let tempo1 = [];

    for (let i = 7; i < 24; i++) {
      tempo1.push(semi1[i]);
    }
    tempo1.reverse();
    let j = 0;
    for (let i = 7; i < 24; i++) {
      semi1[i] = tempo1[j];
      j++;
    }
    semi1 = finalRow1.join('').toString();
    let hash1 = parseInt(semi1, 2).toString(16);


    let semi2 = finalRow2;
    let tempo2 = [];

    for (let i = 0; i < 15; i++) {
      tempo2.push(semi2[i]);
    }
    tempo2.reverse();
    for (let i = 0; i < 15; i++) {
      semi2[i] = tempo2[i];
    }
    semi2 = finalRow2.join('').toString();
    let hash2 = parseInt(semi2, 2).toString(16);

    let semi3 = finalRow3;

    let tempo3 = [];
    semi3 = semi3.reverse();

    for (let i = 15; i < 32; i++) {
      tempo3.push(semi3[i]);
    }
    tempo3.reverse();
    j = 0;
    for (let i = 15; i < 32; i++) {
      semi3[i] = tempo3[j];
      j++;
    }
    semi3 = finalRow3.join('').toString();
    let hash3 = parseInt(semi3, 2).toString(16);


    let semi4 = finalRow4;
    let tempo4 = [];
    for (let i = 0; i < 7; i++) {
      tempo4.push(semi3[i]);
    }
    for (let i = 16; i < 24; i++) {
      tempo4.push(semi3[i]);
    }
    j = 0;
    for (let i = 0; i < 7; i++) {
      semi4[i] = tempo4[j];
      j++;
    }
    j = 7;
    for (let i = 16; i < 24; i++) {
      semi4[i] = tempo4[j];
      j++;
    }
    tempo4.reverse();
    semi4 = finalRow4.join('').toString();
    let hash4 = parseInt(semi4, 2).toString(16);


    let semi5 = finalRow5;
    semi5 = semi5.reverse();
    let tempo5 = [];
    for (let i = 7; i < 15; i++) {
      tempo5.push(semi5[i]);
    }

    for (let i = 25; i < 32; i++) {
      tempo5.push(semi5[i]);
    }

    j = 0;

    for (let i = 7; i < 15; i++) {
      semi5[i] = tempo5[j];
      j++;
    }
    j = 7;
    for (let i = 24; i < 32; i++) {
      semi5[i] = tempo5[j];
      j++;
    }
    tempo5.reverse();

    semi5 = finalRow5.join('').toString();
    let hash5 = parseInt(semi5, 2).toString(16);

    hash = `${hash1}${''}${hash2}${''}${hash3}${''}${hash4}${''}${hash5}`;

    return hash;
  }());

  (function () {
    let tempArray = [];

    let container = salt.split('');

    for (let i = 0; i < hash.length; i++) {
      tempArray.push(hash[i]);
    }

    let i;
    let j;
    let temparray;
    const chunk = 6;
    for (i = 0, j = tempArray.length; i < j; i += chunk) {
      temparray = tempArray.slice(i, i + chunk);
      intermediateResult.push(temparray);
    }

    for (let i = 0; i < intermediateResult.length; i++) {
      intermediateResult[i].push(container[i]);
    }

    intermediateResult = intermediateResult.toString().split(',').join('');

    return intermediateResult;
  }());

  (function () {
    let shortPass;
    if (pass.length > 12) {
      shortPass = `${pass[3]}${''}${pass[6]}${''}${pass[9]}${''}${pass[13]}`;
    } else {
      shortPass = `${pass[2]}${''}${pass[5]}${''}${pass[7]}`;
    }
    let a = [];

    let result = `${''}`;

    for (let i = 0; i < shortPass.length; i++) {
      result += shortPass.charCodeAt(i).toString(16);
    }
    result = result.split('');
    for (let i = 0; i < result.length; i++) {
      a.push(result[i]
        .charCodeAt() // to ascii
        .toString(2)); // to binary
    }
    a = a.join('').toString();

    hashUp = parseInt(a, 2).toString(16);
    hashUp = hashUp.slice(0, 8);

    return hashUp;
  }());

  (function () {
    let temarr = [];

    let containerUp = hashUp.split('');

    for (let i = 0; i < intermediateResult.length; i++) {
      temarr.push(intermediateResult[i]);
    }

    let j;
    let arr;
    const chunk = 4;
    for (let i = 0, j = temarr.length; i < j; i += chunk) {
      arr = temarr.slice(i, i + chunk);
      res.push(arr);
    }

    for (let i = 0; i < containerUp.length; i++) {
      res[i].push(containerUp[i]);
    }
    res = res.toString().split(',').join('');
  }());

  (function () {
    let tempRev = res.toString().split('').reverse().join('');
    const a = ['*', 'N', '.', '!', 'O'];
    const c = ['?', ',', 'o', '<', '/'];
    const d = ['w', '-', 'l', '&'];
    const f = ['y', '(', ':', '#', 'G'];
    const string1 = ['{', '@', 'Y', 's', 'R'];
    const string3 = ['v', '', 'K', '+', '"'];
    const string5 = ['?', 'J', ':', 'S', 't'];

    tempRev = tempRev.split('');
    for (let i = 0; i < tempRev.length; i++) {
      if (tempRev[i] == '1') {
        tempRev[i] = string1;
      }
      if (tempRev[i] == '3') {
        tempRev[i] = string3;
      }
      if (tempRev[i] == '5') {
        tempRev[i] = string5;
      }
    }

    res = res.split('');
    for (let i = 0; i < res.length; i++) {
      if (res[i] == 'a') {
        res[i] = a;
      }
      if (res[i] == 'c') {
        res[i] = c;
      }
      if (res[i] == 'd') {
        res[i] = d;
      }
      if (res[i] == 'f') {
        res[i] = f;
      }
    }

    tempRev = tempRev.toString().split(',').join('');
    res = res.toString().split(',').join('');
    let final = `${tempRev}${''}${res}`;
    let finalP = [];

    for (let i = 0; i < final.length; i++) {
      finalP.push(final[i]);
      if (i == 10) {
        i += 2;
      } else {
        i++;
      }
    }

    final = finalP;
    finalP = [];

    for (let i = 0; i < final.length; i++) {
      finalP.push(final[i]);
      i++;
    }

    let startFinal = [];

    for (let i = 4; i < finalP.length; i++) {
      startFinal.push(finalP[i]);
    }

    let j = 0;
    for (let i = startFinal.length - 1; i > startFinal.length - 29; i--) {
      finalPassword[j] = startFinal[i];
      j++;
    }
    hashedPassword = `${start}${''}${finalPassword}`;
    hashedPassword = hashedPassword.split(',').join('');
  }());

  return hashedPassword;
}

function comparePassword(plainPass, hashedPassword, callback) {
  let newHash = getHash(plainPass);
  if (newHash == hashedPassword) return callback(true);
  return callback(false);
}
