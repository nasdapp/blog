import React from 'react';
import { Button, Icon } from 'antd';
import moment from 'moment';
import * as Showdown from "showdown";
import blog from '../../lib/blog.js';
import CommentList from '../CommentList';
import PostEditor from '../PostEditor';

import './index.less';

class Post extends React.Component {
  converter: Showdown.Converter;

  constructor(props) {
    super(props);

    this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});

    this.state = {
      showAll: false
    };
  }

  deletePost = () => {
    const { post_id, onSuccess } = this.props;

    blog.deletePost({
      postId: post_id,
      success: (res) => {
        onSuccess && onSuccess();
      }
    });
  }

  toggleAll = () => {
    this.setState({
      showAll: !this.state.showAll
    });
  }

  render() {
    const { address, author, date, title, content, post_id, onSuccess } = this.props;
    const { showAll } = this.state;

    return (
      <div className="c-post">
        <a className="post-author" href={`?address=${address}`} title={`查看${author}的文章`}></a>
        <div className="user-wrap">
          <a className="post-author-name" href={`?address=${address}`} title={`查看${author}的文章`}>{author}</a>
          <div>{moment(date).format('YYYY-MM-DD hh:mm')}</div>
        </div>
        
        <div className="post-title">{title}</div>
        <div className={`post-content ${showAll ? 'showall' : ''}`} dangerouslySetInnerHTML={{ __html: this.converter.makeHtml(content) }}></div>
        <div className="btn-toggle-all" onClick={this.toggleAll}>{ showAll ? '收起' : '阅读全文' }</div>

        <div className="opt-box">
          <CommentList postId={post_id} />
          {
            window.account == address && <PostEditor isEdit item={this.props} onSuccess={onSuccess} />
          }
          {
            window.account == address && <Icon className="btn-delete" onClick={this.deletePost} type="delete" title="删除" />
          }
        </div>
      </div>
    );
  }
}

export default Post;