import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'
import { Statistic, Row, Col, Button, Divider, Pagination, Layout, Menu } from 'antd';
import { UserOutlined, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
const { Header, Content, Footer } = Layout;

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

export default function Home(props) {
  return (
    <div className={styles.root}>
      <Head>
        <title>Hacker News</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header> */}
      <div style={{backgroundColor: '#FB651E'}}>
        <div style={{backgroundColor: '#FB651E', margin: '0 10%', border: 'none', color: 'white', display: 'flex', alignItems: 'center'}}>
          <img src="/logo.png" alt="Ycombinator Logo" className={styles.logo} />
          <span style={{fontSize: '1.5em', marginRight: '16px'}}>HACKERNEWS</span>
          <span key="1">NEWS</span>
          <span key="2">SHOW HN</span>
          <span key="3">ASK HN</span>
        </div>
      </div>
      <div className={styles.titled}>
        <h1 style={{fontSize: '2rem', color: '#676767'}}>Top news for Today</h1>
        <Pagination defaultCurrent={1} total={50} />
      </div>
      <div className={styles.container}>
        <Divider style={{marginTop: 0}}/>
        <div className={styles.fullWidth}>
          {props.values.map(v => <TableRow item={v} />)}
        </div>
        <Pagination defaultCurrent={1} total={50} />
      </div>
      
    </div>
    
  )
}

export async function getServerSideProps(context) {

  const { content='latest', page=1 } = context.query;
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
  let posts = await res.json()
  
  const slicedPosts = posts.slice(Number(page)*10, (Number(page)+1)*10);
  const articles = slicedPosts.map(post => fetch(`https://hacker-news.firebaseio.com/v0/item/${post}.json?print=pretty`))
  const data = await Promise.all(articles);

  const jsonArticles = data.map(post => post.json());
  const returnedData = await Promise.all(jsonArticles);

  return {
    props: {
       values: returnedData
    }, // will be passed to the page component as props
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