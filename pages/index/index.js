import React from 'react';
import bootstrap from '../bootstrap.js';
import { Icon } from 'antd';
import blog from '../../lib/blog.js';
import util from '../../lib/util.js';
import PostEditor from '../../components/PostEditor';
import Post from '../../components/Post';
import WalletTip from '../../components/WalletTip';
import SignUp from '../../components/SignUp';

import './index.less';

const blogAddress = util.getUrlParam('address'); // 当前博客的地址，没有就是所有博客

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      loading: false
    };
  }

  componentDidMount() {
    this.getAllPosts();
    
    // blog.exportData({
    //   address: 'n1Qj2by44p9rkZtVYbb1ckywZ8ABVyZFixz',
    //   success: (res) => {
    //     console.log('导出', res)
    //   }
    // });
  }

  getAllPosts = () => {
    this.setState({
      loading: true
    });

    blog.getAllPosts({
      pageNo: 1,
      pageSize: 100,
      address: blogAddress,
      success: (res) => {
        this.setState({
          posts: res,
          loading: false
        });
      },
      error: () => {
        this.setState({
          loading: false
        });
      }
    });
  }
 
  render() {
    const { posts, loading } = this.state;
    const showEditor = window.account == blogAddress || !blogAddress;

    return (
      <div className="page-index">
        <WalletTip />
        <SignUp />
        <h1 className="blog-title">NasBlog！</h1>
        { showEditor && <PostEditor className="btn-show-post-writer" onSuccess={this.getAllPosts} /> }
        { loading && <div className="loading-wrap"><Icon type="loading" /></div> }
        {
          posts.map(item => item && <Post key={item.post_id} {...item} onSuccess={this.getAllPosts} />)
        }
      </div>
    );
  }
}

bootstrap(App);
