// blog api

const dappAddress = "n1mg1jS2aVKBWZ5hFEyiqB7Znz3nXbqqugo";
const Account = nebulas.Account;
const neb = new nebulas.Neb();
const nasApi = neb.api;
neb.setRequest(new nebulas.HttpRequest("https://testnet.nebulas.io"));

var contract = {
  /**
   * 操作
   * excute({
      callFunction: 'addUser',
      callArgs: `["test"]`,
      success: () => {},
      error:() => {}
    })
   */
  excute: (param) => {
    var nebPay = new NebPay();
    var serialNumber;
    var to = dappAddress;
    var value = '0';
    var txhash;

    serialNumber = nebPay.call(to, value, param.callFunction, param.callArgs, {
      listener: (resp) => {
        if (resp && resp.txhash) {
          txhash = resp.txhash;
        } else {
          param.error && param.error(new Error('交易终止'));
        }
      }
    });

    let intervalQuery = setInterval(() => {
      nasApi.getTransactionReceipt({
        hash: txhash
      })
        .then((resp) => {
          console.log("交易结果: " + JSON.stringify(resp));

          if(resp.status == 1){
            param.success && param.success(resp);
            clearInterval(intervalQuery);
          }
        })
        .catch((err) => {
          clearInterval(intervalQuery);
          param.error && param.error(err);
        });
    }, 5000);
  },

  /**
   * 读取
   * getInfo({
   *  callFunction: 'getAllArticles',
      callArgs: '["1", "10"]',
      address // 可选，如果传了，就用这个地址作为 from 调用
      success: () => {},
      error:() => {}
   * })
   */
  getInfo: (param) => {
    var from = param.address || window.account || Account.NewAccount().getAddressString();

    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var contract = {
        "function": param.callFunction,
        "args": param.callArgs // in the form of ["args"]
    };

    neb.api.call(from, dappAddress, value, nonce, gas_price, gas_limit, contract).then((resp) => {
      console.log('getInfo', JSON.parse(resp.result));
      param.success && param.success(JSON.parse(resp.result));
    }).catch((err) => {
      param.error && param.error(err);
    })
  }
};

var blog = {
  /**
   * 获取当前登录用户
   */
  getLoginUser: () => {
    return window.account;
  },

  /**
   * 获取文章列表 {pageNo, pageSize, address, success, error}
   * 参数 address 可选，不传则获取所有文章，否则获取该地址的文章列表
   * 
   * return [{author, content, date, post_id, title}]
   */
  getAllPosts: (param) => {
    const { pageNo, pageSize, address, ...other } = param;
    const limit = pageSize;
    const offset = (pageNo - 1) * pageSize;

    address ?
      contract.getInfo({
        callFunction: 'show_user_posts',
        callArgs: `["${limit}", "${offset}"]`,
        address,
        ...other
      }):
      contract.getInfo({
        callFunction: 'show_posts',
        callArgs: `["${limit}", "${offset}"]`,
        ...other
      });
  },

  /**
   * 发布文章 {title, content, success, error}
   */
  addPost: (param) => {
    const { title, content, ...other } = param;
    contract.excute({
      callFunction: 'post',
      callArgs: `["${title}", "${content}"]`,
      ...other
    });
  },

  /**
   * 编辑文章 {postId, title, content, success, error}
   */
  editPost: (param) => {
    const { postId, title, content, ...other } = param;
    contract.excute({
      callFunction: 'edit_post',
      callArgs: `["${postId}", "${title}", "${content}"]`,
      ...other
    });
  },

  /**
   * 删除文章 {postId, success, error}
   */
  deletePost: (param) => {
    const { postId, ...other } = param;
    contract.excute({
      callFunction: 'delete_post',
      callArgs: `["${postId}"]`,
      ...other
    });
  },

  /**
   * 导出数据 {success, error}
   */
  exportData: (param) => {
    const { ...other } = param;
    contract.getInfo({
      callFunction: 'export_data',
      callArgs: `[]`,
      ...other
    });
  },

  /**
   * 发表评论 {postId, comment, success, error}
   */
  addComment: (param) => {
    const { postId, comment, ...other } = param;
    contract.excute({
      callFunction: 'level_comment',
      callArgs: `["${comment}", "${postId}"]`,
      ...other
    });
  },

  /**
   * 获取某篇文章的评论列表 {postId, pageNo, pageSize, success, error}
   */
  getCommentList: (param) => {
    const { postId, pageNo, pageSize, ...other } = param;
    const limit = pageSize;
    const offset = (pageNo - 1) * pageSize;

    contract.getInfo({
      callFunction: 'get_comments',
      callArgs: `["${postId}", "${limit}", "${offset}"]`,
      ...other
    });
  },

  setNickName: (param) => {
    const { nickname, ...other } = param;
    contract.excute({
      callFunction: 'set_nickname',
      callArgs: `["${nickname}"]`,
      ...other
    });
  },

  getNickName: (param) => {
    const { ...other } = param;

    contract.getInfo({
      callFunction: 'get_nickname',
      callArgs: `[]`,
      ...other
    });
  },
}

module.exports = blog;