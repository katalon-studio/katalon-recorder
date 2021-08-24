const setBackupDataInterval = () => {
  let timerId = setTimeout(function tick() {
    getProjects().then(() => {
      backupData();
      timerId = setTimeout(tick, 15 * 60 * 1000);
    })
  }, 15 * 60 * 1000);
}

export { setBackupDataInterval }