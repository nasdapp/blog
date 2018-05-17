import React from 'react';
import { Button, Input, Form, Modal, Icon, message } from 'antd';
import ReactMde, {ReactMdeTypes} from 'react-mde';
import * as Showdown from "showdown";
import blog from '../../lib/blog.js';

import 'react-mde/lib/styles/css/react-mde-all.css';
import './index.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class PostEditor extends React.Component {
  converter: Showdown.Converter;

  constructor(props) {
    super(props);

    const { item, isEdit } = this.props;

    this.state = {
      visible: false,
      mdeState: isEdit ? (item.content ? { markdown: item.content } : null) : null
    };
    this.converter = new Showdown.Converter({tables: true, simplifiedAutoLink: true});
  }

  addPost = () => {
    const { form, isEdit, item, onSuccess } = this.props;
    const { mdeState } = this.state;
    const { close } = this;
    let content = mdeState && mdeState.markdown;
    console.log(77, onSuccess, this.props)

    let hasError = false;
    form.validateFields((errors) => {
      if (errors) {
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    if (!content) {
      message.error('请输入文章内容');
      return;
    }

    const { title } = form.getFieldsValue();

    content = content.replace(/\n/g, '\\n')

    isEdit ?
      blog.editPost({
        postId: item.post_id,
        title,
        content,
        success: (res) => {
          onSuccess && onSuccess();
          close();
        }
      }):
      blog.addPost({
        title,
        content,
        success: (res) => {
          onSuccess && onSuccess();
          close();
          this.clear();
        }
      });
  }

  clear = () => {
    const { isEdit, form } = this.props;

    if (!isEdit) {
      form.setFieldsValue({ title: '' });
      this.setState({
        mdeState: null
      });
    }
  }

  showEditor = () => {
    this.setState({
      visible: true
    });
  }

  close = () => {
    this.setState({
      visible: false
    });
  }

  handleValueChange = (mdeState: ReactMdeTypes.MdeState) => {
    this.setState({mdeState});
  }

  render() {
    const { visible } = this.state;
    const { isEdit, className = '', item, form } = this.props;
    const { getFieldDecorator } = form;

    if (window.noWallet) {
      return null;
    } else {
      return (
        <div className={`c-post-editor ${className}`}>
          {
            isEdit ?
              <Icon className="btn-edit" onClick={this.showEditor} type="edit" title="编辑" /> :
              <Button onClick={this.showEditor} type="primary" shape="circle" icon="edit" size="large" title="写文章" />
          }

          <Modal
            visible={visible}
            title={ isEdit ? '编辑' : '写文章' }
            okText="发布"
            width={800}
            onCancel={this.close}
            onOk={this.addPost}
          >
            <Form>
              <Form.Item {...formItemLayout} label="">
                {getFieldDecorator('title', {
                  initialValue: item && item.title || '',
                  rules: [{
                    required: true,
                    message: '请输入标题',
                  }],
                })(
                  <Input placeholder="请输入标题" />
                )}
              </Form.Item>
            </Form>
            <ReactMde
              layout="tabbed"
              onChange={this.handleValueChange}
              editorState={this.state.mdeState}
              generateMarkdownPreview={(markdown) => Promise.resolve(this.converter.makeHtml(markdown))}
            />
          </Modal>
        </div>
      );
    }
  }
}

const WrappedDynamicComponent = Form.create()(PostEditor);
export default WrappedDynamicComponent;