import React from 'react';
import { Button, Input, Form } from 'antd';
import blog from '../../lib/blog.js';

import './index.less';

const formItemLayout = {
  wrapperCol: { span: 24 },
};

class CommentEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  addComment = () => {
    const { form, postId, onSuccess } = this.props;
    let hasError = false;
    form.validateFields((errors) => {
      if (errors) {
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    const { comment } = form.getFieldsValue();

    blog.addComment({
      postId,
      comment,
      success: (res) => {
        onSuccess && onSuccess();
        this.clear();
      }
    });
  }

  clear = () => {
    const { form } = this.props;

    form.setFieldsValue({ comment: '' });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    if (window.noWallet) {
      return null;
    } else {
      return (
        <div className="c-comment-editor">
          <Form>
            <Form.Item {...formItemLayout} label="">
              {getFieldDecorator('comment', {
                rules: [{
                  required: true,
                  message: '请输入评论',
                }],
              })(
                <Input.TextArea autosize={{ minRows: 3, maxRows: 3}}  placeholder="请输入评论" />
              )}
            </Form.Item>
          </Form>
          <div className="btn-send-comment-wrap">
            <Button onClick={this.addComment}>评论</Button>          
          </div>
        </div>
      );
    }
  }
}

const WrappedDynamicComponent = Form.create()(CommentEditor);
export default WrappedDynamicComponent;