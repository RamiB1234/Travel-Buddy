import {checkDate} from '../src/client//js/dateChecker'
  
describe("Testing the date check functionality", () => {
    test("Testing the checkDate() function", () => {
        expect(checkDate('01/01/2019')).toBeFalsy();
})});