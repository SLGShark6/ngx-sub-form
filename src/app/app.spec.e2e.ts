/// <reference types="Cypress" />

import { extractErrors, FormElement, hardcodedElementsToTestList } from '../../cypress/helpers/data.helper';
import { DOM, getFormList, getFormValue } from '../../cypress/helpers/dom.helper';
import { DroidType } from './interfaces/droid.interface';
import { ListingType, VehicleListing } from './interfaces/listing.interface';
import { Spaceship, Speeder, VehicleType } from './interfaces/vehicle.interface';
import { hardCodedListings } from './services/listings.data';

context(`EJawa demo`, () => {
  const testContexts = [
    { id: 'old', testName: 'Old implementation', url: '' },
    { id: 'new', testName: 'New implementation', url: '/rewrite' },
  ] as const;

  testContexts.forEach(({ id, testName, url }) => {
    context(testName, () => {
      beforeEach(() => {
        cy.visit(url);
      });

      it(`should have a default list displayed`, () => {
        DOM.list.elements.cy.should($el => {
          expect(getFormList($el)).to.eql(hardcodedElementsToTestList(hardCodedListings));
        });
      });

      it(`should click on the first element and display its data in the form`, () => {
        DOM.list.elements.cy.first().click();

        const x = hardCodedListings[0] as VehicleListing;
        const v = x.product as Spaceship;

        const expectedObj: FormElement = {
          title: x.title,
          price: '£' + x.price.toLocaleString(),
          inputs: {
            id: x.id,
            title: x.title,
            imageUrl: x.imageUrl,
            price: x.price + '',
            listingType: x.listingType,
            vehicleForm: {
              vehicleType: x.product.vehicleType,
              spaceshipForm: {
                color: v.color,
                canFire: v.canFire,
                wingCount: v.wingCount,
                crewMembers: v.crewMembers,
              },
            },
          },
        };

        DOM.form.cy.should($el => {
          expect(getFormValue($el, VehicleType.SPACESHIP)).to.eql(expectedObj);
        });
      });

      it(`should be able to go from a spaceship to a speeder and update the form`, () => {
        DOM.list.elements.cy.eq(0).click();
        DOM.list.elements.cy.eq(1).click();

        const x = hardCodedListings[1] as VehicleListing;
        const v = x.product as Speeder;

        const expectedObj: FormElement = {
          title: x.title,
          price: '£' + x.price.toLocaleString(),
          inputs: {
            id: x.id,
            title: x.title,
            imageUrl: x.imageUrl,
            price: x.price + '',
            listingType: x.listingType,
            vehicleForm: {
              vehicleType: x.product.vehicleType,
              speederForm: {
                color: v.color,
                canFire: v.canFire,
                crewMembers: v.crewMembers,
                maximumSpeed: v.maximumSpeed,
              },
            },
          },
        };

        DOM.form.cy.should($el => {
          expect(getFormValue($el, VehicleType.SPEEDER)).to.eql(expectedObj);
        });
      });

      it(`should be able to go from a spaceship to a speeder AND back and restore the original value`, () => {
        DOM.list.elements.cy.eq(0).click();
        DOM.list.elements.cy.eq(1).click();
        DOM.list.elements.cy.eq(0).click();

        const x = hardCodedListings[0] as VehicleListing;
        const s = x.product as Spaceship;

        const expectedObj: FormElement = {
          title: x.title,
          price: '£' + x.price.toLocaleString(),
          inputs: {
            id: x.id,
            title: x.title,
            imageUrl: x.imageUrl,
            price: x.price + '',
            listingType: x.listingType,
            vehicleForm: {
              vehicleType: x.product.vehicleType,
              spaceshipForm: {
                color: s.color,
                canFire: s.canFire,
                crewMembers: s.crewMembers,
                wingCount: s.wingCount,
              },
            },
          },
        };

        DOM.form.cy.should($el => {
          expect(getFormValue($el, VehicleType.SPACESHIP)).to.eql(expectedObj);
        });
      });

      it(`should display the (nested) errors from the form`, () => {
        DOM.createNewButton.click();

        DOM.form.errors.should($el => {
          expect(extractErrors($el)).to.eql({
            listingType: {
              required: true,
            },
            title: {
              required: true,
            },
            imageUrl: {
              required: true,
            },
            price: {
              required: true,
            },
          });
        });

        DOM.form.elements.selectListingTypeByType(ListingType.VEHICLE);

        DOM.form.errors.should($el => {
          expect(extractErrors($el)).to.eql({
            vehicleProduct: {
              vehicleType: {
                required: true,
              },
            },
            title: {
              required: true,
            },
            imageUrl: {
              required: true,
            },
            price: {
              required: true,
            },
          });
        });

        DOM.form.elements.vehicleForm.selectVehicleTypeByType(VehicleType.SPACESHIP);

        DOM.form.errors.should($el => {
          expect(extractErrors($el)).to.eql({
            vehicleProduct: {
              spaceship: {
                color: {
                  required: true,
                },
                crewMembers: {
                  required: true,
                },
                wingCount: {
                  required: true,
                },
              },
            },
            title: {
              required: true,
            },
            imageUrl: {
              required: true,
            },
            price: {
              required: true,
            },
          });
        });

        DOM.form.elements.vehicleForm.addCrewMemberButton.click();

        if (id === 'old') {
          DOM.form.errors.should($el => {
            expect(extractErrors($el)).to.eql({
              vehicleProduct: {
                spaceship: {
                  color: {
                    required: true,
                  },
                  crewMembers: {
                    crewMembers: [
                      {
                        firstName: {
                          required: true,
                        },
                        lastName: {
                          required: true,
                        },
                      },
                    ],
                  },
                  wingCount: {
                    required: true,
                  },
                },
              },
              title: {
                required: true,
              },
              imageUrl: {
                required: true,
              },
              price: {
                required: true,
              },
            });
          });
        } else {
          DOM.form.errors.should($el => {
            expect(extractErrors($el)).to.eql({
              vehicleProduct: {
                spaceship: {
                  color: {
                    required: true,
                  },
                  crewMembers: {
                    crewMembers: {
                      0: {
                        firstName: {
                          required: true,
                        },
                        lastName: {
                          required: true,
                        },
                      },
                    },
                  },
                  wingCount: {
                    required: true,
                  },
                },
              },
              title: {
                required: true,
              },
              imageUrl: {
                required: true,
              },
              price: {
                required: true,
              },
            });
          });
        }

        DOM.form.elements.selectListingTypeByType(ListingType.DROID);

        DOM.form.errors.should($el => {
          expect(extractErrors($el)).to.eql({
            droidProduct: {
              droidType: {
                required: true,
              },
            },
            title: {
              required: true,
            },
            imageUrl: {
              required: true,
            },
            price: {
              required: true,
            },
          });
        });

        DOM.form.elements.droidForm.selectDroidTypeByType(DroidType.ASSASSIN);

        DOM.form.errors.should($el => {
          expect(extractErrors($el)).to.eql({
            droidProduct: {
              assassinDroid: {
                color: {
                  required: true,
                },
                name: {
                  required: true,
                },
                weapons: {
                  required: true,
                },
              },
            },
            title: {
              required: true,
            },
            imageUrl: {
              required: true,
            },
            price: {
              required: true,
            },
          });
        });

        DOM.form.elements.droidForm.name.type(`IG-86 sentinel`);

        DOM.form.errors.should($el => {
          expect(extractErrors($el)).to.eql({
            droidProduct: {
              assassinDroid: {
                color: {
                  required: true,
                },
                weapons: {
                  required: true,
                },
              },
            },
            title: {
              required: true,
            },
            imageUrl: {
              required: true,
            },
            price: {
              required: true,
            },
          });
        });
      });

      it(`should display no error when form is valid`, () => {
        // we want to make sure that it's easy to detect from the template that there's no error
        // previously we returned an empty object which made that check way harder in the template
        DOM.list.elements.cy.eq(0).click();

        DOM.form.errors.should('not.exist');
        DOM.form.noErrors.should('exist');
      });

      it(`should recursively disable the form when disabling the top formGroup`, () => {
        DOM.list.elements.cy.eq(0).click();

        DOM.form.cy.within(() => {
          cy.get(`mat-card`).within(() => {
            cy.get(`input`).should('be.enabled');
            cy.get(`mat-select`).should('not.have.class', 'mat-select-disabled');
            cy.get(`mat-slide-toggle`).should('not.have.class', 'mat-disabled');
            cy.get(`button`).should('be.enabled');
          });
        });

        DOM.readonlyToggle.click();

        DOM.form.cy.within(() => {
          cy.get(`mat-card`).within(() => {
            cy.get(`input`).should('be.disabled');
            cy.get(`mat-select`).should('have.class', 'mat-select-disabled');
            cy.get(`mat-slide-toggle`).should('have.class', 'mat-disabled');
            cy.get(`button`).should('be.disabled');
          });
        });
      });
    });
  });
});
