this.name = "katalon";

function indents(num) {
    return '';
}

function statement(expression) {
    return expression.toString();
}

this.options = {
    receiver: "selenium",
    environment: "*chrome",
    packageName: "com.example.tests",
    superClass: "GroovySeleneseTestCase",
    indent: 'tab',
    initialIndents: '2',
    defaultExtension: "groovy"
};

options.header =
"import static com.kms.katalon.core.checkpoint.CheckpointFactory.findCheckpoint\n" + 
"import static com.kms.katalon.core.testcase.TestCaseFactory.findTestCase\n" + 
"import static com.kms.katalon.core.testdata.TestDataFactory.findTestData\n" + 
"import static com.kms.katalon.core.testobject.ObjectRepository.findTestObject\n" + 
"import com.kms.katalon.core.checkpoint.Checkpoint as Checkpoint\n" + 
"import com.kms.katalon.core.checkpoint.CheckpointFactory as CheckpointFactory\n" + 
"import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as MobileBuiltInKeywords\n" + 
"import com.kms.katalon.core.model.FailureHandling as FailureHandling\n" + 
"import com.kms.katalon.core.testcase.TestCase as TestCase\n" + 
"import com.kms.katalon.core.testcase.TestCaseFactory as TestCaseFactory\n" + 
"import com.kms.katalon.core.testdata.TestData as TestData\n" + 
"import com.kms.katalon.core.testdata.TestDataFactory as TestDataFactory\n" + 
"import com.kms.katalon.core.testobject.ObjectRepository as ObjectRepository\n" + 
"import com.kms.katalon.core.testobject.TestObject as TestObject\n" + 
"import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WSBuiltInKeywords\n" + 
"import com.kms.katalon.core.webui.driver.DriverFactory as DriverFactory\n" + 
"import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUiBuiltInKeywords\n" + 
"import internal.GlobalVariable as GlobalVariable\n" + 
"import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI\n" + 
"import com.kms.katalon.core.mobile.keyword.MobileBuiltInKeywords as Mobile\n" + 
"import com.kms.katalon.core.webservice.keyword.WSBuiltInKeywords as WS\n" +
"\n" +
"import com.thoughtworks.selenium.Selenium\n" +
"import org.openqa.selenium.firefox.FirefoxDriver\n" +
"import org.openqa.selenium.WebDriver\n" +
"import com.thoughtworks.selenium.webdriven.WebDriverBackedSelenium\n" +
"import static org.junit.Assert.*\n" +
"import java.util.regex.Pattern\n" +
"import static org.apache.commons.lang3.StringUtils.join\n" +
"\n" +
"WebUI.openBrowser('${baseURL}')\n" +
"def driver = DriverFactory.getWebDriver()\n" +
'String baseUrl = "${baseURL}"\n' +
'selenium = new WebDriverBackedSelenium(driver, baseUrl)\n';

options.footer = '';