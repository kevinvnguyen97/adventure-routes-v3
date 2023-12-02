import { Meteor } from "meteor/meteor";
import { AdventureRoute } from "/imports/api/adventureRoutes";

export async function meteorMethodPromise(
  name: "upsertAdventureRoute",
  adventureRoute: AdventureRoute
): Promise<void>;
export async function meteorMethodPromise(
  name: "deleteAdventureRoute",
  adventureRouteId: string
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
