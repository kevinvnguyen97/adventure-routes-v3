import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AdventureRoutesCollection } from "/imports/api/adventureRoutes";
import { CommentsCollection } from "/imports/api/comments";

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
      ? CommentsCollection.find(
          { adventureRouteId },
          { sort: { date: -1 } }
        ).fetch()
      : [];
    return { data: comments, isLoading: !subscription.ready() };
  }, [adventureRouteId]);
};

export const useUserInfo = (userId: string) => {
  return useTracker(() => {
    const subscription = Meteor.subscribe("getUserInfo", userId);
    const users = Meteor.users
      .find(
        { _id: userId },
        {
          fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 },
          limit: 1,
        }
      )
      .fetch();
    return { data: users[0], isLoading: !subscription.ready() };
  }, [userId]);
};

export const useAllUsers = () => {
  return useTracker(() => {
    const userId = Meteor.userId() ?? "";
    const subscription = Meteor.subscribe("getAllUsers");
    const users = Meteor.users
      .find(
        { _id: { $not: { $eq: userId } } },
        {
          fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 },
          sort: { username: 1 },
        }
      )
      .fetch();
    return { data: users, isLoading: !subscription.ready() };
  });
};
