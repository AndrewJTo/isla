interface FullName {
  lastName: string;
  firstName: string;
  middleName?: string;
}

interface Message {
  fullName: FullName;
  dateOfBirth: string;
  primaryCondition: String;
}

const nameRe = /PRS(?:\|[^\\|]*){3}\|([a-zA-Z\s^]+)/;
const dateOfBirthRe = /PRS(?:\|[^\\|]*){7}\|(\d+)/;
const conditionRe = /DET(?:\|[^\\|]*){3}\|([^\n\\|]+)/;

export function parseMessage(text: string): Message {
  // Extract name
  const nameComponents = text.match(nameRe);

  if (!nameComponents || nameComponents.length !== 2) {
    throw new Error('Could not parse full name');
  }

  const names = nameComponents[1].split('^');

  if (names.length < 2) {
    throw new Error('At least a first name and surname must be provided');
  }

  const fullName: FullName = {
    lastName: names[0],
    firstName: names[1],
  };

  if (names.length > 2) {
    fullName.middleName = names.slice(2).join(' ').trimEnd();
  }

  // Extract date of birth
  const dateOfBirthComponents = text.match(dateOfBirthRe);

  if (
    !dateOfBirthComponents ||
    dateOfBirthComponents.length !== 2 ||
    dateOfBirthComponents[1].length !== 8
  ) {
    throw new Error('Could not parse date of birth');
  }

  const dateOfBirth =
    dateOfBirthComponents[1].substring(0, 4) +
    '-' +
    dateOfBirthComponents[1].substring(4, 6) +
    '-' +
    dateOfBirthComponents[1].substring(6, 9);

  // Extract primary condition
  const conditionComponents = text.match(conditionRe);

  if (!conditionComponents || conditionComponents.length !== 2) {
    throw new Error('Could not parse condition');
  }

  const primaryCondition = conditionComponents[1];

  return {
    fullName,
    dateOfBirth,
    primaryCondition,
  };
}
