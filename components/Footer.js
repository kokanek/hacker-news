import styles from '../styles/Home.module.css';

export default function Footer({path}) {
  return (
    <div className={styles.footer}>{`Created with ❤️ by @`}
      <a
        href="https://comscience.now.sh"
        target="_blank"
      > kokaneka</a>. Powered by @ 
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        {`Vercel`}
      </a>.
    </div>
  )
}