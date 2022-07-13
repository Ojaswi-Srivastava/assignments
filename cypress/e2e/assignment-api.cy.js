///<reference types = "cypress" />
function randomString(dataSet = 'abcdefghijklmnopqrstuvwxyz', max = 10) {
    let randomString = "";
    for (let i = 0; i < max; i++)
        randomString += dataSet.charAt(Math.floor(Math.random() * dataSet.length));
    return randomString;
}

let baseURL = 'https://thinking-tester-contact-list.herokuapp.com';
let token = null;

//Validate firstname, last name and email fields returned by fetch user is same as provided while adding a user

it('first Test', () => {
    const firstName = randomString();
    const lastName = randomString();
    const email = randomString() + '@gmail.com'
    cy.request({
        method: 'POST',
        url: baseURL + '/users',
        body: {

            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "password": "myPassword"
        }

    }
    ).then((resp) => {

        expect(resp.status).to.equal(201);
        token = resp.body.token;

        cy.request({
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            url: baseURL + '/users/me'
        }).then((resp) => {
            expect(resp.status).to.equal(200);

            //Validate that no field has value as undefined or empty value.

            expect(resp.body.firstName).to.not.be.oneOf([null, undefined]);
            expect(resp.body.lastName).to.not.be.oneOf([null, undefined]);
            expect(resp.body.email).to.not.be.oneOf([null, undefined]);

            expect(resp.body.firstName).to.equal(firstName);
            expect(resp.body.lastName).to.equal(lastName);
            expect(resp.body.email).to.equal(email);
        })
    })

})

// Validate user is not able to fetch user details with invalid token

it('third test', () => {
    const token = randomString() // generating invalid token
    cy.request({
        method: 'GET',
        failOnStatusCode: false,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        url: baseURL + '/users/me'
    }).then((resp) => {
        expect(resp.status).to.equal(401);
    })

})

//Validate the contact is added successfully using add contact api. Also, validate the response values for each field is correct.

let contactid = null;
it('fourth test', () => {
    const firstName = randomString();
    const lastName = randomString();
    const email = randomString() + '@gmail.com';
    const city = randomString();
    cy.request({
        method: 'POST',
        url: baseURL + '/contacts',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body:
        {
            "firstName": firstName,
            "lastName": lastName,
            "birthdate": "1970-01-01",
            "email": email,
            "phone": "8005555555",
            "street1": "1 Main St.",
            "street2": "Apartment A",
            "city": city,
            "stateProvince": "KS",
            "postalCode": "12345",
            "country": "USA"
        }


    }
    ).then((resp) => {

        expect(resp.status).to.equal(201);
        expect(resp.body.firstName).to.equal(firstName);
        expect(resp.body.lastName).to.equal(lastName);
        expect(resp.body.email).to.equal(email);
        expect(resp.body.city).to.equal(city);

        contactid = resp.body._id;

    })
})

//Validate the contact is deleted successfully using delete contact api. Also, validate get contact api returns error while fetching the deleted contact

it('fifth test',()=>{
    cy.request({
        method: 'DELETE',
        url: baseURL + '/contacts/'+ contactid,
        headers: {
            'Authorization': 'Bearer ' + token
        },

}).then((resp)=>{

    expect(resp.status).to.equal(200);

    cy.request({
        method: 'GET',
        failOnStatusCode: false,
        headers: {
            'Authorization': 'Bearer ' + token
        },
        url: baseURL + '/contacts/'+ contactid,
    }).then((resp) => {
        expect(resp.status).to.equal(404);
    })

})
})