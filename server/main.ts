import { Meteor } from "meteor/meteor";
import {
  AdventureRoutesCollection,
  CommentsCollection,
} from "/imports/api/adventureRoutes";

Meteor.startup(async () => {
  AdventureRoutesCollection.createIndex({ userId: -1 });
  CommentsCollection.createIndex({ _id: -1 });
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
  return AdventureRoutesCollection.find({ _id: id, userId });
});

Meteor.publish("commentsForAdventureRoute", (adventureRouteId: string) => {
  return CommentsCollection.find({ adventureRouteId });
});

// @ts-ignore
Meteor.publish("getUserInfo", (userId: string) => {
  return Meteor.users.findOne(
    { _id: userId },
    { fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 } }
  );
});
