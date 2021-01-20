import Head from 'next/head'
import styles from '../styles/Home.module.css'

export default function Home(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {props.values.map(v => <p>{v.by}</p>)}
      </div>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps(context) {

  const { content='latest', page=1 } = context.query;
  console.log('context in getStaticProps: ', context.query, context.path);
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
  let posts = await res.json()
  
  const slicedPosts = posts.slice(Number(page)*10, (Number(page)+1)*10);
  console.log('sliced: ', slicedPosts);
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
