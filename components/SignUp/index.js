import React from 'react';
import { Modal, Form, Input } from 'antd';
import blog from '../../lib/blog.js';

import './index.less';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  setNickName = () => {
    const { form } = this.props;
    const ctx = this;

    let hasError = false;
    form.validateFields((errors) => {
      if (errors) {
        hasError = true;
      }
    });

    if (hasError) {
      return;
    }

    const { nickName } = form.getFieldsValue();

    blog.setNickName({
      nickname: nickName,
      success: (res) => {
        ctx.close();
        window._nickName = nickName;
      }
    });
  }

  show = () => {
    this.setState({
      visible: true
    });
  }

  close = () => {
    this.setState({
      visible: false
    });
  }

  render() {
    const { visible } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    console.log(window._nickName, 668)

    return (
      <div className="c-signup">
        {
          window._nickName ? 
            <a href={`?address=${window.account}`} title={`查看我的文章`}>{window._nickName}</a> : 
            <a href="javascript:;" onClick={this.show}>注册</a>
        }

        <Modal
          visible={visible}
          title={ '注册' }
          okText="确定"
          width={600}
          onCancel={this.close}
          onOk={this.setNickName}
        >
          <Form>
            <Form.Item {...formItemLayout} label="">
              {getFieldDecorator('nickName', {
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入昵称',
                }],
              })(
                <Input placeholder="请输入昵称" />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

const WrappedDynamicComponent = Form.create()(SignUp);
export default WrappedDynamicComponent;