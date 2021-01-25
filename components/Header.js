import styles from '../styles/Home.module.css';
import { ThunderboltFilled, ThunderboltOutlined } from '@ant-design/icons';
import { Divider, Switch } from 'antd';

function onToggleDarkMode(checked) {
  console.log(`switch to ${checked}`);
  const root = document.getElementById('root');
  root.style.setProperty('--color-background', checked ? '#0E141C' : '#efefef');
  root.style.setProperty('--color-background-muted', checked ? '#152028' : '#ffffff');
  root.style.setProperty('--color-text-main', checked ? '#efefef' : '#121212');
  root.style.setProperty('--color-text-secondary', checked ? '#9a9a9a' : '#00000088');
  root.style.setProperty('--color-text-title', checked ? '#cdcdcd' : '#676767');
}

export default function Header() {
  return (
    <div style={{backgroundColor: '#FB651E', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{backgroundColor: '#FB651E', border: 'none', color: 'white', display: 'flex', alignItems: 'center', height: '100%', margin: '0 10% 0 10%'}}>
        <img src="/logo.png" alt="Ycombinator Logo" className={styles.logo} />
        <span style={{fontSize: '1.5em', marginRight: '16px'}}>HACKERNEWS</span>
        <Divider type="vertical"/>
        <span style={{fontWeight: 800}}>NEWS</span>
        <Divider type="vertical"/>
        <span key="2">SHOW HN</span>
        <Divider type="vertical"/>
        <span key="3">ASK HN</span>
      </div>
      <div style={{display: 'flex', color: 'white', alignItems: 'center', margin: '0 10% 0 0'}}>
        <span style={{marginRight: '16px'}}>Dark Mode</span>
        <Switch onChange={onToggleDarkMode} checkedChildren={<ThunderboltOutlined />} unCheckedChildren={<ThunderboltFilled />}/>
      </div>
    </div>
  )
}