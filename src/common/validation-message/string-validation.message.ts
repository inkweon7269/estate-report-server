import { ValidationArguments } from 'class-validator';

export const stringValidationMessage = (args: ValidationArguments) => {
    return `${args.property}에 문자열을 입력해 주세요!`;
};
