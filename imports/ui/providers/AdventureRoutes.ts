import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import { AdventureRoutesCollection } from "/imports/api/adventureRoutes";
import { CommentsCollection } from "/imports/api/comments";

export const useAdventureRoutesForUser = (userId: string) => {
  return useTracker(async () => {
    const subscription = Meteor.subscribe("adventureRoutesForUser", userId);
    const adventureRoutes = userId
      ? await AdventureRoutesCollection.find({ userId }).fetchAsync()
      : [];
    return { data: adventureRoutes, isLoading: !subscription.ready() };
  }, [userId]);
};

export const useAdventureRoute = async (id: string) => {
  const userId = Meteor.userId();
  return useTracker(async () => {
    const subscription = Meteor.subscribe("adventureRouteById", id);
    const adventureRoute = await AdventureRoutesCollection.findOneAsync({
      _id: id,
    });
    return { data: adventureRoute, isLoading: !subscription.ready() };
  }, [userId, id]);
};

export const useCommentsForAdventureRoute = (adventureRouteId: string) => {
  return useTracker(async () => {
    const subscription = Meteor.subscribe(
      "commentsForAdventureRoute",
      adventureRouteId
    );
    const comments = adventureRouteId
      ? await CommentsCollection.find(
          { adventureRouteId },
          { sort: { date: -1 } }
        ).fetchAsync()
      : [];
    return { data: comments, isLoading: !subscription.ready() };
  }, [adventureRouteId]);
};

export const useUserInfo = (userId: string) => {
  return useTracker(async () => {
    const subscription = Meteor.subscribe("getUserInfo", userId);
    const user = await Meteor.users.findOneAsync(
      { _id: userId },
      {
        fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 },
        limit: 1,
      }
    );
    return { data: user, isLoading: !subscription.ready() };
  }, [userId]);
};

export const useAllUsers = () => {
  return useTracker(async () => {
    const userId = Meteor.userId() ?? "";
    const subscription = Meteor.subscribe("getAllUsers");
    const users = await Meteor.users
      .find(
        { _id: { $not: { $eq: userId } } },
        {
          fields: { userId: 1, username: 1, "profile.profilePictureUrl": 1 },
          sort: { username: 1 },
        }
      )
      .fetchAsync();
    return { data: users, isLoading: !subscription.ready() };
  });
};
