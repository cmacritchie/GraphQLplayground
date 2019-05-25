import React, { Component } from 'react';
import gql from 'graphql-tag'; //helper to write queries
import { graphql } from 'react-apollo';
import {Link } from 'react-router';
import query from '../queries/fetchSongs';

class SongList extends Component {
    
    onDeleteSong(id){
        this.props.mutate({
                variables:{ id }})
                .then(()=> this.props.data.refetch()); //automatically refetch queries associated with it
                //use refetch when the query is associated with the specific component
                //use the other way for queries NOT associated with the component
    }
    
    renderSongs() {

        if(this.props.data.loading){return <div>loading...</div>;}

        return this.props.data.songs.map(({id, title})=>{
            return (
                <li key={id} className="collection-item">
                <Link to={`/songs/${id}`}>
                    {title}
                    </Link>
                    <i className="material-icons"
                        onClick={()=>this.onDeleteSong(id)}>delete</i> {/*materialize library*/}
                </li>
            );
        });
    }


    render() {
        return (
            <div>
        <ul className="collection">
            {this.renderSongs()}
        </ul>
        <Link 
        to="/songs/new"
        className="btn-floating btn-large red right">
        <i className="material-icons">add</i>
        </Link>
        </div>
        )
    }
}

const mutation =gql`
mutation DeleteSong($id: ID) {
    deleteSong(id: $id) {
        id
    }
}
`;

export default graphql(mutation)(
            graphql(query)(SongList)
        );