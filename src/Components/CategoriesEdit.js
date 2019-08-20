import React, { Component } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';

const CATEGORIES_EDIT_API = 'http://localhost:3000/categories/:id.json';
class CategoriesEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: {}
    };

    const fetchCategoryById = () => {
      const url = CATEGORIES_EDIT_API.replace(":id", this.props.match.params.id);
      axios.get(url).then((result) => {
        this.setState({ category: result.data });
      });
    };
    fetchCategoryById();

    this._handleChange = this._handleChange.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  _handleChange(event) {
    const newData = {
      [event.currentTarget.name]: event.currentTarget.value
    };
    this.setState(({ category }) => {
      return {
        category: {
          ...category,
          ...newData,
        }
      };
    });
  }

  _handleSubmit(event) {
    event.preventDefault();
    const data = this.state.category;
    //put because I'm editing 
    console.log('data before save:', data);
    const url = CATEGORIES_EDIT_API.replace(":id", data.id);
    axios.put(url, data).then(() => {
      this.props.history.go(-1);
    });
  }

  uploadWidget = () => {
    window.cloudinary.openUploadWidget({ cloud_name: 'dm9keau0d', upload_preset: 'o1da5zng'},
        (error, result) => {
          const data = result[0];
          const newData = {
            image: data.secure_url
          };
          this.setState(({ category }) => {
            return {
              category: {
                ...category,
                ...newData,
              }
            };
          });
    });
  }

  render() {
    const { category } = this.state;

    if (category === null) {
      return null;
    }

    return (
      <div>
        <Form onSubmit={this._handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control placeholder="Title" type="text" name="title" value={category.title} onChange={this._handleChange} />
          </Form.Group>

          <Form.Group controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control placeholder="Add Image URL ..." type="text" name="image" value={category.image} onChange={this._handleChange} />
            <Button onClick={this.uploadWidget.bind(this)}>Select Image</Button>
            <Card style={{ width: '18rem', marginTop: '20px' }}>
              <Card.Img variant="top" width='400px' height='225px' src={category.image} />
            </Card>
          </Form.Group>
          <Button variant="outline-secondary" type="submit">Submit</Button>
        </Form >
      </div>
    );
  }
}

export default CategoriesEdit;
