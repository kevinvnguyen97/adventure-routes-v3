declare module "meteor/meteor" {
  module Meteor {
    interface User {
      _id: string;
      createdAt?: Date;
      emails?: Meteor.UserEmail[];
      profile?: {
        firstName: string;
        lastName: string;
        phoneNumber: string;
        profilePictureUrl: string;
      };
      services?: any;
      username?: string;
    }
  }
}
