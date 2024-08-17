"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layout, Menu, Upload, Button, Card, Input, List, message, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadImageToImgur } from '@/utils/upload';

const { Header, Content, Footer } = Layout;

type Comment = {
  id: number;
  data: string;
  photoId: number;
}

type Photo = {
  id: number;
  url: string;
  caption: string;
  comments: Comment[];
};

const apiURL = process.env.NEXT_PUBLIC_API_URL;

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [caption, setCaption] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photosResponse = await axios.get(`${apiURL}/api/photo`);
        const photos = photosResponse.data.photos;

        // Fetch comments for each photo
        const commentsPromises = photos.map(async (photo: Photo) => {
          const commentsResponse = await axios.get(`${apiURL}/api/comment/${photo.id}`);
          return {
            ...photo,
            comments: commentsResponse.data.comments,
          };
        });

        const photosWithComments = await Promise.all(commentsPromises);
        setPhotos(photosWithComments);
      } catch (error) {
        console.error('Failed to fetch photos and comments:', error);
        message.error('Failed to fetch photos and comments');
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

      const newComment: Comment = {
        id: response.data.comment.id,
        data: comment,
        photoId: photoId
      }

      setPhotos(
        photos.map((photo) =>
          photo.id === photoId
            ? { ...photo, comments: [...photo.comments, newComment] }
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
          {photos.map((photo) => (
            <Card key={photo.id} className="mb-5">
              <Image
                alt={photo.caption}
                src={photo.url}
                className="w-full h-64 object-cover rounded justify-center"
              />
              <Card.Meta title={photo.caption} />
              <List
                dataSource={photo.comments}
                renderItem={(comment, index) => (
                  <List.Item key={index}>{comment.data}</List.Item>
                )}
              />
              <Input
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onPressEnter={() => handleAddComment(photo.id)}
                className="mt-2"
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
