import styles from '../styles/Home.module.css';
import { Statistic, Row, Col, Button, Divider, Pagination, Layout, Menu } from 'antd';
import { UserOutlined, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { getElapsedTime } from './utils';

function Stats({title, value}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '8px'}} className={styles.stats}>
      <p style={{ margin: 0 }}>{title}</p>
      <p style={{ color: '#FB651E', fontSize: '1.5em', margin: '8px 0 0 0' }}>{value}</p>
    </div>
  )
}
export default function TableRow({item}) {
  const { hostname } = new URL(item.url || 'https://news.ycombinator.com');
  return (
    <Row gutter={16} className={styles.fullWidth}>
      <Col span={3}>
        <Stats title="POINTS" value={item.score}  />
      </Col>
      <Col span={3}>
        <Stats title="COMMENTS" value={item.descendants}  />
      </Col>
      <Col span={16} className={styles.separator}>
        <h2 className={styles.mainText}>{item.title}</h2>
        <ClockCircleOutlined style={{marginRight: 4, color: '#898989'}}/><span style={{color: '#898989'}}>{getElapsedTime(item.time)}</span>
        <Divider type="vertical"/>
        <UserOutlined style={{marginRight: 4, color: '#898989'}} /> <span style={{color: '#898989'}}>{item.by}</span>
        <Divider type="vertical"/>
        <LinkOutlined style={{marginRight: 4, color: '#898989'}} /> <span style={{color: '#898989'}}>{hostname}</span>
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