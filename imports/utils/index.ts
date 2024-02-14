import { Meteor } from "meteor/meteor";
import { AdventureRoute } from "/imports/api/adventureRoutes";

const VALID_EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export async function meteorMethodPromise(
  name: "upsertAdventureRoute",
  adventureRoute: AdventureRoute
): Promise<void>;
export async function meteorMethodPromise(
  name: "deleteAdventureRoute",
  adventureRouteId: string
): Promise<void>;
export async function meteorMethodPromise(
  name: "changeUsername",
  newUsername: string
): Promise<void>;
export async function meteorMethodPromise<TReturn, TArgs extends any[]>(
  name: string,
  ...args: TArgs
): Promise<TReturn> {
  return new Promise((resolve, reject) => {
    Meteor.call(name, ...args, (e: Meteor.Error | null, r: TReturn) => {
      if (e) {
        reject(e);
      } else {
        resolve(r);
      }
    });
  });
}

export const isValidEmail = (email: string) => VALID_EMAIL_REGEX.test(email);

export const formatDuration = (numberOfSeconds: number) => {
  const numberOfHours = numberOfSeconds / 60 / 60;
  const numberOfMinutes = Math.round((numberOfHours % 1) * 60);

  const formattedHours =
    Math.trunc(numberOfHours) > 0
      ? `${Math.trunc(numberOfHours)} ${numberOfHours === 1 ? "hour" : "hours"}`
      : "";
  const formattedMinutes =
    numberOfMinutes > 0
      ? `${numberOfMinutes} ${numberOfMinutes === 1 ? "min" : "mins"}`
      : "";
  const formattedDuration = [formattedHours, formattedMinutes]
    .filter(Boolean)
    .join(" ");

  return formattedDuration;
};

export const formatMetricDistance = (numberOfMeters: number) => {
  if (numberOfMeters < 1000) {
    return `${numberOfMeters} m`;
  }
  const numberOfKilometers = numberOfMeters / 1000;
  if (numberOfKilometers < 100) {
    return `${numberOfKilometers.toFixed(1)} km`;
  } else {
    return `${Math.round(numberOfKilometers)} km`;
  }
};

export const formatImperialDistance = (numberOfMeters: number) => {
  const numberOfFeet = numberOfMeters * 3.280839895;
  if (numberOfFeet < 528) {
    return `${numberOfFeet} ft`;
  }

  const numberOfMiles = numberOfFeet / 5280;
  if (numberOfMiles < 100) {
    return `${numberOfMiles.toFixed(1)} mi`;
  } else {
    return `${Math.round(numberOfMiles).toLocaleString("en-US")} mi`;
  }
};
