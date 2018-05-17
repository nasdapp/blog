import React from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import moment from 'moment';
import 'moment/locale/zh-cn';
import blog from '../../lib/blog.js';

import './index.less';

moment.locale('zh-cn');

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: ''
    };
  }

  componentDidMount() {
    const ctx = this;
    window.postMessage({
      "target": "contentscript",
      "data":{},
      "method": "getAccount",
    }, "*");

    window.addEventListener('message', (e) => {
      if(e.data && e.data.data && e.data.data.account){
        ctx.setState({});
        window.account = e.data.data.account; // todo::优化

        blog.getNickName({
          success: (res) => {
            window.nickName = res;
            ctx.setState({});
          }
        });
      }
    })
  }

  render() {
    return (
      <LocaleProvider locale={zhCN}>
        <div className="container">
          {this.props.children}
        </div>
      </LocaleProvider>
    );
  }
}

export default Layout;
