import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import {
  AdventureRoutesCollection,
  CommentsCollection,
} from "/imports/api/adventureRoutes";

export const useAdventureRoutesForUser = (userId: string) => {
  return useTracker(() => {
    const subscription = Meteor.subscribe("adventureRoutesForUser", userId);
    const adventureRoutes = userId
      ? AdventureRoutesCollection.find({ userId }).fetch()
      : [];
    return { data: adventureRoutes, isLoading: !subscription.ready() };
  }, [userId]);
};

export const useAdventureRoute = (id: string) => {
  const userId = Meteor.userId();
  return useTracker(() => {
    const subscription = Meteor.subscribe("adventureRouteById", id);
    const adventureRoute = userId
      ? AdventureRoutesCollection.find({ _id: id }).fetch()
      : [];
    return { data: adventureRoute[0], isLoading: !subscription.ready() };
  }, [userId, id]);
};

export const useCommentsForAdventureRoute = (adventureRouteId: string = "") => {
  return useTracker(() => {
    const subscription = Meteor.subscribe(
      "commentsForAdventureRoute",
      adventureRouteId
    );
    const comments = adventureRouteId
      ? CommentsCollection.find({ adventureRouteId }).fetch()
      : [];
    return { data: comments, isLoading: !subscription.ready() };
  }, [adventureRouteId]);
};

export const useUserInfo = (userId: string) => {
  return useTracker(() => {
    const subscription = Meteor.subscribe("getUserInfo", userId);
    const user = Meteor.users.findOne(
      { _id: userId },
      { fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 } }
    );
    return { data: user as Meteor.User, isLoading: !subscription.ready() };
  }, [userId]);
};
