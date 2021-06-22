/* eslint-disable valid-typeof */
import { ValidationMessageTemplate } from '../constants';
import ToastHelpers from './ToastHelpers';

// const testArray = [
//     {
//         fieldName: 'Tên ngân hàng',
//         input: '1623462777',
//         validate: {
//             required: {
//                 value: true,
//             },
//             maxLength: {
//                 value: 4,
//             },
//             minLength: {
//                 value: 2,
//             },
//             dataType: {
//                 value: ['number', 'string'],
//             },
//             dateAfter: {
//                 value: true,
//             },
//             dateBefore: {
//                 value: true,
//             },
//             equal: {
//                 value: 5,
//             },
//             equalGreaterThan: {
//                 value: 5,
//             },
//             equalLessThan: {
//                 value: 5,
//             },
//             isEmail: {
//                 value: false,
//             },
//             isPhone: {
//                 value: true,
//             },
//             match: {
//                 value: /ab+c/,
//                 message: 'Không hợp lệ'
//             }
//         }
//     },
// ];

const generateValidateMessage = (template, displayName, value) => {
    const mainContentArray = template.split('');

    if (mainContentArray[0] === ' ' && mainContentArray[mainContentArray.length - 1] === ' ') {
        return `${displayName}${template}${value}`;
    }

    if (mainContentArray[0] !== ' ' && mainContentArray[mainContentArray.length - 1] !== ' ') {
        return `${template}`;
    }

    if (mainContentArray[0] === ' ') {
        return `${displayName}${template}`;
    }

    return `${template}${displayName}`;
};

const validateEmail = (mail) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailRegex.test(mail);
};

const validatePhoneNum = (phoneNum) => {
    const phoneRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    phoneRegex.test(phoneNum);
};

const checkType = (input, typeArr) => {
    const inputType = typeof (input);
    const result = typeArr.find((type) => type === inputType);
    if (result) return true;
    return false;
};

const getLength = (text) => text.toString().length;

const doValidate = (validateType, validateProp, fieldName, input) => {
    switch (validateType) {
        case 'maxLength': {
            if (getLength(input) >= validateProp.value) {
                const message = validateProp?.message
                || `${generateValidateMessage(
                    ValidationMessageTemplate.MAX_LENGTH,
                    fieldName,
                    validateProp.value
                )} kí tự`;

                ToastHelpers.renderToast(message);
                return false;
            }
            return true;
        }

        case 'minLength': {
            if (getLength(input) < validateProp.value) {
                const message = validateProp?.message
                || `${generateValidateMessage(
                    ValidationMessageTemplate.MIN_LENGTH,
                    fieldName, validateProp.value
                )} kí tự`;

                ToastHelpers.renderToast(message);
                return false;
            }
            return true;
        }

        case 'required': {
            if (input === '' || input === null || input === undefined) {
                const message = validateProp?.message
                || generateValidateMessage(ValidationMessageTemplate.REQUIRED, fieldName, validateProp.value);

                ToastHelpers.renderToast(message);
                return false;
            }
            return true;
        }

        case 'isEmail': {
            if (validateProp.value) {
                if (!validateEmail(validateProp.value)) {
                    const message = validateProp?.message
                || generateValidateMessage(ValidationMessageTemplate.IS_EMAIL, fieldName, validateProp.value);

                    ToastHelpers.renderToast(message);
                    return false;
                }
            }
            return true;
        }

        case 'isPhone': {
            if (validateProp.value) {
                if (!validatePhoneNum(validateProp.value)) {
                    const message = validateProp?.message
                || generateValidateMessage(ValidationMessageTemplate.IS_PHONE, fieldName, validateProp.value);

                    ToastHelpers.renderToast(message);
                    return false;
                }
            }
            return true;
        }

        case 'dataType': {
            if (!(checkType(input, validateProp.value))) {
                const message = validateProp?.message
                || generateValidateMessage(
                    ValidationMessageTemplate.DATA_TYPE,
                    fieldName, validateProp.value
                );

                ToastHelpers.renderToast(message);
                return false;
            }
            return true;
        }

        case 'equal': {
            if (!(+input === +validateProp.value)) {
                const message = validateProp?.message
                || generateValidateMessage(
                    ValidationMessageTemplate.EQUAL,
                    fieldName, validateProp.value
                );

                ToastHelpers.renderToast(message);
                return false;
            }
            return true;
        }

        case 'equalGreaterThan': {
            if (!(+input >= +validateProp.value)) {
                const message = validateProp?.message
                || generateValidateMessage(
                    ValidationMessageTemplate.EQUAL_GREATER_THAN,
                    fieldName, validateProp.value
                );

                ToastHelpers.renderToast(message);

                return false;
            }
            return true;
        }

        case 'equalLessThan': {
            if (!(+input <= +validateProp.value)) {
                const message = validateProp?.message
                || generateValidateMessage(
                    ValidationMessageTemplate.EQUAL_LESS_THAN,
                    fieldName, validateProp.value
                );

                ToastHelpers.renderToast(message);

                return false;
            }
            return true;
        }

        // case 'dateAfter': {
        //     if (!(input > Math.floor(Date.now() / 1000))) {
        //         const message = validateProp?.message
        //         || generateValidateMessage(
        //             ValidationMessageTemplate.DATE_AFTER,
        //             fieldName, validateProp.value
        //         );

        //         ToastHelpers.renderToast(message);
        //
        //         return false;
        //     }
        //     return true;
        // }

        // case 'dateBefore': {
        //     if (!(input < Math.floor(Date.now() / 1000))) {
        //         const message = validateProp?.message
        //         || generateValidateMessage(
        //             ValidationMessageTemplate.DATE_BEFORE,
        //             fieldName, validateProp.value
        //         );

        //         ToastHelpers.renderToast(message);
        //
        //         return false;
        //     }
        //     return true;
        // }

        case 'match': {
            if (validatePhoneNum(validateProp.value)) {
                const message = validateProp?.message
                || generateValidateMessage(ValidationMessageTemplate.IS_PHONE, fieldName, validateProp.value);

                ToastHelpers.renderToast(message);
                return false;
            }
            return true;
        }
        default: {
            return true;
        }
    }
};

const validateItem = (validateObj) => {
    let isValid = true;
    const validatePropArr = Object.keys(validateObj.validate);

    validatePropArr.every((element) => {
        isValid = doValidate(
            element, validateObj.validate[element.toString()], validateObj.fieldName, validateObj.input
        );

        return isValid;
    });
    return isValid;
};

const validate = (validateArray) => {
    if (!validateArray || validateArray.length === 0) return false;

    let isValid = true;
    validateArray.every((item) => {
        if (!validateItem(item)) {
            isValid = false;
            return false;
        }
        return true;
    });

    return isValid;
};

export default { validate };
