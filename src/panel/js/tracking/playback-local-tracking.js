function isObjectEmpty(obj) {
  return obj &&
    Object.keys(obj).length === 0 &&
    obj.constructor === Object
}

async function getTrackingPlayBackData() {
  let data = await browser.storage.local.get("playbackTracking");
  if (isObjectEmpty(data)) {
    data = {
      recordNum: 0,
      playTestCaseSuccess: 0,
      playTestCaseFail: 0,
      selfHealing: 0
    }
    return data;
  }
  return data.playbackTracking;

}

const trackingLocalPlayback = async (type, status) => {
  switch (type) {
    case "record":
      await trackingRecord();
      break;
    case "executeTestCase":
      if (status === undefined) {
        throw "status cannot be undefined";
      }
      await trackingTestCase(status);
      break;
    case "selfHealing":
      await trackingSelfHealing(status);
      break;
    default:
      throw `${type} is not supported`
  }
}

const trackingRecord = async () => {
  const playbackTracking = await getTrackingPlayBackData();
  playbackTracking.recordNum++;
  await browser.storage.local.set({ playbackTracking });
}

const trackingTestCase = async (status) => {
  const playbackTracking = await getTrackingPlayBackData();
  if (status) {
    playbackTracking.playTestCaseSuccess++;
  } else {
    playbackTracking.playTestCaseFail++;
  }
  await browser.storage.local.set({ playbackTracking });
}

const trackingSelfHealing = async (status) =>{
  if (status){
    const playbackTracking = await getTrackingPlayBackData();
    playbackTracking.selfHealing++;
    await browser.storage.local.set({ playbackTracking });
  }

}

const getChangedProperty = (oldValue, newValue) => {
  if (oldValue === undefined) {
    oldValue = {
      recordNum: 0,
      playTestCaseSuccess: 0,
      playTestCaseFail: 0,
    }
  }
  if (oldValue && newValue) {
    return Object.keys(oldValue).find(key => oldValue[key] !== newValue[key]);
  }
}

const isUserFirstTime = (data) => {
  return Object.values(data).every(value => value === 0);
}

export { trackingLocalPlayback, getTrackingPlayBackData, getChangedProperty, isUserFirstTime }