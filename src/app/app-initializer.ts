import { RealmAppService } from "./realm-app.service";
import { UserService } from "./user.service";
import { getRandomUsername } from "./usernames";

export function initializeApp(realmAppService: RealmAppService, userService: UserService) {
  return () => new Promise(async (resolve, reject) => {
    try {
      const app = await realmAppService.getAppInstance();
      const username = getRandomUsername();
      userService.username = username;

      return resolve(app);
    } catch (err) {
      console.error(err);
      return reject(err);
    }
  });
}