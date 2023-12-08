/**
 * ops:[1,1,1] = [boolean(View),boolean(Create/edit),boolean(delete);
 * 
 * 
 */


let FIELDPERMISSIONS = {

    credit: {
        login: [1, 0, 0],
        Name: [1, 0, 0],
        Age: [1, 0, 0]
    },
    tax: {
        login: [1, 0, 0],
        Name: [1, 0, 0],
        amount: [1, 0, 0],
    },
    funding: {
        login: [1, 0, 0],
        Name: [1, 0, 0],
        amount: [1, 0, 0],
    },
    VAT: {
        login: [1, 0, 0],
        amount: [1, 0, 0],
    },
    products: {
        Name: [1, 0, 0],
        desc: [1, 0, 0]
    }
};

module.exports = FIELDPERMISSIONS;