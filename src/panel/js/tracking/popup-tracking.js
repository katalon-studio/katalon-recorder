function isObjectEmpty(obj){
  return obj &&
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
}

async function getTrackingPopupData() {
  let data = await browser.storage.local.get("popupTracking");
  if (isObjectEmpty(data)) {
    data = {
      rateOnStore: false
    }
    return data;
  }
  return data.popupTracking;
}

async function trackingRateOnStore(value) {
  const popupTracking = await getTrackingPopupData();
  popupTracking.rateOnStore = value.rateOnStore;
  await browser.storage.local.set({ popupTracking });
}

const setTrackingPopupData = async (type, value) => {
  switch (type) {
    case "rateOnStore":
      await trackingRateOnStore(value);
      break;
    default:
      throw `${type} is not supported`
  }
}

export { setTrackingPopupData, getTrackingPopupData }