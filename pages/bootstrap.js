'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout';

export default function bootstrap(Page) {
  ReactDOM.render(
    <Layout>
      <Page />
    </Layout>
    , document.getElementById('root'));
}
