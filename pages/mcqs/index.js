// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
import nextCookie from 'next-cookies';
import { Testimony, BestTeacher } from '@sampleData/testemony';
import { Progress, Tabs, Button, Menu } from 'antd';

const LandingPage = (props) => {
  const user = useSelector(({ USER }) => USER.user);
  const { pathname, query } = useRouter();
  const [userType, setUserType] = useState(user ? user.role || 'student' : '');
  const [slctdQuestion, setSlctdQuestion] = useState(user ? user.role || 'student' : '');
  const { Authorization } = props;
  const { TabPane } = Tabs;
  console.log(user);
  return (
    <div id="top">
      <Head>
        <meta
          property="og:title"
          content="SCHOOLX leading online learning platform"
        />
        <meta
          property="og:description"
          content="SCHOOLX leading online learning platform"
        />
      </Head>

      <section className="" id="intro" >
        <div className="">
          <div className="row" style={{ marginTop: 100 }}>

            <div className="col-md-4 margins" >
              <Menu
                theme={'dark'}
                // onClick={this.handleClick}
                // style={{ width: 256 }}
                defaultOpenKeys={['1']}
                selectedKeys={["1"]}
                mode="inline"
              >

                <Menu.Item className="cutomizer" key="1"><span>{"Option 1 Option 1 Option 1Option"} <br /> {"Option 1 Option 1 Option 1Option"} <br /> {"Option 1 Option 1 Option 1Option"} <br /> {"1Option 1Option 1Option 1Option 1Option 1"}</span></Menu.Item>
                <Menu.Item className="cutomizer" key="2">Option 2 1 Option 1 Option 1Option 1Option 1Option 1Option 1Option 1Option 1</Menu.Item>
                <Menu.Item key="3">Option 3</Menu.Item>
                <Menu.Item key="4">Option 4</Menu.Item>

              </Menu>
            </div>

            <div className="col-md-7 text-md-center margins margin-30">
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <i className="fa fa-clock-o fa-2x" />
                <span style={{ fontSize: 18, fontWeight: 700 }}> 12:43:00</span>
                <Progress style={{ width: '70%' }} percent={70} status="active" strokeWidth={20} />
                <span><i className="fa fa-stop-circle fa-2x" /></span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50 }}>
                <span style={{ padding: '7px 8px', backgroundColor: '#c4c4c4', fontWeight: 'bold', borderRadius: 4 }}>02</span>
                <span><i className="fa fa-bookmark-o fa-2x" /></span>
              </div>

              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 18, textAlign: 'left' }}>How come in free fall you feel weightless even though gravity
                is pulling down on you? (ignore air resistance when answering this question).</p>
              </div>
              <div>

                <Tabs tabPosition={'left'} className="mcq_option">
                  <TabPane tab={<span ><span style={{ border: '1px solid', borderRadius: 50, padding: '5px 10px', marginRight: 10 }}>A</span> Option 1 for this site is</span>} key="1" />
                  <TabPane tab={<span ><span style={{ border: '1px solid', borderRadius: 50, padding: '5px 10px', marginRight: 10 }}>B</span> Option 2 for this site is</span>} key="2" />
                  <TabPane tab={<span ><span style={{ border: '1px solid', borderRadius: 50, padding: '5px 10px', marginRight: 10 }}>C</span> Option 3 for this site is</span>} key="3" />
                  <TabPane tab={<span ><span style={{ border: '1px solid', borderRadius: 50, padding: '5px 10px', marginRight: 10 }}>D</span> Option 4 for this site is</span>} key="3" />
                </Tabs>

              </div>
              <div style={{ justifyContent: 'space-between', display: 'flex', width: '100%', marginTop: 30 }}>
                <Button type="primary" shape="round" size={'large'} style={{ width: 150 }}> PREVIOUS</Button>
                <Button type="primary" shape="round" size={'large'} style={{ width: 150 }}> NEXT</Button>

              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
  // LandingPage.getInitialProps = async (ctx) => {
  //   const { user } = ctx.store.getState().USER;
  //   const { Authorization } = nextCookie(ctx);
  //   if (ctx.req && Authorization) {
  //     if (user && user.role === 'student') ctx.res.writeHead(302, { Location: '/mcqs' }).end();
  //     else ctx.res.writeHead(302, { Location: '/mcqs' }).end();
  //   } else if (Authorization) {
  //     if (user && user.role === 'student') document.location.pathname = '/mcqs';
  //     else document.location.pathname = '/mcqs';
  //   } else return { Authorization };
  // };
export default LandingPage;
