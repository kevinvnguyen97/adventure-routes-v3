import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export interface AdventureRoute {
  _id?: string;
  userId: string;
  pictureUrl?: string;
  name: string;
  priceCategory?: number;
  activities?: string[];
  description?: string;
  route: {
    origin: string;
    waypoints?: string[];
    destination: string;
  };
}

export const AdventureRoutesCollection = new Mongo.Collection<AdventureRoute>(
  "adventureRoutes"
);

Meteor.methods({
  upsertAdventureRoute: async (adventureRoute: AdventureRoute) => {
    const { _id, ...adventureRouteFields } = adventureRoute;
    await AdventureRoutesCollection.upsertAsync(
      { _id },
      { $set: adventureRouteFields }
    );
  },
  deleteAdventureRoute: async (adventureRouteId: string) => {
    await AdventureRoutesCollection.removeAsync({ _id: adventureRouteId });
  },
  changeUsername: (newUsername: string) => {
    const userId = Meteor.userId();
    if (!!userId) {
      Accounts.setUsername(userId, newUsername);
    }
  },
  changeEmail: (newEmail: string) => {
    const user = Meteor.user();
    const { emails = [], _id: userId } = user || {};

    if (emails.length > 0 && !!userId && Meteor.isServer) {
      Accounts.removeEmail(userId, emails[0].address);
      Accounts.addEmail(userId, newEmail);
    }
  },
});
