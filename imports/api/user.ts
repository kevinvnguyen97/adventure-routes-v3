import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { isValidEmail } from "/imports/utils";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";

Meteor.methods({
  changeUsername: (newUsername: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      Accounts.setUsername(userId, newUsername);
    }
  },
  changeEmail: (newEmail: string) => {
    const user = Meteor.user();
    const { emails = [], _id: userId } = user || {};

    if (!isValidEmail(newEmail)) {
      throw new Meteor.Error("invalid-input", "Email must be valid");
    }

    if (emails.length > 0 && !!userId && Meteor.isServer) {
      Accounts.removeEmail(userId, emails[0].address);
      Accounts.addEmail(userId, newEmail);
    }
  },
  changeProfilePicture: async (newProfilePictureUrl: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      await Meteor.users.updateAsync(
        { _id: userId },
        { $set: { "profile.profilePictureUrl": newProfilePictureUrl } }
      );
    }
  },
  changeFullName: async (args: { firstName: string; lastName: string }) => {
    const { firstName, lastName } = args;
    const userId = Meteor.userId();
    if (!!userId) {
      await Meteor.users.updateAsync(
        { _id: userId },
        {
          $set: {
            "profile.firstName": firstName,
            "profile.lastName": lastName,
          },
        }
      );
    }
  },
  changePhoneNumber: async (newPhoneNumber: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      if (!isValidPhoneNumber(newPhoneNumber, "US") || !newPhoneNumber) {
        throw new Meteor.Error("invalid-input", "Phone number is invalid");
      }
      await Meteor.users.updateAsync(
        { _id: userId },
        {
          $set: {
            "profile.phoneNumber": parsePhoneNumber(
              newPhoneNumber,
              "US"
            ).formatNational(),
          },
        }
      );
    }
  },
});
