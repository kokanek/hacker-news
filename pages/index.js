import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'antd/dist/antd.css'
import { Statistic, Row, Col, Button, Divider } from 'antd';
import { UserOutlined, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';

function TableRow({item}) {
  console.log('table row props: ', item);
  return (
    <Row gutter={16} className={styles.fullWidth}>
      <Col span={3}>
        <Statistic title="POINTS" value={item.score} valueStyle={{ color: '#FB651E' }} />
      </Col>
      <Col span={3}>
        <Statistic title="COMMENTS" value={item.descendants} valueStyle={{ color: '#FB651E' }} />
      </Col>
      <Col span={14} className={styles.separator}>
        <h2>{item.title}</h2>
        <ClockCircleOutlined />{` 15 mins ago `}
        <UserOutlined /> {item.by}
        <LinkOutlined /> {` google.com `}
      </Col>
      <Col span={1}>
        <Button type="primary" danger>Open</Button>
      </Col>
      <Divider />
    </Row>
  )
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className={styles.fullWidth}>
        {props.values.map(v => <TableRow item={v} />)}
      </div>

      {/* <footer className={styles.footer}>
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
      </footer> */}
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
