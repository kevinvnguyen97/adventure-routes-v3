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
