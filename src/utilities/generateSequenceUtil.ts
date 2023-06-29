const generateSequenceNumb = (string: string) => {
  // takes in a string and return the next sequence of said string
  const splitString = string.split('-');
  const numberString = splitString[1].toString().padStart(5, '0');

  const nextNumberString: string = (Number(numberString) + 1).toString();

  const paddedNextNumberString: string = nextNumberString.padStart(5, '0');

  return paddedNextNumberString;
};

export default generateSequenceNumb;
