// @ts-nocheck
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import Router, { useRouter } from 'next/router';
import nextCookie from 'next-cookies';
import { Testimony, BestTeacher } from '@sampleData/testemony';
import {
  Progress, Tabs, Button, Menu, Result, Card,
} from 'antd';
import Timer from 'react-compound-timer';

import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import { InlineMath, BlockMath } from 'react-katex';
import { withApollo } from '../../lib/apollo';
// import Latex from 'react-latex-next'


const LandingPage = (props) => {

  const user = useSelector(({ USER }) => USER.user);
  const { pathname, query } = useRouter();
  const { slug } = query;
  const [userType, setUserType] = useState(user ? user.role || 'student' : '');
  const [slctdQuestionId, setSlctdQuestionId] = useState('1');
  const [slctdQuestion, setSlctdQuestion] = useState({});
  const [questions, setQuestions] = useState([]);
  const [slctdOption, setSlctdOption] = useState('');
  const [counter, setCounter] = useState(1800);
  const [correctAns, setCorrectAns] = useState('');
  const [completed, setCompleted] = useState(false);
  const [progressVlu, setProgressVlu] = useState(1);
  const { Authorization } = props;
  const abc = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const { TabPane } = Tabs;


  const GET_TEST = gql`
  {
    findTest(query:{_id: "${slug}"}){
      _id,
      name,
      courseId,
      lectureId,
      mcqs{
        _id,
        name,
        options,
        answer,
        answer_index
      }
  }
  }
  `;


  const {
    loading, error, data, fetchMore, networkStatus, client,
  } = useQuery(
    GET_TEST,
    {
      // variables: allPostsQueryVars,
      notifyOnNetworkStatusChange: true,
    },
  );


  useEffect(() => {
    if (data) {
      if (data.findTest && data.findTest.length > 0) {
        const test = data.findTest[0].mcqs;
        if (test && test.length > 0) {
          setSlctdQuestionId(test[0]._id);
          setSlctdQuestion(test[0]);
        }
        setQuestions(test);
      }
    }
  }, [data]);


  const getQustion = (string) => {

    const strArr = string.match(/.{1,70}/g);
    if (strArr && strArr.length > 0) {
      const tg = '<br />';
      return strArr.map((item) => <span>{item} <br /></span>);
    }
  };


  const setQ = (key) => {
    setSlctdQuestionId(key);
    const index = questions.findIndex((item) => item._id == key);
    if (index > -1) {
      setSlctdQuestion(questions[index]);
    }
  };

  const optionSelect = (key) => {
    console.log(key);
    setSlctdOption(key);
  };

  const nextClick = () => {
    if (slctdOption != '') {
      // console.log(slctdOption, slctdQuestion.options[slctdQuestion.answer_index], '00000000000', slctdQuestion.answer_index)
      if (slctdOption === slctdQuestion.options[slctdQuestion.answer_index]) {
        const index = questions.findIndex((item) => item._id == slctdQuestionId);
        if (index > -1) {
          if ((index + 1) < questions.length) {
            setSlctdQuestion(questions[index + 1]);
            setSlctdQuestionId(questions[index + 1]._id);
            setCorrectAns('');
            getProgress(questions[index + 1]._id);
            optionSelect('');
          } else {
            setCompleted(true);
          }
        }
      } else {
        setCorrectAns(slctdQuestion.answer);
      }
    }
  };


  const prevClick = () => {
    const index = questions.findIndex((item) => item._id == slctdQuestionId);
    if (index > -1) {
      if ((index - 1) > -1 && (index - 1) < questions.length) {
        setSlctdQuestion(questions[index - 1]);
        setSlctdQuestionId(questions[index - 1]._id);
        setCorrectAns('');
        getProgress(questions[index - 1]._id);
        optionSelect('');
      }
    }
  };

  const getProgress = (QuestionId) => {
    const index = questions.findIndex((item) => item._id == QuestionId);
    if (index > -1) {
      setProgressVlu(Math.round((index / questions.length) * 100));
    }
  };

  const getQuestionNo = () => {
    if (slctdQuestionId) {
      const index = questions.findIndex((item) => item._id == slctdQuestionId);
      if (index > -1) {
        return index + 1;
      } return 0;
    }
  };


  // console.log(slctdQuestion, 'slug is the', slug);
  return (
    <div>
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

      <section className="" id="intro">
        <div className="">
          {
            completed

              ? <Result
                status="success"
                title="Successfully completed the test"
                extra={[
                  <Button type="primary" size="large" onClick={() => Router.push('/')}>Continue Learning</Button>,
                ]}
              />
              : <div className="row" style={{ marginTop: 20 }}>

                <div className="col-md-4 margins">
                  {/* <Menu
                    theme={'dark'}
                    onClick={(e) => setQ(e.key)}
                    // style={{ width: 256 }}
                    defaultOpenKeys={[slctdQuestionId]}
                    selectedKeys={[slctdQuestionId]}
                    mode="inline"
                  >
                    {
                      questions ? questions.map(item =>
                        <Menu.Item className="cutomizer" key={item._id}>
                          <span>{item.name ? item.name.split("&lt;Math&gt;").map((ele, id) => {
                            if (id % 2 != 0) {
                              return (<InlineMath>{ele}</InlineMath>)
                            } else {
                              return ele
                            }
                          }) : ""}</span>
                        </Menu.Item>
                      ) : null
                    }

                  </Menu> */}

                  <ToggleButtonGroup
                    orientation="vertical"
                    value={slctdQuestionId}
                    exclusive
                    style={{ display: 'grid' }}
                    onChange={(e, text) => {
                      setQ(text);
                      setCorrectAns('');
                    }}>
                    {
                      questions ? questions.map((item) => <ToggleButton style={{ height: 'auto', textAlign: 'left' }} value="list" aria-label="list" value={item._id}>
                        <p>
                          {item.name ? item.name.split('&lt;Math&gt;').map((ele, id) => {
                            if (id % 2 != 0) {
                              return (<InlineMath>{ele}</InlineMath>);
                            }
                            return ele;

                          }) : ''}
                        </p>
                      </ToggleButton>) : null
                    }

                  </ToggleButtonGroup>


                </div>

                <div className="col-md-7 text-md-center margin-30">
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <i className="fa fa-clock-o fa-2x" />
                    <span style={{ fontSize: 18, fontWeight: 700 }}>
                      <Timer
                        initialTime={55000}
                        direction="backward"
                      >
                        {() => (
                          <>
                            <Timer.Minutes />:
                            <Timer.Seconds />
                          </>
                        )}
                      </Timer>
                    </span>
                    <Progress style={{ width: '69%' }} percent={progressVlu} status="active" strokeWidth={20} />
                    <span><i className="fa fa-stop-circle fa-2x" /></span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 50 }}>
                    <span style={{
                      padding: '7px 8px', backgroundColor: '#c4c4c4', fontWeight: 'bold', borderRadius: 4, minWidth: 35,
                    }}>{getQuestionNo()}</span>
                    <span><i className="fa fa-bookmark-o fa-2x" /></span>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 18, textAlign: 'left' }}>{slctdQuestion.name ? slctdQuestion.name.split('&lt;Math&gt;').map((ele, id) => {
                      if (id % 2 != 0) {
                        return (<InlineMath>{ele}</InlineMath>);
                      }
                      return ele;

                    }) : ''}</p>
                  </div>
                  <div>

                    <Tabs tabPosition={'left'} className="mcq_option" activeKey={slctdOption} onChange={optionSelect}>
                      {
                        slctdQuestion.options && slctdQuestion.options.length > 0
                          ? slctdQuestion.options.map((item, index) => <TabPane
                            key={item}
                            tab={<span>
                              <span style={{
                                border: '1px solid', borderRadius: 50, padding: '5px 10px', marginRight: 10,
                              }}>
                                {abc[index]}</span>{item.split('&lt;Math&gt;').map((ele, id) => {
                                  if (id % 2 != 0) {
                                    return (<InlineMath>{ele}</InlineMath>);
                                  }
                                  return ele;

                                })}</span>} />)
                          : false
                      }


                    </Tabs>

                    {
                      correctAns != ''

                        ? <div style={{ color: 'red', paddingTop: 20, maxWidth: 600 }}>
                          {correctAns}
                        </div> : null
                    }


                  </div>
                  <div style={{
                    justifyContent: 'space-between', display: 'flex', width: '100%', marginTop: 30,
                  }}>
                    <Button type="primary" shape="round" size={'large'} style={{ width: 150 }} onClick={prevClick}> PREVIOUS</Button>
                    <Button type="primary" shape="round" size={'large'} style={{ width: 150 }} onClick={nextClick}> NEXT</Button>

                  </div>
                </div>
              </div>
          }
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
export default withApollo(LandingPage);
