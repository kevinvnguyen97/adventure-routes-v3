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
  upsertAdventureRoute: (adventureRoute: AdventureRoute) => {
    const { _id, ...adventureRouteFields } = adventureRoute;
    AdventureRoutesCollection.upsert({ _id }, { $set: adventureRouteFields });
  },
  deleteAdventureRoute: (adventureRouteId: string) => {
    AdventureRoutesCollection.remove({ _id: adventureRouteId });
  },
});
