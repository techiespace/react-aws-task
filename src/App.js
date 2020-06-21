import React, { Component } from 'react';
import EventInput from './components/EventInput'
import EventList from './components/EventList'
import 'bootstrap/dist/css/bootstrap.min.css'
import {v1 as uuid} from 'uuid'
class App extends Component{
  state = {
    isLoading:false,
    items:[
      {
        "id": "1",
        "title": "default item"
      },
      {
        "id": "2",
        "title": "default item 2"
      }
    ],
    id:uuid(),
    item:"",
    editItem:false
  };
  handleChange = e => {
    this.setState({
      item: e.target.value
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: this.state.id,
      title: this.state.item
    };
    const updatedItems = [...this.state.items,newItem];
    this.setState({
      items: updatedItems,
      item: "",
      id: uuid(),
      editItem: false
    });
  }
  clearList = () => {
    this.setState({
      items:[]
    })
  }
  handleDelete = (id) => {
    const filteredItems = this.state.items.filter(item => 
    item.id !== id);
    this.setState({
      items: filteredItems
    });
  }
  handleEdit = id => {
    const filteredItems = this.state.items.filter(item => 
      item.id !== id);
    const selectedItem  = this.state.items.find(item => item.id === id);
    this.setState({
      items: filteredItems,
      item: selectedItem.title,
      id:id,
      // because we do not want a new id when we are editing
      editItem: true
    });
  }
  render(){
    const isLoading = this.state.isLoading;
    const allItems = this.state.items;
    if (isLoading)
      return(<div>Loading...</div>);
    return(
      <div className="container">
        <div className="row">
          <div className="col-10 ex-auto col-md-8 mt-4">
            <h3 className="text-capitalize text-center">
              Event Input
            </h3>
            <EventInput 
            item={this.state.item} 
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            editItem={this.state.editItem}/>
            <EventList 
            items={this.state.items} 
            clearList={this.clearList} 
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}/>
          </div>
        </div>
      </div>
    );
  }
}
export default App;

// function App() {
//   return (
//     <div>
//       Hello from app component

//     </div>
//   );
// }