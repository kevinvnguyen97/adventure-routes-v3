import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

export interface Comment {
  _id?: string;
  userId: string;
  adventureRouteId: string;
  date: Date;
  commentText: string;
  commentIdReplyFrom?: string;
  imageAttachmentUrl?: string;
  placeOfInterest?: google.maps.Place;
}

export const CommentsCollection = new Mongo.Collection<Comment>("comments");

Meteor.methods({
  upsertComment: async (comment: Comment) => {
    const { _id, ...commentFields } = comment;
    if (!comment.commentText) {
      throw new Meteor.Error("incomplete", "Field required");
    }
    await CommentsCollection.upsertAsync({ _id }, { $set: commentFields });
  },
  deleteComment: async (commentId: string) => {
    const userId = Meteor.userId();
    const commentToRemove = await CommentsCollection.findOneAsync({
      _id: commentId,
    });
    if (!commentToRemove) {
      throw new Meteor.Error("not-found", "Route not found to delete");
    }
    if (!userId) {
      throw new Meteor.Error("not-logged-in");
    }
    if (userId !== commentToRemove?.userId) {
      throw new Meteor.Error("not-authorized", "");
    }
    await CommentsCollection.removeAsync({ _id: commentId });
  },
});
