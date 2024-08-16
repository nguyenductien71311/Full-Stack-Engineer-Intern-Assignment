"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Menu, Upload, Button, Card, Input, List, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImageToImgur } from '@/utils/upload';

const { Header, Content, Footer } = Layout;

type Photo = {
  id: number;
  url: string;
  caption: string;
  comments: string[];
};

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    console.log(apiURL)
    // Fetch photos from the API
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/photo`);
        setPhotos(response.data.photos);
      } catch (error) {
        console.error('Failed to fetch photos:', error);
        message.error('Failed to fetch photos');
      }
    };

    fetchPhotos();
  }, []);

  const handleUpload = async (file: File) => {
    const imgurUrl = await uploadImageToImgur(file);

    if (imgurUrl) {
      try {
        const response = await axios.post(`${apiURL}/api/photo`, {
          url: imgurUrl,
          caption,
        });

        setPhotos([...photos, response.data.photo]);
        setCaption('');
        message.success('Photo uploaded successfully!');
      } catch (error) {
        console.error('Failed to upload photo:', error);
        message.error('Failed to upload photo');
      }
    } else {
      message.error('Failed to upload photo to Imgur');
    }
  };

  const handleAddComment = async (photoId: number) => {
    try {
      const response = await axios.post(`${apiURL}/api/comment/${photoId}`, {
        data: comment,
      });

      setPhotos(
        photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, comments: [...photo.comments, response.data.comment.data] }
            : photo
        )
      );
      setComment('');
      message.success('Comment added successfully!');
    } catch (error) {
      console.error('Failed to add comment:', error);
      message.error('Failed to add comment');
    }
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
          <Input
            placeholder="Enter caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Upload
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            showUploadList={false}
          >
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
