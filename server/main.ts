import { Meteor } from "meteor/meteor";
import { AdventureRoutesCollection } from "/imports/api/adventureRoutes";

Meteor.startup(async () => {
  AdventureRoutesCollection.createIndex({ userId: -1 });
});

Meteor.publish("adventureRoutesForUser", () => {
  const userId = Meteor.userId();
  if (!userId) {
    console.error("User is not logged in.");
    throw new Meteor.Error("not-logged-in", "User is not logged in.");
  }
  return AdventureRoutesCollection.find({ userId });
});

Meteor.publish("adventureRouteById", (id: string) => {
  const userId = Meteor.userId();
  if (!userId) {
    console.error("User is not logged in.");
    throw new Meteor.Error("not-logged-in", "User is not logged in.");
  }
  return AdventureRoutesCollection.find({ _id: id, userId });
});
