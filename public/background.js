chrome.runtime.onInstalled.addListener(function () {
    console.log('background run')
    refreshToken()
});

let refreshToken = () => {
    chrome.storage.local.get(null, (res) => {
      if (res['refresh-token'] && res['access-token']) {
        axios({
          url: 'https://app.jike.ruguoapp.com/app_auth_tokens.refresh',
          method: 'get',
          headers: {
            'x-jike-refresh-token': res['refresh-token']
          }
        })
          .then(response => {
            const data = response.data;
            chrome.storage.local.set({
              'refresh-token': data['x-jike-refresh-token'],
              'access-token': data['x-jike-access-token']
            });
          });
      }
    });
  }