import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'
import cacheData from "memory-cache";
import Router, { useRouter } from 'next/router';
import TableRow from './../components/TableRow';
import Header from './../components/Header';
import Footer from './../components/Footer';
import { Divider, Pagination, Spin } from 'antd';

const API_URL = 'https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty';

Router.events.on('routeChangeStart', () => console.log('route start')); 
Router.events.on('routeChangeComplete', () => console.log('route complete')); 
Router.events.on('routeChangeError', () => console.log('route error'));

function onPaginationChange(page, pageSize, router) {
  router.push(`/news?page=${page}&pagesize=${pageSize}`);
}

export default function Home(props) {

  const router = useRouter();
  const { query, pathname } = router;
  const path = pathname.split('/')[1] || 'news';
  console.log('path: ', path);
  const {page = 1, pagesize = 10} = query;
  const { values, totalPosts } = props;

  return (
    <div className={styles.root} id="root">
      <Head>
        <title>Hacker News</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header path={path} />

      <div className={styles.topRow}>
        <div><h1 className={styles.titleText}>Top news for Today</h1><Spin size="large" /></div>
        <Pagination current={page} total={totalPosts} pageSize={pagesize} onChange={(page, pageSize) => onPaginationChange(page, pageSize, router)}/>
      </div>

      <div className={styles.container}>
        <Divider style={{marginTop: 0}}/>
        <div className={styles.fullWidth}>
          {values.map(v => <TableRow item={v} key={v.id}/>)}
        </div>
      </div>

      <div className={styles.pagination}>
        <Pagination current={page} total={totalPosts} pageSize={pagesize} onChange={(page, pageSize) => onPaginationChange(page, pageSize, router)}/>
      </div>
      
      <Footer />
    </div>
    
  )
}

export async function getServerSideProps(context) {

  let { pagesize=10, page=1 } = context.query;
  let posts = await fetchAllWithCache(API_URL);
  
  page = page == 0 ? 0 : page - 1;
  const slicedPosts = posts.slice(Number(page)*Number(pagesize), (Number(page)+1)*Number(pagesize));
  const jsonArticles = slicedPosts.map(post => getPostsViaCache(`https://hacker-news.firebaseio.com/v0/item/${post}.json?print=pretty`));

  savePostsToCache(slicedPosts, jsonArticles);
  const returnedData = await Promise.all(jsonArticles);

  return {
    props: {
       values: returnedData,
       totalPosts: posts.length
    }
  }
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

function savePostsToCache(slicedPosts, jsonArticles) {
  const minutesToCache = 5;
  slicedPosts.forEach((post, index) => {
    const cacheKey = `https://hacker-news.firebaseio.com/v0/item/${post}.json?print=pretty`;
    cacheData.put(cacheKey, jsonArticles[index], minutesToCache * 1000 * 60);
  })
}

async function fetchAllWithCache(url) {
  const value = cacheData.get(url);
  if (value) {
    return value;
  } else {
    const minutesToCache = 5;
    const res = await fetch(url);
    const data = await res.json();
    cacheData.put(url, data, minutesToCache * 1000 * 60);
    return data;
  }
}