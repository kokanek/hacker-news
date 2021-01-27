import styles from '../styles/Home.module.css';
import { useEffect, useState } from 'react';
import { ThunderboltFilled, ThunderboltOutlined } from '@ant-design/icons';
import { Divider, Switch } from 'antd';

function onToggleDarkMode(checked, setDarkMode) {

  const root = document.getElementById('root');
  root.style.setProperty('--color-background', checked ? '#0E141C' : '#efefef');
  root.style.setProperty('--color-background-muted', checked ? '#152028' : '#ffffff');
  root.style.setProperty('--color-text-main', checked ? '#efefef' : '#121212');
  root.style.setProperty('--color-text-secondary', checked ? '#9a9a9a' : '#00000088');
  root.style.setProperty('--color-text-title', checked ? '#cdcdcd' : '#676767');

  if (setDarkMode) {
    console.log('writing to localstorage: ', checked);
    setDarkMode(checked);
    window.localStorage.setItem('dark-mode', checked ? 'true' : 'false');
  }
}

function getInitialColorMode() {

  // do nothing on server side
  if (typeof window !== "undefined") {

    // first check local storage
    const darkModePreferred = window.localStorage.getItem('dark-mode');
    if (darkModePreferred) {
      return darkModePreferred == 'true';
    }

    // if no local storage, check OS level preference
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const hasMediaQueryPreference = typeof mql.matches === 'boolean';
    if (hasMediaQueryPreference) {
      return mql.matches ? true : false;
    }
  }

  return false;
}

export default function Header() {

  const [darkModeEnabled, setDarkMode] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const isDarkMode = getInitialColorMode();
      if (isDarkMode) {
        setDarkMode(true);
        console.log('dark mode enabled: ', darkModeEnabled);
        onToggleDarkMode(true, setDarkMode);
      }
    }, 0);
  }, [])

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
        <Divider type="vertical"/>
        <span key="4">JOBS</span>
      </div>
      <div style={{display: 'flex', color: 'white', alignItems: 'center', margin: '0 10% 0 0'}}>
        <span style={{marginRight: '8px'}}>Dark Mode 🌗</span>
        <Switch checked={darkModeEnabled} onChange={(checked) => onToggleDarkMode(checked, setDarkMode)} />
      </div>
    </div>
  )
}

// checkedChildren={<ThunderboltOutlined />} unCheckedChildren={<ThunderboltFilled />}