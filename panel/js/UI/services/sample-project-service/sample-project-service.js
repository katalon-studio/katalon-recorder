import { unmarshall } from "../helper-service/parser.js";
import { addTestSuite } from "../data-service/test-suite-service.js"
import { getTrackingPlayBackData } from "../tracking-service/playback-local-tracking.js";
import { trackingSegment } from "../tracking-service/segment-tracking-service.js";
import { sampleData } from "./sample-data.js";

/**
 * add Sample project data to in-memory data objects
 * @param {Object[]} sampleData
 * @param {number[]} selectedSampleIndexes - list of sample data indexes that will be added to data o
 * @returns {TestSuite[]}
 */
const addSampleData = (sampleData, selectedSampleIndexes) => {
  if (sampleData === undefined || sampleData === null) {
    throw "Null or undefined sampleData";
  }
  if (selectedSampleIndexes === undefined || selectedSampleIndexes === null) {
    throw "Null or undefined selectedSampleIndexes";
  }
  const samples = sampleData.filter((sampleData, index) => selectedSampleIndexes.includes(index));
  const sampleTestSuites = [];
  for (const sample of samples) {
    const testSuiteHTMLString = sample.testSuite;
    const testSuiteName = sample.testSuiteName;
    const testSuite = unmarshall(testSuiteName, testSuiteHTMLString);
    addTestSuite(testSuite);
    sampleTestSuites.push(testSuite);
    //load data files
    if (sample.data) {
      dataFiles = Object.assign(dataFiles, sample.data);
      saveDataFiles();
    }
  }

  return sampleTestSuites;
}


const sampleDataTrackingService = async (sampleData, selectedSampleIndexes) => {
  const selectedSampleProjectNames = sampleData.filter((sampleData, index) => selectedSampleIndexes.includes(index)).map(sample => sample.projectName);
  let playBackTrackingData = await getTrackingPlayBackData();
  let numOfExecution = playBackTrackingData.playTestCaseFail + playBackTrackingData.playTestCaseSuccess;
  let alreadyAddedSampleProject = browser.storage.local.get("addSample")?.addSample;
  if(!alreadyAddedSampleProject) {
    browser.storage.local.set({ addSample: { isAddSample: true, numOfExecution } });
  }
  trackingSegment("kru_add_sample_project", { projectName: selectedSampleProjectNames });
}

export { addSampleData, sampleDataTrackingService, sampleData }