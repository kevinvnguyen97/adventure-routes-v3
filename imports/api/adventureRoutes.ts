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
    const userId = Meteor.userId();
    if (userId !== adventureRoute._id) {
      throw new Meteor.Error("not-authorized");
    }
    const { _id, ...adventureRouteFields } = adventureRoute;
    await AdventureRoutesCollection.upsertAsync(
      { _id },
      { $set: adventureRouteFields }
    );
  },
  deleteAdventureRoute: async (adventureRouteId: string) => {
    const userId = Meteor.userId();
    const adventureRoute = AdventureRoutesCollection.findOne({
      _id: adventureRouteId,
    });
    if (userId !== adventureRoute?.userId) {
      throw new Meteor.Error("not-authorized");
    }
    await AdventureRoutesCollection.removeAsync({ _id: adventureRouteId });
  },
});
