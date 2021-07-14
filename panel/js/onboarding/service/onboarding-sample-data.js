function addSampleCSVData() {
  const sampleCSVData = `{"sample_data.csv":{"content":"visit_date,comment\\r\\n26/10/1984,what a life\\r\\n1/10/1996,what a death","type":"csv"}}`;
  dataFiles = JSON.parse(sampleCSVData);
  saveDataFiles();
}

async function addOnboardingSampleData() {
  let savedData = await browser.storage.local.get("data");
  let existingData = Object.assign([], savedData.data);
  let sampleData =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n' +
    '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">\n' +
    "<head>\n" +
    '\t<meta content="text/html; charset=UTF-8" http-equiv="content-type" />\n' +
    "\t<title>Product Tour Sample Test Suite</title>\n" +
    "</head>\n" +
    "<body>\n" +
    '<table cellpadding="1" cellspacing="1" border="1">\n' +
    "<thead>\n" +
    '<tr><td rowspan="1" colspan="3">Book a healthcare appointment</td></tr>\n' +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr><td>open</td><td>https://katalon-demo-cura.herokuapp.com/profile.php#login<datalist><option>https://katalon-demo-cura.herokuapp.com/profile.php#login</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>//input[@value='John Doe']<datalist><option>//input[@value='John Doe']</option><option>//section[@id='login']/div/div/div[2]/form/div/div/div/div/input</option><option>//input</option><option>css=input.form-control</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt-username<datalist><option>id=txt-username</option><option>name=username</option><option>//input[@id='txt-username']</option><option>//section[@id='login']/div/div/div[2]/form/div[2]/div/input</option><option>//div[2]/div/input</option><option>css=#txt-username</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt-username<datalist><option>id=txt-username</option><option>name=username</option><option>//input[@id='txt-username']</option><option>//section[@id='login']/div/div/div[2]/form/div[2]/div/input</option><option>//div[2]/div/input</option><option>css=#txt-username</option></datalist></td><td>John Doe</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>//input[@value='ThisIsNotAPassword']<datalist><option>//input[@value='ThisIsNotAPassword']</option><option>//section[@id='login']/div/div/div[2]/form/div/div[2]/div/div/input</option><option>//div[2]/div/div/input</option><option>css=div.col-sm-offset-4.col-sm-8 &gt; div.input-group &gt; input.form-control</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt-password<datalist><option>id=txt-password</option><option>name=password</option><option>//input[@id='txt-password']</option><option>//section[@id='login']/div/div/div[2]/form/div[3]/div/input</option><option>//div[3]/div/input</option><option>css=#txt-password</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt-password<datalist><option>id=txt-password</option><option>name=password</option><option>//input[@id='txt-password']</option><option>//section[@id='login']/div/div/div[2]/form/div[3]/div/input</option><option>//div[3]/div/input</option><option>css=#txt-password</option></datalist></td><td>ThisIsNotAPassword</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=btn-login<datalist><option>id=btn-login</option><option>//button[@id='btn-login']</option><option>//section[@id='login']/div/div/div[2]/form/div[4]/div/button</option><option>//button</option><option>css=#btn-login</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=combo_facility<datalist><option>id=combo_facility</option><option>name=facility</option><option>//select[@id='combo_facility']</option><option>//section[@id='appointment']/div/div/form/div/div/select</option><option>//select</option><option>css=#combo_facility</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>select</td><td>id=combo_facility<datalist><option>id=combo_facility</option><option>name=facility</option><option>//select[@id='combo_facility']</option><option>//section[@id='appointment']/div/div/form/div/div/select</option><option>//select</option><option>css=#combo_facility</option></datalist></td><td>label=Hongkong CURA Healthcare Center</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=chk_hospotal_readmission<datalist><option>id=chk_hospotal_readmission</option><option>name=hospital_readmission</option><option>//input[@id='chk_hospotal_readmission']</option><option>//section[@id='appointment']/div/div/form/div[2]/div/label/input</option><option>//input</option><option>css=#chk_hospotal_readmission</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=radio_program_medicaid<datalist><option>id=radio_program_medicaid</option><option>//input[@id='radio_program_medicaid']</option><option>//section[@id='appointment']/div/div/form/div[3]/div/label[2]/input</option><option>//label[2]/input</option><option>css=#radio_program_medicaid</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt_visit_date<datalist><option>id=txt_visit_date</option><option>name=visit_date</option><option>//input[@id='txt_visit_date']</option><option>//section[@id='appointment']/div/div/form/div[4]/div/div/input</option><option>//div/input</option><option>css=#txt_visit_date</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt_visit_date<datalist><option>id=txt_visit_date</option><option>name=visit_date</option><option>//input[@id='txt_visit_date']</option><option>//section[@id='appointment']/div/div/form/div[4]/div/div/input</option><option>//div/input</option><option>css=#txt_visit_date</option></datalist></td><td>26/10/1992</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt_comment<datalist><option>id=txt_comment</option><option>name=comment</option><option>//textarea[@id='txt_comment']</option><option>//section[@id='appointment']/div/div/form/div[5]/div/textarea</option><option>//textarea</option><option>css=#txt_comment</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt_comment<datalist><option>id=txt_comment</option><option>name=comment</option><option>//textarea[@id='txt_comment']</option><option>//section[@id='appointment']/div/div/form/div[5]/div/textarea</option><option>//textarea</option><option>css=#txt_comment</option></datalist></td><td>What a beautiful day for a healthcare appointment!</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=btn-book-appointment<datalist><option>id=btn-book-appointment</option><option>//button[@id='btn-book-appointment']</option><option>//section[@id='appointment']/div/div/form/div[6]/div/button</option><option>//button</option><option>css=#btn-book-appointment</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=menu-toggle<datalist><option>id=menu-toggle</option><option>//a[@id='menu-toggle']</option><option>//a[contains(@href, '#')]</option><option>//a</option><option>css=#menu-toggle</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>link=Logout<datalist><option>link=Logout</option><option>//a[contains(text(),'Logout')]</option><option>xpath=(//a[@onclick=\"$('#menu-close').click();\"])[5]</option><option>//nav[@id='sidebar-wrapper']/ul/li[5]/a</option><option>//a[contains(@href, 'authenticate.php?logout')]</option><option>//li[5]/a</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "</tbody></table>\n" +
    '<table cellpadding="1" cellspacing="1" border="1">\n' +
    "<thead>\n" +
    '<tr><td rowspan="1" colspan="3">Book many healthcare appointments</td></tr>\n' +
    "</thead>\n" +
    "<tbody>\n" +
    "<tr><td>open</td><td>https://katalon-demo-cura.herokuapp.com/<datalist><option>https://katalon-demo-cura.herokuapp.com/</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>loadVars</td><td>sample_data.csv<datalist><option>sample_data.csv</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>//a[@id='menu-toggle']/i<datalist><option>//a[@id='menu-toggle']/i</option><option>//i</option><option>css=i.fa.fa-bars</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>link=Login<datalist><option>link=Login</option><option>//a[contains(text(),'Login')]</option><option>xpath=(//a[@onclick=\"$('#menu-close').click();\"])[3]</option><option>//nav[@id='sidebar-wrapper']/ul/li[3]/a</option><option>//a[contains(@href, 'profile.php#login')]</option><option>//li[3]/a</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>//input[@value='John Doe']<datalist><option>//input[@value='John Doe']</option><option>//section[@id='login']/div/div/div[2]/form/div/div/div/div/input</option><option>//input</option><option>css=input.form-control</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt-username<datalist><option>id=txt-username</option><option>name=username</option><option>//input[@id='txt-username']</option><option>//section[@id='login']/div/div/div[2]/form/div[2]/div/input</option><option>//div[2]/div/input</option><option>css=#txt-username</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt-username<datalist><option>id=txt-username</option><option>name=username</option><option>//input[@id='txt-username']</option><option>//section[@id='login']/div/div/div[2]/form/div[2]/div/input</option><option>//div[2]/div/input</option><option>css=#txt-username</option></datalist></td><td>John Doe</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>//input[@value='ThisIsNotAPassword']<datalist><option>//input[@value='ThisIsNotAPassword']</option><option>//section[@id='login']/div/div/div[2]/form/div/div[2]/div/div/input</option><option>//div[2]/div/div/input</option><option>css=div.col-sm-offset-4.col-sm-8 &gt; div.input-group &gt; input.form-control</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt-password<datalist><option>id=txt-password</option><option>name=password</option><option>//input[@id='txt-password']</option><option>//section[@id='login']/div/div/div[2]/form/div[3]/div/input</option><option>//div[3]/div/input</option><option>css=#txt-password</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt-password<datalist><option>id=txt-password</option><option>name=password</option><option>//input[@id='txt-password']</option><option>//section[@id='login']/div/div/div[2]/form/div[3]/div/input</option><option>//div[3]/div/input</option><option>css=#txt-password</option></datalist></td><td>ThisIsNotAPassword</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=btn-login<datalist><option>id=btn-login</option><option>//button[@id='btn-login']</option><option>//section[@id='login']/div/div/div[2]/form/div[4]/div/button</option><option>//button</option><option>css=#btn-login</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=combo_facility<datalist><option>id=combo_facility</option><option>name=facility</option><option>//select[@id='combo_facility']</option><option>//section[@id='appointment']/div/div/form/div/div/select</option><option>//select</option><option>css=#combo_facility</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>select</td><td>id=combo_facility<datalist><option>id=combo_facility</option><option>name=facility</option><option>//select[@id='combo_facility']</option><option>//section[@id='appointment']/div/div/form/div/div/select</option><option>//select</option><option>css=#combo_facility</option></datalist></td><td>label=Hongkong CURA Healthcare Center</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=chk_hospotal_readmission<datalist><option>id=chk_hospotal_readmission</option><option>name=hospital_readmission</option><option>//input[@id='chk_hospotal_readmission']</option><option>//section[@id='appointment']/div/div/form/div[2]/div/label/input</option><option>//input</option><option>css=#chk_hospotal_readmission</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=radio_program_medicaid<datalist><option>id=radio_program_medicaid</option><option>//input[@id='radio_program_medicaid']</option><option>//section[@id='appointment']/div/div/form/div[3]/div/label[2]/input</option><option>//label[2]/input</option><option>css=#radio_program_medicaid</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt_visit_date<datalist><option>id=txt_visit_date</option><option>name=visit_date</option><option>//input[@id='txt_visit_date']</option><option>//section[@id='appointment']/div/div/form/div[4]/div/div/input</option><option>//div/input</option><option>css=#txt_visit_date</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt_visit_date<datalist><option>id=txt_visit_date</option><option>name=visit_date</option><option>//input[@id='txt_visit_date']</option><option>//section[@id='appointment']/div/div/form/div[4]/div/div/input</option><option>//div/input</option><option>css=#txt_visit_date</option></datalist></td><td>${cmt}</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=txt_comment<datalist><option>id=txt_comment</option><option>name=comment</option><option>//textarea[@id='txt_comment']</option><option>//section[@id='appointment']/div/div/form/div[5]/div/textarea</option><option>//textarea</option><option>css=#txt_comment</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>type</td><td>id=txt_comment<datalist><option>id=txt_comment</option><option>name=comment</option><option>//textarea[@id='txt_comment']</option><option>//section[@id='appointment']/div/div/form/div[5]/div/textarea</option><option>//textarea</option><option>css=#txt_comment</option></datalist></td><td>${visit_date}</td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>id=btn-book-appointment<datalist><option>id=btn-book-appointment</option><option>//button[@id='btn-book-appointment']</option><option>//section[@id='appointment']/div/div/form/div[6]/div/button</option><option>//button</option><option>css=#btn-book-appointment</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>//a[@id='menu-toggle']/i<datalist><option>//a[@id='menu-toggle']/i</option><option>//i</option><option>css=i.fa.fa-bars</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>click</td><td>link=Logout<datalist><option>link=Logout</option><option>//a[contains(text(),'Logout')]</option><option>xpath=(//a[@onclick=\"$('#menu-close').click();\"])[5]</option><option>//nav[@id='sidebar-wrapper']/ul/li[5]/a</option><option>//a[contains(@href, 'authenticate.php?logout')]</option><option>//li[5]/a</option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "<tr><td>endLoadVars</td><td><datalist><option></option></datalist></td><td></td>\n" +
    "</tr>\n" +
    "</tbody></table>\n" +
    "</body>\n" +
    "</html>";
  let dataExisted = existingData.some((element) =>
    parseSuiteName(element).includes("Product Tour Sample Test Suite")
  );
  if (dataExisted) {
    return false;
  }
  addSampleCSVData();
  let newData = {
    data: [sampleData].concat(existingData),
  };
  for (var i = 0; i < newData.data.length; i++) {
    readSuiteFromString(newData.data[i]);
  }
  await browser.storage.local.set(newData);
  return true;
}

function removeOnboardingSampleData() {
  return browser.storage.local.remove("data");
}

export { addOnboardingSampleData, removeOnboardingSampleData };
