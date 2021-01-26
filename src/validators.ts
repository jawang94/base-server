// Note create standardized error code list for client <-> server communication
export const validateLength = (ctx: string, str: string, ...args: number[]): void => {
  let min, max;

  if (args.length === 1) {
    min = 0;
    max = args[0];
  } else {
    min = args[0];
    max = args[1];
  }

  if (typeof str !== 'string') {
    throw TypeError(`${ctx}: Must be a string.`);
  }

  if (str.length < min) {
    throw TypeError(`${ctx}: Must be at least ${min} characters.`);
  }

  if (str.length > max) {
    throw TypeError(`${ctx}: Must be less than ${max} characters.`);
  }
};

export const validatePassword = (ctx: string, password: string, passwordConfirm: string): void => {
  validateLength(ctx, password, 8, 30);
  validateLength(ctx, passwordConfirm, 8, 30);

  if (password !== passwordConfirm) {
    throw Error(`${ctx}Confirm: Passwords do not match.`);
  }

  if (!/[a-zA-Z]+/.test(password)) {
    throw TypeError(`${ctx}: Must contain english letters.`);
  }

  if (!/\d+/.test(password)) {
    throw TypeError(`${ctx}: Must contain numbers.`);
  }

  if (!/[^\da-zA-Z]+/.test(password)) {
    throw TypeError(`${ctx}: Must contain special characters.`);
  }
};

import moment from 'moment';
// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
export const validateDate = (ctx: string, dateString: string): void => {
  // First check for the pattern
  if (!moment(dateString, 'MM/DD/YYYY', true).isValid()) {
    throw TypeError(`${ctx} is invalid format`);
  }
  // console.log(dateString);
  // // Parse the date parts to integers
  // const parts = dateString.split('/');
  // const day = parseInt(parts[1], 10);
  // const month = parseInt(parts[0], 10);
  // const year = parseInt(parts[2], 10);

  // // Check the ranges of month and year
  // if (year < 1000 || year > 3000 || month == 0 || month > 12) {
  //   throw TypeError(`${ctx} has an invalid year or month`);
  // }

  // const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // // Adjust for leap years
  // if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) monthLength[1] = 29;

  // // Check the range of the day
  // if (day < 0 || day > monthLength[month - 1]) {
  //   throw TypeError(`${ctx} has an invalid day range`);
  // }
};
