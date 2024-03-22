import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import {
  AdventureRoutesCollection,
  CommentsCollection,
} from "/imports/api/adventureRoutes";

export const useAdventureRoutesForUser = () => {
  const userId = Meteor.userId();
  return useTracker(async () => {
    const subscription = Meteor.subscribe("adventureRoutesForUser");
    const adventureRoutes = userId
      ? await AdventureRoutesCollection.find({ userId }).fetchAsync()
      : [];
    return { data: adventureRoutes, isLoading: !subscription.ready() };
  }, []);
};

export const useAdventureRoute = (id: string) => {
  const userId = Meteor.userId();
  return useTracker(async () => {
    const subscription = Meteor.subscribe("adventureRouteById");
    const adventureRoute = userId
      ? await AdventureRoutesCollection.find({ _id: id }).fetchAsync()
      : [];
    return { data: adventureRoute[0], isLoading: !subscription.ready() };
  }, []);
};

export const useCommentsForAdventureRoute = (adventureRouteId: string) => {
  return useTracker(async () => {
    const subscription = Meteor.subscribe("commentsForAdventureRoute");
    const comments = await CommentsCollection.find({
      adventureRouteId,
    }).fetchAsync();
    return { data: comments, isLoading: !subscription.ready() };
  }, []);
};
