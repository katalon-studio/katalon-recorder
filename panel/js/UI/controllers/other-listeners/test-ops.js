import { setBackupDataInterval } from "../../services/test-ops-service/test-ops-service.js";

$(document).ready(function(){
  $('#ka-open').on('click', function() {
    window.open(testOpsEndpoint);
  });

  $("#test-ops-back-up-data").click(function(){
    getProjects().then(() => {
      backupData();
      updateBackupStatus(`Backing up data …`);
      $("#backup-restore-btn").css("display", "none");
      setTimeout(() => {
        showBackupEnabledStatus();
      }, 2000)
    }).catch(() =>{
      showTestOpsLoginDialog();
      showBackupDisabledStatus();
    })
  });

  setBackupDataInterval();
})