import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'
import cacheData from "memory-cache";
import { useRouter } from 'next/router';
import TableRow from './../components/TableRow';
import Header from './../components/Header';
import { Divider, Pagination, Layout } from 'antd';

const { Content, Footer } = Layout;

function onPaginationChange(page, pageSize, router) {
  router.push(`/?page=${page}&pagesize=${pageSize}`);
}

export default function Home(props) {

  const router = useRouter();
  const { query } = router;
  const {page = 1, pagesize = 10} = query;
  const { values, totalPosts } = props;

  return (
    <div className={styles.root}>
      <Head>
        <title>Hacker News</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <Header />

      <div className={styles.titled}>
        <h1 style={{fontSize: '2rem', color: '#676767'}}>Top news for Today</h1>
        <Pagination defaultCurrent={page} total={totalPosts} pageSize={pagesize} onChange={(page, pageSize) => onPaginationChange(page, pageSize, router)}/>
      </div>

      <div className={styles.container}>
        <Divider style={{marginTop: 0}}/>
        <div className={styles.fullWidth}>
          {values.map(v => <TableRow item={v} />)}
        </div>
      </div>

      <div className={styles.pagination}>
        <Pagination defaultCurrent={page} total={totalPosts} pageSize={pagesize} onChange={(page, pageSize) => onPaginationChange(page, pageSize, router)}/>
      </div>
    </div>
    
  )
}

export async function getServerSideProps(context) {

  const { pagesize=10, page=1 } = context.query;
  let posts = await fetchAllWithCache('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty');
  
  const slicedPosts = posts.slice(Number(page)*Number(pagesize), (Number(page)+1)*Number(pagesize));
  const jsonArticles = slicedPosts.map(post => getPostsViaCache(`https://hacker-news.firebaseio.com/v0/item/${post}.json?print=pretty`));

  savePostsToCache(slicedPosts, jsonArticles);
  const returnedData = await Promise.all(jsonArticles);

  return {
    props: {
       values: returnedData,
       totalPosts: posts.length
    }, // will be passed to the page component as props
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
  const minutesToCache = 10;
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
    const minutesToCache = 10;
    const res = await fetch(url);
    const data = await res.json();
    cacheData.put(url, data, minutesToCache * 1000 * 60);
    return data;
  }
}


/* <footer className={styles.footer}>
    <p>
      Created with ❤️ by 
      <a
        href="https://comscience.now.sh"
        target="_blank"
      >
        <span>Kapeel Kokane</span>
      </a>
      Powered by{' '}
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
      </a>
    </p>
  </footer> */