import {
  countUnreadNotification,
  fetchNotificationContent,
  getLocalNotificationContent,
  getNewJsonContent, parseJsonContentToDisplayableContent,
  removeOldNotification,
  setLocalNotificationContent,
} from "../../services/notification-service/notification-data-service.js";
import { displayNotificationCount, toggleNotificationDropdown } from "../../view/notification/notification-view.js";

async function main() {
  let localData = await getLocalNotificationContent();
  let remoteData = await fetchNotificationContent("https://raw.githubusercontent.com/katalon-studio/katalon-recorder/master/katalon/in-app-notifications.json");
  let newContent = getNewJsonContent(remoteData, localData);
  newContent = parseJsonContentToDisplayableContent(newContent);
  localData.push(...newContent);
  localData = localData.sort((firstContent, secondContent) => {
    return new Date(secondContent.date) - new Date(firstContent.date);
  });
  await setLocalNotificationContent(localData);

  let unreadNotificationNum = countUnreadNotification(localData);
  if (unreadNotificationNum > 0) {
    displayNotificationCount(unreadNotificationNum);
  }

  $("#notification").click(async function () {
    let localData = await getLocalNotificationContent();
    await toggleNotificationDropdown(localData);
  })
}

$(document).ready(function () {
  //$(document).ready does not work with async function
  main();
});

$(document).on("unload", function () {
  removeOldNotification(50);
})