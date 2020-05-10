import { checkInput } from './inputCheck.js';

describe('RegExp: input', function () {
    it('this needs to be a string', function () {
        const urlRGEX = /^[a-zA-Z\s]{0,255}$/;
        const urlTest = "PiN0y";
        expect(urlRGEX.test(urlTest)).toBe(false);
    })
});