import React, { Component } from 'react';
import * as QrCode from 'qrcode.react';
import axios from 'axios';
import moment from "moment";
import './App.css';

moment.locale('zh-cn', {
  months: [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ],
  weekdays: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
})
const jikeDomain = 'https://app.jike.ruguoapp.com'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
        url:'',
        uuid: '',
        authToken: '',
        refreshToken: '',
        accessToken: '',
        login:false,
        dailyData: {},
        dateStr: '',
        dayStr:'',
        cache:false
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.cache?
          <div className='App-body'>
            <div className='App-body-top'>
              <div className='Cal-week'>{this.state.dateStr}</div>
              <div className='Cal-day'>{this.state.dayStr}</div>
              <div className='Cal-fortune'>{this.state.dailyData.fortune}</div>
              <div className='Bold-line'></div>
              <div className='line'></div>
              <div className='Cal-text'>{this.state.dailyData.featuredContent.text}</div>
              <div className='Cal-author'>via {this.state.dailyData.featuredContent.author}</div>
            </div>
            <div className='App-body-bottom'>
              <div className='Cal-first'>{this.state.dailyData.greetings.firstLine}</div>
              <div className='Cal-second'>{this.state.dailyData.greetings.secondLine}</div>
            </div>
          </div>
          :
          <div>
            <header className="App-header">
              扫码登录 开启黄历
            </header>
            <div className="Qrcode">
            <QrCode value={this.state.url} size={180} />
            </div>
          </div>}

      </div>
    );
  }

  componentDidMount(){
    this.loadCache()
    this.tryGetData()
  }

  refreshQrCode = () => {
    this.setState({login:false})
    let _this = this;
    axios.get(jikeDomain+'/sessions.create').then(res=>{
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
    axios.get(jikeDomain+'/sessions.wait_for_login?uuid='+uuid).then(res=>{
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
    axios.get(jikeDomain+'/sessions.wait_for_confirmation?uuid='+uuid).then(res=>{
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
      axios.get(jikeDomain+'/1.0/dailyCards/list',{
        params:{
          'coordsys':'wgs84',
          'date':date,
          'x-jike-access-token':_this.state.accessToken
        },
        headers: {'x-jike-access-token': _this.state.accessToken}
      }).then(res=>{
        _this.parseCardData(res.data.data.cards[0])
         console.log('请求日历数据成功')
      }).catch(e=>{
        console.log('获取数据异常') 
        _this.tryRefreshToken(_this.state.refreshToken)
      })
  }

  parseCardData = (cardData) => {
    let dateStr = cardData.date
    let dateObj = moment(dateStr)
    let dayStr = dateObj.format('DD')
    let str = dateObj.format('YYYY') +' '+dateObj.format('MMMM')+' '+dateObj.format('dddd')
    this.setState({
      login:true,
      cache:true,
      dayStr: dayStr,
      dateStr: str,
      dailyData:cardData
    })
    this.cacheCardData(cardData,str,dayStr)
  }

  cacheCardData = (cardData,dateStr,dayStr) =>{
    window.localStorage.setItem('dailyData',JSON.stringify(cardData));
    window.localStorage.setItem('dateStr',dateStr);
    window.localStorage.setItem('dayStr',dayStr);
    window.localStorage.setItem('dataCache',true);
  }

  loadCache = () =>{
    console.log('加载缓存数据')
    let cache = window.localStorage.getItem('dataCache');
    if(cache){     
      this.setState({
        dailyData:JSON.parse(window.localStorage.getItem('dailyData')),
        dateStr:window.localStorage.getItem('dateStr'),
        dayStr:window.localStorage.getItem('dayStr'),
        cache:cache
    })
    }
  }

  tryGetData = () => {
    let _this = this
    this.state.refreshToken = window.localStorage.getItem('refresh-token');
    this.state.accessToken = window.localStorage.getItem('access-token');
      if(this.state.accessToken==undefined){
        console.log('未登录')
        _this.refreshQrCode()
        return false
      }else{
        console.log('已登录')
       _this.getdailyCards()
       }
    }

  tryRefreshToken = (refreshToken) =>{
    let _this = this
    axios.get(jikeDomain+"/app_auth_tokens.refresh",{headers:{
          'x-jike-refresh-token':refreshToken
    }}).then(res =>{
      window.localStorage.setItem('refresh-token',res.data['x-jike-refresh-token']);
      window.localStorage.setItem('access-token',res.data['x-jike-access-token']);
      this.state.refreshToken = res.data['x-jike-refresh-token'];
      this.state.accessToken = res.data['x-jike-access-token'];
      console.log('刷新token成功')
      _this.getdailyCards()
    }).catch(e=>{
      console.log('刷新token失败')
      _this.refreshQrCode()
    })
  }
}

export default App;
