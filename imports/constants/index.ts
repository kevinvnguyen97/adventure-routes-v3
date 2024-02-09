import { Meteor } from "meteor/meteor";
interface GoogleSecret {
  oauth: {
    googleMapsApiKey: string;
  };
  public: {
    oauth: {
      googleMapsApiKey: string;
    };
  };
}
export const GOOGLE_SECRETS = Meteor.settings as unknown as GoogleSecret;
export const MINIMUM_PASSWORD_LENGTH = 8;
export const MINIMUM_USERNAME_LENGTH = 8;
