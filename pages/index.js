import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'
import cacheData from "memory-cache";
import { useRouter } from 'next/router';
import { Statistic, Row, Col, Button, Divider, Pagination, Layout, Menu } from 'antd';
import { UserOutlined, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
const { Content, Footer } = Layout;

function TableRow({item}) {
  return (
    <Row gutter={16} className={styles.fullWidth}>
      <Col span={3}>
        <Statistic title="POINTS" value={item.score} valueStyle={{ color: '#FB651E' }} />
      </Col>
      <Col span={3}>
        <Statistic title="COMMENTS" value={item.descendants} valueStyle={{ color: '#FB651E' }} />
      </Col>
      <Col span={16} className={styles.separator}>
        <h2>{item.title}</h2>
        <ClockCircleOutlined />{` 15 mins ago `}
        <Divider type="vertical"/>
        <UserOutlined /> {item.by}
        <Divider type="vertical"/>
        <LinkOutlined /> {` google.com `}
      </Col>
      <Col span={1}>
        <a
            href={item.url}
            target="_blank"
          >
          <Button type="primary" danger>Open</Button>
        </a>
      </Col>
      <Divider />
    </Row>
  )
}

function Header() {
  return (
    <div style={{backgroundColor: '#FB651E'}}>
      <div style={{backgroundColor: '#FB651E', margin: '0 10%', border: 'none', color: 'white', display: 'flex', alignItems: 'center', height: '100%'}}>
        <img src="/logo.png" alt="Ycombinator Logo" className={styles.logo} />
        <span style={{fontSize: '1.5em', marginRight: '16px'}}>HACKERNEWS</span>
        <Divider type="vertical"/>
        <span style={{fontWeight: 800}}>NEWS</span>
        <Divider type="vertical"/>
        <span key="2">SHOW HN</span>
        <Divider type="vertical"/>
        <span key="3">ASK HN</span>
      </div>
    </div>
  )
}

function onPaginationChange(page, pageSize, router) {
  
  console.log('pagination changed: ', page, pageSize);
  router.push(`/?page=${page}`);
}

export default function Home(props) {

  const router = useRouter();
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
        <Pagination defaultCurrent={1} total={totalPosts} pageSize={10} onChange={(page, pageSize) => onPaginationChange(page, pageSize, router)}/>
      </div>

      <div className={styles.container}>
        <Divider style={{marginTop: 0}}/>
        <div className={styles.fullWidth}>
          {values.map(v => <TableRow item={v} />)}
        </div>
      </div>

      <div className={styles.pagination}>
        <Pagination defaultCurrent={1} total={totalPosts} pageSize={10} />
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