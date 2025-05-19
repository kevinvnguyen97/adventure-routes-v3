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
export type AdventureRouteInput = Omit<AdventureRoute, "userId">;

export const AdventureRoutesCollection = new Mongo.Collection<AdventureRoute>(
  "adventureRoutes"
);

Meteor.methods({
  upsertAdventureRoute: async (adventureRoute: AdventureRouteInput) => {
    const [user, previousInfo] = await Promise.all([
      Meteor.userAsync(),
      AdventureRoutesCollection.findOneAsync({ _id: adventureRoute._id }),
    ]);
    const userId = user?._id;
    if (!userId || (previousInfo && userId !== previousInfo?.userId)) {
      throw new Meteor.Error(
        "not-authorized",
        "Editing routes from other users not allowed"
      );
    }
    const { _id, ...adventureRouteFields } = adventureRoute;
    await AdventureRoutesCollection.upsertAsync(
      { _id },
      { $set: { userId, ...adventureRouteFields } }
    );
  },
  deleteAdventureRoute: async (adventureRouteId: string) => {
    const [user, adventureRoute] = await Promise.all([
      Meteor.userAsync(),
      AdventureRoutesCollection.findOneAsync({
        _id: adventureRouteId,
      }),
    ]);
    const userId = user?._id;
    if (userId !== adventureRoute?.userId) {
      throw new Meteor.Error("not-authorized");
    }
    await AdventureRoutesCollection.removeAsync({ _id: adventureRouteId });
  },
});
