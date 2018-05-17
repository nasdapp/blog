var util = {
  getUrlParam: (name) => {
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      if (results === null) {
          return null;
      }
      return results[1] || 0;
  }
}

module.exports = util;