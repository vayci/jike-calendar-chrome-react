import React, { Component } from 'react';
import * as QrCode from 'qrcode.react';
import axios from 'axios';
import moment from "moment";
import './App.css';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        url:'',
        uuid: '',
        authToken: '',
        refreshToken: '',
        accessToken: ''

    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          扫码登录 开启黄历
        </header>
        <div className="Qrcode">
        <QrCode value={this.state.url} size={180} />
        </div>
      </div>
    );
  }

  componentDidMount(){
    //localstorage 获取token 请求数据
    this.state.authToken = window.localStorage.getItem('auth-token');
    this.state.refreshToken = window.localStorage.getItem('refresh-token');
    this.state.accessToken = window.localStorage.getItem('access-token');
    let res = this.getdailyCards()
    if(!res){
      //失败则刷新token再请求
      this.refreshAccessToken()
      let as = this.getdailyCards()
      if(!as){
        //还失败扫码重新登录
        this.refreshQrCode()
      }
    }
  }

  refreshAccessToken = () =>{

  }

  refreshQrCode = () => {
    let _this = this;
    axios.get('https://app.jike.ruguoapp.com/sessions.create').then(res=>{
        if(res.status == 200){
          let uuid = res.data.uuid
          let url = 'jike://page.jk/web?url=https%3A%2F%2Fruguoapp.com%2Faccount%2Fscan%3Fuuid%3D' + uuid + '&displayHeader=false&displayFooter=false'
          _this.setState({
            url: url,
            uuid: uuid
          })
          _this.waitForLogin(uuid)
          console.log('刷新二维码')
        }else{
          alert('网络错误')
        }  
    })
  }

  waitForLogin = (uuid) => {
    let _this = this;
    axios.get('https://app.jike.ruguoapp.com/sessions.wait_for_login?uuid='+uuid).then(res=>{
      if(res.status == 200){
        console.log('扫码成功,等待确认')
        _this.waitForConfirm(uuid)
      }
      if(res.status == 204){
        console.log('25秒内未扫码，继续polling')
        _this.waitForLogin(uuid)
      }
      if(res.status == 404){
        console.log('二维码失效')
        _this.refreshQrCode()
      }
    }).catch(e=>{
      console.log('二维码失效')
      _this.refreshQrCode()
    })
  }

  waitForConfirm = (uuid) =>{
    let _this = this;
    axios.get('https://app.jike.ruguoapp.com/sessions.wait_for_confirmation?uuid='+uuid).then(res=>{
      if(res.status == 200){
        console.log('登录成功')

          _this.state.authToken = res.data['token']
          _this.state.refreshToken = res.data['x-jike-refresh-token']
          _this.state.accessToken = res.data['x-jike-access-token']

        window.localStorage.setItem('auth-token',res.data['token']);
        window.localStorage.setItem('refresh-token',res.data['x-jike-refresh-token']);
        window.localStorage.setItem('access-token',res.data['x-jike-access-token']);
        // eslint-disable-next-line
        chrome.notifications.create("playlist_covers", {
          type: 'basic',
          iconUrl: 'image/icon.png',
          title: '即刻黄历提示',
          message: '扫码登录成功'
        });
        _this.getdailyCards()
      }
      if(res.status == 204){
        console.log('25秒内未确认，继续polling')
        _this.waitForConfirm(uuid)
      }
      if(res.status == 404){
        console.log('等待超时')
        _this.refreshQrCode()
      }
    }).catch(e=>{
      console.log('等待超时')
      _this.refreshQrCode()
    })
  }

  getdailyCards = () =>{
      let _this = this
      let date = moment().format('YYYY-MM-DD');  
      console.log(date)
      console.log(_this.state.accessToken)
      axios.get('https://app.jike.ruguoapp.com/1.0/dailyCards/list',{
        params:{
          'coordsys':'wgs84',
          'date':date
        },
        headers: {' x-jike-access-token': _this.state.accessToken}
      }).then(res=>{
        console.log(res)
        return true
      }).catch(e=>{
        console.log('获取数据异常')
        return false
      })
  }


}

export default App;
