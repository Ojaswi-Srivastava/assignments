import { rand, randEmail, randNumber, randSentence } from "@ngneat/falso";
describe("Test with page objects", () => {
  beforeEach("open application", () => {
    cy.viewport(1024, 780);
    cy.visit("/index.php");
  });

  // Validate whether the search suggestion is not given to the user until 3 characters are populated.

  it("first test", () => {
    const singleChar = ["F", "B", "P", "f", "b", "p"];
    singleChar.forEach(($obj) => {
      cy.get(".search_query").type($obj);
      cy.get("#index").find(".ac_results").should("not.exist");
      cy.get(".search_query").clear();
    });

    const doubleChar = ["Fa", "Bl", "Pr", "fa", "bl", "pr"];
    doubleChar.forEach(($obje) => {
      cy.get(".search_query").type($obje);
      cy.get("#index").find(".ac_results").should("not.exist");
      cy.get(".search_query").clear();
    });

    const tripleChar = [
      "Fad",
      "Blo",
      "Pri",
      "Sum",
      "Sle",
      "Dre",
      "fad",
      "blo",
      "pri",
      "sum",
      "dre",
      "sle",
    ];
    tripleChar.forEach(($text) => {
      cy.get(".search_query").type($text);
      cy.get("#index").as("results").find(".ac_results").should("be.visible");
      cy.wait(350);
      cy.get(".search_query").clear();
      cy.get("@results").should("be.visible");
    });
  });

  // Validate results are displayed according to the search made by the user.

  it("second test", () => {
    let i = 0;
    const tripleChar = [
      "Fad",
      "Blo",
      "Pri",
      "Sum",
      "Sle",
      "Dre",
      "fad",
      "blo",
      "pri",
      "sum",
      "dre",
      "sle",
    ];
    tripleChar.forEach(($text) => {
      cy.get(".search_query").type($text);
      cy.wait(350);
      cy.get("#index")
        .find(".ac_results")
        .should("exist")
        .contains(tripleChar[i], { matchCase: false });
      cy.get(".search_query").clear();
    });
  });

  //Validate whether the user is able to apply the large size catalog filter for the T-shirt section.

  it("third test", () => {
    cy.get("ul.sf-menu>li:eq(2)").should("contain", "T-shirts").click();
    cy.get("#layered_block_left")
      .find(".layered_filter")
      .should("contain", "Size")
      .find("#uniform-layered_id_attribute_group_3")
      .click();
    cy.get('[class="button ajax_add_to_cart_button btn btn-default"]').click();
    cy.get('[class="layer_cart_product col-xs-12 col-md-6"]').should(
      "contain",
      "Product successfully added to your shopping cart"
    );
  });

  // Validate whether the user is able to upload  a file on the contact us page.

  it("fourth test", function () {
    cy.get("#contact-link").should("contain", "Contact us").click();

    cy.get("#id_contact> option") // we get the select/option by finding the select by id
      .then((listing) => {
        console.log(listing);
        const randomNumber = rand([1, 2]);
        const email = randEmail();
        const idorder = randNumber();
        const message = randSentence(); //generate a rendom number between 0 and length-1. In this case 1,2
        cy.get("#id_contact> option")
          .eq(randomNumber)
          .then((selec) => {
            //choose an option randomly
            //console.log(typeof selec)  used to find datatype
            const text = selec.text(); //get the option's text. For ex. "A"
            cy.get("#id_contact").select(text); // select the option on UI
          });
        cy.get("#email").type(email);
        cy.get("#id_order").type(idorder);
        cy.get("#uniform-fileUpload");
        const filepath = "/UploadFile.txt";
        cy.get("#fileUpload").attachFile(filepath);
        cy.get(".filename").should("contain", "UploadFile.txt");
        cy.get("#message").type(message);
        cy.get("#submitMessage").click();
        cy.get("#center_column").should(
          "contain",
          "Your message has been successfully sent to our team."
        );
      });
  });

  // Add 5 products in the cart, validate total cart amount

  it.only("fifth test", () => {
    cy.get('[class="sf-with-ul"]').contains("Women").click();
    let count = 0;

    for (var i = 0; i < 5; i++) {
      cy.get("ul.product_list>li")
        .eq(i)
        .then((PriceFirst) => {
          cy.wrap(PriceFirst).find(
            '[class="button ajax_add_to_cart_button btn btn-default"]'
          ).click();
          cy.wait(300);
          cy.get(
            '[class="continue btn btn-default button exclusive-medium"]'
          ).click();
          cy.wait(300);
          count += parseFloat(
            PriceFirst.find('[class="price product-price"]')
              .text()
              .replace("$", "")
              .trim()
          );
        });
    }

    cy.get('[title="View my shopping cart"]', { timeout: 10000 })
      .should("be.visible")
      .click();
    var final_amount = 0;
    cy.get("#total_product").then((ele) => {
      final_amount = parseFloat(ele.text().trim().replace("$", ""));
      expect(final_amount).to.equal(count);
    });
  });
});
