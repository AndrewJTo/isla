import {expect, describe, it} from 'vitest';
import {parseMessage} from '.';

describe('parse message', () => {
  const tests = [
    {
      name: 'should parse',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      expected: {
        fullName: {
          lastName: 'Smith',
          firstName: 'John',
          middleName: 'A',
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold',
      },
    },
    {
      name: 'Extra segments should parse',
      input: `BGN|123@@@|asd|@@#|
MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
MDL|extra information | 
DET|1|I|^^MainDepartment^101^Room 1|Common Cold
END|end info| ###`,
      expected: {
        fullName: {
          lastName: 'Smith',
          firstName: 'John',
          middleName: 'A',
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold',
      },
    },
    {
      name: 'no middle name should parse',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      expected: {
        fullName: {
          lastName: 'Smith',
          firstName: 'John',
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold',
      },
    },
    {
      name: 'no middle name ending with carat should parse',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      expected: {
        fullName: {
          lastName: 'Smith',
          firstName: 'John',
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold',
      },
    },
    {
      name: 'multiple middle names should parse',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^Brian^Steve^William|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      expected: {
        fullName: {
          lastName: 'Smith',
          middleName: 'Brian Steve William',
          firstName: 'John',
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold',
      },
    },
    {
      name: 'multiple middle names ending with caret should parse',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^Brian^Steve^William^|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      expected: {
        fullName: {
          lastName: 'Smith',
          middleName: 'Brian Steve William',
          firstName: 'John',
        },
        dateOfBirth: '1980-01-01',
        primaryCondition: 'Common Cold',
      },
    },
    {
      name: 'cannot parse name',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID|||||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      throws: 'Could not parse full name',
    },
    {
      name: 'only first name',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||John|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      throws: 'At least a first name and surname must be provided',
    },
    {
      name: 'date of birth field too short',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|1900101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      throws: 'Could not parse date of birth',
    },
    {
      name: 'date of birth field too long',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|193800101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      throws: 'Could not parse date of birth',
    },
    {
      name: 'invalid characters in date of birth',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|1a8vs101|
DET|1|I|^^MainDepartment^101^Room 1|Common Cold`,
      throws: 'Could not parse date of birth',
    },
    {
      name: 'missing condition',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1`,
      throws: 'Could not parse condition',
    },
    {
      name: 'empty condition',
      input: `MSG|^~\\&|SenderSystem|Location|ReceiverSystem|Location|20230502112233||DATA^TYPE|123456|P|2.5
EVT|TYPE|20230502112233
PRS|1|9876543210^^^Location^ID||Smith^John^A|||M|19800101|
DET|1|I|^^MainDepartment^101^Room 1||`,
      throws: 'Could not parse condition',
    },
  ];

  tests.forEach(test => {
    it(test.name, () => {
      if (test.throws) {
        expect(() => parseMessage(test.input)).toThrow(test.throws);
        return;
      }

      if (!test.expected) {
        throw new Error(
          'Test does not specify expected return or thrown value'
        );
      }

      expect(parseMessage(test.input)).toMatchObject(test.expected);
    });
  });
});
