import {
  countUnreadNotification,
  getLocalNotificationContent,
  setLocalNotificationContent
} from "../../services/notification-service/notification-data-service.js";

const displayNotificationCount = (count) => {
  let countSymbol = $("#notification-count");
  if (count === 0) {
    if (countSymbol.length > 0) {
      $(countSymbol).hide();
    }
    return;
  }
  if (countSymbol.length === 0) {
    let notificationIcon = $("#notification");
    countSymbol = $("<div id='notification-count'></div>").html(`<div>${count}</div>`);
    $(notificationIcon).append($(countSymbol));
  } else {
    $(countSymbol).html(`<div>${count}</div>`).show();
  }

}

function popupNotificationDialog(html) {
  let popup = $("#notificationDialog");
  if (popup.length) {
    $(popup).show()
    return;
  }
  popup = $('<div id="notificationDialog"></div>').html(html);
  $("body").append(popup);
  popup.show();
  attachEvent();
}

const toggleNotificationDropdown = async (localContentData) => {
  let popup = $("#notificationDialog");
  if ($(popup).is(':visible')) {
    popup.hide();
    return;
  }
  let htmlList = localContentData.map(content => {
    let checked = content.isRead ? "checked" : "";
    return `<div id="noti-${content.id}" class="notification">
                <div class="noti-type">
                    <div class="noti-${content.type}"></div>
                </div>
                <div class="noti-content">
                    <p class="title">${content.title}</p>
                    <p class="content">${content.content}</p>
                </div>
                <div class="noti-time">
                    ${getTimeDifferent(content.date)}
                </div>
                <div class="noti-read">
                    <input type="radio" title="Mark as read" value="${content.id}" ${checked}/>    
                    <div class="checkmark"></div>
                </div>    
              </div>`;
  });
  let header = `<div class='header'>
                    <div class="title">Notifications</div>
                    <div id="noti-markAll">Mark all as read</div>
                </div>`

  let html;
  if (htmlList.length === 0) {
    html = header + `<div class="noti-empty">No notifications</div>`
  } else {
    html = header + htmlList.join("");

  }
  popupNotificationDialog(html);
}

async function markAsRead(notificationID) {
  let localData = await getLocalNotificationContent();
  localData.forEach((content, index, list) => {
    if (content.id === notificationID) {
      list[index].isRead = true;
    }
  });
  let count = countUnreadNotification(localData);
  displayNotificationCount(count);
  await setLocalNotificationContent(localData);
}

async function markAllAsRead() {
  let localData = await getLocalNotificationContent();
  localData.forEach((content, index, list) => {
    list[index].isRead = true;
  });
  displayNotificationCount(0);
  await setLocalNotificationContent(localData);
}

function attachEvent() {
  $("#noti-markAll").click(async function () {
    $(".noti-read input").prop("checked", true);
    await markAllAsRead();
  });
  $(".noti-read input").on("change", async function () {
    let notificationID = $(this).val();
    await markAsRead(notificationID);
    $(this).attr('disabled', true);
  });

}

function getTimeDifferent(date) {
  let milli = new Date() - new Date(date);
  let days = Math.round(milli / 1000 / 60 / 60 / 24);
  if (days <= 1) return "1 day ago";
  if (days < 7) return `${Math.round(days)} days ago`
  let weeks = Math.round(days / 7);
  if (weeks <= 1) return "1 week ago";
  if (weeks < 4) return `${Math.round(weeks)} weeks ago`;
  let months = Math.round(weeks / 4);
  if (months <= 1) return "1 month ago";
  if (months <= 12) return `${Math.round(months)} year ago`
  let years = Math.round(months / 12);
  if (years <= 1) return "1 year ago";
  return `${years} years ago`
}

export { displayNotificationCount, toggleNotificationDropdown }