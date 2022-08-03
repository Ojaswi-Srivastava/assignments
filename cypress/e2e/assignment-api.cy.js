///<reference types = "cypress" />
import {
  randEmail,
  randFirstName,
  randLastName,
  randCity,
  randStreetName,
  randZipCode,
  randCountry,
  randState,
  randPassword,
  randUuid,
} from "@ngneat/falso";

let baseURL = "https://thinking-tester-contact-list.herokuapp.com";
let authToken = "";

const firstName = randFirstName();
const lastName = randLastName();
const email = randEmail();
const password = randPassword();

const user = {
  firstName: firstName,
  lastName: lastName,
  email: email,
  password: password,
};

before(() => {
  cy.request({
    method: "POST",
    url: baseURL + "/users",
    body: user,
  })
    .its("body.token")
    .then((token) => (authToken = token));
});

//Validate firstname, last name and email fields returned by fetch user is same as provided while adding a user

it("first Test", () => {
  cy.request({
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    url: baseURL + "/users/me",
  }).then((resp) => {
    cy.wrap(resp.status).should("eq", 200);
    cy.wrap(resp.body.firstName).should("eq", firstName);
    cy.wrap(resp.body.lastName).should("eq", lastName);
    cy.wrap(resp.body.email).should("eq", email);
  });
});

// Validate user is not able to fetch user details with invalid token

it("third test", () => {
  const token = randUuid(); // generating invalid token
  cy.request({
    method: "GET",
    failOnStatusCode: false,
    headers: {
      Authorization: "Bearer assss",
    },
    url: baseURL + "/users/me",
  }).then((resp) => {
    expect(resp.status).to.equal(401);
  });
});

//Validate the contact is added successfully using add contact api. Also, validate the response values for each field is correct.

let contactid = null;
it("fourth test", () => {
  const firstName = randFirstName();
  const lastName = randFirstName();
  const email = randEmail();
  const city = randCity();
  const street1 = randStreetName();
  const phone = "9123456789";
  const postalCode = randZipCode();
  const country = randCountry();
  const state = randState();
  cy.request({
    method: "POST",
    url: baseURL + "/contacts",
    headers: {
      Authorization: "Bearer " + authToken,
    },
    body: {
      firstName: firstName,
      lastName: lastName,
      birthdate: "1970-01-01",
      email: email,
      phone: phone,
      street1: street1,
      street2: street1,
      city: city,
      stateProvince: state,
      postalCode: postalCode,
      country: country,
    },
  }).then((resp) => {
    expect(resp.status).to.equal(201);
    expect(resp.body.firstName).to.equal(firstName);
    expect(resp.body.lastName).to.equal(lastName);
    expect(resp.body.email).to.equal(email);
    expect(resp.body.city).to.equal(city);

    contactid = resp.body._id;
  });
});

//Validate the contact is deleted successfully using delete contact api. Also, validate get contact api returns error while fetching the deleted contact

it("fifth test", () => {
  cy.request({
    method: "DELETE",
    url: baseURL + "/contacts/" + contactid,
    headers: {
      Authorization: "Bearer " + authToken,
    },
  }).then((resp) => {
    expect(resp.status).to.equal(200);

    cy.request({
      method: "GET",
      failOnStatusCode: false,
      headers: {
        Authorization: "Bearer " + authToken,
      },
      url: baseURL + "/contacts/" + contactid,
    }).then((resp) => {
      expect(resp.status).to.equal(404);
    });
  });
});
