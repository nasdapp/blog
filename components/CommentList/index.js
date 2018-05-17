import React from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import blog from '../../lib/blog.js';
import CommentEditor from '../CommentEditor';

import './index.less';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showMore: false,
      comments: [],
      loading: false
    };
  }

  toggleShowMore = () => {
    const { showMore } = this.state;

    if (showMore) {
      this.setState({
        showMore: false
      });
    } else {
      this.setState({
        showMore: true
      }, this.getCommentList);
    }
  }

  getCommentList = () => {
    this.setState({
      loading: true
    });

    blog.getCommentList({
      postId: this.props.postId,
      pageNo: 1,
      pageSize: 100,
      success: (res) => {
        this.setState({
          comments: res,
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
    const { comments, showMore, loading } = this.state;
    const { postId } = this.props;

    return (
      <div className="c-comment-list">
        <img title="评论" className="btn-more-comments" onClick={this.toggleShowMore} src="../../img/comments.png" />
        {
          showMore && <div className="comment-more">
            <CommentEditor postId={postId} onSuccess={this.getCommentList} />
            { loading && <Icon className="comment-loading" type="loading" />}
            {
              comments.map((item) => {
                const { author, address } = item;
                return (<div className="a-comment" key={item.date}>
                  <a className="comment-author" href={`?address=${address}`} title={`查看${author}的文章`}></a>
                  <div className="user-wrap">
                    <a className="comment-author-name" href={`?address=${address}`} title={`查看${author}的文章`}>{author}</a>
                    <div className="comment-time">{moment(item.date).format('YYYY-MM-DD hh:mm')}</div>
                  </div>
                  <div className="comment-content">{item.comment}</div>
                </div>);
              })
            }
            {
              !loading && !comments[0] && <div>还没有评论</div>
            }
          </div>
        }
      </div>
    );
  }
}

export default CommentList;