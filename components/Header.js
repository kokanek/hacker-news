import styles from '../styles/Home.module.css';
import { Divider } from 'antd';

export default function Header() {
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