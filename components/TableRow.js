import styles from '../styles/Home.module.css';
import { Statistic, Row, Col, Button, Divider, Pagination, Layout, Menu } from 'antd';
import { UserOutlined, ClockCircleOutlined, LinkOutlined } from '@ant-design/icons';
import { getElapsedTime } from './utils';

export default function TableRow({item}) {
  const { hostname } = new URL(item.url);
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
        <ClockCircleOutlined style={{marginRight: 4}}/>{getElapsedTime(item.time)}
        <Divider type="vertical"/>
        <UserOutlined style={{marginRight: 4}} /> {item.by}
        <Divider type="vertical"/>
        <LinkOutlined style={{marginRight: 4}} /> {hostname}
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