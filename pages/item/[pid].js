import React, { useState, useEffect } from 'react';
import ReactHtmlParser from 'react-html-parser';
import Head from 'next/head'
import cheerio from 'cheerio';
import axios from 'axios';
import {default as nodeUrl} from 'url';
import styles from '../../styles/Home.module.css'
import 'antd/dist/antd.css'
import cacheData from "memory-cache";
import Router, { useRouter } from 'next/router';
import Header from './../../components/Header';
import Footer from './../../components/Footer';
import { Comment, Pagination, Spin, List, Avatar, Space } from 'antd';
import { MessageOutlined, StarOutlined, MehOutlined, ConsoleSqlOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

async function fetchComments(commentIds) {
  const jsonComments = commentIds.map(comment => getPostsViaCache(`https://hacker-news.firebaseio.com/v0/item/${comment}.json?print=pretty`));
  let result = await Promise.all(jsonComments);

  console.log('results: ', result);
  result = result.filter(item => item.text && item.by);
  result = result.map(item => ({
    actions: [<span key="comment-list-reply-to-0">Reply to</span>],
    author: item.by,
    avatar: item.by && item.by[0].toUpperCase() || 'A',
    content: item.text
  }));

  console.log('final results: ', result);
  return result;
}

export default function Item(props) {

  const { post, image, summary } = props;
  console.log('post: ', post, image, summary);
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { query } = router;
  const { pid } = query;

  useEffect(async () => {
    const fetchedComments = await fetchComments(post.kids);
    console.log('fetched comments in useEffect: ', fetchedComments);
    setComments([...fetchedComments]);
  }, []);

  console.log('comments in render function: ', comments);

  const listData = [{
    href: post.url,
    title: post.title,
    by: post.by,
    image: image || "/not_found.png",
    content: summary || post.title,
    comments: post.descendants,
    score: post.score,
  }];

  return (
    <div className={styles.root} id="root">
      <Head>
        <title>Hacker News</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header />

      <div className={styles.topRow}>
        <div className={styles.row}><h1 className={styles.titleText}>Post:</h1></div>
      </div>

      <div className={styles.itemContainer }>
        <List 
          pagination={false}
          itemLayout="vertical"
          size="large"
          dataSource={listData}
          renderItem={item => (
            <List.Item
              key={item.title}
              actions={[
                <IconText icon={StarOutlined} text={<span style={{color: '#898989'}}>{item.score}</span>} key="list-vertical-star-o" />,
                <IconText icon={MessageOutlined} text={<span style={{color: '#898989'}}>{item.comments}</span>} key="list-vertical-message" />,
                <IconText icon={MehOutlined} text={<span style={{color: '#898989'}}>${item.by}</span>} key="list-vertical-user" />,
              ]}
              extra={
                <img
                  width={272}
                  alt="logo"
                  src={item.image}
                />
              }
            >
              <List.Item.Meta
                avatar={<Avatar>{item.by[0].toUpperCase()}</Avatar>}
                title={<h3 className={styles.mainText}><a href={item.href} style={{textDecoration: 'inherit', color: 'inherit'}}>{item.title}</a></h3>}
              />
              <p className={styles.stats}>{item.content}</p>
            </List.Item>
          )}
        />
      </div>

      <div className={styles.topRow}>
        <div className={styles.row}><h4 className={styles.titleText}>Comments:</h4></div>
      </div>

      <div className={styles.itemContainer }>
        {comments.map(comment => 
          (
            <Comment
              actions={[<span key="comment-nested-reply-to">view replies</span>]}
              author={comment.author}
              avatar={ <Avatar>{comment.author[0]}</Avatar>}
              content={<p className={styles.stats}>{ReactHtmlParser(comment.content)}</p>}
            >
            </Comment>
          )
        )}
      </div>
      <Footer />
    </div>
    
  )
}

export async function getServerSideProps(context) {

  let { pid } = context.query;
  
  let url = `https://hacker-news.firebaseio.com/v0/item/${pid}.json?print=pretty`;
  const post = await getPostsViaCache(url);
  const {image, summary} = await getImageAndSummary(post.url);

  return {
    props: {
       post,
       image,
       summary
    }
  }
}

function getImageAndSummary(url) {
    if (!url) {
      return {
        image: null,
        summary: null
      }
    }
    return new Promise((resolve, reject) => {
        //get our html
        axios.get(url)
        .then(resp => {

            const html = resp.data;
            const $ = cheerio.load(html);
            let image = null;
            
            const imageInPage = getImage($)
            if (imageInPage) {
              image = nodeUrl.resolve(url, imageInPage);
            } 

            const summary = getParas($);
            resolve({image, summary});
        })
        .catch(err => {
           reject(err);
        });
    });
}

function getImage($) {
  let length = $("body").find("img").length;
  for (let i = 0; i < length; i++) {
    if ($("body").find("img")[i].attribs.width > 300) {
      return $("body").find("img")[i].attribs.src;
    }
  }

  return null;
}

function getParas($) {
  let summary = '';

  $("body").find("p").each((index,element) => {
    let paraText = $(element).text();
    if (paraText.length > 100 && summary.length < 300) {
      summary += paraText + ". ";
    }
  });

  return summary;
}

async function getPostsViaCache(url) {
  const value = cacheData.get(url);
  if (value) {
    console.log('fetching post from cache');
    return value;
  } else {
    console.log('fetching post from server');
    return fetch(url).then(post => post.json());
  }
}