let money: string;
let price: string;
let unit: string;
let cent: string;
let litera: string = "";
let hundreds: string = "";
let tens: string = "";
let ones: string = "";
let minus: string = "";
let k: number = 0;
let i: number;
let j: number;

const N: string[] = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
  "",
  "one hundred",
  "two hundred",
  "three hundred",
  "four hundred",
  "five hundred",
  "six hundred",
  "seven hundred",
  "eight hundred",
  "nine hundred",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "thousand",
  "million",
  "million",
  "million",
  "million",
  "million",
  "million",
  "million",
  "million",
  "million",
  "million",
  "billion",
  "billion",
  "billion",
  "billion",
  "billion",
  "billion",
  "billion",
  "billion",
  "billion",
  "billion",
];

// Initialize M array
const M: string[][] = Array.from({ length: 10 }, () => new Array(N.length));
k = 0;
for (i = 0; i < N.length; i++) {
  for (j = 0; j < 10; j++) {
    M[j][i] = N[k++];
  }
}

const U: string[] = [
  "dollars",
  "dollar",
  "dollars",
  "dollars",
  "dollars",
  "dollars",
  "dollars",
  "dollars",
  "dollars",
  "dollars",
];
const C: string[] = [
  "cents",
  "cent",
  "cents",
  "cents",
  "cents",
  "cents",
  "cents",
  "cents",
  "cents",
  "cents",
];

export function num2str(moneyArg: string): string {
  money = moneyArg;
  unit = "";
  cent = "";

  // Replace comma with dot if present
  money = money.replace(",", ".");

  // Check if the value is numeric
  if (isNaN(Number(money))) {
    throw new Error("Non-numeric value");
  }

  // Check if the value is negative
  if (money.charAt(0) === "-") {
    money = money.slice(1);
    minus = "minus ";
  } else {
    minus = "";
  }

  // Round to two decimal places and convert to string
  money = (Math.round(Number(money) * 100) / 100).toString();

  // Split into dollars and cents
  if (money.indexOf(".") !== -1) {
    unit = money.slice(0, money.indexOf("."));
    cent = money.slice(money.indexOf(".") + 1);
    if (cent.length === 1) cent += "0";
  } else {
    unit = money;
    cent = "00"; // Always add cents
  }

  if (unit.length > 12) {
    throw new Error("Number is too large");
  }

  function words(price: string, declension: string[]): string {
    litera = "";
    for (i = 0; i < price.length; i += 3) {
      hundreds = tens = ones = "";
      const twoDigits = n(i + 2, 2);
      if (twoDigits > 10 && twoDigits < 20) {
        ones = ` ${M[n(i + 1, 1)][1]} ${M[0][i / 3 + 3]}`;
        if (i === 0) ones += declension[0];
      } else {
        ones = M[n(i + 1, 1)][0];
        if (i === 0 && ones !== "") ones += ` ${declension[n(i + 1, 1)]}`;
        else if (ones !== " ") ones += ` ${M[n(i + 1, 1)][i / 3 + 3]}`;
        if (ones === " ") ones = "";
        else if (ones !== ` ${M[n(i + 1, 1)][i / 3 + 3]}`) ones = ` ${ones}`;
        tens = M[n(i + 2, 1)][2] ? ` ${M[n(i + 2, 1)][2]}` : "";
      }
      hundreds = M[n(i + 3, 1)][3] ? ` ${M[n(i + 3, 1)][3]}` : "";
      if (
        price.slice(price.length - i - 3, price.length - i) === "000" &&
        ones === ` ${M[0][i / 3 + 3]}`
      ) {
        ones = "";
      }
      litera = hundreds + tens + ones + litera;
    }
    if (price === "00" && declension === C) return "zero cents";
    if (litera === ` ${U[0]}`) return `zero${litera}`;
    const trimmedLitera = litera.slice(1);
    if (declension === C && trimmedLitera) {
      const lastDigit = parseInt(price.slice(-1), 10);
      const lastTwoDigits = parseInt(price.slice(-2), 10);
      if (lastTwoDigits >= 11 && lastTwoDigits <= 19)
        return `${trimmedLitera} ${C[0]}`;
      if (lastDigit === 1) return `${trimmedLitera} ${C[1]}`;
      return `${trimmedLitera} ${C[0]}`;
    }
    return trimmedLitera;
  }

  function n(start: number, len: number): number {
    if (start > price.length) return 0;
    return Number(
      price.slice(price.length - start, price.length - start + len)
    );
  }

  const unitsString: string = words((price = unit), U);
  const centsString: string = words((price = cent), C);

  let res: string = `${unitsString} and ${centsString}`;
  if (unitsString === `Zero ${U[0]}`) res = centsString;

  return (minus + res).charAt(0).toUpperCase() + (minus + res).slice(1);
}
