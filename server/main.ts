import { Meteor } from "meteor/meteor";
import { AdventureRoutesCollection } from "/imports/api/adventureRoutes";
import { CommentsCollection } from "/imports/api/comments";
import { isValidPhoneNumber, parsePhoneNumber } from "libphonenumber-js";
import { Accounts } from "meteor/accounts-base";
import { isValidEmail } from "/imports/utils";

Meteor.startup(async () => {
  await Promise.all([
    AdventureRoutesCollection.createIndexAsync({ userId: -1 }),
    CommentsCollection.createIndexAsync({ _id: -1 }),
  ]);
});

Meteor.publish("adventureRoutesForUser", (userId: string) => {
  return AdventureRoutesCollection.find({ userId });
});
Meteor.publish("adventureRouteById", (id: string) => {
  const userId = Meteor.userId();
  if (!userId) {
    console.error("User is not logged in.");
    throw new Meteor.Error("not-logged-in", "User is not logged in.");
  }
  return AdventureRoutesCollection.find({ _id: id }, { limit: 1 });
});
Meteor.publish("commentsForAdventureRoute", (adventureRouteId: string) => {
  return CommentsCollection.find({ adventureRouteId });
});
Meteor.publish("getUserInfo", (userId: string) => {
  return Meteor.users.find(
    { _id: userId },
    {
      fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 },
      limit: 1,
    }
  );
});
Meteor.publish("getAllUsers", () => {
  const userId = Meteor.userId() ?? "";
  return Meteor.users.find(
    { _id: { $not: { $eq: userId } } },
    { sort: { username: 1 } }
  );
});

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
      Accounts.addEmail(userId, newEmail);
      Accounts.removeEmail(userId, emails[0].address);
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
