import React, {Component} from 'react';
import EventItem from './EventItem';
export default class EventList extends Component {
    render(){
        const {items, user, clearList, handleDelete, handleEdit} = this.props;
        return(
            <ul className="list-group my-5">
                <h3 className="text-capitalize text-center">Event List</h3>
                {
                    items.filter(function(itm) {                        
                        if(itm['user']===user)
                            return true;
                        return false;
                    }).map(item => {
                        return <EventItem 
                        key={item.id} 
                        title={item.title}
                        handleDelete={() => handleDelete(item.id)}
                        handleEdit={() => handleEdit(item.id)}/>;
                    })
                }
                <button
                    type="button"
                    className="btn btn-danger btn-block text-capitalize mt-5"
                    onClick={clearList}>
                        Clear Events
                    </button>
            </ul>
        )
    }
}