import React, { Component, useEffect } from 'react';
import EventInput from './components/EventInput'
import EventList from './components/EventList'
import 'bootstrap/dist/css/bootstrap.min.css'
import {v1 as uuid} from 'uuid'
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react'
import {Auth, Hub} from "aws-amplify";
import '@aws-amplify/ui/dist/style.css';

class App extends Component{
  state = {
    loggedinUser: "Dummy",
    isLoading:false,
    items:[
      {
        "id": "1",
        "user": "test",
        "title": "default item",
        "status": "Idle",
        "schedule": {
          "start_time": "string",
          "stop_time": "string"
        }
      },
      {
        "id": "2",
        "user": "test2",
        "title": "default item 2",
        "status": "Idle",
        "schedule": {
          "start_time": "string",
          "stop_time": "string"
        }
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
      title: this.state.item,
      user: this.state.loggedinUser,
    };
    const currId = newItem.id;
    const currTitle = newItem.title;
    const currUser = newItem.user;
    const updatedItems = [...this.state.items,newItem];
    this.setState({
      items: updatedItems,
      item: "",
      id: uuid(),
      editItem: false
    });
    //add to dynamo db
    (async() => {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          "id": currId,
          "user": currUser,
          "title": currTitle,
          "status": "dummy_status",
          "schedule": {
            "start_time": "dummy_starttime",
            "stop_time": "dummy_endtime"
          }
        })
    };
      await fetch(
        "https://3x2owagrv4.execute-api.us-east-2.amazonaws.com/Stg/events",
        requestOptions
      );
    })();
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
  async setUserName() { //not able to call this ##### Fix later IMP!!!!!!! TODO
    // in useEffect, we create the listener
    console.log('inside setuserName funct')
    useEffect(() => {
      Hub.listen('auth', (data) => {
        const { payload } = data
        console.log('A new auth event has happened: ', data)
        if (payload.event === 'signIn') {
          this.setState.loggedinUser = Auth.currentAuthenticatedUser()
          .then(user => user.getUsername().toString())
          .catch(err => console.log(err))
          console.log('a user has signed in!')
        }
        if (payload.event === 'signOut') {
          console.log('a user has signed out!')
        }
      })
    })
  }

  async componentDidMount() {
    const response = await fetch(
      "https://3x2owagrv4.execute-api.us-east-2.amazonaws.com/Stg/events"
    );
    const body = await response.json();
    var fetchedItems = []
    var responseItems = JSON.parse(body.body)
    for(var currItem in responseItems){
      fetchedItems.push(
        {
          "id": responseItems[currItem].id,
          "user": responseItems[currItem].user,
          "title": responseItems[currItem].title,
          "status": responseItems[currItem].status,
          "schedule": {
            "start_time": (responseItems[currItem].schedule !== undefined && responseItems[currItem].schedule !== null)?responseItems[currItem].schedule.start_time:"default",
            "stop_time": (responseItems[currItem].schedule !== undefined && responseItems[currItem].schedule !== null)?responseItems[currItem].schedule.end_time:"default"
          }
        }
      );
    }
    console.log(fetchedItems)
    console.log(responseItems)
    //console.log(JSON.parse(body.body))
    if(responseItems!==undefined && responseItems !== null && responseItems[0].user !== undefined)
      this.setState({ items: fetchedItems, isLoading: false });
    const tempUserName = await Auth.currentAuthenticatedUser()
    .then(user => user.getUsername().toString())
    .catch(err => console.log(err))
    this.setState({loggedinUser : tempUserName});
  }
  
  render(){
    const isLoading = this.state.isLoading;
    const allItems = this.state.items;
    if (isLoading)
      return(<div>Loading...</div>);
    return(
      <div className="container">
        <AmplifySignOut />
        <div className="row">
          <div className="col-10 ex-auto col-md-8 mt-4">
    <h1>Hi, {this.state.loggedinUser}</h1>
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
            user={this.state.loggedinUser} 
            clearList={this.clearList} 
            handleDelete={this.handleDelete}
            handleEdit={this.handleEdit}/>
          </div>
        </div>
      </div>
    );
  }
}
export default withAuthenticator(App)

// function App() {
//   return (
//     <div>
//       Hello from app component

//     </div>
//   );
// }