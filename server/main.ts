import { Meteor } from "meteor/meteor";
import { AdventureRoutesCollection } from "/imports/api/adventureRoutes";
import { CommentsCollection } from "/imports/api/comments";

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
