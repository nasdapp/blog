import React from 'react';
import { Alert } from 'antd';
import blog from '../../lib/blog.js';

import './index.less';

window.noWallet = typeof(webExtensionWallet) === "undefined";

class WalletTip extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const msg = <div>您现在只能浏览，安装<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">钱包插件</a>后可以写文章评论哦~</div>;

    return (
      <div className="c-wallet-tip">
        {
          window.noWallet && <Alert message={msg} type="warning" showIcon />
        }
      </div>
    );
  }
}

export default WalletTip;
