const fetchNotificationContent = async (url) => {
  try {
    let response = await fetch(url)
    let data = await response.json();
    if (!data instanceof Array) {
      return Promise.resolve([]);
    }
    return Promise.resolve(data);
  } catch (e) {
    return Promise.resolve([]);
  }
}

const getLocalNotificationContent = async () => {
  let data = await browser.storage.local.get("notificationContent");
  if (data?.notificationContent?.content) {
    return data.notificationContent.content;
  }
  return [];
}

const setLocalNotificationContent = async (value) => {
  let obj = {
    notificationContent: {
      content: value
    }
  }
  browser.storage.local.set(obj);
}

function parseJsonContentToDisplayableContent(data) {
  data = JSON.parse(JSON.stringify(data));
  data.forEach((content, i, array) => {
    let re = /<a/g;
    let match;
    while ((match = re.exec(content.content)) != null) {
      let index = match.index + 2;
      array[i].content = content.content.substring(0, index) + ` target="_blank" ` + content.content.substring(index + 1);
    }
    re = /href/g;
    while ((match = re.exec(content.content)) != null) {
      let index = match.index + 6;
      if (!content.content.substring(index, index + 4).includes("http")) {
        array[i].content = content.content.substring(0, index) + `https://` + content.content.substring(index);
      }
    }
  });
  return data;
}

const getNewJsonContent = (remoteData, localData) => {
  return remoteData.reduce((newContent, remoteContent) => {
    if (!localData.find(localContent => localContent.id === remoteContent.id)) {
      remoteContent.isRead = false;
      return [...newContent, remoteContent];
    }
    return newContent;
  }, []);
}

const countUnreadNotification = (data) => {
  return data.reduce((count, content) => {
    return content.isRead ? count : ++count;
  }, 0);
}

const removeOldNotification = async (threshold) => {
  let localData = await getLocalNotificationContent();
  if (localData.length > threshold) localData.splice(threshold);
  await setLocalNotificationContent(localData);
}
export {
  fetchNotificationContent,
  getLocalNotificationContent,
  setLocalNotificationContent,
  countUnreadNotification,
  removeOldNotification,
  getNewJsonContent,
  parseJsonContentToDisplayableContent
}