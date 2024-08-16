"use client";

import { useState } from 'react';
import { Layout, Menu, Upload, Button, Card, Input, List, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

type Photo = {
  id: number;
  url: string;
  caption: string;
  comments: string[];
};

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState('');
  const [comment, setComment] = useState('');

  const handleUpload = (file: any) => {
    const newPhoto: Photo = {
      id: photos.length + 1,
      url: URL.createObjectURL(file),
      caption,
      comments: [],
    };
    setPhotos([...photos, newPhoto]);
    setCaption('');
    message.success('Photo uploaded successfully!');
  };

  const handleAddComment = (photoId: number) => {
    setPhotos(
      photos.map((photo) =>
        photo.id === photoId
          ? { ...photo, comments: [...photo.comments, comment] }
          : photo
      )
    );
    setComment('');
  };

  return (
    <Layout>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item key="1">Photo Gallery</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Card title="Upload Photo" style={{ marginBottom: '20px' }}>
          <Upload
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            showUploadList={false}
          >
            <Input
              placeholder="Enter caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Card>
        <div>
          {photos.map((photo) => (
            <Card
              key={photo.id}
              cover={<Image alt={photo.caption} src={photo.url} />}
              style={{ marginBottom: '20px' }}
            >
              <Card.Meta title={photo.caption} />
              <List
                dataSource={photo.comments}
                renderItem={(comment, index) => (
                  <List.Item key={index}>{comment}</List.Item>
                )}
              />
              <Input
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onPressEnter={() => handleAddComment(photo.id)}
                style={{ marginTop: '10px' }}
              />
            </Card>
          ))}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Photo App ©2024 Created by Tien Nguyen
      </Footer>
    </Layout>
  );
};

export default Home;
