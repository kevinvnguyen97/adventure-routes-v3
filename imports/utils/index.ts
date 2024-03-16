import { Meteor } from "meteor/meteor";
import { AdventureRoute } from "/imports/api/adventureRoutes";
import { Color } from "/imports/constants";

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
export async function meteorMethodPromise(
  name: "changeEmail",
  newEmail: string
): Promise<void>;
export async function meteorMethodPromise(
  name: "changeProfilePicture",
  newProfilePictureUrl: string
): Promise<void>;
export async function meteorMethodPromise(
  name: "changeFullName",
  args: { firstName: string; lastName: string }
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
  const numberOfDays = numberOfSeconds / 60 / 60 / 24;
  const numberOfHours = (numberOfDays % 1) * 24;
  const numberOfMinutes = Math.round((numberOfHours % 1) * 60);

  const formattedDays =
    Math.trunc(numberOfDays) > 0
      ? `${Math.trunc(numberOfDays)} ${
          Math.trunc(numberOfDays) === 1 ? "day" : "days"
        }`
      : "";
  const formattedHours =
    Math.trunc(numberOfHours) > 0
      ? `${
          Math.trunc(numberOfDays) < 1
            ? Math.trunc(numberOfHours)
            : Math.round(numberOfHours)
        } ${Math.trunc(numberOfHours) === 1 ? "hour" : "hours"}`
      : "";
  const formattedMinutes =
    numberOfMinutes > 0 && numberOfDays < 1
      ? `${numberOfMinutes} ${numberOfMinutes === 1 ? "min" : "mins"}`
      : "";
  const formattedDuration = [formattedDays, formattedHours, formattedMinutes]
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
    return `${Math.round(numberOfKilometers).toLocaleString("en-US")} km`;
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

/** Determines if the text color should be black or white based on the background color.
 * @param backgroundColor The background color for the text. Must be in six-digit hex form. (ex: #A0DB22)
 */
export const getTextColorBasedOnBackground = (backgroundColor: string) => {
  const backgroundColorWithoutHash = backgroundColor.replaceAll("#", "");
  const hexSplit = backgroundColorWithoutHash
    .toUpperCase()
    .match(/[0-9A-F]{2}/g);

  const redValue = parseInt(hexSplit![0], 16);
  const greenValue = parseInt(hexSplit![1], 16);
  const blueValue = parseInt(hexSplit![2], 16);

  const brightness = Math.round(
    (redValue * 299 + greenValue * 587 + blueValue * 114) / 1000
  );

  const textColor = brightness > 125 ? Color.BLACK : Color.WHITE;

  return textColor;
};

export { formatDirections } from "./formatDirections";

export const getTotalDistance = (legs: google.maps.DirectionsLeg[]) => {
  return (
    legs
      .map(({ distance }) => distance?.value ?? 0)
      .reduce(
        (accumulatedDistance, legDistance) => accumulatedDistance + legDistance
      ) ?? 0
  );
};

export const getTotalDuration = (
  legs: google.maps.DirectionsLeg[],
  inTraffic?: boolean
) => {
  return (
    legs
      .map(
        ({ duration, duration_in_traffic }) =>
          (inTraffic && !!duration_in_traffic ? duration_in_traffic : duration)
            ?.value ?? 0
      )
      .reduce(
        (accumulatedDuration, legDuration) => accumulatedDuration + legDuration
      ) ?? 0
  );
};
