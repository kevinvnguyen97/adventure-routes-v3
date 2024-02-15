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

export enum Color {
  WHITE = "#FFFFFF",
  MUTCD_GREEN = "#006B54",
}

export const humanReadableTravelMode: Record<google.maps.TravelMode, string> = {
  DRIVING: "Driving",
  BICYCLING: "Bicycling",
  TRANSIT: "Transit",
  WALKING: "Walking",
};

export enum MUTCDFont {
  CLEARVIEW = "Clearview 4W",
  HWYGOTHIC = "Highway Gothic Wide",
}
